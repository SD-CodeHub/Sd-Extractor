import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiArrowRight, FiShield } from 'react-icons/fi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hard-coded check
    if (username === 'admin' && password === 'admin123') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 font-sans antialiased selection:bg-indigo-50">
      
      {/* Brand Logo - Matching Home Nav */}
      <div className="mb-10 text-2xl font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
        DATA<span className="text-indigo-600">EXTRACTOR</span>
      </div>

      <div className="w-full max-w-md px-4">
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Admin Access</h2>
            <p className="text-slate-500 font-light">Secure gateway for license management.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-base"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center group"
            >
              Sign In
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest">
            <FiShield className="text-indigo-600" />
            Encrypted Session
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition uppercase tracking-widest"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}