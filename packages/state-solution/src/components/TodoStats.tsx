import React from 'react';
import { clsx } from 'clsx';
import type { TodoStats as TodoStatsType } from '@/types/todo';

interface TodoStatsProps {
  stats: TodoStatsType;
  className?: string;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ stats, className }) => {
  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 p-6',
        className
      )}
    >
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>统计信息</h3>

      {/* 总体统计 */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
          <div className='text-sm text-gray-500'>总计</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {stats.completed}
          </div>
          <div className='text-sm text-gray-500'>已完成</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-orange-600'>
            {stats.active}
          </div>
          <div className='text-sm text-gray-500'>进行中</div>
        </div>
      </div>

      {/* 完成率进度条 */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-gray-700'>完成率</span>
          <span className='text-sm font-medium text-gray-900'>
            {completionRate.toFixed(1)}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-600 h-2 rounded-full transition-all duration-300'
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* 按分类统计 */}
      <div className='mb-4'>
        <h4 className='text-sm font-medium text-gray-700 mb-3'>按分类</h4>
        <div className='space-y-2'>
          {Object.entries(stats.byCategory).map(
            ([category, count]) =>
              count > 0 && (
                <div
                  key={category}
                  className='flex justify-between items-center'
                >
                  <span className='text-sm text-gray-600 capitalize'>
                    {category}
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {count}
                  </span>
                </div>
              )
          )}
        </div>
      </div>

      {/* 按优先级统计 */}
      <div>
        <h4 className='text-sm font-medium text-gray-700 mb-3'>按优先级</h4>
        <div className='space-y-2'>
          {Object.entries(stats.byPriority).map(
            ([priority, count]) =>
              count > 0 && (
                <div
                  key={priority}
                  className='flex justify-between items-center'
                >
                  <span
                    className={clsx(
                      'text-sm capitalize',
                      priority === 'high' && 'text-red-600',
                      priority === 'medium' && 'text-yellow-600',
                      priority === 'low' && 'text-green-600'
                    )}
                  >
                    {priority === 'high'
                      ? '高'
                      : priority === 'medium'
                        ? '中'
                        : '低'}
                    优先级
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {count}
                  </span>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
