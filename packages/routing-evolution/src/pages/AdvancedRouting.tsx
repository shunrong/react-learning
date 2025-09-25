import { motion } from 'framer-motion';
import { Settings, Wrench } from 'lucide-react';

function AdvancedRouting() {
  return (
    <div className='min-h-full bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center'
        >
          <div className='w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
            <Wrench className='w-8 h-8 text-purple-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            高级路由特性
          </h1>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            这个页面正在建设中，将包含嵌套路由、动态路由、路由守卫等高级功能
          </p>
          <div className='bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-md mx-auto'>
            <Settings className='w-12 h-12 text-purple-600 mx-auto mb-4' />
            <p className='text-purple-800 font-medium'>即将推出</p>
            <p className='text-purple-600 text-sm mt-1'>
              高级特性示例正在开发中...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdvancedRouting;
