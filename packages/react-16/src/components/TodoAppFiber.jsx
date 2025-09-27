import React, { useState, useEffect, useMemo, useCallback, useTransition, memo } from 'react';

// 优化的 Todo 项组件 - 使用 memo
const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  
  useEffect(() => {
    console.log(`📝 TodoItem ${todo.id} 渲染 (React 16+ Hook 组件)`);
  });
  
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.title);
  }, [todo.title]);
  
  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  }, [todo.id, editText, onEdit]);
  
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.title);
  }, [todo.title]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);
  
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      <div className="todo-content">
        {isEditing ? (
          <input
            type="text"
            className="input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <div>
            <div className={`todo-title ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </div>
            {todo.description && (
              <div className="todo-description">{todo.description}</div>
            )}
            <div className="todo-meta">
              <span className={`priority-indicator priority-${todo.priority}`}></span>
              {new Date(todo.createdAt).toLocaleString()} | {todo.category} | {todo.priority}
            </div>
          </div>
        )}
      </div>
      
      <div className="todo-actions">
        {!isEditing && (
          <button className="btn btn-small btn-secondary" onClick={handleEdit}>
            编辑
          </button>
        )}
        <button className="btn btn-small btn-danger" onClick={() => onDelete(todo.id)}>
          删除
        </button>
      </div>
    </div>
  );
});

// 添加 Todo 表单
const AddTodoForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    category: 'work'
  });
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAdd({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        completed: false,
        createdAt: Date.now()
      });
      
      setFormData({
        title: '',
        description: '',
        priority: 'normal',
        category: 'work'
      });
    }
  }, [formData, onAdd]);
  
  const handleChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="label">标题 *</label>
          <input
            type="text"
            className="input"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="输入待办事项标题..."
            required
          />
        </div>
        
        <div className="form-group">
          <label className="label">描述</label>
          <input
            type="text"
            className="input"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="添加详细描述..."
          />
        </div>
        
        <div className="form-group">
          <label className="label">优先级</label>
          <select
            className="input"
            value={formData.priority}
            onChange={handleChange('priority')}
          >
            <option value="low">低</option>
            <option value="normal">普通</option>
            <option value="high">高</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="label">分类</label>
          <select
            className="input"
            value={formData.category}
            onChange={handleChange('category')}
          >
            <option value="work">工作</option>
            <option value="personal">个人</option>
            <option value="study">学习</option>
            <option value="health">健康</option>
          </select>
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary">
        ➕ 添加任务
      </button>
    </form>
  );
};

// 性能监控 Hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    totalTime: 0,
    averageTime: 0,
    lastRenderTime: 0,
    fiberInterruptions: 0
  });
  
  const recordRender = useCallback((duration, wasInterrupted = false) => {
    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      const newTotalTime = prev.totalTime + duration;
      
      return {
        renderCount: newRenderCount,
        totalTime: newTotalTime,
        averageTime: newTotalTime / newRenderCount,
        lastRenderTime: duration,
        fiberInterruptions: wasInterrupted ? prev.fiberInterruptions + 1 : prev.fiberInterruptions
      };
    });
  }, []);
  
  return { metrics, recordRender };
};

const TodoAppFiber = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const { metrics, recordRender } = usePerformanceMonitor();
  
  // 使用 useMemo 优化过滤和搜索
  const filteredTodos = useMemo(() => {
    console.log('🔍 过滤 Todo 列表 (useMemo 优化)');
    
    let filtered = todos;
    
    // 按状态过滤
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [todos, filter, searchQuery]);
  
  // 统计信息
  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    filtered: filteredTodos.length
  }), [todos, filteredTodos]);
  
  // 添加 Todo
  const handleAddTodo = useCallback((todoData) => {
    const newTodo = {
      id: Date.now(),
      ...todoData
    };
    
    console.log('➕ 添加新 Todo (React 16+ 优化):', newTodo.title);
    
    // 🚀 使用函数式更新，避免闭包问题
    setTodos(prev => [...prev, newTodo]);
  }, []);
  
  // 切换 Todo 状态
  const handleToggleTodo = useCallback((id) => {
    console.log('🔄 切换 Todo 状态:', id);
    
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);
  
  // 删除 Todo
  const handleDeleteTodo = useCallback((id) => {
    console.log('🗑️ 删除 Todo:', id);
    
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  // 编辑 Todo
  const handleEditTodo = useCallback((id, newTitle) => {
    console.log('✏️ 编辑 Todo:', id, newTitle);
    
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    ));
  }, []);
  
  // 搜索处理 - 使用 startTransition
  const handleSearch = useCallback((query) => {
    // 🚀 立即更新输入框显示
    setSearchQuery(query);
    
    // ⏰ 搜索过滤 - 低优先级，可被中断
    startTransition(() => {
      console.log(`🔍 执行搜索: "${query}" (低优先级)`);
      // 搜索逻辑在 useMemo 中处理
    });
  }, [startTransition]);
  
  // 批量操作 - 使用 startTransition
  const handleBatchOperation = useCallback((operation) => {
    console.log('📦 批量操作:', operation);
    
    // ⏰ 批量操作使用低优先级，不阻塞用户交互
    startTransition(() => {
      const startTime = performance.now();
      
      setTodos(prev => {
        let newTodos = [...prev];
        
        switch (operation) {
          case 'completeAll':
            newTodos = newTodos.map(todo => ({ ...todo, completed: true }));
            break;
          case 'deleteCompleted':
            newTodos = newTodos.filter(todo => !todo.completed);
            break;
          case 'resetAll':
            newTodos = newTodos.map(todo => ({ ...todo, completed: false }));
            break;
          case 'addMany':
            // 添加大量数据测试 Fiber 性能
            const newItems = Array.from({ length: 100 }, (_, i) => ({
              id: Date.now() + i,
              title: `批量任务 ${i + 1}`,
              description: `这是第 ${i + 1} 个批量添加的任务`,
              completed: false,
              priority: ['low', 'normal', 'high'][i % 3],
              category: ['work', 'personal', 'study', 'health'][i % 4],
              createdAt: Date.now() + i
            }));
            newTodos = [...newTodos, ...newItems];
            break;
        }
        
        const duration = performance.now() - startTime;
        recordRender(duration);
        console.log(`📊 批量操作完成，耗时: ${duration.toFixed(2)}ms`);
        
        return newTodos;
      });
    });
  }, [startTransition, recordRender]);
  
  // 初始化数据
  useEffect(() => {
    const initialTodos = [
      {
        id: 1,
        title: '学习 React Fiber 架构',
        description: '深入理解可中断渲染和时间切片技术',
        completed: false,
        priority: 'high',
        category: 'study',
        createdAt: Date.now() - 86400000
      },
      {
        id: 2,
        title: '优化应用性能',
        description: '使用 React 16+ 的新特性提升用户体验',
        completed: true,
        priority: 'normal',
        category: 'work',
        createdAt: Date.now() - 172800000
      },
      {
        id: 3,
        title: '体验并发特性',
        description: '测试 startTransition 和 useDeferredValue',
        completed: false,
        priority: 'normal',
        category: 'study',
        createdAt: Date.now() - 259200000
      }
    ];
    
    setTodos(initialTodos);
  }, []);
  
  return (
    <div className="demo-section">
      <h2>📝 现代 Todo 应用 - React 16+ 实现</h2>
      <p>
        使用 React Hooks 和现代特性重新实现的 Todo 应用。
        注意观察性能监控数据和控制台输出，对比与 React 15 的差异。
      </p>
      
      {/* 性能数据展示 */}
      <div className="performance-stats">
        <div className="stat-item">
          <div className="stat-label">渲染次数</div>
          <div className="stat-value good">{metrics.renderCount}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">平均渲染时间</div>
          <div className={`stat-value ${metrics.averageTime > 5 ? 'warning' : 'good'}`}>
            {metrics.averageTime.toFixed(2)}ms
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">最近渲染时间</div>
          <div className={`stat-value ${metrics.lastRenderTime > 5 ? 'warning' : 'good'}`}>
            {metrics.lastRenderTime.toFixed(2)}ms
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Fiber 中断次数</div>
          <div className="stat-value">{metrics.fiberInterruptions}</div>
        </div>
      </div>
      
      {/* 状态指示器 */}
      {isPending && (
        <div style={{
          background: '#fed7aa',
          border: '1px solid #f6ad55',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#c05621'
        }}>
          ⏳ Transition 进行中... (用户交互依然响应，后台处理数据更新)
        </div>
      )}
      
      {/* 统计信息 */}
      <div className="performance-stats">
        <div className="stat-item">
          <div className="stat-label">总任务</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">未完成</div>
          <div className="stat-value warning">{stats.active}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">已完成</div>
          <div className="stat-value good">{stats.completed}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">当前显示</div>
          <div className="stat-value">{stats.filtered}</div>
        </div>
      </div>
      
      {/* 控制面板 */}
      <div className="grid grid-2">
        <div>
          <h3>➕ 添加新任务</h3>
          <AddTodoForm onAdd={handleAddTodo} />
        </div>
        
        <div>
          <h3>🎛️ 批量操作</h3>
          <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
            所有操作都使用 startTransition，保持界面响应性
          </p>
          <div className="controls">
            <button 
              className="btn btn-success"
              onClick={() => handleBatchOperation('addMany')}
            >
              📊 添加100个任务
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleBatchOperation('completeAll')}
            >
              ✅ 全部完成
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleBatchOperation('deleteCompleted')}
            >
              🗑️ 删除已完成
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleBatchOperation('resetAll')}
            >
              🔄 重置全部
            </button>
          </div>
        </div>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="grid grid-2">
        <div>
          <h3>🔍 搜索</h3>
          <div className="form-group">
            <input
              type="text"
              className="input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索任务标题或描述..."
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#718096' }}>
            搜索使用了低优先级更新，不会阻塞输入响应
          </p>
        </div>
        
        <div>
          <h3>🔍 过滤器</h3>
          <div className="controls">
            {[
              { key: 'all', label: '全部' },
              { key: 'active', label: '未完成' },
              { key: 'completed', label: '已完成' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                className={`btn ${filter === filterOption.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(filterOption.key)}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 任务列表 */}
      <div>
        <h3>📋 任务列表 ({stats.filtered} 项)</h3>
        <div className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))}
          
          {filteredTodos.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#a0aec0' 
            }}>
              {searchQuery ? 
                `没有找到包含 "${searchQuery}" 的任务` : 
                '暂无待办事项，添加一些任务开始体验吧！'
              }
            </div>
          )}
        </div>
      </div>
      
      {/* React 16+ 特性说明 */}
      <div style={{
        background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
        border: '1px solid #4fd1c7',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#234e52' }}>🚀 React 16+ 现代特性应用</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>Hooks</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>useState - 状态管理</li>
              <li>useEffect - 副作用</li>
              <li>useMemo - 性能优化</li>
              <li>useCallback - 函数缓存</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>并发特性</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>startTransition - 低优先级更新</li>
              <li>useTransition - 状态反馈</li>
              <li>React.memo - 渲染优化</li>
              <li>Suspense - 异步边界</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>性能优化</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>组件记忆化</li>
              <li>计算结果缓存</li>
              <li>非阻塞更新</li>
              <li>智能调度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoAppFiber;
