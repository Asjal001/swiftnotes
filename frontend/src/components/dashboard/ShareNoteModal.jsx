import { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

const ShareNoteModal = ({ noteId, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateLink = async () => {
      try {
        const res = await api.post(`/notes/${noteId}/share`);
        const token = res.data.data.shareToken;
        setShareUrl(`${window.location.origin}/shared/${token}`);
      } catch {
        setError('Failed to generate share link.');
      } finally {
        setLoading(false);
      }
    };
    generateLink();
  }, [noteId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy link.');
    }
  };

  return (
    <dialog
      ref={(el) => { if (el && !el.open) el.showModal(); }}
      onCancel={onClose}
      className="m-auto bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border-0 backdrop:bg-slate-900/40"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-900 truncate pr-4">Share "{title}"</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Anyone with this link can view this note.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2.5 outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors shrink-0 ${
                copied ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ShareNoteModal;