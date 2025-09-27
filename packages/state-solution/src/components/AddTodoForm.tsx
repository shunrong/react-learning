import React from 'react';
import { clsx } from 'clsx';
import type { TodoPriority, TodoCategory } from '@/types/todo';

interface AddTodoFormProps {
  onAdd: (text: string, priority: TodoPriority, category: TodoCategory) => void;
  className?: string;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  onAdd,
  className,
}) => {
  const [text, setText] = React.useState('');
  const [priority, setPriority] = React.useState<TodoPriority>('medium');
  const [category, setCategory] = React.useState<TodoCategory>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority, category);
      setText('');
      setPriority('medium');
      setCategory('other');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
      <div className='flex gap-4'>
        {/* 输入框 */}
        <input
          type='text'
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='添加新的 Todo...'
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />

        {/* 优先级选择 */}
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as TodoPriority)}
          className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='low'>低优先级</option>
          <option value='medium'>中优先级</option>
          <option value='high'>高优先级</option>
        </select>

        {/* 分类选择 */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value as TodoCategory)}
          className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='work'>工作</option>
          <option value='personal'>个人</option>
          <option value='shopping'>购物</option>
          <option value='health'>健康</option>
          <option value='other'>其他</option>
        </select>

        {/* 添加按钮 */}
        <button
          type='submit'
          disabled={!text.trim()}
          className={clsx(
            'px-6 py-2 font-medium rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            text.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          添加
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
