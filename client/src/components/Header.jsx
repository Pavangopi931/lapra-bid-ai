import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Database, 
  History, 
  PlusCircle, 
  RefreshCw, 
  ExternalLink,
  Cpu,
  Building2,
  FileText
} from 'lucide-react';

export default function Header({ 
  geminiConfig, 
  onOpenApiKeyModal, 
  onOpenPortalsModal, 
  onOpenAuditModal, 
  onOpenNewBidderModal, 
  onOpenReportModal,
  onRefreshData,
  isRefreshing
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1528]/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Top Gov Bar */}
      <div className="bg-[#050A14] border-b border-slate-800/80 px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-medium text-slate-300">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 shadow-sm" />
            <span>Government of India</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Government e-Marketplace (GeM) Procurement AI Cell</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Sandbox Statutory Network Connected
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenPortalsModal}
            className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>10+ Statutory Connectors (Sandbox Data)</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">Buyer ID: <span className="text-slate-200 font-semibold">GEM-PO-DELHI-042</span></span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-blue">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0B1528] items-center justify-center text-[8px] font-bold text-white">✓</span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                GeM-Verify <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">AI ENGINE</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                GeM 5.0 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Autonomous Multi-Portal Bid Eligibility & Statutory Compliance Verification
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Gemini AI Key Status Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              geminiConfig?.isGeminiConfigured
                ? 'bg-purple-950/40 text-purple-300 border-purple-500/40 hover:bg-purple-900/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-blue-500/50'
            }`}
            title="Configure Google Gemini API Key"
          >
            <Sparkles className={`w-3.5 h-3.5 ${geminiConfig?.isGeminiConfigured ? 'text-purple-400 animate-spin-slow' : 'text-blue-400'}`} />
            <span>
              {geminiConfig?.isGeminiConfigured ? 'Gemini AI: Active' : 'Gemini Key: Placeholder'}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              {geminiConfig?.isGeminiConfigured ? 'Live' : 'Mock AI'}
            </span>
          </button>

          {/* Audit Trail Button */}
          <button
            onClick={onOpenAuditModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audit Trail</span>
          </button>

          {/* Evaluation Report Button */}
          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Executive Report</span>
          </button>

          {/* New Bidder Verification Button */}
          <button
            onClick={onOpenNewBidderModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-glow-blue transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Verify New Bid</span>
          </button>

          {/* Refresh current database data */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Refresh bidder data from database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
