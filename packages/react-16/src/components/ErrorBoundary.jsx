import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('🚨 ErrorBoundary 捕获到错误:', error);
    console.error('📋 错误信息:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // 在真实应用中，你可以将错误报告给错误监控服务
    this.logErrorToService(error, errorInfo);
  }
  
  logErrorToService = (error, errorInfo) => {
    // 模拟错误上报
    console.log('📡 错误已上报到监控服务:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }
  
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>🚨 Oops! 出现了错误</h3>
          <p>
            别担心，这是 React 16+ 的错误边界特性在工作。
            错误被优雅地捕获，应用的其他部分依然正常运行。
          </p>
          
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              📋 错误详情 (点击展开)
            </summary>
            <pre style={{ 
              marginTop: '0.5rem',
              whiteSpace: 'pre-wrap',
              fontSize: '0.8rem'
            }}>
              <strong>错误信息:</strong>
              {this.state.error && this.state.error.toString()}
              
              <strong>组件堆栈:</strong>
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <div style={{ marginTop: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={this.handleRetry}
            >
              🔄 重试
            </button>
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem',
            background: '#e6fffa',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>💡 React 16+ 错误边界的价值:</strong>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>防止整个应用因一个组件错误而崩溃</li>
              <li>提供优雅的错误处理和用户反馈</li>
              <li>支持错误上报和监控</li>
              <li>保持应用其他部分的正常运行</li>
            </ul>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
