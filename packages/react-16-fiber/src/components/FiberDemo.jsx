import React, { useState, useEffect, useMemo, useCallback } from 'react';

// 模拟 Fiber 工作单元
const WorkUnit = ({ id, status, duration }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#a0aec0';
      case 'processing': return '#f6ad55'; 
      case 'completed': return '#68d391';
      case 'interrupted': return '#fc8181';
      default: return '#e2e8f0';
    }
  };
  
  return (
    <div 
      className="work-unit"
      style={{ 
        backgroundColor: getStatusColor(status),
        position: 'relative'
      }}
      title={`工作单元 ${id}: ${status} (${duration}ms)`}
    >
      {status === 'processing' && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px', 
          bottom: '-2px',
          border: '2px solid #f6ad55',
          borderRadius: '4px',
          animation: 'pulse 1s infinite'
        }} />
      )}
    </div>
  );
};

// Fiber 工作流程可视化
const FiberWorkLoop = ({ isRunning, onStatusChange }) => {
  const [workUnits, setWorkUnits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 生成工作单元
  const generateWorkUnits = useCallback((count = 50) => {
    const units = Array.from({ length: count }, (_, i) => ({
      id: i,
      status: 'pending',
      duration: Math.floor(Math.random() * 10) + 1
    }));
    setWorkUnits(units);
    setCurrentIndex(0);
  }, []);
  
  // 模拟 Fiber 工作循环
  useEffect(() => {
    if (!isRunning || currentIndex >= workUnits.length) {
      if (currentIndex >= workUnits.length && workUnits.length > 0) {
        onStatusChange?.('completed');
      }
      return;
    }
    
    let timeSliceUsed = 0;
    const TIME_SLICE = 5; // 5ms 时间片
    
    const processWorkUnits = () => {
      const startTime = performance.now();
      
      while (currentIndex < workUnits.length && timeSliceUsed < TIME_SLICE) {
        const workUnit = workUnits[currentIndex];
        
        // 标记为处理中
        setWorkUnits(prev => prev.map((unit, i) => 
          i === currentIndex ? { ...unit, status: 'processing' } : unit
        ));
        
        // 模拟工作单元处理
        const workStart = performance.now();
        while (performance.now() - workStart < workUnit.duration) {
          // 模拟工作
        }
        
        // 标记为完成
        setWorkUnits(prev => prev.map((unit, i) => 
          i === currentIndex ? { ...unit, status: 'completed' } : unit
        ));
        
        setCurrentIndex(prev => prev + 1);
        timeSliceUsed = performance.now() - startTime;
        
        console.log(`⚡ 工作单元 ${currentIndex} 完成，耗时: ${workUnit.duration}ms`);
      }
      
      if (currentIndex < workUnits.length) {
        console.log(`⏰ 时间片用完 (${timeSliceUsed.toFixed(2)}ms)，让出控制权`);
        onStatusChange?.('yielding');
        
        // 让出控制权，在下一个时间片继续
        setTimeout(processWorkUnits, 0);
      } else {
        console.log('🎉 所有工作单元处理完成');
        onStatusChange?.('completed');
      }
    };
    
    processWorkUnits();
  }, [isRunning, currentIndex, workUnits, onStatusChange]);
  
  return (
    <div>
      <div className="controls">
        <button 
          className="btn btn-primary"
          onClick={() => generateWorkUnits(30)}
        >
          📋 生成 30 个工作单元
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => generateWorkUnits(100)}
        >
          📋 生成 100 个工作单元
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setWorkUnits([]);
            setCurrentIndex(0);
          }}
        >
          🧹 清空
        </button>
      </div>
      
      <div className="fiber-visualization">
        <h4>🔄 Fiber 工作单元处理可视化</h4>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '2px',
          margin: '1rem 0',
          minHeight: '60px',
          alignItems: 'flex-start',
          alignContent: 'flex-start'
        }}>
          {workUnits.map(unit => (
            <WorkUnit 
              key={unit.id} 
              id={unit.id}
              status={unit.status}
              duration={unit.duration}
            />
          ))}
        </div>
        
        <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
          <div>🔵 灰色: 等待处理 | 🟡 黄色: 正在处理 | 🟢 绿色: 已完成 | 🔴 红色: 被中断</div>
          <div>进度: {currentIndex} / {workUnits.length}</div>
        </div>
      </div>
    </div>
  );
};

const FiberDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [workStatus, setWorkStatus] = useState('idle');
  const [interruptCount, setInterruptCount] = useState(0);
  
  const handleStart = () => {
    console.log('🚀 开始 Fiber 工作循环演示');
    setIsRunning(true);
    setWorkStatus('running');
    setInterruptCount(0);
  };
  
  const handleStop = () => {
    console.log('⏹️ 停止 Fiber 工作循环');
    setIsRunning(false);
    setWorkStatus('stopped');
  };
  
  const handleInterrupt = () => {
    console.log('🚨 模拟高优先级任务中断');
    setInterruptCount(prev => prev + 1);
    
    // 模拟中断：停止当前工作，稍后恢复
    setIsRunning(false);
    setTimeout(() => {
      if (workStatus !== 'stopped') {
        setIsRunning(true);
        console.log('🔄 恢复 Fiber 工作循环');
      }
    }, 1000);
  };
  
  const handleStatusChange = useCallback((status) => {
    setWorkStatus(status);
    if (status === 'completed') {
      setIsRunning(false);
    }
  }, []);
  
  return (
    <div className="demo-section">
      <h2>⚡ Fiber 工作原理演示</h2>
      <p>
        可视化展示 Fiber 的工作循环、时间切片和可中断渲染。
        观察工作单元如何被分片处理，以及如何响应中断。
      </p>
      
      {/* 控制面板 */}
      <div className="grid grid-3">
        <div>
          <h3>🎛️ 工作控制</h3>
          <div className="controls">
            <button 
              className="btn btn-success"
              onClick={handleStart}
              disabled={isRunning}
            >
              ▶️ 开始工作
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleStop}
              disabled={!isRunning}
            >
              ⏹️ 停止工作
            </button>
          </div>
        </div>
        
        <div>
          <h3>🚨 中断测试</h3>
          <button 
            className="btn btn-primary"
            onClick={handleInterrupt}
            disabled={!isRunning}
          >
            ⚡ 模拟高优先级中断
          </button>
          <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
            中断次数: {interruptCount}
          </p>
        </div>
        
        <div>
          <h3>📊 状态监控</h3>
          <div style={{
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div><strong>工作状态:</strong> {workStatus}</div>
            <div><strong>是否运行:</strong> {isRunning ? '✅ 是' : '❌ 否'}</div>
          </div>
        </div>
      </div>
      
      {/* Fiber 工作循环可视化 */}
      <FiberWorkLoop 
        isRunning={isRunning}
        onStatusChange={handleStatusChange}
      />
      
      {/* Fiber 优势说明 */}
      <div style={{
        background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
        border: '1px solid #4fd1c7',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#234e52' }}>🚀 Fiber 架构核心优势</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>可中断渲染</h4>
            <p style={{ color: '#285e61', fontSize: '0.9rem' }}>
              工作可以被更高优先级任务中断，确保用户交互的即时响应
            </p>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>时间切片</h4>
            <p style={{ color: '#285e61', fontSize: '0.9rem' }}>
              将渲染工作分解为小片段，每片段不超过 5ms，保持 60fps 流畅度
            </p>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>优先级调度</h4>
            <p style={{ color: '#285e61', fontSize: '0.9rem' }}>
                用户交互 &gt; 动画 &gt; 数据更新 &gt; 后台任务，智能安排执行顺序
            </p>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>增量更新</h4>
            <p style={{ color: '#285e61', fontSize: '0.9rem' }}>
              只更新变化的部分，避免重复工作，提高渲染效率
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiberDemo;
