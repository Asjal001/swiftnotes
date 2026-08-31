import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Sparkles, Book } from 'lucide-react';
import api from '../api/axios'; 
import ReactMarkdown from 'react-markdown';

const SharedNotePage = () => {
  const { shareToken } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/notes/shared/${shareToken}`)
      .then((res) => {
        setNote(res.data.data);
      })
      .catch(() => {
        setError('This note could not be found or the link has expired.');
      })
      .finally(() => setLoading(false));
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Note Unavailable</h3>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <Link to="/" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors">
          Go to SwiftNotes
        </Link>
      </div>
    );
  }

  const date = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 h-16 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Book className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SwiftNotes</span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
            Shared Note
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{note.title}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
            <span className="font-medium text-slate-700">{note.user?.name || 'Anonymous'}</span>
            <span>•</span>
            <span>Last updated on {date}</span>
          </div>

          {note.summary && (
            <div className="mb-10 p-6 rounded-xl border border-indigo-100 bg-indigo-50/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-600" />
                Executive Summary
              </h3>
              <div className="text-slate-700 leading-relaxed prose prose-slate max-w-none">
                <ReactMarkdown>{note.summary}</ReactMarkdown>
              </div>
            </div>
          )}

          <div 
            className="prose prose-slate max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </main>
    </div>
  );
};

export default SharedNotePage;