import React, { useState } from 'react';
import { X, FileSpreadsheet, Check, Copy, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleAppsScriptCode';

export const SheetConfigModal: React.FC = () => {
  const { isSheetConfigOpen, closeSheetConfig, settings, saveGoogleSheetUrl } = useData();
  const [urlInput, setUrlInput] = useState(
    settings.google_sheet_webapp_url || (settings as any).google_sheet_url || localStorage.getItem('balaji_sheet_url') || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isSheetConfigOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    const result = await saveGoogleSheetUrl(urlInput);
    setIsSaving(false);
    setStatusMessage(result.message);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={closeSheetConfig}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Google Sheet Enquiry Store Setup
              </h3>
              <p className="text-[11px] text-slate-500">
                All citizen enquiries are saved directly to this Google Sheet.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSheetConfig}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900 block">How to connect in 2 minutes:</span>
          <ol className="list-decimal pl-4 space-y-1 text-slate-600">
            <li>Open a Google Sheet at <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">sheets.new</a></li>
            <li>In Google Sheets menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
            <li>Copy the script code below, paste into <code>Code.gs</code>, and click Save.</li>
            <li>In toolbar, select <strong>setupEnquiriesSheet</strong> and click <strong>Run</strong> (authorizes permissions).</li>
            <li>Click <strong>Deploy &gt; New deployment &gt; Web app</strong>, set <strong>Who has access: "Anyone"</strong>, click Deploy, and copy your Web App URL.</li>
          </ol>
        </div>

        {/* Copy Script Code Button */}
        <button
          type="button"
          onClick={handleCopyCode}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedCode ? 'Apps Script Code Copied to Clipboard!' : 'Copy Apps Script Code'}</span>
        </button>

        {/* Form to paste Web App URL */}
        <form onSubmit={handleSave} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Google Apps Script Web App URL (ends in /exec)
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeSheetConfig}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Connecting...' : 'Save & Connect'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
