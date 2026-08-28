import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  Send,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function BidderTable({ 
  bidders, 
  selectedRiskFilter, 
  onSelectRiskFilter, 
  onSelectBidder, 
  onReverifyBidder, 
  onOpenClarificationModal,
  reverifyingId 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter bidders
  const filteredBidders = (bidders || []).filter(bidder => {
    const matchesSearch = 
      bidder.bidderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bidder.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bidder.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bidder.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = 
      selectedRiskFilter === 'ALL' || bidder.verificationSummary.riskLevel === selectedRiskFilter;

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'PENDING' && (!bidder.verificationSummary.officerDecision || bidder.verificationSummary.officerDecision.status === 'PENDING_OFFICER_REVIEW')) ||
      (bidder.verificationSummary.officerDecision?.status === statusFilter);

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW_RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            LOW RISK
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            MEDIUM RISK
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm shadow-red-500/10">
            <ShieldAlert className="w-3.5 h-3.5" />
            HIGH RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            PENDING
          </span>
        );
    }
  };

  const getDecisionBadge = (decision) => {
    const status = decision?.status || 'PENDING_OFFICER_REVIEW';
    switch (status) {
      case 'QUALIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ QUALIFIED
          </span>
        );
      case 'DISQUALIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
            ✕ DISQUALIFIED
          </span>
        );
      case 'CLARIFICATION_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ✉ REPRESENTATION SOUGHT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            ⏳ Pending Officer Action
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Table Controls & Filter Toolbar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Bidder name, PAN, GSTIN, Bid ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Showing <strong>{filteredBidders.length}</strong> of {bidders?.length || 0} bids
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'QUALIFIED', label: 'Qualified' },
            { key: 'CLARIFICATION_REQUESTED', label: 'Clarifications' },
            { key: 'DISQUALIFIED', label: 'Disqualified' },
            { key: 'PENDING', label: 'Pending Review' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === f.key
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#091122] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th scope="col" className="py-3 px-4">Bidder Details & IDs</th>
              <th scope="col" className="py-3 px-4">Eligibility & MII Claim</th>
              <th scope="col" className="py-3 px-4 text-center">Compliance Score</th>
              <th scope="col" className="py-3 px-4 text-center">Risk Assessment</th>
              <th scope="col" className="py-3 px-4">Key Statutory Flags & AI Verdict</th>
              <th scope="col" className="py-3 px-4">Officer Decision</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filteredBidders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500">
                  <Building className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  No bidders matching the selected filters found.
                </td>
              </tr>
            ) : (
              filteredBidders.map((bidder) => {
                const isReverifying = reverifyingId === bidder.id;
                const score = bidder.verificationSummary.complianceScore || 0;
                const riskLevel = bidder.verificationSummary.riskLevel;

                return (
                  <tr 
                    key={bidder.id} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectBidder(bidder)}
                  >
                    {/* Bidder Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 text-sm group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        {bidder.bidderName}
                        {bidder.verificationSummary.isPoweredByLiveGemini && (
                          <span title="Verified with Live Gemini AI">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono mt-1">
                        <span className="text-slate-300 font-bold">{bidder.id}</span>
                        <span>•</span>
                        <span>PAN: {bidder.pan}</span>
                        <span>•</span>
                        <span>GSTIN: {bidder.gstin}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        URN: {bidder.udyamRegNo || 'N/A'} | CIN: {bidder.cin || 'N/A'}
                      </div>
                    </td>

                    {/* Eligibility & MII Claim */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="text-slate-200 font-medium truncate" title={bidder.claimedCategory}>
                        {bidder.claimedCategory}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          bidder.localContentPercentage >= 50 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          MII: {bidder.localContentPercentage}% Local
                        </span>
                        {bidder.startupDpiitNo && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                            DPIIT Startup
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Compliance Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 font-mono font-extrabold text-sm ${getScoreColor(score)} shadow-inner`}>
                        {score}%
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4 text-center">
                      {getRiskBadge(riskLevel)}
                    </td>

                    {/* Statutory Flags & AI Verdict */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {bidder.verificationSummary.criticalFlags && bidder.verificationSummary.criticalFlags.length > 0 ? (
                        <div className="space-y-1">
                          {bidder.verificationSummary.criticalFlags.slice(0, 1).map((flag, idx) => (
                            <div key={idx} className="text-[11px] text-red-300 font-medium line-clamp-2 flex items-start gap-1">
                              <span className="text-red-400 font-bold shrink-0">⚠️</span>
                              <span>{flag}</span>
                            </div>
                          ))}
                          {bidder.verificationSummary.criticalFlags.length > 1 && (
                            <span className="text-[10px] text-red-400 underline font-semibold">
                              +{bidder.verificationSummary.criticalFlags.length - 1} more critical alert(s)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-300 line-clamp-2">
                          {bidder.verificationSummary.aiSummary || 'Statutory criteria verified and clear.'}
                        </div>
                      )}
                    </td>

                    {/* Officer Decision */}
                    <td className="py-3.5 px-4">
                      {getDecisionBadge(bidder.verificationSummary.officerDecision)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectBidder(bidder)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all font-medium inline-flex items-center gap-1 cursor-pointer"
                        title="Open Full Verification Dossier"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onReverifyBidder(bidder.id)}
                        disabled={isReverifying}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors inline-flex items-center cursor-pointer"
                        title="Re-run AI & Portal Verification"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReverifying ? 'animate-spin text-blue-400' : ''}`} />
                      </button>

                      {bidder.verificationSummary.riskLevel === 'MEDIUM_RISK' && (
                        <button
                          onClick={() => onOpenClarificationModal(bidder)}
                          className="p-1 rounded bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-colors inline-flex items-center cursor-pointer"
                          title="Generate GeM Representation Notice"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
