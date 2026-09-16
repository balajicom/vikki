import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, isAdminLoggedIn } = useData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@balaji.com');
  const [password, setPassword] = useState('balaji@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await loginAdmin(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div id="admin-login-page" className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Balaji Admin Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Jan Seva Kendra Management & Google Sheets Sync
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-950">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Default Administrator Credentials:</span>
          </div>
          <div className="pl-5 space-y-0.5 text-slate-700 font-mono text-[11px]">
            <div>Email: <strong>admin@balaji.com</strong></div>
            <div>Password: <strong>balaji@2026</strong></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="admin-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="admin-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-login-submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <p>Protected route. Authorized access only.</p>
        </div>

      </div>
    </div>
  );
};
