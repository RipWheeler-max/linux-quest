/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLevelById } from '../../data/levels';
import { getHintsForLevel } from '../../data/hints';
import { completeLevel, consumeHint } from '../../services/firebase';
import Terminal from '../Terminal/Terminal';
import HintPanel from '../Hint/HintPanel';
import type { TerminalEngine } from '../Terminal/terminalEngine';

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, progress, refreshProgress } = useAuth();

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [taskJustCompleted, setTaskJustCompleted] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const level = getLevelById(Number(id));
  const hints = getHintsForLevel(Number(id));

  // 重置状态
  useEffect(() => {
    setCompletedTasks(new Set());
    setLevelCompleted(false);
    setShowCompletionModal(false);
    setTaskJustCompleted(null);
    setShowSuccess(false);
  }, [id]);

  // 检查已完成
  useEffect(() => {
    if (!level) { navigate('/'); return; }
    if (progress?.completedLevels.includes(level.id)) {
      setLevelCompleted(true);
      setCompletedTasks(new Set(level.tasks.map(t => t.id)));
    }
  }, [level, progress, navigate]);

  // 用 useCallback 避免闭包问题
  const completedTasksRef = useRef(completedTasks);
  useEffect(() => {
    completedTasksRef.current = completedTasks;
  }, [completedTasks]);

  const handleCommandExecuted = useCallback((_command: string, engine: TerminalEngine) => {
    if (!level || !user) return;
    // 如果已完成，跳过
    if (completedTasksRef.current.size === level.tasks.length) return;

    const state = engine.getState();
    const newCompleted = new Set(completedTasksRef.current);
    let justCompleted = '';

    for (const task of level.tasks) {
      if (!newCompleted.has(task.id) && task.validator(state)) {
        newCompleted.add(task.id);
        justCompleted = task.id;
      }
    }

    if (justCompleted) {
      setCompletedTasks(newCompleted);
      setTaskJustCompleted(justCompleted);
      setShowSuccess(true);
      setTimeout(() => setTaskJustCompleted(null), 2000);
      setTimeout(() => setShowSuccess(false), 1500);

      // 检查是否全部完成
      if (newCompleted.size === level.tasks.length) {
        setLevelCompleted(true);
        completeLevel(user.uid, level.id).then(() => refreshProgress());
        setTimeout(() => setShowCompletionModal(true), 800);
      }
    }
  }, [level, user, refreshProgress]);

  const handleHintUsed = async () => {
    if (user && level) {
      await consumeHint(user.uid, level.id);
    }
  };

  if (!level) return null;

  const done = completedTasks.size;
  const total = level.tasks.length;
  const pct = (done / total) * 100;

  return (
    <div className="min-h-screen bg-[#0a0e1a] grid-bg relative flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-[#00ff88] rounded-full opacity-3 blur-[80px]" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#00d4ff] rounded-full opacity-3 blur-[80px]" />
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1e293b] hover:bg-[#2d3a4a] text-white rounded-xl transition-all border border-[#374357] hover:border-[#00ff88] text-base font-semibold"
          >
            ← 返回地图
          </button>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-base text-[#00ff88] font-bold">
              任务 {level.id} · {done}/{total} 完成
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧 - 任务信息 */}
          <div className="space-y-6">
            {/* 任务卡片 */}
            <div className="game-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="game-font text-2xl font-bold text-white">{level.title}</h1>
                {levelCompleted && (
                  <span className="px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl text-base text-[#ffd700] animate-pulse font-bold">
                    ✓ 已完成
                  </span>
                )}
              </div>
              <p className="text-[#94a3b8] text-base mb-4">{level.description}</p>
              <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* 任务背景 */}
            <div className="game-card p-6">
              <h2 className="game-font text-lg font-bold text-[#ffd700] mb-3">📋 任务背景</h2>
              <p className="text-[#94a3b8] text-base leading-relaxed">{level.missionBriefing}</p>
            </div>

            {/* 通关步骤 */}
            <div className="game-card p-6">
              <h2 className="game-font text-lg font-bold text-[#00ff88] mb-5">🚀 通关步骤</h2>
              <div className="space-y-4">
                {level.steps.map((step, i) => {
                  const task = level.tasks[i];
                  const isDone = task ? completedTasks.has(task.id) : false;
                  const isJust = task ? taskJustCompleted === task.id : false;

                  return (
                    <div key={`${id}-${i}`} className={`p-4 rounded-xl border transition-all duration-500 ${
                      isJust ? 'bg-[#00ff88]/15 border-[#00ff88]/50 shadow-lg shadow-[#00ff88]/20' :
                      isDone ? 'bg-[#00ff88]/5 border-[#00ff88]/20' :
                      'bg-[#0a0e1a] border-[#1e293b]'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                          isDone ? 'bg-[#00ff88] text-black' : 'bg-[#1e293b] text-[#64748b] border border-[#374357]'
                        }`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-base font-medium ${isDone ? 'text-[#00ff88]' : 'text-white'}`}>
                            {step.instruction}
                          </p>
                          <div className="mt-3 bg-[#0a0e1a] rounded-lg px-4 py-2 terminal-font text-sm border border-[#1e293b] inline-block">
                            <span className="text-[#64748b]">$</span> <span className="text-[#00ff88]">{step.command}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 提示面板 */}
            <HintPanel hints={hints} onHintUsed={handleHintUsed} />

            {/* 知识点 */}
            <div className="game-card p-6">
              <h2 className="game-font text-lg font-bold text-[#00d4ff] mb-4">🎓 知识点</h2>
              <div className="flex flex-wrap gap-3">
                {level.whatYouLearn.map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-full text-sm text-[#00d4ff]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧 - 终端 */}
          <div className="lg:sticky lg:top-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="game-font text-lg text-white">💻 终端</span>
              <span className="text-sm text-[#64748b]">输入命令完成任务</span>
            </div>
            <Terminal onCommandExecuted={handleCommandExecuted} />

            {/* 当前提示 */}
            {!levelCompleted && done < total && level.steps[done] && (
              <div className="mt-4 p-4 bg-[#1e293b]/80 rounded-xl border border-[#374357]">
                <p className="text-base text-[#94a3b8]">
                  💡 下一步：<span className="text-[#00ff88] font-bold">{level.steps[done].instruction}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 成功动画 */}
      {showSuccess && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="animate-bounce text-[#ffd700] font-bold text-3xl drop-shadow-lg">
            ✅ 完成！
          </div>
        </div>
      )}

      {/* 通关弹窗 */}
      {showCompletionModal && level && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ffd700] rounded-2xl blur-xl opacity-30 animate-pulse" />

            <div className="game-card p-8 text-center relative overflow-hidden rounded-2xl border-2 border-[#ffd700]/30">
              {/* 粒子效果 */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({length: 20}).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full animate-ping"
                    style={{
                      left: `${10 + (i * 4.5)}%`,
                      top: `${10 + (i * 4.5)}%`,
                      background: ['#00ff88', '#00d4ff', '#ffd700'][i % 3],
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="text-8xl mb-4">🏆</div>

                <h2 className="game-font text-3xl font-black mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4a]">
                    任务完成！
                  </span>
                </h2>

                <p className="text-[#94a3b8] text-lg mb-8">「{level.title}」</p>

                {/* 下一关预览 */}
                {getLevelById(level.id + 1) && (
                  <div className="mb-8 p-4 bg-[#0a0e1a]/80 rounded-xl border border-[#1e293b]">
                    <p className="text-xs text-[#64748b] mb-2 uppercase tracking-wider">下一关</p>
                    <p className="text-white font-bold text-lg">
                      {getLevelById(level.id + 1)?.title}
                    </p>
                  </div>
                )}

                {/* 按钮 */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-[#1e293b] hover:bg-[#2d3a4a] text-[#94a3b8] hover:text-white rounded-xl transition-all border border-[#374357]"
                  >
                    📍 返回地图
                  </button>
                  {getLevelById(level.id + 1) && (
                    <button
                      onClick={() => {
                        setShowCompletionModal(false);
                        navigate(`/level/${level.id + 1}`);
                      }}
                      className="game-btn px-8 py-3 text-lg rounded-xl"
                    >
                      🚀 下一关
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
