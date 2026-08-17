import {Link} from 'react-router-dom';
import {Plus} from 'lucide-react';

const AddNoteButton=({className=''})=>{
  return(
    <Link to="/notes/new" className={`flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors ${className}`}>
      <Plus className="w-4 h-4" />
      New Note
    </Link>
  );
};
export default AddNoteButton;