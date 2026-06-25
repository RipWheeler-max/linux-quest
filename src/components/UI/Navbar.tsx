import { useAuth } from '../../context/AuthContext';
import { logoutUser, resetProgress } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { levels } from '../../data/levels';

export default function Navbar() {
  const { user, progress } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleReset = async () => {
    if (user && confirm('确定要重置所有进度吗？这将清除所有关卡完成记录。')) {
      await resetProgress(user.uid);
      window.location.reload();
    }
  };

  const completedCount = progress?.completedLevels.length || 0;
  const totalLevels = levels.length;

  return (
    <nav className="bg-[#0a0e1a]/90 backdrop-blur-md border-b border-[#1e293b] px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <div className="text-2xl group-hover:animate-[float_1s_ease-in-out_infinite]">🐧</div>
            <div className="absolute -inset-2 bg-[#00ff88] opacity-0 group-hover:opacity-10 rounded-full blur-md transition-opacity" />
          </div>
          <h1 className="game-font text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff] tracking-wider">
            LINUX QUEST
          </h1>
        </div>

        {/* Center - Progress */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111827] rounded-full border border-[#1e293b]">
            <span className="text-xl">🏆</span>
            <span className="text-sm text-[#94a3b8]">
              <span className="text-[#00ff88] font-semibold">{completedCount}</span>
              <span className="mx-1">/</span>
              <span>{totalLevels}</span>
            </span>
          </div>
        </div>

        {/* Right - User */}
        <div className="flex items-center gap-4">
          {/* Mobile stats */}
          <div className="md:hidden flex items-center gap-2">
            <div className="px-3 py-1 bg-[#111827] rounded-full border border-[#1e293b]">
              <span className="text-xs text-[#00ff88]">{completedCount}/{totalLevels}</span>
            </div>
          </div>

          {/* User email */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#111827] rounded-full border border-[#1e293b]">
            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-[pulse-glow_2s_ease-in-out_infinite]" />
            <span className="text-sm text-[#94a3b8] terminal-font">
              {user?.email?.split('@')[0]}
            </span>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-[#111827] hover:bg-yellow-500/10 border border-[#1e293b] hover:border-yellow-500/50 text-[#94a3b8] hover:text-yellow-400 rounded-full text-xs transition-all duration-300"
            title="重置进度"
          >
            🔄
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#111827] hover:bg-red-500/10 border border-[#1e293b] hover:border-red-500/50 text-[#94a3b8] hover:text-red-400 rounded-full text-sm transition-all duration-300"
          >
            退出
          </button>
        </div>
      </div>
    </nav>
  );
}
