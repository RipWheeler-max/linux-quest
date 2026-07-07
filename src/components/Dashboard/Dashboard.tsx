import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { levels } from '../../data/levels';

const categoryNames: { [key: string]: string } = {
  basic: '基础篇',
  permission: '权限篇',
  text: '文本篇',
  script: '脚本篇',
  process: '进程篇',
  network: '网络篇',
  system: '系统篇'
};

const categoryIcons: { [key: string]: string } = {
  basic: '📁',
  permission: '🔒',
  text: '📝',
  script: '📜',
  process: '⚙️',
  network: '🌐',
  system: '🖥️'
};

// 章节解锁映射：完成前一章节最后一关 → 解锁下一章节
const categoryUnlockMap: Record<string, number> = {
  basic: 0,        // 默认解锁
  permission: 10,  // 完成基础篇最后一关
  text: 16,        // 完成权限篇最后一关
  script: 24,      // 完成文本篇最后一关
  process: 30,     // 完成脚本篇最后一关
  network: 36,     // 完成进程篇最后一关
  system: 42,      // 完成网络篇最后一关
};

export default function Dashboard() {
  const { progress } = useAuth();
  const navigate = useNavigate();

  const isLevelCompleted = (levelId: number) => {
    return progress?.completedLevels.includes(levelId) || false;
  };

  // 章节解锁逻辑
  const isCategoryUnlocked = (category: string) => {
    const requiredLevel = categoryUnlockMap[category];
    if (requiredLevel === 0) return true;
    return progress?.completedLevels.includes(requiredLevel) || false;
  };

  const isLevelUnlocked = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return false;
    return isCategoryUnlocked(level.category);
  };

  const handleLevelClick = (levelId: number) => {
    if (isLevelUnlocked(levelId)) {
      navigate(`/level/${levelId}`);
    }
  };

  const completedCount = progress?.completedLevels.length || 0;
  const totalLevels = levels.length;
  const progressPercent = (completedCount / totalLevels) * 100;
  const currentLevel = progress?.currentLevel || 1;

  // Get current category progress
  const basicLevels = levels.filter(l => l.category === 'basic');
  const basicCompleted = basicLevels.filter(l => isLevelCompleted(l.id)).length;
  const basicPercent = (basicCompleted / basicLevels.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0e1a] grid-bg relative flex flex-col items-center">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ff88] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        {/* Version Number */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-[#94a3b8] game-font text-sm opacity-80 z-50">
          v0.1.1
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="game-font text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#b347d9] mb-4">
            任务地图
          </h1>
          <p className="text-[#94a3b8] text-lg">
            完成每个任务，掌握 Linux 技能
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="game-card px-8 py-5 flex items-center gap-5">
              <div className="text-5xl">🏆</div>
              <div className="text-left">
                <div className="text-sm text-[#94a3b8] uppercase tracking-wider">完成进度</div>
                <div className="game-font text-4xl font-bold text-[#00ff88]">{completedCount}/{totalLevels}</div>
              </div>
            </div>
            <div className="game-card px-8 py-5 flex items-center gap-5">
              <div className="text-5xl">📊</div>
              <div className="text-left">
                <div className="text-sm text-[#94a3b8] uppercase tracking-wider">完成率</div>
                <div className="game-font text-4xl font-bold text-[#00d4ff]">{Math.round(progressPercent)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-12">
          <div className="h-4 bg-[#111827] rounded-full overflow-hidden border border-[#1e293b]">
            <div
              className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Game Map - Basic Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">{categoryIcons['basic']}</div>
            <div>
              <h2 className="game-font text-3xl font-bold text-white">{categoryNames['basic']}</h2>
              <p className="text-[#94a3b8] text-base">掌握基础命令</p>
            </div>
            <div className="ml-auto px-5 py-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full">
              <span className="text-[#00ff88] text-base font-bold">
                {basicCompleted} / {basicLevels.length} 已完成
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-full"
                style={{ width: `${basicPercent}%` }}
              />
            </div>
          </div>

          {/* Level Nodes */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {basicLevels.map((level) => {
              const completed = isLevelCompleted(level.id);
              const unlocked = isLevelUnlocked(level.id);
              const isCurrent = level.id === currentLevel;

              return (
                <div key={level.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleLevelClick(level.id)}
                    disabled={!unlocked}
                    className={`level-node relative group ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#0a0e1a]' : ''}`}
                  >
                    {completed && <div className="absolute inset-0 rounded-full bg-[#00ff88] opacity-20 blur-md animate-pulse" />}
                    {isCurrent && !completed && <div className="absolute inset-0 rounded-full bg-[#ffd700] opacity-20 blur-md animate-pulse" />}
                    <span className="relative z-10">{completed ? '✓' : unlocked ? level.id : '🔒'}</span>
                    {unlocked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="game-card px-4 py-2 whitespace-nowrap text-sm">
                          <div className="text-white font-semibold">{level.title}</div>
                          <div className="text-[#94a3b8] text-xs">{level.tasks.length} 个任务</div>
                        </div>
                      </div>
                    )}
                  </button>
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-semibold ${completed ? 'text-[#00ff88]' : unlocked ? 'text-white' : 'text-[#64748b]'}`}>
                      {level.title.split(' - ')[0]}
                    </div>
                    <div className="text-xs text-[#64748b] mt-1">
                      {completed ? '✓ 已完成' : unlocked ? `${level.tasks.length} 个任务` : '未解锁'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Categories */}
        <div className="space-y-8">
          {['permission', 'text', 'script', 'process', 'network', 'system'].map((category) => {
            const categoryLevels = levels.filter(l => l.category === category);
            const categoryCompleted = categoryLevels.filter(l => isLevelCompleted(l.id)).length;
            const categoryPercent = categoryLevels.length > 0 ? (categoryCompleted / categoryLevels.length) * 100 : 0;
            const unlocked = isCategoryUnlocked(category);

            return (
              <div key={category} className={`game-card p-8 ${!unlocked ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{categoryIcons[category]}</div>
                  <div className="flex-1">
                    <h3 className="game-font text-2xl font-bold text-white">{categoryNames[category]}</h3>
                    <p className="text-[#94a3b8] text-base">{categoryLevels.length} 个关卡</p>
                  </div>
                  {unlocked ? (
                    <div className="px-5 py-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full">
                      <span className="text-[#00ff88] text-base font-bold">
                        {categoryCompleted} / {categoryLevels.length} 已完成
                      </span>
                    </div>
                  ) : (
                    <div className="px-5 py-3 bg-[#64748b]/10 border border-[#64748b]/30 rounded-full">
                      <span className="text-[#64748b] text-base font-bold">🔒 未解锁</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-full"
                      style={{ width: `${categoryPercent}%` }}
                    />
                  </div>
                </div>

                {unlocked ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {categoryLevels.map((level) => {
                      const completed = isLevelCompleted(level.id);
                      const levelUnlocked = isLevelUnlocked(level.id);
                      const isCurrent = level.id === currentLevel;

                      return (
                        <div key={level.id} className="flex flex-col items-center">
                          <button
                            onClick={() => handleLevelClick(level.id)}
                            disabled={!levelUnlocked}
                            className={`level-node relative group ${completed ? 'completed' : levelUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#0a0e1a]' : ''}`}
                          >
                            {completed && <div className="absolute inset-0 rounded-full bg-[#00ff88] opacity-20 blur-md animate-pulse" />}
                            <span className="relative z-10">{completed ? '✓' : levelUnlocked ? level.id : '🔒'}</span>
                            {levelUnlocked && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="game-card px-4 py-2 whitespace-nowrap text-sm">
                                  <div className="text-white font-semibold">{level.title}</div>
                                </div>
                              </div>
                            )}
                          </button>
                          <div className="mt-2 text-center">
                            <div className={`text-xs font-semibold ${completed ? 'text-[#00ff88]' : levelUnlocked ? 'text-white' : 'text-[#64748b]'}`}>
                              {level.title.split(' - ')[0]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <p className="text-[#64748b] text-lg">完成「{categoryNames[Object.keys(categoryUnlockMap).find(k => categoryUnlockMap[k] === categoryUnlockMap[category] - 1) || 'basic']}」解锁</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
