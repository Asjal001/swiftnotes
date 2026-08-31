import {Link} from 'react-router-dom';
import {useState} from 'react';
import {Trash2,Share2} from 'lucide-react';
import api from '../../api/axios';
import DeleteNoteModal from './DeleteNoteModal';
import ShareNoteModal from './ShareNoteModal';

const NoteCard=({note,index,onDelete})=>{
  const [showModal,setShowModal] =useState(false);
  const [deleting,setDeleting] =useState(false);
  const [deleteError,setDeleteError]=useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const preview=note.content?.replace(/<[^>]{0,500}>/g, ' ').replace(/&[a-z]{1,10};/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 100)||'No content';
  const date=note.createdAt?new Date(note.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year: 'numeric'}): '—';
  const handleDelete=async()=>{
    setDeleting(true);
    try {
      await api.delete(`/notes/${note.id}`);
      onDelete(note.id);
    } catch{
      setDeleting(false);
      setDeleteError('Failed to delete. Try again.');
    }
  };
  const borderColors=[
    'border-b-indigo-400',
    'border-b-emerald-400',
    'border-b-amber-400',
    'border-b-rose-400',
    'border-b-sky-400',
    'border-b-purple-400'
  ];
  const bottomBorderColor=borderColors[index% borderColors.length];
  return (
    <>
      <div className="relative">
        <Link
          to={`/notes/${note.id}`} className={`block bg-white border border-slate-100 border-b-4 ${bottomBorderColor} rounded-2xl p-5 hover:shadow-md transition-all`}>
          <h3 className="font-semibold text-slate-900 text-base mb-1 truncate pr-8">{note.title}</h3>
          <p className="text-sm text-slate-400 mb-3">{date}</p>
          <p className="text-sm text-slate-500 line-clamp-2">{preview}</p>
        </Link>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowShareModal(true); }}
            aria-label="Share note"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowModal(true); }}
            aria-label="Delete note"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showModal && (
        <DeleteNoteModal
          onCancel={()=>{setShowModal(false); setDeleteError('');}}
          onConfirm={handleDelete}
          loading={deleting}
          error={deleteError}
        />
      )}
      {showShareModal && (
        <ShareNoteModal
          noteId={note.id}
          title={note.title}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};
export default NoteCard;