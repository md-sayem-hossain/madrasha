import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Clock,
  Heart,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDigits } from '../../lib/translations';

export const ContactView: React.FC = () => {
  const { data, language } = useMadrasa();
  const t = translations[language];

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim() || !formState.message.trim()) {
      setErrorMsg('দয়া করে আপনার নাম, মোবাইল নম্বর এবং বার্তা সঠিকভাবে পূরণ করুন।');
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_contact_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            {t.contact_banner_title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            {t.contact_banner_subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t.contact_hq_title}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.contact_location_label}</div>
                  <div className="text-slate-600 mt-0.5">{getLocalized(data.settings.address, language)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.contact_hotline_label}</div>
                  <a href={`tel:${data.settings.phone}`} className="text-emerald-800 font-bold font-mono mt-0.5 block hover:underline">
                    {formatDigits(data.settings.phone, language)}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.contact_email_label}</div>
                  <a href={`mailto:${data.settings.email}`} className="text-slate-600 mt-0.5 block hover:text-emerald-800">
                    {data.settings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Whatsapp Action */}
            {data.settings.socialLinks.whatsapp && (
              <a
                href={data.settings.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>{t.contact_whatsapp_btn}</span>
              </a>
            )}
          </div>

          {/* Donation / Lillah Boarding Bank Account Details */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>{t.contact_donation_title}</span>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              {t.contact_donation_desc}
            </p>
            <div className="space-y-2 text-xs bg-emerald-900/80 p-4 rounded-2xl border border-emerald-700 font-mono">
              <div className="flex justify-between">
                <span className="text-emerald-300">{t.contact_bank_name_label}</span>
                <span className="font-bold text-white">{t.contact_bank_name_val}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">{t.contact_acc_name_label}</span>
                <span className="font-bold text-white">{getLocalized(data.settings.name, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">{t.contact_acc_no_label}</span>
                <span className="font-bold text-amber-300">{formatDigits("20507770100123456", language)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-emerald-800">
                <span className="text-emerald-300">{t.contact_bkash_label}</span>
                <span className="font-bold text-amber-300">{formatDigits("01711-XXXXXX", language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.contact_form_heading}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.contact_form_sub}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
              {errorMsg}
            </div>
          )}

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">
                {t.contact_msg_sent_title}
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                {t.contact_msg_sent_sub}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', phone: '', email: '', subject: '', message: '' });
                }}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg"
              >
                {t.contact_send_another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.contact_full_name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.contact_name_placeholder}
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.contact_phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.contact_phone_placeholder}
                    value={formState.phone}
                    onChange={e => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.contact_email_optional}
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.contact_subject_label}
                  </label>
                  <select
                    value={formState.subject}
                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-emerald-700"
                  >
                    <option value="">{t.contact_subject_select}</option>
                    <option value="admission">{t.contact_subj_admission}</option>
                    <option value="lillah">{t.contact_subj_lillah}</option>
                    <option value="mahfil">{t.contact_subj_mahfil}</option>
                    <option value="general">{t.contact_subj_general}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.contact_msg_label} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={t.contact_msg_placeholder}
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.contact_btn_send}</span>
              </button>
            </form>
          )}

          {/* Embedded Map Container */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              {t.contact_map_heading}
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 bg-slate-100">
              <iframe
                src={data.settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sandwip Madrasa Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
