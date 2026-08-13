import {Link} from 'react-router-dom';

const NoteCard=({note})=>{
  const preview=note.content?.replace(/<[^>]*>/g,'').replace(/&[a-z]+;/gi,' ').trim().slice(0, 100)||'No content';
  const date=note.createdAt?new Date(note.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year: 'numeric'}): '—';
  return (
    <Link
      to={`/notes/${note.id}`} className="block bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all">
      <h3 className="font-semibold text-slate-900 text-base mb-1 truncate">{note.title}</h3>
      <p className="text-sm text-slate-400 mb-3">{date}</p>
      <p className="text-sm text-slate-500 line-clamp-2">{preview}</p>
    </Link>
  );
};
export default NoteCard;