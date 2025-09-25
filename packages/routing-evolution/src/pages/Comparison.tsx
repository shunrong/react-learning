import { motion } from 'framer-motion';
import { BarChart3, Scale } from 'lucide-react';

function Comparison() {
  return (
    <div className="min-h-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">方案对比</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            这个页面正在建设中，将包含不同路由方案的对比分析
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <BarChart3 className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 font-medium">即将推出</p>
            <p className="text-red-600 text-sm mt-1">对比分析正在准备中...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Comparison;
