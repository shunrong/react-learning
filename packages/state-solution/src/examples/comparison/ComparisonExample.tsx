import React from 'react';

const ComparisonExample: React.FC = () => {
  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          📊 状态管理方案对比
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          同一个 Todo 应用的四种不同实现对比分析
        </p>
      </div>

      <div className='bg-gray-50 rounded-lg p-8 text-center'>
        <div className='text-6xl mb-4'>🚧</div>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          对比分析页面开发中
        </h2>
        <p className='text-gray-600 mb-6'>
          这里将展示四种状态管理方案的详细对比，包括：
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              📝 代码复杂度对比
            </h3>
            <p className='text-sm text-gray-600'>
              样板代码量、学习曲线、开发效率等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              ⚡ 性能表现对比
            </h3>
            <p className='text-sm text-gray-600'>
              渲染次数、内存使用、Bundle 大小等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              🛠️ 开发体验对比
            </h3>
            <p className='text-sm text-gray-600'>
              调试能力、工具链支持、错误处理等
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              🎯 适用场景分析
            </h3>
            <p className='text-sm text-gray-600'>
              项目规模、团队协作、维护成本等
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonExample;
