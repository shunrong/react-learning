import React from 'react';
import { clsx } from 'clsx';
import type {
  TodoFilter as TodoFilterType,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';

interface TodoFilterProps {
  filter: TodoFilterType;
  onFilterChange: (filter: TodoFilterType) => void;
  className?: string;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  className,
}) => {
  const updateFilter = (updates: Partial<TodoFilterType>) => {
    onFilterChange({ ...filter, ...updates });
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* 搜索框 */}
      <div>
        <input
          type='text'
          value={filter.searchText}
          onChange={e => updateFilter({ searchText: e.target.value })}
          placeholder='搜索 Todo...'
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* 过滤器选项 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* 状态过滤 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            状态
          </label>
          <div className='flex gap-2'>
            {[
              { value: 'all', label: '全部' },
              { value: 'active', label: '进行中' },
              { value: 'completed', label: '已完成' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFilter({ status: option.value as any })}
                className={clsx(
                  'px-3 py-1 text-sm rounded-lg transition-colors',
                  filter.status === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 分类过滤 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            分类
          </label>
          <select
            value={filter.category}
            onChange={e =>
              updateFilter({ category: e.target.value as TodoCategory | 'all' })
            }
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>全部分类</option>
            <option value='work'>工作</option>
            <option value='personal'>个人</option>
            <option value='shopping'>购物</option>
            <option value='health'>健康</option>
            <option value='other'>其他</option>
          </select>
        </div>

        {/* 优先级过滤 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            优先级
          </label>
          <select
            value={filter.priority}
            onChange={e =>
              updateFilter({ priority: e.target.value as TodoPriority | 'all' })
            }
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>全部优先级</option>
            <option value='high'>高优先级</option>
            <option value='medium'>中优先级</option>
            <option value='low'>低优先级</option>
          </select>
        </div>
      </div>

      {/* 清除过滤器 */}
      {(filter.searchText ||
        filter.status !== 'all' ||
        filter.category !== 'all' ||
        filter.priority !== 'all') && (
        <div>
          <button
            onClick={() =>
              onFilterChange({
                status: 'all',
                category: 'all',
                priority: 'all',
                searchText: '',
              })
            }
            className='px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            清除所有过滤器
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoFilter;
