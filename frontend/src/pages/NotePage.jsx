import {useState,useEffect,useRef} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import api from '../api/axios';
import NoteEditor from '../components/notes/NoteEditor';

const NotePage=()=>{
  const {id}=useParams();
  const navigate=useNavigate();
  const isNew=id==='new';
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [loading,setLoading]=useState(!isNew);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [showCancelModal,setShowCancelModal]=useState(false);
  const initialTitle=useRef('');
  const initialContent=useRef('');
  useEffect(()=>{
    if(isNew) return;
    api.get(`/notes/${id}`)
      .then(res=>{
        const t=res.data.data.title;
        const c=res.data.data.content||'';
        setTitle(t);
        setContent(c);
        initialTitle.current=t;
        initialContent.current=c;
      })
      .catch(()=>setError('Failed to load note'))
      .finally(()=>setLoading(false));
  },[id, isNew]);
  const handleCancel=()=>{
    const hasChanges= title!==initialTitle.current||content!==initialContent.current;
    if(hasChanges){
      setShowCancelModal(true);
      return;
    }
    navigate('/dashboard');
  };
  const handleSave=async()=>{
    if(!title.trim()){
      setError('Title is required');
      return;
    }
    setSaving(true);
    try{
      if(isNew){
        await api.post('/notes',{title,content});
      }else{
        await api.patch(`/notes/${id}`,{title,content});
      }
      navigate('/dashboard');
    }catch{
      setError('Failed to save note');
    }finally{
      setSaving(false);
    }
  };
  if (loading) return <p className="p-8 text-slate-400 text-sm">Loading...</p>;
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight text-indigo-950">
          Swift<span className="text-indigo-600">Notes</span>
        </span>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto w-full px-8 py-10 flex flex-col flex-1">
        <input
          type="text"
          value={title}
          onChange={(e)=>{setTitle(e.target.value);setError('');}}
          placeholder="Note title"
          className="text-3xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none w-full mb-6 bg-transparent"
        />
        <NoteEditor
          content={content}
          onChange={(val) => { setContent(val); setError(''); }}
        />
      </div>
      {showCancelModal &&(
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Discard changes?</h3>
            <p className="text-sm text-slate-500 mb-5">Your unsaved changes will be lost.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Keep editing
              </button>
              <button
                onClick={()=>navigate('/dashboard')}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotePage;