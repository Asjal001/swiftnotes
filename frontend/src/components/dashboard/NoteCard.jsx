import {Link} from 'react-router-dom';
import {useState} from 'react';
import {Trash2} from 'lucide-react';
import api from '../../api/axios';
import DeleteNoteModal from './DeleteNoteModal';

const NoteCard=({note,index,onDelete})=>{
  const [showModal,setShowModal] =useState(false);
  const [deleting,setDeleting] =useState(false);
  const [deleteError,setDeleteError]=useState('');
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
        <button
          type="button"
          onClick={(e)=>{
            e.preventDefault();
            setShowModal(true);
          }}
          aria-label="Delete note"
          className="absolute top-4 right-4 p-1 text-red-400 hover:text-red-600 transition-colors z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {showModal && (
        <DeleteNoteModal
          onCancel={()=>{setShowModal(false); setDeleteError('');}}
          onConfirm={handleDelete}
          loading={deleting}
          error={deleteError}
        />
      )}
    </>
  );
};
export default NoteCard;