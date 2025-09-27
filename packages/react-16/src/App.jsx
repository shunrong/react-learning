import React, { useState, useCallback, Suspense, startTransition, useDeferredValue } from 'react';
import TodoAppFiber from './components/TodoAppFiber';
import FiberDemo from './components/FiberDemo';
import ConcurrentDemo from './components/ConcurrentDemo';
import PerformanceComparison from './components/PerformanceComparison';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [activeDemo, setActiveDemo] = useState('todo');
  const [isPending, startDemoTransition] = React.useTransition();
  
  const handleDemoChange = useCallback((demoType) => {
    // 🚀 使用 startTransition 让演示切换不阻塞用户交互
    startDemoTransition(() => {
      setActiveDemo(demoType);
    });
  }, [startDemoTransition]);
  
  return (
    <div className="app">
      {/* 头部介绍 */}
      <header className="header">
        <h1>React 16+ Fiber 架构演示</h1>
        <p>体验可中断渲染、时间切片和现代并发特性</p>
        <div className="version-badge">
          React {React.version} - Fiber 架构 + 并发特性
        </div>
      </header>
      
      {/* Fiber 优势介绍 */}
      <div className="fiber-info">
        <h3>🚀 Fiber 架构优势</h3>
        <p>
          React 16+ 的 Fiber 架构实现了可中断渲染、优先级调度和时间切片技术，
          让大型应用保持 60fps 的流畅体验。观察控制台和性能监控，体验现代 React 的强大能力。
        </p>
      </div>
      
      {/* 演示选择 */}
      <div className="demo-section">
        <h2>选择演示内容</h2>
        {isPending && (
          <div className="transition-pending">
            🔄 切换中... (非阻塞)
          </div>
        )}
        <div className="controls">
          <button 
            className={`btn ${activeDemo === 'todo' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleDemoChange('todo')}
          >
            📝 现代 Todo 应用
          </button>
          <button 
            className={`btn ${activeDemo === 'fiber' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleDemoChange('fiber')}
          >
            ⚡ Fiber 工作原理
          </button>
          <button 
            className={`btn ${activeDemo === 'concurrent' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleDemoChange('concurrent')}
          >
            🚀 并发特性演示
          </button>
          <button 
            className={`btn ${activeDemo === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleDemoChange('comparison')}
          >
            📊 性能对比
          </button>
        </div>
      </div>
      
      {/* 演示内容 - 使用 Suspense 包装 */}
      <ErrorBoundary>
        <Suspense fallback={
          <div className="suspense-fallback">
            <div className="loading-spinner"></div>
            <p>正在加载演示内容...</p>
          </div>
        }>
          <div className={isPending ? 'transition-demo' : 'fade-in'}>
            {activeDemo === 'todo' && <TodoAppFiber />}
            {activeDemo === 'fiber' && <FiberDemo />}
            {activeDemo === 'concurrent' && <ConcurrentDemo />}
            {activeDemo === 'comparison' && <PerformanceComparison />}
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
