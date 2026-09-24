// New'Gen Dental: enquiry form relay (Vercel serverless function, Node 18+).
// Posts the contact form to SMTP2GO and emails reception, the SmileOx intake address and GYA.
// Recipients are hard-coded as a fallback so a missing environment variable never drops a lead.

const FALLBACK_TO = ["newgendental14@gmail.com", "rowayne@gyaclients.com"];
const DEFAULT_SENDER = "New'Gen Dental Website <website@gyaclients.com>";
const MIN_FILL_MS = 3000; // faster than this is a bot

const clean = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function recipients() {
  const fromEnv = (process.env.ENQUIRY_TO || "").split(",").map((s) => s.trim()).filter(isEmail);
  const list = fromEnv.length ? fromEnv : FALLBACK_TO.slice();
  const smileox = (process.env.SMILEOX_INTAKE_EMAIL || "").trim();
  if (isEmail(smileox)) list.push(smileox);
  return [...new Set(list)];
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return Object.fromEntries(new URLSearchParams(req.body)); }
  }
  return {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const b = readBody(req);

  // Spam traps: hidden field filled in, or the form was submitted too quickly. Pretend it worked.
  const started = Number(b.t) || 0;
  if (clean(b.company, 200) || (started && Date.now() - started < MIN_FILL_MS)) {
    return res.status(200).json({ ok: true });
  }

  const f = {
    name: clean(b.name, 120),
    phone: clean(b.phone, 40),
    email: clean(b.email, 160),
    preferred: clean(b.preferred, 160),
    message: String(b.message == null ? "" : b.message).trim().slice(0, 3000),
  };
  if (!f.name || !f.phone || !isEmail(f.email) || !f.message) {
    return res.status(400).json({ ok: false, error: "Please fill in your name, phone, email and message." });
  }

  const apiKey = process.env.SMTP2GO_API_KEY;
  if (!apiKey) {
    console.error("enquiry: SMTP2GO_API_KEY is not set", { name: f.name, phone: f.phone, email: f.email });
    return res.status(500).json({ ok: false, error: "Email is not configured." });
  }

  const rows = [
    ["Name", f.name],
    ["Phone", f.phone],
    ["Email", f.email],
    ["Preferred day or time", f.preferred || "Not given"],
    ["Message", f.message],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nSent from the enquiry form at newgendental.com.au/contact/";
  const htmlBody =
    `<h2 style="font-family:Arial,sans-serif;color:#0D1E3D">New website enquiry</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5B6770;vertical-align:top">${k}</td>` +
      `<td style="padding:6px 0;color:#131A22;white-space:pre-wrap">${esc(v)}</td></tr>`).join("") +
    `</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#5B6770">Sent from the enquiry form at newgendental.com.au/contact/</p>`;

  try {
    const r = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Smtp2go-Api-Key": apiKey },
      body: JSON.stringify({
        sender: process.env.SMTP2GO_SENDER || DEFAULT_SENDER,
        to: recipients(),
        subject: `Website enquiry from ${f.name}`,
        text_body: text,
        html_body: htmlBody,
        custom_headers: [{ header: "Reply-To", value: `${f.name.replace(/[<>",]/g, "")} <${f.email}>` }],
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.data || !j.data.succeeded) {
      console.error("enquiry: SMTP2GO rejected the send", r.status, JSON.stringify(j).slice(0, 500));
      return res.status(502).json({ ok: false, error: "Could not send" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("enquiry: SMTP2GO request failed", err && err.message);
    return res.status(502).json({ ok: false, error: "Could not send" });
  }
};
