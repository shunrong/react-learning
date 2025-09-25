import React from 'react';

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editText: props.todo.title
    };
  }
  
  handleEdit = () => {
    this.setState({ isEditing: true });
  };
  
  handleSave = () => {
    this.props.onEdit(this.props.todo.id, this.state.editText.trim());
    this.setState({ isEditing: false });
  };
  
  handleCancel = () => {
    this.setState({ 
      isEditing: false, 
      editText: this.props.todo.title 
    });
  };
  
  render() {
    const { todo, onToggle, onDelete } = this.props;
    const { isEditing, editText } = this.state;
    
    return (
      <div className="todo-item">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        
        {isEditing ? (
          <div className="edit-mode">
            <input
              type="text"
              value={editText}
              onChange={(e) => this.setState({ editText: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && this.handleSave()}
            />
            <button onClick={this.handleSave}>保存</button>
            <button onClick={this.handleCancel}>取消</button>
          </div>
        ) : (
          <div className="view-mode">
            <span 
              className={todo.completed ? 'completed' : ''}
              onDoubleClick={this.handleEdit}
            >
              {todo.title}
            </span>
            <button onClick={this.handleEdit}>编辑</button>
            <button onClick={() => onDelete(todo.id)}>删除</button>
          </div>
        )}
      </div>
    );
  }
}

class AddTodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '' };
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.title.trim()) {
      this.props.onAdd(this.state.title.trim());
      this.setState({ title: '' });
    }
  };
  
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="add-todo-form">
        <input
          type="text"
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
          placeholder="添加新的 Todo..."
        />
        <button type="submit">添加</button>
      </form>
    );
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, title: '学习 React 15 栈协调器', completed: false },
        { id: 2, title: '理解同步渲染机制', completed: false },
        { id: 3, title: '对比 Fiber 架构', completed: false }
      ],
      filter: 'all', // all, active, completed
      nextId: 4
    };
    this.startTime = Date.now();
  }
  
  addTodo = (title) => {
    const newTodo = {
      id: this.state.nextId,
      title,
      completed: false
    };
    
    this.setState(prevState => ({
      todos: [...prevState.todos, newTodo],
      nextId: prevState.nextId + 1
    }));
  };
  
  toggleTodo = (id) => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };
  
  editTodo = (id, newTitle) => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    }));
  };
  
  deleteTodo = (id) => {
    this.setState(prevState => ({
      todos: prevState.todos.filter(todo => todo.id !== id)
    }));
  };
  
  setFilter = (filter) => {
    this.setState({ filter });
  };
  
  addBulkTodos = () => {
    const bulkTodos = Array.from({ length: 100 }, (_, i) => ({
      id: this.state.nextId + i,
      title: `批量任务 ${this.state.nextId + i}`,
      completed: Math.random() > 0.7
    }));
    
    this.setState(prevState => ({
      todos: [...prevState.todos, ...bulkTodos],
      nextId: prevState.nextId + 100
    }));
  };
  
  clearCompleted = () => {
    this.setState(prevState => ({
      todos: prevState.todos.filter(todo => !todo.completed)
    }));
  };
  
  render() {
    const { todos, filter } = this.state;
    
    const filteredTodos = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
    
    const completedCount = todos.filter(todo => todo.completed).length;
    const activeCount = todos.length - completedCount;
    
    return (
      <div className="todo-app">
        <h2>📋 React 15 Todo 应用</h2>
        <p className="description">
          栈协调器同步渲染演示 - 添加大量任务体验性能差异
        </p>
        
        <AddTodoForm onAdd={this.addTodo} />
        
        <div className="bulk-actions">
          <button onClick={this.addBulkTodos}>
            🚀 添加100个任务 (测试性能)
          </button>
          <button onClick={this.clearCompleted}>
            🗑️ 清除已完成
          </button>
        </div>
        
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => this.setFilter('all')}
          >
            全部 ({todos.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => this.setFilter('active')}
          >
            进行中 ({activeCount})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => this.setFilter('completed')}
          >
            已完成 ({completedCount})
          </button>
        </div>
        
        <div className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={this.toggleTodo}
              onEdit={this.editTodo}
              onDelete={this.deleteTodo}
            />
          ))}
        </div>
        
        <div className="stats">
          总任务: {todos.length} | 已完成: {completedCount} | 进行中: {activeCount}
        </div>
      </div>
    );
  }
}

export default TodoApp;
