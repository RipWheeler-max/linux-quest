import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/firebase';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[150px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#b347d9] rounded-full opacity-5 blur-[150px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-8xl mb-6">🐧</div>
          <h1 className="game-font text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#b347d9] mb-3">
            LINUX QUEST
          </h1>
          <p className="text-[#94a3b8] text-lg">创建你的账号</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="game-card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-base">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#00d4ff] mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="game-input w-full text-lg py-3"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#00d4ff] mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="game-input w-full text-lg py-3"
              placeholder="至少6位"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#00d4ff] mb-2">
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="game-input w-full text-lg py-3"
              placeholder="再次输入密码"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="game-btn w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: '#00d4ff', color: '#00d4ff' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                注册中...
              </span>
            ) : (
              '注 册'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#94a3b8] text-base">
              已有账号？{' '}
              <Link to="/login" className="text-[#00ff88] hover:text-[#00d4ff] transition-colors font-bold text-lg">
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
