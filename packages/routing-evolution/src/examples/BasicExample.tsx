import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

function BasicExample() {
  return (
    <div className='min-h-full bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center'
        >
          <div className='w-16 h-16 bg-route-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
            <BookOpen className='w-8 h-8 text-route-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            基础路由示例
          </h1>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            这个示例正在开发中，将展示路由的基础使用方法
          </p>
          <div className='route-indicator'>路由路径: /examples/basic</div>
        </motion.div>
      </div>
    </div>
  );
}

export default BasicExample;
