import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  Cpu
} from 'lucide-react';
import { createAndVerifyBidder } from '../services/api';

export default function NewVerificationModal({ onClose, onBidderCreated }) {
  const [formData, setFormData] = useState({
    bidderName: '',
    pan: '',
    gstin: '',
    cin: '',
    udyamRegNo: '',
    epfoCode: '',
    esicCode: '',
    claimedCategory: 'MSE (Small Enterprise) & Class-I Local Supplier',
    localContentPercentage: '75',
    oemAuthorizationCode: 'MAF-OEM-2026-VERIFIED',
    startupDpiitNo: '',
    nsicCertNo: '',
    claimedTurnover: '₹ 12.50 Cr',
    claimedExperienceYears: '6'
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bidderName || !formData.pan) {
      setError('Please provide at least the Bidder Legal Entity Name and PAN number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      files.forEach(file => {
        data.append('documents', file);
      });

      const res = await createAndVerifyBidder(data);
      onBidderCreated(res.bidder);
      onClose();
    } catch (err) {
      setError(err.message || 'Verification process encountered an issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl bg-[#091122]/95 my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060B16] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Verify New Tender Bid Submission
              </h2>
              <p className="text-xs text-slate-400">
                Upload tender bid documents & trigger autonomous statutory verification
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Document Upload Area */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
              1. Upload Tender Bid Documents (PDF / Scans)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 sm:p-6 text-center bg-slate-900/40 transition-colors relative cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 mx-auto text-blue-400 mb-2" />
              <p className="text-slate-200 font-medium">
                Drag & Drop or Click to Upload Bidder PDF Documents
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Udyam Certificate, GST-3B returns, Form 26AS, MII CA Audit, OEM MAF (Max 5 files)
              </p>

              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  {files.map((f, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-blue-900/50 text-blue-300 border border-blue-700 text-[11px] flex items-center gap-1 font-mono">
                      <FileText className="w-3 h-3" /> {f.name} ({(f.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bidder Identifiers Grid */}
          <div className="space-y-1.5 pt-2">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
              2. Statutory & Commercial Identifiers
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Legal Entity / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Dynamics Private Limited"
                  value={formData.bidderName}
                  onChange={(e) => setFormData({ ...formData, bidderName: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Permanent Account Number (PAN) *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="e.g. AABCB1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 uppercase font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AABCB1234F1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 uppercase font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Udyam Registration No (URN)</label>
                <input
                  type="text"
                  placeholder="e.g. UDYAM-MH-01-0045892"
                  value={formData.udyamRegNo}
                  onChange={(e) => setFormData({ ...formData, udyamRegNo: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Make in India Local Content (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.localContentPercentage}
                  onChange={(e) => setFormData({ ...formData, localContentPercentage: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">EPFO Establishment Code</label>
                <input
                  type="text"
                  placeholder="e.g. MH/BAN/0045892/000"
                  value={formData.epfoCode}
                  onChange={(e) => setFormData({ ...formData, epfoCode: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">DPIIT Startup India Reg (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. DIPP104829"
                  value={formData.startupDpiitNo}
                  onChange={(e) => setFormData({ ...formData, startupDpiitNo: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">NSIC Registration (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NSIC/GP/DEL/2021/00341"
                  value={formData.nsicCertNo}
                  onChange={(e) => setFormData({ ...formData, nsicCertNo: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Claimed Category</label>
                <select
                  value={formData.claimedCategory}
                  onChange={(e) => setFormData({ ...formData, claimedCategory: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="MSE (Micro Enterprise) & Class-I Local Supplier">MSE (Micro) & Class-I Local</option>
                  <option value="MSE (Small Enterprise) & Class-I Local Supplier">MSE (Small) & Class-I Local</option>
                  <option value="Medium Enterprise / Class-I Local Supplier">Medium Enterprise & Class-I</option>
                  <option value="DPIIT Recognized Startup & Micro Enterprise">DPIIT Recognized Startup</option>
                  <option value="Non-Local Supplier / Class-II">Non-Local Supplier / Class-II</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action */}
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                  <span>Cross-Verifying with Government Databases...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute AI Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
