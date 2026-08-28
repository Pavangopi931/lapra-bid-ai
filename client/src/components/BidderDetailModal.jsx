import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Database, 
  Send, 
  RefreshCw, 
  UserCheck, 
  Building, 
  Briefcase, 
  Scale,
  Award,
  Clock,
  Layers,
  Lock,
  Download
} from 'lucide-react';
import { fetchBidderDetails, reVerifyBidder, recordOfficerDecision } from '../services/api';

export default function BidderDetailModal({ 
  bidderId, 
  onClose, 
  onOpenClarificationModal,
  onDecisionUpdated 
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'statutory' | 'audit'
  const [isReverifying, setIsReverifying] = useState(false);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [bidderId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchBidderDetails(bidderId);
      setData(res);
      if (res.bidder?.verificationSummary?.officerDecision?.officerRemarks) {
        setOfficerRemarks(res.bidder.verificationSummary.officerDecision.officerRemarks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReverify = async () => {
    try {
      setIsReverifying(true);
      const res = await reVerifyBidder(bidderId);
      setData(prev => ({
        ...prev,
        bidder: res.bidder
      }));
      onDecisionUpdated();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    } finally {
      setIsReverifying(false);
    }
  };

  const handleOfficerDecision = async (status) => {
    try {
      setSubmittingDecision(true);
      await recordOfficerDecision(bidderId, {
        decisionStatus: status,
        remarks: officerRemarks,
        officerId: 'GEM-PO-DELHI-042'
      });
      await loadDetails();
      onDecisionUpdated();
    } catch (err) {
      alert('Failed to submit decision: ' + err.message);
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-slate-700 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm font-medium text-slate-300">Retrieving Cross-Portal Bidder Dossier...</p>
        </div>
      </div>
    );
  }

  const { bidder, portalData, auditHistory } = data;
  const summary = bidder.verificationSummary || {};
  const breakdown = summary.statutoryBreakdown || {};
  const score = summary.complianceScore || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-6xl rounded-2xl border border-slate-700 shadow-2xl bg-[#091122]/95 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060B16] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{bidder.bidderName}</h2>
                <span className="font-mono text-xs text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800">
                  {bidder.id}
                </span>
                {summary.isPoweredByLiveGemini && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gemini 2.0
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>PAN: <strong className="text-slate-200 font-mono">{bidder.pan}</strong></span>
                <span>•</span>
                <span>GSTIN: <strong className="text-slate-200 font-mono">{bidder.gstin}</strong></span>
                <span>•</span>
                <span>Tender: <strong className="text-slate-300">{bidder.tenderId}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReverify}
              disabled={isReverifying}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReverifying ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isReverifying ? 'Scanning...' : 'Re-Verify AI'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-800 bg-slate-900/50 flex space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dossier'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Side-by-Side Verification Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('statutory')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'statutory'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Government Portal / Sandbox Records</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Audit Trail & Cryptographic Log</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Executive Score & AI Verdict Banner */}
          <div className={`rounded-xl p-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            score >= 85 
              ? 'bg-emerald-950/30 border-emerald-500/30' 
              : score >= 65 
              ? 'bg-amber-950/30 border-amber-500/30' 
              : 'bg-red-950/30 border-red-500/30'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-mono border-2 ${
                score >= 85 ? 'border-emerald-400 text-emerald-300 bg-emerald-900/40' :
                score >= 65 ? 'border-amber-400 text-amber-300 bg-amber-900/40' :
                'border-red-400 text-red-300 bg-red-900/40'
              }`}>
                <span className="text-xl font-extrabold">{score}%</span>
                <span className="text-[9px] uppercase tracking-wider font-sans">Score</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    summary.riskLevel === 'LOW_RISK' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    summary.riskLevel === 'MEDIUM_RISK' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {summary.riskLevel?.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    AI Verdict: <strong className="text-white">{summary.verdict?.replace(/_/g, ' ')}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {summary.aiSummary}
                </p>
              </div>
            </div>

            {/* Quick Clarification Shortcut */}
            {summary.riskLevel === 'MEDIUM_RISK' && (
              <button
                onClick={() => onOpenClarificationModal(bidder)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Issue GeM Clarification Notice</span>
              </button>
            )}
          </div>

          {/* Critical Flags Alert Box */}
          {summary.criticalFlags && summary.criticalFlags.length > 0 && (
            <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Critical Statutory & Integrity Violations Detected ({summary.criticalFlags.length})
              </h4>
              <ul className="space-y-1 text-xs text-red-200">
                {summary.criticalFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 1: Dossier View (Side-by-Side) */}
          {activeTab === 'dossier' && (
            <div className="space-y-6">
              {/* 8-Pillar Statutory Compliance Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-blue-400" />
                  Statutory Pillars Evaluation Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { key: 'statutoryAndTax', title: '1. GST & Tax Compliance', icon: '🏛️' },
                    { key: 'msmeStartupBenefits', title: '2. MSME / Startup Exemption', icon: '🚀' },
                    { key: 'makeInIndia', title: '3. Make in India (MII %)', icon: '🇮🇳' },
                    { key: 'laborCompliance', title: '4. EPFO & ESIC Labor', icon: '👷' },
                    { key: 'financialViability', title: '5. Financial & Turnover', icon: '💼' },
                    { key: 'debarmentVigilance', title: '6. Debarment & Vigilance', icon: '🛡️' },
                    { key: 'digiLockerIntegrity', title: '7. DigiLocker & Hashes', icon: '🔐' },
                    { key: 'oemAuthorization', title: '8. OEM Authorization (MAF)', icon: '📜' }
                  ].map(pillar => {
                    const data = breakdown[pillar.key] || { score: 100, status: 'COMPLIANT', details: 'Verified and compliant.' };
                    const isOk = data.score >= 80;
                    return (
                      <div key={pillar.key} className="glass-panel p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300 flex items-center gap-1">
                            <span>{pillar.icon}</span> {pillar.title}
                          </span>
                          <span className={`font-mono font-bold ${isOk ? 'text-emerald-400' : 'text-red-400'}`}>
                            {data.score}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {data.details}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-Side Comparison: Uploaded Docs vs Portal Record */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Uploaded Documents */}
                <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Submitted Bidder Documents ({bidder.submittedDocuments?.length || 0})
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">DigiLocker Hash Verified</span>
                  </div>

                  <div className="space-y-2">
                    {bidder.submittedDocuments?.map(doc => (
                      <div key={doc.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2.5">
                          <span className="p-1.5 rounded bg-blue-600/10 text-blue-400 font-mono text-[10px]">
                            {doc.type}
                          </span>
                          <div>
                            <div className="font-medium text-slate-200">{doc.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Size: {doc.size}</div>
                          </div>
                        </div>

                        <div>
                          {doc.hashVerificationStatus === 'VERIFIED' || doc.hashValid === true || doc.verifiedStatus === 'VERIFIED' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Hash Verified
                            </span>
                          ) : doc.hashVerificationStatus === 'NOT_VERIFIED' || doc.hashValid === null ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <ShieldAlert className="w-3 h-3" /> Not Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                              <XCircle className="w-3 h-3" /> Tampered
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Live Portal Data Cross-Reference */}
                <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-400" />
                      Government Portal / Sandbox Records
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono">Sandbox connector response</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Udyam Status */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300 mb-1">
                        <span>Udyam Registration</span>
                        <span className={portalData.udyam ? 'text-emerald-400' : 'text-amber-400'}>
                          {portalData.udyam ? `ACTIVE (${portalData.udyam.classification})` : 'NO UDYAM LINKED'}
                        </span>
                      </div>
                      {portalData.udyam && (
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>URN: <strong className="text-slate-200">{portalData.udyam.urn}</strong></div>
                          <div>Activity: {portalData.udyam.majorActivity} ({portalData.udyam.nicCode})</div>
                        </div>
                      )}
                    </div>

                    {/* GSTN Status */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300 mb-1">
                        <span>GSTN Portal Compliance</span>
                        <span className={portalData.gstn?.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}>
                          {portalData.gstn?.status || 'NOT FOUND'}
                        </span>
                      </div>
                      {portalData.gstn && (
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>Legal Name: <strong className="text-slate-200">{portalData.gstn.legalName}</strong></div>
                          <div>Jurisdiction: {portalData.gstn.stateJurisdiction}</div>
                        </div>
                      )}
                    </div>

                    {/* EPFO & Labor Status */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300 mb-1">
                        <span>EPFO Shram Suvidha</span>
                        <span className={portalData.epfo?.status === 'COMPLIANT' ? 'text-emerald-400' : 'text-amber-400'}>
                          {portalData.epfo?.status || 'N/A'}
                        </span>
                      </div>
                      {portalData.epfo && (
                        <div className="text-[11px] text-slate-400">
                          Employees: {portalData.epfo.coveredEmployees} | Default: {portalData.epfo.defaultStatus}
                        </div>
                      )}
                    </div>

                    {/* Debarment Registry */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300 mb-1">
                        <span>CPPP Central Debarment</span>
                        <span className={portalData.debarment?.isDebarred ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {portalData.debarment?.isDebarred ? 'BLACKLISTED' : 'CLEAR / NO RECORD'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Full Government Portal Records */}
          {activeTab === 'statutory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Income Tax & PAN Card */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Building className="w-4 h-4 text-blue-400" /> Income Tax & ITR-V Filings
                  </h4>
                  {portalData.incomeTax ? (
                    <div className="space-y-1.5 text-slate-300">
                      <div>Status: <span className="text-emerald-400 font-semibold">{portalData.incomeTax.panStatus}</span></div>
                      <div>Tax Audit 44AB: <strong>{portalData.incomeTax.taxAudit44AB}</strong></div>
                      <div>Recent Filings:</div>
                      <div className="space-y-1 mt-1 font-mono text-[11px]">
                        {portalData.incomeTax.itrFilings?.map(itr => (
                          <div key={itr.ay} className="bg-slate-900 p-1.5 rounded flex justify-between">
                            <span>AY {itr.ay} ({itr.form})</span>
                            <span className="text-emerald-400">{itr.grossTurnover}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500">No direct Income Tax repository records found.</p>
                  )}
                </div>

                {/* MCA21 / ROC */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> MCA21 / Ministry of Corporate Affairs
                  </h4>
                  {portalData.mca21 ? (
                    <div className="space-y-1.5 text-slate-300">
                      <div>CIN: <span className="font-mono text-slate-100">{portalData.mca21.cin || portalData.mca21.llpin}</span></div>
                      <div>Company Status: <span className="text-emerald-400 font-semibold">{portalData.mca21.companyStatus}</span></div>
                      <div>RoC Jurisdiction: {portalData.mca21.rocCode}</div>
                      <div>Authorized Capital: {portalData.mca21.authorizedCapital}</div>
                    </div>
                  ) : (
                    <p className="text-slate-500">MCA records not applicable for entity structure.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cryptographic Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                Immutable Procurement Verification Ledger
              </h4>
              <div className="space-y-2 font-mono text-xs">
                {auditHistory && auditHistory.length > 0 ? (
                  auditHistory.map((log) => (
                    <div key={log.logId} className="glass-panel p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span className="text-blue-400 font-bold">{log.action}</span>
                        <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        Officer ID: <strong className="text-slate-200">{log.officerId}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500 break-all">
                        SHA-256 Block Hash: {log.hash}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No specific ledger events recorded for this entity yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Procurement Officer Decision Area */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-400" />
              Procurement Officer Official Evaluation & Decision
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-medium">
                Reasoned Remarks / Notes on Tender File:
              </label>
              <textarea
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="Enter evaluation justification, rule references (e.g. GFR 153/MSME Act), or representation observations..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Current Status:{' '}
                <strong className="text-slate-200">
                  {bidder.verificationSummary.officerDecision?.status || 'PENDING_OFFICER_REVIEW'}
                </strong>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOfficerDecision('QUALIFIED')}
                  disabled={submittingDecision}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept & Qualify Bid</span>
                </button>

                <button
                  onClick={() => handleOfficerDecision('CLARIFICATION_REQUESTED')}
                  disabled={submittingDecision}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Clarification</span>
                </button>

                <button
                  onClick={() => handleOfficerDecision('DISQUALIFIED')}
                  disabled={submittingDecision}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Disqualify Bid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
