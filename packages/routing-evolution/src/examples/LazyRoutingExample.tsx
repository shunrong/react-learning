import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function LazyRoutingExample() {
  return (
    <div className="min-h-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">懒加载示例</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            这个示例正在开发中，将展示路由懒加载和代码分割
          </p>
          <div className="route-indicator">
            路由路径: /examples/lazy
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LazyRoutingExample;
