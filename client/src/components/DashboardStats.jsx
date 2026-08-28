import React from 'react';
import { 
  Building2, 
  FileCheck2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Flame,
  Award,
  Cpu
} from 'lucide-react';

export default function DashboardStats({ tenderDetails, bidders, selectedRiskFilter, onSelectRiskFilter }) {
  const total = bidders?.length || 0;
  const lowRisk = bidders?.filter(b => b.verificationSummary.riskLevel === 'LOW_RISK').length || 0;
  const medRisk = bidders?.filter(b => b.verificationSummary.riskLevel === 'MEDIUM_RISK').length || 0;
  const highRisk = bidders?.filter(b => b.verificationSummary.riskLevel === 'HIGH_RISK').length || 0;

  const qualified = bidders?.filter(b => b.verificationSummary.officerDecision?.status === 'QUALIFIED').length || 0;
  const pendingOfficer = bidders?.filter(b => !b.verificationSummary.officerDecision || b.verificationSummary.officerDecision?.status === 'PENDING_OFFICER_REVIEW').length || 0;
  const clarifications = bidders?.filter(b => b.verificationSummary.officerDecision?.status === 'CLARIFICATION_REQUESTED').length || 0;
  const disqualified = bidders?.filter(b => b.verificationSummary.officerDecision?.status === 'DISQUALIFIED').length || 0;

  const avgScore = total > 0 
    ? Math.round(bidders.reduce((acc, b) => acc + (b.verificationSummary.complianceScore || 0), 0) / total)
    : 0;

  return (
    <div className="space-y-4">
      {/* Tender Context Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-[#0d1f3d]/80 via-[#0b162c]/80 to-[#0d1a30]/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                ACTIVE GeM TENDER
              </span>
              <span className="font-mono text-xs text-slate-300 font-semibold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {tenderDetails?.tenderId || 'GEM/2026/B/882194'}
              </span>
              <span className="text-xs text-slate-400">
                Est. Value: <strong className="text-emerald-400">{tenderDetails?.estimatedValue || '₹ 14.50 Crore'}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {tenderDetails?.title || 'Procurement of Enterprise Cloud Infrastructure, AI Server Racks & Cyber Security Suite'}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Organization: <strong>{tenderDetails?.buyerOrg || 'Ministry of Electronics & IT / NIC'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-amber-400" />
                Eval Deadline: <strong>{tenderDetails?.technicalEvaluationDeadline || '31-Aug-2026'}</strong>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Evaluation Velocity</div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 74% Time Saved
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Mean Compliance</div>
              <div className="text-lg font-extrabold text-blue-400 font-mono">{avgScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Bids Card */}
        <div 
          onClick={() => onSelectRiskFilter('ALL')}
          className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
            selectedRiskFilter === 'ALL' ? 'ring-2 ring-blue-500 bg-slate-800/90' : 'hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bids</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{total}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{qualified} Qualified</span>
            <span className="text-blue-400 font-medium">100% Scanned</span>
          </div>
        </div>

        {/* Low Risk Bids Card */}
        <div 
          onClick={() => onSelectRiskFilter('LOW_RISK')}
          className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
            selectedRiskFilter === 'LOW_RISK' ? 'ring-2 ring-emerald-500 bg-slate-800/90' : 'hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Low Risk (Eligible)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{lowRisk}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Recommended to Qualify
          </div>
        </div>

        {/* Medium Risk Bids Card */}
        <div 
          onClick={() => onSelectRiskFilter('MEDIUM_RISK')}
          className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
            selectedRiskFilter === 'MEDIUM_RISK' ? 'ring-2 ring-amber-500 bg-slate-800/90' : 'hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Medium Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{medRisk}</div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            Clarifications / Window Active
          </div>
        </div>

        {/* High Risk Bids Card */}
        <div 
          onClick={() => onSelectRiskFilter('HIGH_RISK')}
          className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
            selectedRiskFilter === 'HIGH_RISK' ? 'ring-2 ring-red-500 bg-slate-800/90' : 'hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">High Risk (Non-Compliant)</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-red-400 font-mono">{highRisk}</div>
          <div className="text-[11px] text-red-300/80 mt-1">
            Debarred / MII / Tax Flags
          </div>
        </div>
      </div>
    </div>
  );
}
