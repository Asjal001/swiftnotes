import {Link} from 'react-router-dom';
import NoteCard from './NoteCard';
import {StickyNote} from 'lucide-react';

const NoteGrid=({notes=[]})=>{
  if(notes.length===0){
    return(
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto">
        <StickyNote className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No notes yet</h3>
        <p className="text-sm text-slate-400 mb-6">Create your first note to get started.</p>
        <Link to="/notes/new" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors">
          Create a note
        </Link>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <NoteCard key={note.id} note={note}/>
      ))}
    </div>
  );
};
export default NoteGrid;