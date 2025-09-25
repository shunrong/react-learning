import React from 'react';

class PerformanceMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderLogs: []
    };
  }
  
  componentWillReceiveProps(nextProps) {
    // 记录渲染日志
    if (nextProps.data.renderCount > this.props.data.renderCount) {
      const timestamp = new Date().toLocaleTimeString();
      const renderTime = nextProps.data.lastRenderTime;
      
      const logEntry = {
        id: Date.now(),
        timestamp,
        message: `第 ${nextProps.data.renderCount} 次渲染`,
        duration: renderTime.toFixed(2),
        isBlocking: renderTime > 16.67
      };
      
      this.setState(prevState => ({
        renderLogs: [...prevState.renderLogs.slice(-9), logEntry]
      }));
    }
  }
  
  getPerformanceLevel = (value, thresholds) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'danger';
  }
  
  render() {
    const { data } = this.props;
    const { renderLogs } = this.state;
    
    const avgRenderLevel = this.getPerformanceLevel(data.averageRenderTime, {
      good: 5,
      warning: 16.67
    });
    
    const lastRenderLevel = this.getPerformanceLevel(data.lastRenderTime, {
      good: 5,
      warning: 16.67
    });
    
    return (
      <div className="performance-monitor">
        <h3>🔍 性能监控 - React 15 栈协调器</h3>
        
        <div className="performance-stats">
          <div className="stat-item">
            <div className="stat-label">总渲染次数</div>
            <div className="stat-value">{data.renderCount}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">平均渲染时间</div>
            <div className={`stat-value ${avgRenderLevel}`}>
              {data.averageRenderTime.toFixed(2)}ms
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">最近渲染时间</div>
            <div className={`stat-value ${lastRenderLevel}`}>
              {data.lastRenderTime.toFixed(2)}ms
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">阻塞时间累计</div>
            <div className={`stat-value ${data.blockingTime > 50 ? 'danger' : 'warning'}`}>
              {data.blockingTime.toFixed(2)}ms
            </div>
          </div>
        </div>
        
        <div>
          <h4>📊 渲染日志 (最近 10 次)</h4>
          <div className="render-log">
            {renderLogs.length === 0 ? (
              <div className="log-entry">
                <span className="log-message">等待渲染事件...</span>
              </div>
            ) : (
              renderLogs.map(log => (
                <div key={log.id} className="log-entry">
                  <span className="log-timestamp">{log.timestamp}</span>
                  <span className="log-message">
                    {log.message}: {log.duration}ms
                    {log.isBlocking && ' ⚠️ 超过一帧'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#a0aec0' }}>
          💡 性能指标说明:
          <br />• 绿色 (&lt;5ms): 优秀性能
          <br />• 黄色 (5-16.67ms): 可接受性能  
          <br />• 红色 (&gt;16.67ms): 可能造成卡顿 (超过60fps阈值)
        </div>
      </div>
    );
  }
}

export default PerformanceMonitor;
