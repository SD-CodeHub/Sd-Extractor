import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { login, saveSession } from '../services/api';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      saveSession(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white font-sans antialiased px-4 py-10">
      <Toaster position="top-center" />

      <button onClick={() => navigate('/')} className="mb-8 text-2xl font-black tracking-tighter text-center">
        SD<span className="text-indigo-400"> EXTRACTOR</span>
        <span className="block text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase -mt-1">by SD CodeHub</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white text-slate-900 p-10 rounded-[2rem] shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 font-light">Log in to your SD Extractor account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required placeholder="Gmail address"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-base"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" required placeholder="Password"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-base"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center group disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New here?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 hover:underline">Create an account</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link to="/login"
              className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition">
              <FiShield /> Login as Admin
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-300 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
