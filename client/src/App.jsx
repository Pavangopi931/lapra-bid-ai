import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import BidderTable from './components/BidderTable';
import BidderDetailModal from './components/BidderDetailModal';
import NewVerificationModal from './components/NewVerificationModal';
import PortalIntegrationsModal from './components/PortalIntegrationsModal';
import ApiKeyModal from './components/ApiKeyModal';
import ClarificationModal from './components/ClarificationModal';
import ReportModal from './components/ReportModal';
import AuditTrailModal from './components/AuditTrailModal';
import { 
  fetchBidders, 
  fetchGeminiConfig, 
  reVerifyBidder 
} from './services/api';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  SlidersHorizontal 
} from 'lucide-react';

export default function App() {
  const [bidders, setBidders] = useState([]);
  const [tenderDetails, setTenderDetails] = useState(null);
  const [geminiConfig, setGeminiConfig] = useState(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reverifyingId, setReverifyingId] = useState(null);

  // Modals state
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [clarificationBidder, setClarificationBidder] = useState(null);
  const [isNewBidderModalOpen, setIsNewBidderModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPortalsModalOpen, setIsPortalsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    loadGeminiConfig();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchBidders();
      setBidders(res.bidders || []);
      setTenderDetails(res.tenderDetails || null);
    } catch (err) {
      console.error('Failed to load bidders data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGeminiConfig = async () => {
    try {
      const config = await fetchGeminiConfig();
      setGeminiConfig(config);
    } catch (err) {
      console.error('Failed to load Gemini config:', err);
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      // Refresh only reloads the current persistent database state.
      // It must never reset or reseed the bidder dataset.
      await loadData();
    } catch (err) {
      alert('Failed to refresh bidder data: ' + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReverifyBidder = async (id) => {
    try {
      setReverifyingId(id);
      const res = await reVerifyBidder(id);
      setBidders(prev => prev.map(b => b.id === id ? res.bidder : b));
    } catch (err) {
      alert('Re-verification failed: ' + err.message);
    } finally {
      setReverifyingId(null);
    }
  };

  const handleBidderCreated = (newBidder) => {
    setBidders(prev => [newBidder, ...prev]);
    setSelectedBidder(newBidder);
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Main Header */}
      <Header
        geminiConfig={geminiConfig}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPortalsModal={() => setIsPortalsModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenNewBidderModal={() => setIsNewBidderModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI & Context Dashboard Stats */}
        <DashboardStats
          tenderDetails={tenderDetails}
          bidders={bidders}
          selectedRiskFilter={selectedRiskFilter}
          onSelectRiskFilter={setSelectedRiskFilter}
        />

        {/* Master Evaluation Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Bidder Compliance & Verification Registry
            </h3>

            <span className="text-xs text-slate-400">
              Rule 144(xi) GFR 2017 & MSME Act Automated Validation Active
            </span>
          </div>

          <BidderTable
            bidders={bidders}
            selectedRiskFilter={selectedRiskFilter}
            onSelectRiskFilter={setSelectedRiskFilter}
            onSelectBidder={(bidder) => setSelectedBidder(bidder)}
            onReverifyBidder={handleReverifyBidder}
            onOpenClarificationModal={(bidder) => setClarificationBidder(bidder)}
            reverifyingId={reverifyingId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#050A14] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GeM-Verify AI • Integrated Bid Compliance Verification Platform • GeM 5.0</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Udyam • GSTN • PAN/IT • MCA21 • EPFO • ESIC • Startup India • CPPP</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedBidder && (
        <BidderDetailModal
          bidderId={selectedBidder.id}
          onClose={() => setSelectedBidder(null)}
          onOpenClarificationModal={(b) => {
            setSelectedBidder(null);
            setClarificationBidder(b);
          }}
          onDecisionUpdated={loadData}
        />
      )}

      {clarificationBidder && (
        <ClarificationModal
          bidder={clarificationBidder}
          onClose={() => setClarificationBidder(null)}
        />
      )}

      {isNewBidderModalOpen && (
        <NewVerificationModal
          onClose={() => setIsNewBidderModalOpen(false)}
          onBidderCreated={handleBidderCreated}
        />
      )}

      {isApiKeyModalOpen && (
        <ApiKeyModal
          geminiConfig={geminiConfig}
          onClose={() => setIsApiKeyModalOpen(false)}
          onConfigUpdated={loadGeminiConfig}
        />
      )}

      {isPortalsModalOpen && (
        <PortalIntegrationsModal
          onClose={() => setIsPortalsModalOpen(false)}
        />
      )}

      {isAuditModalOpen && (
        <AuditTrailModal
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          tenderDetails={tenderDetails}
          bidders={bidders}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
