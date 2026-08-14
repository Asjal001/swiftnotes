import useAuth from '../../hooks/useAuth';
import {Lightbulb,StickyNote} from 'lucide-react';

const WelcomeBanner=()=>{
  const {user}=useAuth();
  const hour=new Date().getHours();
  const greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
  const rawName=user?.email?.split('@')[0].split('.')[0]||'Guest';
  const name=rawName.charAt(0).toUpperCase()+rawName.slice(1);
  return(
    <div className="mb-8 mt-4">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-3 tracking-tight">
        👋 {greeting}, <span className="text-indigo-600">{name}</span>.
      </h1>
      <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
        <span>Convert your</span>
        <span className="text-indigo-500 font-semibold flex items-center gap-1.5 bg-indigo-50 px-2.5 py-0.5 rounded-md">
          Thoughts <Lightbulb className="w-4 h-4" />
        </span> 
        <span>to</span>
        <span className="text-emerald-500 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-md">
          Notes <StickyNote className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
export default WelcomeBanner;