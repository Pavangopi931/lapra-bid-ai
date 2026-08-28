import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { updateGeminiConfig } from '../services/api';

export default function ApiKeyModal({ 
  geminiConfig, 
  onClose, 
  onConfigUpdated 
}) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(geminiConfig?.model || 'gemini-2.0-flash');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please provide a valid Gemini API Key string.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const res = await updateGeminiConfig({ apiKey, model });
      setMessage(res.message);
      onConfigUpdated();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl bg-[#091122]/95 my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060B16] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Google Gemini AI Configuration
              </h2>
              <p className="text-xs text-slate-400">
                Configure live Gemini API for document parsing & GFR discrepancy analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Current Status Box */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            geminiConfig?.isGeminiConfigured
              ? 'bg-purple-950/30 border-purple-500/30 text-purple-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center space-x-2.5">
              <Key className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-semibold text-slate-200">
                  Status: {geminiConfig?.isGeminiConfigured ? 'Live Gemini AI Connected' : 'Placeholder Mode (Built-in Heuristic AI Engine)'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Key: {geminiConfig?.maskedKey || 'None'}
                </div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              geminiConfig?.isGeminiConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {geminiConfig?.isGeminiConfigured ? 'LIVE ACTIVE' : 'BUILT-IN MOCK'}
            </span>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Enter Your Gemini API Key:
            </label>
            <input
              type="password"
              placeholder="Paste your key here (e.g. AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:border-purple-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>You can get a free API key from Google AI Studio.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline flex items-center gap-0.5"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Select Gemini Model:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-purple-500 focus:outline-none"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended - Fastest & Multimodal)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
            </select>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">💡 Backend Configuration Note:</p>
            <p>
              You can also set your key permanently in <code className="text-purple-300 font-mono bg-slate-950 px-1 py-0.5 rounded">server/.env</code> file under <code className="text-purple-300 font-mono">GEMINI_API_KEY</code>.
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Validating Key...' : 'Activate Gemini AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
