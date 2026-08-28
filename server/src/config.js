import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  isGeminiConfigured: () => {
    const key = process.env.GEMINI_API_KEY || config.geminiApiKey;
    return key && key.trim() !== '' && key !== 'YOUR_GEMINI_API_KEY_HERE';
  },
  updateApiKey: (newKey) => {
    config.geminiApiKey = newKey.trim();
    process.env.GEMINI_API_KEY = newKey.trim();
  }
};
