import {useState,useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {AlertCircle,Loader2,CheckCircle,ChevronDown,ChevronUp,Eye,EyeOff} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

const ProfilePage=()=>{
  const {logout}=useAuth();
  const navigate=useNavigate();
  const [profile,setProfile]=useState({name:'',bio:'',email:''});
  const initialProfile=useRef({name:'',bio:''});
  const mountedRef=useRef(true);
  const [loading,setLoading]=useState(true);
  const [profileError,setProfileError]=useState('');
  const [profileSuccess,setProfileSuccess]=useState('');
  const [savingProfile,setSavingProfile]=useState(false);
  const [showUnsavedModal,setShowUnsavedModal]=useState(false);
  const [pendingAction,setPendingAction]=useState(null);
  const [passwords,setPasswords]=useState({currentPassword:'',newPassword:'',confirmPassword:''});
  const [isPasswordOpen,setIsPasswordOpen]=useState(false);
  const [showPwd,setShowPwd]=useState({current:false,new:false,confirm:false});
  const [passwordError,setPasswordError]=useState('');
  const [passwordSuccess,setPasswordSuccess]=useState('');
  const [savingPassword,setSavingPassword]=useState(false);
  const [showDeleteModal,setShowDeleteModal]=useState(false);
  const [deleting,setDeleting]=useState(false);
  const [deleteError,setDeleteError]=useState('');
  useEffect(()=>{
    api.get('/user/profile')
      .then(res=>{
        const data=res.data.data;
        const formattedProfile={name:data.name||'',bio:data.bio||'',email: data.email};
        setProfile(formattedProfile);
        initialProfile.current={name:formattedProfile.name,bio:formattedProfile.bio};
      })
      .catch(()=>setProfileError('Failed to load profile'))
      .finally(()=>setLoading(false));
  },[]);
  useEffect(()=>{
    const handleBeforeUnload = (e) => {
      const hasProfileChanges = profile.name !== initialProfile.current.name || profile.bio !== initialProfile.current.bio;
      const hasPasswordChanges = passwords.currentPassword || passwords.newPassword || passwords.confirmPassword;
      if (hasProfileChanges || hasPasswordChanges) {
        e.preventDefault();
        e.returnValue='';
      }
    };
    window.addEventListener('beforeunload',handleBeforeUnload);
    return ()=>window.removeEventListener('beforeunload',handleBeforeUnload);
  },[profile, passwords]);
  useEffect(()=>{
    return()=>{ mountedRef.current=false;};
  },[]);
  const handleActionAttempt=(action)=>{
    const hasProfileChanges=profile.name!==initialProfile.current.name||profile.bio!==initialProfile.current.bio;
    const hasPasswordChanges=passwords.currentPassword||passwords.newPassword||passwords.confirmPassword;    
    if(hasProfileChanges||hasPasswordChanges){
      setPendingAction(action);
      setShowUnsavedModal(true);
    } else{
      executeAction(action);
    }
  };
  const executeAction=(action)=>{
    if(action.type==='logout'){
      logout();
    } else if(action.type==='navigate'){
      navigate(action.path);
    }
  };
  const showProfileSuccess=(msg)=>{
  setProfileSuccess(msg);
  setTimeout(()=>{ if(mountedRef.current) setProfileSuccess('');},3000);
};
const showPasswordSuccess=(msg)=>{
  setPasswordSuccess(msg);
  setTimeout(()=>{ if(mountedRef.current) setPasswordSuccess('');},3000);
};
  const handleProfileSave = async () => {
    const hasChanges=profile.name!==initialProfile.current.name||profile.bio!==initialProfile.current.bio;
    if(!hasChanges){
      setProfileError('No changes to save');
      setTimeout(()=>{ if(mountedRef.current) setProfileError('');},3000);
      return;
    }
    setSavingProfile(true);
    setProfileError('');
    try{
      const res=await api.patch('/user/profile',{name:profile.name,bio:profile.bio});
      const updatedData=res.data.data;
      const safeName=updatedData.name||'';
      const safeBio=updatedData.bio||'';
      setProfile(prev=>({ ...prev,name:safeName,bio:safeBio}));
      initialProfile.current={name:safeName,bio:safeBio};
      showProfileSuccess('Profile updated successfully');
    } catch (err){
      setProfileError(err.response?.data?.error||'Failed to update profile');
    } finally{
      setSavingProfile(false);
    }
  };
  const handlePasswordChange=async()=>{
    setPasswordError('');
    setPasswordSuccess('');
    if(passwords.newPassword!==passwords.confirmPassword){
      setPasswordError("New passwords don't match");
      return;
    }
    if(passwords.newPassword.length<8){
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setSavingPassword(true);
    try{
      await api.patch('/user/password',{
        currentPassword:passwords.currentPassword,
        newPassword:passwords.newPassword,
      });
      showPasswordSuccess('Password changed successfully');
      setPasswords({currentPassword:'',newPassword:'',confirmPassword:''});
      setIsPasswordOpen(false);
    } catch (err){
      setPasswordError(err.response?.data?.error||'Failed to change password');
    } finally{
      setSavingPassword(false);
    }
  };
  const handleDeleteAccount=async()=>{
    setDeleting(true);
    setDeleteError('');
    try{
      await api.delete('/user');
      logout();
      navigate('/');
    } catch{
      setDeleteError('Failed to delete account. Try again.');
      setDeleting(false);
    }
  };
  const togglePwdVisibility=(field)=>{
    setShowPwd(prev => ({ ...prev, [field]: !prev[field]}));
  };
  if (loading) return(
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
      <Navbar onActionAttempt={handleActionAttempt} />
      <main className="max-w-2xl mx-auto px-8 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-slate-500">Loading profile...</p>
      </main>
    </div>
  );
  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#f0f2f9] font-sans">
      <Navbar onActionAttempt={handleActionAttempt}/>
      <main className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Profile</h1>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-5">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(e)=>{setProfile(prev=>({...prev,name:e.target.value})); setProfileError(''); setProfileSuccess('');}}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
              <textarea
                id="profile-bio"
                value={profile.bio}
                onChange={(e)=>{setProfile(prev=>({...prev,bio:e.target.value})); setProfileError(''); setProfileSuccess('');}}
                placeholder="Tell us a little about yourself"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm resize-none"
              />
            </div>
          </div>
          {profileError &&(
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{profileError}</p>
            </div>
          )}
          {profileSuccess &&(
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-sm text-green-600">{profileSuccess}</p>
            </div>
          )}
          <div className="flex justify-center mt-5">
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={savingProfile}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {savingProfile?'Saving...' :'Save Changes'}
            </button>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm overflow-hidden transition-all">
          <button
            type="button"
            aria-expanded={isPasswordOpen}
            aria-controls="password-content"
            className="w-full flex justify-between items-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-lg"
            onClick={()=> setIsPasswordOpen(!isPasswordOpen)}
          >
            <h2 className="text-base font-semibold text-slate-800">Change Password</h2>
            {isPasswordOpen ?(
              <ChevronUp className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
            )}
          </button>
          {isPasswordOpen &&(
            <div id="password-content" className="mt-5 space-y-4 animate-in slide-in-from-top-2 fade-in duration-500">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showPwd.current?'text':'password'}
                    value={passwords.currentPassword}
                    onChange={(e)=>{ setPasswords(prev =>({...prev, currentPassword:e.target.value})); setPasswordError(''); setPasswordSuccess('');}}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                  />
                  <button type="button" onClick={() => togglePwdVisibility('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPwd.new ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e)=>{ setPasswords(prev=>({...prev,newPassword:e.target.value})); setPasswordError(''); setPasswordSuccess('');}}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                  />
                  <button type="button" onClick={()=>togglePwdVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showPwd.confirm?'text':'password'}
                    value={passwords.confirmPassword}
                    onChange={(e)=>{ setPasswords(prev=>({...prev,confirmPassword:e.target.value})); setPasswordError(''); setPasswordSuccess('');}}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                  />
                  <button type="button" onClick={()=>togglePwdVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {passwordError &&(
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              {passwordSuccess &&(
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}
              <div className="flex justify-center mt-5">
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={savingPassword}
                  className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {savingPassword?'Updating...':'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-red-600 mb-2">Delete Account</h2>
          <p className="text-sm text-slate-500 mb-5">Permanently delete your account and all your notes. This cannot be undone.</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={()=>setShowDeleteModal(true)}
              className="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
        {showDeleteModal &&(
          <dialog
            ref={(el)=>{if(el&&!el.open) el.showModal();}}
            onCancel={()=>{setShowDeleteModal(false);setDeleteError('');}}
            onClose={()=>{setShowDeleteModal(false);setDeleteError('');}}
            aria-labelledby="delete-modal-title"
            className="m-auto bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg border-0 backdrop:bg-black/40"
          >
            <h3 id="delete-modal-title" className="text-lg font-semibold text-slate-900 mb-2">Delete account?</h3>
            <p className="text-sm text-slate-500 mb-4">All your notes will be permanently deleted. This action cannot be undone.</p>
            {deleteError&&(
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={()=>{setShowDeleteModal(false);setDeleteError('');}}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting?'Deleting...':'Delete'}
              </button>
            </div>
          </dialog>
        )}
        {showUnsavedModal &&(
          <dialog
            ref={(el)=>{if(el&&!el.open) el.showModal();}}
            onCancel={()=>{setShowUnsavedModal(false);setPendingAction(null);}}
            onClose={()=>{setShowUnsavedModal(false);setPendingAction(null);}}
            aria-labelledby="cancel-modal-title"
            className="m-auto bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg border-0 backdrop:bg-black/30"
          >
            <h3 id="cancel-modal-title" className="text-base font-semibold text-slate-900 mb-1">Discard changes?</h3>
            <p className="text-sm text-slate-500 mb-5">Your unsaved changes will be lost.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={()=>{
                  setShowUnsavedModal(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Keep editing
              </button>
              <button
                type="button"
                autoFocus 
                onClick={()=>{ 
                  setShowUnsavedModal(false);
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
export default ProfilePage;