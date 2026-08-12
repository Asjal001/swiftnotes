import {Link} from 'react-router-dom';
import {FileText,LayoutList,UserCircle,ArrowRight} from 'lucide-react';

const features=[
  {
    title:"Organized Dashboard",
    description:"Access and manage all your notes in a clean, intuitive layout.",
    icon:<LayoutList className="w-6 h-6 text-indigo-500" />
  },
  {
    title:"Create & Edit Notes",
    description:"Write and update your notes quickly with a distraction-free editor.",
    icon:<FileText className="w-6 h-6 text-indigo-500" />
  },
  {
    title:"Secure & Private",
    description:"Your notes are protected with JWT-based authentication.",
    icon:<UserCircle className="w-6 h-6 text-indigo-500" />
  },
];
const Landing=()=>{
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-indigo-950">Swift<span className="text-indigo-600">Notes</span></div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
          <Link to="/signup" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-all">Sign up</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">Capture thoughts at the <br className="hidden md:block" /> speed of light.</h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          A fast, secure, and beautiful space for your ideas. Create, edit, and organize your notes all in one place.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup" className="flex items-center px-8 py-4 text-base font-semibold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 shadow-md transition-all group">
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default Landing;