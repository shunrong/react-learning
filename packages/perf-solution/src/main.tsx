import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

// 开发环境下启用性能监控
if (import.meta.env.DEV) {
  // 启用 React 性能分析
  if ('performance' in window && 'mark' in performance) {
    performance.mark('app-start');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
