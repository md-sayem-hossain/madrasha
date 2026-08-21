import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { translateEntityFields, translateLocalizedString } from "./src/server/translation_service";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  app.use(express.json({ limit: "40mb" }));
  app.use(express.urlencoded({ extended: true, limit: "40mb" }));

  const dataDir = path.join(process.cwd(), "server_data");
  const dataFilePath = path.join(dataDir, "madrasa_db.json");

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load or initialize persistent data
  let madrasaData: any = null;
  if (fs.existsSync(dataFilePath)) {
    try {
      const raw = fs.readFileSync(dataFilePath, "utf-8");
      madrasaData = JSON.parse(raw);
    } catch (err) {
      console.error("Error reading saved data, will initialize from frontend", err);
    }
  }

  // Helper to save data safely
  const saveDataToFile = (data: any) => {
    try {
      madrasaData = data;
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist data file:", err);
    }
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      translationService: process.env.GEMINI_API_KEY ? "Gemini 3.7 Flash AI Active" : "Islamic Dictionary & Transliteration Active"
    });
  });

  // GET: Pure view of stored data (Zero translation API calls on page load)
  app.get("/api/madrasa/data", (_req, res) => {
    if (madrasaData) {
      res.json({ success: true, data: madrasaData });
    } else {
      res.json({ success: false, message: "No persistent data saved yet, load initial client seed" });
    }
  });

  // POST: Translate and save a single entity on save
  app.post("/api/madrasa/save-entity", async (req, res) => {
    try {
      const { entityType, item } = req.body;
      if (!entityType || !item) {
        return res.status(400).json({ success: false, error: "Missing entityType or item payload" });
      }

      // Auto-translate entity fields on the server before persisting
      const translatedItem = await translateEntityFields(item, entityType);

      if (madrasaData) {
        const pluralKey = entityType === 'history' ? 'history' : `${entityType}s`;
        const list = madrasaData[pluralKey] || madrasaData[entityType];

        if (Array.isArray(list)) {
          const index = list.findIndex((x: any) => x.id === translatedItem.id);
          if (index >= 0) {
            list[index] = translatedItem;
          } else {
            list.push(translatedItem);
          }
          saveDataToFile(madrasaData);
        } else if (entityType === 'settings') {
          madrasaData.settings = translatedItem;
          saveDataToFile(madrasaData);
        }
      }

      res.json({
        success: true,
        message: "Entity translated and saved successfully",
        item: translatedItem
      });
    } catch (error: any) {
      console.error("Error in save-entity:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST: Full Data Update with automatic translation pass on save
  app.post("/api/madrasa/update", async (req, res) => {
    try {
      const newData = req.body;
      if (!newData || typeof newData !== "object") {
        return res.status(400).json({ success: false, error: "Invalid data payload" });
      }

      // Save directly to the JSON store
      saveDataToFile(newData);
      res.json({ success: true, message: "Madrasa data updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST: On-Demand server translation utility for custom text inputs
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, bn, en, ar, context } = req.body;
      const input = {
        bn: bn || (typeof text === 'string' ? text : ''),
        en: en || '',
        ar: ar || ''
      };

      const translated = await translateLocalizedString(input, context || 'Madrasa General Text');
      res.json({ success: true, data: translated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST: Contact form with strict input validation
  app.post("/api/contacts", (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: "আপনার নাম দেওয়া আবশ্যক (Name is required)" });
      }
      if (!phone || !phone.trim()) {
        return res.status(400).json({ success: false, error: "মোবাইল নম্বর দেওয়া আবশ্যক (Phone is required)" });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, error: "বার্তা দেওয়া আবশ্যক (Message is required)" });
      }

      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return res.status(400).json({ success: false, error: "সঠিক ইমেইল ঠিকানা লিখুন" });
        }
      }

      const sanitize = (str: any) =>
        typeof str === "string"
          ? str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim()
          : "";

      const newMsg = {
        id: `cnt-${Date.now()}`,
        name: sanitize(name),
        email: sanitize(email || ""),
        phone: sanitize(phone),
        subject: sanitize(subject || "সাধারন অনুসন্ধান"),
        message: sanitize(message),
        date: new Date().toISOString().split("T")[0],
        isRead: false,
        replyStatus: "pending"
      };

      if (madrasaData && Array.isArray(madrasaData.contacts)) {
        madrasaData.contacts.unshift(newMsg);
        saveDataToFile(madrasaData);
      }

      res.json({ success: true, message: "Contact inquiry recorded successfully", contact: newMsg });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET: MySQL Backup config download
  app.get("/api/mysql-config", (_req, res) => {
    const configPath = path.join(process.cwd(), ".env.mysql.backup");
    if (fs.existsSync(configPath)) {
      res.setHeader("Content-Disposition", "attachment; filename=.env.mysql.backup");
      res.setHeader("Content-Type", "text/plain");
      res.sendFile(configPath);
    } else {
      res.status(404).json({ success: false, error: "Config file not found" });
    }
  });

  // Export / Backup
  app.get("/api/backup", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=madrasa_backup.json");
    res.json(madrasaData || {});
  });

  // Restore
  app.post("/api/restore", (req, res) => {
    try {
      const backup = req.body;
      if (!backup || !backup.settings || !Array.isArray(backup.teachers)) {
        return res.status(400).json({ success: false, error: "Invalid backup format" });
      }
      saveDataToFile(backup);
      res.json({ success: true, message: "Backup restored successfully", data: backup });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Madrasa secure multilingual server running on http://localhost:${PORT}`);
  });
}

startServer();
