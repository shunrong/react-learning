import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import CSSModulesDemo from '@/pages/CSSModulesDemo';
import StyledComponentsDemo from '@/pages/StyledComponentsDemo';
import EmotionDemo from '@/pages/EmotionDemo';
import TailwindDemo from '@/pages/TailwindDemo';
import Comparison from '@/pages/Comparison';
import Performance from '@/pages/Performance';

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-gray-100'>
      <Layout>
        <AnimatePresence mode='wait'>
          <Routes>
            {/* 主页 */}
            <Route path='/' element={<Home />} />

            {/* 样式方案演示页面 */}
            <Route path='/css-modules' element={<CSSModulesDemo />} />
            <Route
              path='/styled-components'
              element={<StyledComponentsDemo />}
            />
            <Route path='/emotion' element={<EmotionDemo />} />
            <Route path='/tailwind' element={<TailwindDemo />} />

            {/* 对比和性能页面 */}
            <Route path='/comparison' element={<Comparison />} />
            <Route path='/performance' element={<Performance />} />

            {/* 404 页面 */}
            <Route
              path='*'
              element={
                <div className='flex items-center justify-center min-h-[60vh]'>
                  <div className='text-center'>
                    <h1 className='text-4xl font-bold text-gray-600 mb-4'>
                      404
                    </h1>
                    <p className='text-gray-500'>页面未找到</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;
