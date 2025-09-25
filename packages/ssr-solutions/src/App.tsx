import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';

// 懒加载页面组件
const NextjsDemo = lazy(() => import('./pages/NextjsDemo'));
const RemixDemo = lazy(() => import('./pages/RemixDemo'));
const CustomSSRDemo = lazy(() => import('./pages/CustomSSRDemo'));
const Comparison = lazy(() => import('./pages/Comparison'));
const Performance = lazy(() => import('./pages/Performance'));
const BestPractices = lazy(() => import('./pages/BestPractices'));

// 加载中组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-ssr-200 border-t-ssr-600 mx-auto mb-4"></div>
      <p className="text-gray-600">页面加载中...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nextjs" element={<NextjsDemo />} />
            <Route path="/remix" element={<RemixDemo />} />
            <Route path="/custom" element={<CustomSSRDemo />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/best-practices" element={<BestPractices />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
