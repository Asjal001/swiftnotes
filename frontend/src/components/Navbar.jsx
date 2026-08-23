import {Link,useLocation} from 'react-router-dom';
import {LogOut} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar=({onActionAttempt})=>{
  const {logout}=useAuth();
  const location=useLocation();
  const isActive=(path)=>location.pathname===path;
  const handleNavClick=(e,path)=>{
    if(onActionAttempt){
      e.preventDefault();
      onActionAttempt({type:'navigate',path});
    }
  };
  const handleLogoutClick=()=>{
    if(onActionAttempt){
      onActionAttempt({ type:'logout'});
    } else{
      logout();
    }
  };
  return(
    <nav className="bg-white/60 backdrop-blur-md border-b border-slate-100 px-4 py-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <Link to="/dashboard" onClick={(e) => handleNavClick(e, '/dashboard')} className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.jpg" alt="SwiftNotes" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-indigo-950">
              Swift<span className="text-indigo-600">Notes</span>
            </span>
          </Link>
        </div>
        <div className="flex justify-center items-center gap-8">
          <Link
            to="/dashboard"
            onClick={(e)=>handleNavClick(e,'/dashboard')}
            className={`text-sm font-bold transition-all py-1 border-b-2 ${
              isActive('/dashboard') 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            onClick={(e)=>handleNavClick(e,'/profile')}
            className={`text-sm font-bold transition-all py-1 border-b-2 ${
              isActive('/profile') 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-md hover:border-slate-200 transition-all text-sm font-bold text-slate-800"
          >
            <LogOut className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;