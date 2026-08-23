import {createContext,useState,useEffect,useMemo} from 'react';
import {useNavigate} from 'react-router-dom';

export const AuthContext=createContext();
export const AuthProvider=({children})=>{
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();
  useEffect(()=>{
    try{
      const savedUser=localStorage.getItem('user');
      const token=localStorage.getItem('token');
      if(savedUser && token){
        setUser(JSON.parse(savedUser));
      }
    } catch{
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally{
      setLoading(false);
    }
  }, []);
  const login=(userData,token)=>{
    localStorage.setItem('user',JSON.stringify(userData));
    localStorage.setItem('token',token);
    setUser(userData);
    navigate('/dashboard');
  };
  const logout=()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };
  const contextValue=useMemo(()=>({
    user,
    login,
    logout,
    loading
  }),[user,login,logout,loading]);
  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};