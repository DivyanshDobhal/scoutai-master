import { writeFileSync } from "node:fs";
import { join } from "node:path";

const apiUrl =
  process.env.API_URL ||
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

const normalizedApiUrl = apiUrl.replace(/\/+$/, "");

const config = `window.__SCOUTAI_CONFIG__ = ${JSON.stringify(
  { apiUrl: normalizedApiUrl },
  null,
  2
)};\n`;

writeFileSync(join(process.cwd(), "frontend", "config.js"), config);
console.log(`ScoutAI frontend config generated with API_URL=${normalizedApiUrl || "(same-origin)"}`);
