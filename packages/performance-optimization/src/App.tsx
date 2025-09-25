import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';

// 懒加载页面组件 - 演示代码分割
const RenderOptimization = lazy(() => import('./pages/RenderOptimization'));
const MemoryManagement = lazy(() => import('./pages/MemoryManagement'));
const CodeSplitting = lazy(() => import('./pages/CodeSplitting'));
const Virtualization = lazy(() => import('./pages/Virtualization'));
const PerformanceMonitoring = lazy(
  () => import('./pages/PerformanceMonitoring')
);
const Comparison = lazy(() => import('./pages/Comparison'));
const BestPractices = lazy(() => import('./pages/BestPractices'));

// 加载中组件
const LoadingFallback = () => (
  <div className='flex items-center justify-center min-h-[400px]'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-performance-200 border-t-performance-600 mx-auto mb-4'></div>
      <p className='text-gray-600'>页面加载中...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/render-optimization'
              element={<RenderOptimization />}
            />
            <Route path='/memory-management' element={<MemoryManagement />} />
            <Route path='/code-splitting' element={<CodeSplitting />} />
            <Route path='/virtualization' element={<Virtualization />} />
            <Route
              path='/performance-monitoring'
              element={<PerformanceMonitoring />}
            />
            <Route path='/comparison' element={<Comparison />} />
            <Route path='/best-practices' element={<BestPractices />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
