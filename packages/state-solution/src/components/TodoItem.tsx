import React from 'react';
import { clsx } from 'clsx';
import type { Todo, TodoPriority, TodoCategory } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const priorityColors: Record<TodoPriority, string> = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-red-600 bg-red-50',
};

const categoryColors: Record<TodoCategory, string> = {
  work: 'text-blue-600 bg-blue-50',
  personal: 'text-purple-600 bg-purple-50',
  shopping: 'text-pink-600 bg-pink-50',
  health: 'text-green-600 bg-green-50',
  other: 'text-gray-600 bg-gray-50',
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  className,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm',
        'hover:shadow-md transition-shadow duration-200',
        todo.completed && 'opacity-75',
        className
      )}
    >
      {/* 完成状态复选框 */}
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
      />

      {/* Todo 内容 */}
      <div className='flex-1 min-w-0'>
        {isEditing ? (
          <input
            type='text'
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleSave}
            className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            autoFocus
          />
        ) : (
          <div className='space-y-1'>
            <p
              className={clsx(
                'text-sm font-medium',
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              )}
            >
              {todo.text}
            </p>

            {/* 标签 */}
            <div className='flex gap-2'>
              <span
                className={clsx(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  priorityColors[todo.priority]
                )}
              >
                {todo.priority}
              </span>
              <span
                className={clsx(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  categoryColors[todo.category]
                )}
              >
                {todo.category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className='flex gap-2'>
        {!isEditing ? (
          <>
            <button
              onClick={handleEdit}
              className='px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors'
            >
              编辑
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className='px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors'
            >
              删除
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className='px-3 py-1 text-xs text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors'
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className='px-3 py-1 text-xs text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors'
            >
              取消
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
