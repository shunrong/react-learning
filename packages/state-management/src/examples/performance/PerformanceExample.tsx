import React from 'react';

const PerformanceExample: React.FC = () => {
  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          ⚡ 性能基准测试
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          四种状态管理方案的性能基准测试和分析
        </p>
      </div>

      <div className='bg-gray-50 rounded-lg p-8 text-center'>
        <div className='text-6xl mb-4'>⏱️</div>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          性能测试页面开发中
        </h2>
        <p className='text-gray-600 mb-6'>
          这里将展示详细的性能基准测试，包括：
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>🚀 渲染性能</h3>
            <p className='text-sm text-gray-600'>
              组件渲染次数、渲染时间、重新渲染优化等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>💾 内存使用</h3>
            <p className='text-sm text-gray-600'>
              内存占用、内存泄漏检测、垃圾回收等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>📦 Bundle 分析</h3>
            <p className='text-sm text-gray-600'>
              打包大小、Tree-shaking 效果、加载时间等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>🔄 更新效率</h3>
            <p className='text-sm text-gray-600'>
              状态更新速度、批量操作性能、响应延迟等
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceExample;
