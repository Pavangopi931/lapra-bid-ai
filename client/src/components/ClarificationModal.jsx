import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  FileText, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { fetchClarificationNotice } from '../services/api';

export default function ClarificationModal({ bidder, onClose }) {
  const [loading, setLoading] = useState(true);
  const [noticeDraft, setNoticeDraft] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bidder?.id) {
      loadNotice();
    }
  }, [bidder?.id]);

  const loadNotice = async () => {
    try {
      setLoading(true);
      const res = await fetchClarificationNotice(bidder.id);
      setNoticeDraft(res.noticeDraft || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(noticeDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>GeM Representation Notice - ${bidder?.bidderName}</title>
          <style>
            body { font-family: monospace; padding: 40px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; }
          </style>
        </head>
        <body>${noticeDraft}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl bg-[#091122]/95 my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060B16] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                GeM Clarification / Representation Notice
              </h2>
              <p className="text-xs text-slate-400">
                Formal communication draft for bidder: <strong className="text-slate-200">{bidder?.bidderName}</strong>
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

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Generated Official Notice (GFR 2017 & GeM GTC Compliant)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                <span>Print Notice</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
              <p className="text-xs">Drafting formal notice referencing GeM clauses...</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={noticeDraft}
              rows={16}
              className="w-full text-xs font-mono p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed focus:outline-none select-all"
            />
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            <span>Notice will be transmitted through GeM Representation Window with 48h SLA.</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
