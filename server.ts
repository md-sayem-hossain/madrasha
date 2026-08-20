import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

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

  app.use(express.json({ limit: "35mb" }));
  app.use(express.urlencoded({ extended: true, limit: "35mb" }));

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
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/madrasa/data", (_req, res) => {
    if (madrasaData) {
      res.json({ success: true, data: madrasaData });
    } else {
      res.json({ success: false, message: "No persistent data saved yet, load initial client seed" });
    }
  });

  app.post("/api/madrasa/update", (req, res) => {
    try {
      const newData = req.body;
      if (!newData || typeof newData !== "object") {
        return res.status(400).json({ success: false, error: "Invalid data payload" });
      }
      saveDataToFile(newData);
      res.json({ success: true, message: "Madrasa data updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/contacts", (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !phone || !message) {
        return res.status(400).json({ success: false, error: "Required fields missing" });
      }

      const sanitize = (str: any) => typeof str === "string" ? str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim() : "";

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
    console.log(`Madrasa secure server running on http://localhost:${PORT}`);
  });
}

startServer();
