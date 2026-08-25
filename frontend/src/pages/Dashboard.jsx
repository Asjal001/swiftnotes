import {useState,useEffect} from 'react';
import {Book,Loader2,AlertCircle,RefreshCw,Lightbulb,PenTool,BookOpen,Search} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import NoteGrid from '../components/dashboard/NoteGrid';
import AddNoteButton from '../components/dashboard/AddNoteButton';

const Dashboard=()=>{
  const [notes,setNotes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [searchQuery,setSearchQuery]=useState('');
  useEffect(()=>{
    api.get('/notes')
      .then(res=>setNotes(res.data.data??[]))
      .catch(()=>setError('Failed to load notes'))
      .finally(()=>setLoading(false));
  },[]);
  const handleDelete=(id)=>{
    setNotes(prev=>prev.filter(note=>note.id!==id));
  };
  const normalizedSearchQuery=searchQuery.trim().toLowerCase();
  const filteredNotes=notes.filter(note=>
    (note.title||'').toLowerCase().includes(normalizedSearchQuery)||
    note.content?.replace(/<[^>]{0,500}>/g, ' ').toLowerCase().includes(normalizedSearchQuery)
  );
  const renderContent=()=>{
    if(loading) return(
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4"/>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Loading notes</h3>
        <p className="text-sm text-slate-500">Fetching your workspace...</p>
      </div>
    );
    if(error) return(
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          {error}. Please check your internet connection or make sure the server is running.
        </p>
        <button 
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );    
    if(normalizedSearchQuery && filteredNotes.length===0) return(
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto">
        <Search aria-hidden="true" className="w-10 h-10 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No results found</h3>
        <p className="text-sm text-slate-400">No notes match "<span className="font-medium text-slate-500">{searchQuery}</span>"</p>
      </div>
    );
    return <NoteGrid notes={filteredNotes} onDelete={handleDelete} />;
  };
  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-10">
        <WelcomeBanner />       
        {notes.length>0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-8">
            <div className="flex items-center gap-2 border-b-2 border-indigo-600 pb-1 pr-4 whitespace-nowrap">
              <Book className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Your Notes</h2>
            </div>
            <div className="relative flex-1 max-w-md w-full">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                aria-label="Search notes"
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="shrink-0">
              <AddNoteButton />
            </div>
          </div>
        )}      
        {renderContent()}
        {notes.length>0 && !loading && !error && filteredNotes.length>0 && (
          <div className="mt-8 mx-auto max-w-4xl bg-[#f8f9ff] rounded-xl py-6 px-8 shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 border-r-4 border-r-indigo-100 flex items-center justify-between overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="text-indigo-500 text-8xl font-serif leading-none pt-4 select-none">
                “
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-slate-900 mb-1 max-w-xl px-4">
                  "The best way to predict the future is to create it."
                </h3>
                <p className="text-sm text-slate-600 font-medium px-4">- Peter Drucker</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 pr-2">
              <Lightbulb className="w-8 h-8 text-indigo-200" />
              <PenTool className="w-10 h-10 text-indigo-300" />
              <BookOpen className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;