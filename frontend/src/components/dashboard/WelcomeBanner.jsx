import useAuth from '../../hooks/useAuth';

const WelcomeBanner=()=>{
  const {user}=useAuth();
  const hour=new Date().getHours();
  const greeting=hour< 12?'Good morning':hour< 18?'Good afternoon':'Good evening';
  const rawName=user?.email?.split('@')[0].split('.')[0]||'Guest';
  const name=rawName.charAt(0).toUpperCase()+rawName.slice(1);
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-center ">{greeting}, <span className="text-indigo-600">{name}</span>.</h1>
    </div>
  );
};
export default WelcomeBanner;