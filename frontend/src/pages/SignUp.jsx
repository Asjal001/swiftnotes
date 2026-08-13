import {useState} from 'react';
import {Link} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import {Eye,EyeOff} from 'lucide-react';

const SignUp=()=>{
  const {login}=useAuth();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(password.length<8){
      setError('Password must be at least 8 characters');
      return;
    }
    if(password!==confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res=await api.post('/auth/signup',{email,pass:password });
      login(res.data.data.user, res.data.data.token);
    } catch(err){
      setError(err.response?.data?.error||'Something went wrong');
    } finally{
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 sm:p-12">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-950 inline-block mb-2">Swift<span className="text-indigo-600">Notes</span></Link>
          <h2 className="text-xl font-semibold text-slate-900">Create an account</h2>
          <p className="text-sm text-slate-500 mt-1">Start organizing your thoughts today.</p>
        </div>
        {error &&(
          <p className="text-sm text-center text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>{setEmail(e.target.value);setError('');}}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword?'text':'password'}
                required
                value={password}
                onChange={(e)=>{setPassword(e.target.value);setError('');}}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button type="button" onClick={()=> setShowPassword(!showPassword)} aria-label={showPassword?'Hide password': 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword?<EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5" />}
            </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm?'text':'password'}
                required
                value={confirmPassword}
                onChange={(e)=>{setConfirmPassword(e.target.value);setError('');}}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button type="button" onClick={()=> setShowConfirm(!showConfirm)} aria-label={showPassword?'Hide password': 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"> {showConfirm?<EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>} </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading?'Creating account...':'Sign up'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;