import React from 'react';
import TodoApp from './components/TodoApp';
import PerformanceMonitor from './components/PerformanceMonitor';
import StackDemo from './components/StackDemo';
import LargeListDemo from './components/LargeListDemo';

// 错误边界组件 - 专门处理栈溢出错误
class StackOverflowBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // 检查是否是栈溢出错误
    const isStackOverflow = error.message.includes('Maximum call stack size') || 
                           error.message.includes('stack size exceeded') ||
                           error.name === 'RangeError';
    
    console.log('🚨 React 15 栈协调器限制演示:', error.message);
    
    this.setState({ 
      hasError: true, 
      error: isStackOverflow ? 
        '🎯 演示成功！这就是 React 15 栈协调器的限制 - 栈溢出错误' : 
        error.message 
    });
  }
  
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          margin: '20px',
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          textAlign: 'center'
        }
      }, [
        React.createElement('h3', { 
          key: 'title',
          style: { color: '#856404', marginBottom: '15px' } 
        }, '⚠️ React 15 栈协调器限制演示'),
        React.createElement('p', { 
          key: 'desc',
          style: { marginBottom: '15px', fontSize: '16px' } 
        }, this.state.error),
        React.createElement('p', { 
          key: 'explain',
          style: { marginBottom: '20px', color: '#6c757d' } 
        }, '这正是 React 16 引入 Fiber 架构要解决的核心问题！'),
        React.createElement('button', {
          key: 'retry',
          onClick: () => {
            this.setState({ hasError: false, error: null });
            // 强制刷新到安全的演示
            this.props.onReset && this.props.onReset();
          },
          style: {
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }
        }, '🔄 重新开始 (降低复杂度)')
      ]);
    }
    
    return this.props.children;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDemo: 'todo',
      performanceData: {
        renderCount: 0,
        totalRenderTime: 0,
        averageRenderTime: 0,
        blockingTime: 0,
        lastRenderTime: 0
      }
    };
    
    this.startTime = 0;
  }
  
  componentWillMount() {
    console.log('🎬 React 15 App 即将挂载');
    this.startTime = performance.now();
  }
  
  componentDidMount() {
    const endTime = performance.now();
    const initialRenderTime = endTime - this.startTime;
    
    console.log('🎉 React 15 App 挂载完成');
    console.log(`初始渲染时间: ${initialRenderTime.toFixed(2)}ms`);
    
    this.updatePerformanceData(initialRenderTime);
  }
  
  componentWillUpdate() {
    this.startTime = performance.now();
  }
  
  componentDidUpdate() {
    const endTime = performance.now();
    const renderTime = endTime - this.startTime;
    
    console.log(`组件更新耗时: ${renderTime.toFixed(2)}ms`);
    
    if (renderTime > 16.67) {
      console.warn('⚠️ 渲染时间超过一帧，可能造成卡顿');
    }
    
    this.updatePerformanceData(renderTime);
  }
  
  updatePerformanceData = (renderTime) => {
    this.setState(prevState => {
      const newRenderCount = prevState.performanceData.renderCount + 1;
      const newTotalTime = prevState.performanceData.totalRenderTime + renderTime;
      
      return {
        performanceData: {
          renderCount: newRenderCount,
          totalRenderTime: newTotalTime,
          averageRenderTime: newTotalTime / newRenderCount,
          blockingTime: renderTime > 16.67 ? prevState.performanceData.blockingTime + renderTime : prevState.performanceData.blockingTime,
          lastRenderTime: renderTime
        }
      };
    });
  }
  
  handleDemoChange = (demoType) => {
    console.log('🔄 切换演示模式: ' + demoType);
    this.setState({ activeDemo: demoType });
  }
  
  handleReset = () => {
    console.log('🔄 重置到安全模式');
    this.setState({ 
      activeDemo: 'todo',
      performanceData: {
        renderCount: 0,
        totalRenderTime: 0,
        averageRenderTime: 0,
        blockingTime: 0,
        lastRenderTime: 0
      }
    });
  }
  
  render() {
    const { activeDemo, performanceData } = this.state;
    
    return (
      <div className="app">
        {/* 头部介绍 */}
        <header className="header">
          <h1>React 15 栈协调器演示</h1>
          <p>体验同步渲染的特点和性能特征</p>
          <div className="version-badge">
            React {React.version} - 栈协调器架构
          </div>
        </header>
        
        {/* 性能警告 */}
        <div className="warning-banner">
          <h3>⚠️ 栈协调器特征</h3>
          <p>
            React 15 使用同步递归渲染，大型组件树可能造成主线程阻塞。
            观察控制台输出和性能监控数据，体验栈协调器的工作特点。
          </p>
        </div>
        
        {/* 性能监控 */}
        <PerformanceMonitor data={performanceData} />
        
        {/* 演示选择 */}
        <div className="demo-section">
          <h2>选择演示内容</h2>
          <div className="controls">
            <button 
              className={`btn ${activeDemo === 'todo' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => this.handleDemoChange('todo')}
            >
              📝 Todo 应用
            </button>
            <button 
              className={`btn ${activeDemo === 'stack' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => this.handleDemoChange('stack')}
            >
              🏗️ 栈调用演示
            </button>
            <button 
              className={`btn ${activeDemo === 'largelist' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => this.handleDemoChange('largelist')}
            >
              📊 大列表性能
            </button>
          </div>
        </div>
        
        {/* 演示内容 */}
        <div className="fade-in">
          <StackOverflowBoundary onReset={this.handleReset}>
            {activeDemo === 'todo' && <TodoApp />}
            {activeDemo === 'stack' && <StackDemo />}
            {activeDemo === 'largelist' && <LargeListDemo />}
          </StackOverflowBoundary>
        </div>
      </div>
    );
  }
}

export default App;
