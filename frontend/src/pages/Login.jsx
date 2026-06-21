import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ArrowRight, Mail, Lock, User, AlertCircle, X } from 'lucide-react';

export default function SlimeLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Tracking form focus states to drive the Slime animation
  const [focusedField, setFocusedField] = useState(null); // 'email' | 'password' | 'name' | null

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      } else {
        await authAPI.register({ email, password, full_name: fullName });
        setIsLogin(true);
        setError('Account created! Please sign in.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = error?.includes('created');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712] font-sans antialiased">
      
      {/* Background Neon Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Error/Notification Toast */}
      {error && (
        <div className="fixed top-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            isSuccess ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' : 'bg-red-950/80 border-red-500/30 text-red-200'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError('')} className="ml-3 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[420px] z-10">
        
        {/* ================= SLIME INTERACTIVE SVG CHARACTER ================= */}
        <div className="relative w-full h-40 flex justify-center items-end mb-2 select-none pointer-events-none">
          <svg viewBox="0 0 200 160" className="w-44 h-44 drop-shadow-[0_10px_20px_rgba(20,184,166,0.2)]">
            {/* Slime Main Floating Body */}
            <path 
              d="M30,120 C30,50 60,30 100,30 C140,30 170,50 170,120 C170,145 145,150 100,150 C55,150 30,145 30,120 Z" 
              className="fill-gradient animate-[slimeFloat_4s_infinite_ease-in-out]"
              fill="url(#slimeGrad)"
            />

            {/* Eyes Container - Moves down when typing username/email */}
            <g className={`transition-transform duration-300 ease-out ${
              focusedField === 'email' || focusedField === 'name' ? 'translate-y-2' : 'translate-y-0'
            }`}>
              {/* Left Eye Background */}
              <ellipse cx="75" cy="85" rx="16" ry="20" fill="#ffffff" />
              {/* Right Eye Background */}
              <ellipse cx="125" cy="85" rx="16" ry="20" fill="#ffffff" />

              {/* Pupils - Looks around dynamically based on active field */}
              <ellipse 
                cx="75" 
                cy="85" 
                rx="7" 
                ry="9" 
                fill="#0f172a"
                className={`transition-transform duration-300 ${
                  focusedField === 'email' || focusedField === 'name' ? 'translate-y-3 scale-y-90' : 'translate-y-0'
                }`}
              />
              <ellipse 
                cx="125" 
                cy="85" 
                rx="7" 
                ry="9" 
                fill="#0f172a"
                className={`transition-transform duration-300 ${
                  focusedField === 'email' || focusedField === 'name' ? 'translate-y-3 scale-y-90' : 'translate-y-0'
                }`}
              />
            </g>

            {/* Happy Mouth */}
            <path 
              d="M90,110 Q100,120 110,110" 
              stroke="#0f172a" 
              strokeWidth="3" 
              strokeLinecap="round" 
              fill="none" 
              className={`transition-opacity duration-200 ${focusedField === 'password' ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Slime Tentacles / Arms - COVERS EYES when password field is focused! */}
            <g className="origin-bottom transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              {/* Left Arm */}
              <path 
                d="M 25 135 Q 15 100 25 80" 
                stroke="url(#slimeGrad)" 
                strokeWidth="14" 
                strokeLinecap="round" 
                fill="none"
                className={`transition-all duration-500 origin-bottom ${
                  focusedField === 'password' ? 'stroke-teal-400' : ''
                }`}
                style={{
                  d: focusedField === 'password' ? "path('M 25 135 Q 40 70 73 82')" : "path('M 20 140 Q -5 100 15 110')"
                }}
              />
              {/* Right Arm */}
              <path 
                d="M 175 135 Q 185 100 175 80" 
                stroke="url(#slimeGrad)" 
                strokeWidth="14" 
                strokeLinecap="round" 
                fill="none"
                className={`transition-all duration-500 origin-bottom ${
                  focusedField === 'password' ? 'stroke-teal-400' : ''
                }`}
                style={{
                  d: focusedField === 'password' ? "path('M 175 135 Q 160 70 127 82')" : "path('M 180 140 Q 205 100 185 110')"
                }}
              />
            </g>

            {/* SVG Gradients */}
            <defs>
              <linearGradient id="slimeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Form Container Card */}
        <div className="bg-[#0b1329]/80 border border-white/[0.06] backdrop-blur-2xl rounded-3xl p-8 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] relative">
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

          {/* Form Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {isLogin ? 'Industrial Mainframe' : 'Register New Node'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Operator Designation</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white placeholder:text-slate-600 text-sm focus:border-teal-500/50 focus:bg-white/[0.04] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Secure Mail Routing</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white placeholder:text-slate-600 text-sm focus:border-teal-500/50 focus:bg-white/[0.04] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Encryption Key</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white placeholder:text-slate-600 text-sm focus:border-teal-500/50 focus:bg-white/[0.04] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Glowing CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Execute Identity' : 'Deploy Identity'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs font-bold tracking-wider uppercase text-teal-400 hover:text-teal-300 transition-colors"
            >
              {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
            </button>
          </div>

        </div>

        {/* Footer Brand */}
        <div className="mt-6 text-center text-[10px] font-medium tracking-widest text-slate-600">
          <span className="w-2 h-2 rounded-full bg-teal-500/40 inline-block mr-2" />
          Secure Slime Terminal Node
        </div>

      </div>

      {/* High performance CSS for micro-movements injected into the global style tag */}
      <style>{`
        @keyframes slimeFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02, 0.98); }
        }
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}