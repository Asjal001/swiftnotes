import {useState,useEffect} from 'react';
import {LogOut} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import NoteGrid from '../components/dashboard/NoteGrid';
import AddNoteButton from '../components/dashboard/AddNoteButton';

const Dashboard=()=>{
  const {logout}=useAuth();
  const [notes,setNotes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    api.get('/notes')
      .then(res=>setNotes(res.data.data??[]))
      .catch(()=>setError('Failed to load notes'))
      .finally(()=>setLoading(false));
  },[]);
  const handleDelete=(id)=>{
    setNotes(prev=>prev.filter(note=>note.id!==id));
  };
  const renderContent=()=>{
    if(loading) return(
      <div className="flex justify-center items-center py-24">
        <p className="text-sm text-slate-400">Loading notes...</p>
      </div>
    );
    if(error) return(
      <div className="flex justify-center items-center py-24">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
    return <NoteGrid notes={notes} onDelete={handleDelete}/>;
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-100 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-tight text-indigo-950">
            Swift<span className="text-indigo-600">Notes</span>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-8 py-10">
        <WelcomeBanner />
        {notes.length>0 && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Your Notes</h2>
            <AddNoteButton />
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};
export default Dashboard;