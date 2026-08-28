import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  History, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Calendar, 
  User, 
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { fetchAuditLogs } from '../services/api';

export default function AuditTrailModal({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetchAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl bg-[#091122]/95 my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060B16] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Procurement Verification Audit Trail
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  SHA-256 Cryptographic Chain
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tamper-evident chronological log of all AI automated verifications and Officer decisions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-3 font-mono text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
              <p className="text-xs">Verifying cryptographic hash chain...</p>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No audit logs recorded yet.</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={log.logId}
                className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-sans font-semibold">{log.entityName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 flex items-center justify-between font-sans">
                  <span>Officer / Initiator: <strong className="text-slate-100">{log.officerId}</strong></span>
                  <span className="font-mono text-slate-400 text-[10px]">Entity ID: {log.entityId}</span>
                </div>

                {log.details && (
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-900 text-[10px] text-slate-300 font-mono">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                  </div>
                )}

                <div className="text-[9px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-800/60 pt-1.5 gap-1">
                  <span className="truncate">Prev Hash: {log.prevHash}</span>
                  <span className="text-emerald-400 truncate">Block Hash: {log.hash}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
