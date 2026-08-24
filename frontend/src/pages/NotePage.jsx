import {useState,useEffect,useRef} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {Loader2,AlertCircle} from 'lucide-react';
import api from '../api/axios';
import NoteEditor from '../components/notes/NoteEditor';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

const NotePage=()=>{
  const {id}=useParams();
  const navigate=useNavigate();
  const {logout}=useAuth();
  const isNew=id==='new';
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [loading,setLoading]=useState(!isNew);
  const [saving,setSaving]=useState(false);
  const [loadError,setLoadError]=useState('');
  const [saveError,setSaveError]=useState('');
  const [showCancelModal,setShowCancelModal]=useState(false);
  const [pendingAction,setPendingAction]=useState(null);
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
      .catch(()=>setLoadError('Failed to load note. It may have been deleted or there is a network issue.'))
      .finally(()=>setLoading(false));
  },[id, isNew]);
  useEffect(()=>{
    const handleBeforeUnload=(e)=>{
      const hasChanges=title!==initialTitle.current||content!==initialContent.current;
      if(hasChanges){
        e.preventDefault();
        e.returnValue='';
      }
    };
    window.addEventListener('beforeunload',handleBeforeUnload);
    return()=>window.removeEventListener('beforeunload',handleBeforeUnload);
  },[title,content]);
  const handleActionAttempt=(action)=>{
    const hasChanges=title!==initialTitle.current||content!==initialContent.current;
    if(hasChanges){
      setPendingAction(action);
      setShowCancelModal(true);
    } else{
      executeAction(action);
    }
  };
  const executeAction=(action)=>{
    if(!action) return;
    if(action.type === 'logout'){
      logout();
    } else if(action.type === 'navigate'){
      navigate(action.path);
    }
  };
  const handleCancel=()=>{
    handleActionAttempt({type:'navigate',path:'/dashboard'});
  };
  const handleSave=async()=>{
    if(!title.trim()){
      setSaveError('Title is required to save the note.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try{
      if(isNew){
        await api.post('/notes',{title,content});
      } else{
        await api.patch(`/notes/${id}`,{title,content });
      }
      initialTitle.current=title;
      initialContent.current=content;
      navigate('/dashboard');
    } catch{
      setSaveError('Failed to save note. Please check your connection and try again.');
    } finally{
      setSaving(false);
    }
  };
  if(loading){
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto px-8 py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading your note...</p>
        </main>
      </div>
    );
  }
  if(loadError){
    return(
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto px-8 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Note Unavailable</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">{loadError}</p>
          <button 
            type="button"
            onClick={()=>navigate('/dashboard')}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }
  return(
    <div className="h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans flex flex-col overflow-hidden">
      <Navbar onActionAttempt={handleActionAttempt}/>
      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-8">
        <div className="shrink-0 py-4">
          <input
            type="text"
            value={title}
            onChange={(e)=>{setTitle(e.target.value);setSaveError('');}}
            placeholder="Note title"
            className="text-3xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none w-full bg-transparent"
          />
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <NoteEditor
            content={content}
            onChange={(val)=>{setContent(val);setSaveError('');}}
          />
        </div>
        <div className="shrink-0 py-4">
          {saveError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-medium text-red-700">{saveError}</p>
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {saving?'Saving...':'Save Note'}
            </button>
          </div>
        </div>
        {showCancelModal &&(
          <dialog
            ref={(el)=>{if(el&&!el.open) el.showModal();}}
            onCancel={()=>{setShowCancelModal(false);setPendingAction(null);}}
            onClose={()=>{setShowCancelModal(false);setPendingAction(null);}}
            aria-labelledby="cancel-modal-title"
            className="m-auto bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg border-0 backdrop:bg-black/30"
          >
            <h3 id="cancel-modal-title" className="text-base font-semibold text-slate-900 mb-1">Discard changes?</h3>
            <p className="text-sm text-slate-500 mb-5">Your unsaved changes will be lost.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={()=>{
                  setShowCancelModal(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={()=>{
                  setShowCancelModal(false);
                  executeAction(pendingAction);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
            </div>
          </dialog>
        )}
      </main>
    </div>
  );
};
export default NotePage;