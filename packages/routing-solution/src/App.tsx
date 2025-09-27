import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import RouterEvolution from '@/pages/RouterEvolution';
import BasicRouting from '@/pages/BasicRouting';
import AdvancedRouting from '@/pages/AdvancedRouting';
import RoutePatterns from '@/pages/RoutePatterns';
import PerformanceDemo from '@/pages/PerformanceDemo';
import Comparison from '@/pages/Comparison';
import NotFound from '@/pages/NotFound';

// 路由示例页面
import BasicExample from '@/examples/BasicExample';
import NestedRoutingExample from '@/examples/NestedRoutingExample';
import DynamicRoutingExample from '@/examples/DynamicRoutingExample';
import ProtectedRoutingExample from '@/examples/ProtectedRoutingExample';
import LazyRoutingExample from '@/examples/LazyRoutingExample';
import ModalRoutingExample from '@/examples/ModalRoutingExample';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Layout>
        <AnimatePresence mode='wait'>
          <Routes>
            {/* 主要页面 */}
            <Route path='/' element={<Home />} />
            <Route path='/evolution' element={<RouterEvolution />} />
            <Route path='/basic' element={<BasicRouting />} />
            <Route path='/advanced' element={<AdvancedRouting />} />
            <Route path='/patterns' element={<RoutePatterns />} />
            <Route path='/performance' element={<PerformanceDemo />} />
            <Route path='/comparison' element={<Comparison />} />

            {/* 路由示例 */}
            <Route path='/examples'>
              <Route path='basic' element={<BasicExample />} />
              <Route path='nested' element={<NestedRoutingExample />} />
              <Route path='dynamic' element={<DynamicRoutingExample />} />
              <Route path='protected' element={<ProtectedRoutingExample />} />
              <Route path='lazy' element={<LazyRoutingExample />} />
              <Route path='modal' element={<ModalRoutingExample />} />
            </Route>

            {/* 404 页面 */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;
