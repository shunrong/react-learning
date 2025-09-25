# React 18：并发特性的正式时代

> React 18 - 并发渲染正式版，开启高性能用户体验新纪元

## 概述

React 18 于 2022年3月发布，是 React 历史上最重要的版本之一。它将**并发渲染**从实验特性转为正式功能，引入了革命性的 **Automatic Batching**、**Transitions**、**Suspense** 等特性，彻底改变了 React 应用的性能表现。

### 🎯 核心理念：并发渲染 (Concurrent Rendering)

React 18 的最大突破是将**可中断渲染**能力发挥到极致，让应用在处理复杂更新时依然保持响应性。

## 🚀 重大新特性

### 1. 新的根 API (createRoot)

#### 🏗️ React 17 及之前的渲染方式

```javascript
// 传统的 ReactDOM.render
import ReactDOM from 'react-dom';

const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// 问题：同步渲染，无法利用并发特性
```

#### ⚡ React 18 的并发根

```javascript
// 新的 createRoot API
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// 优势：启用并发特性，可中断渲染
```

### 2. 自动批处理 (Automatic Batching)

#### React 17 的批处理限制

```javascript
// React 17：只在事件处理中批处理
function handleClick() {
  setCount(c => c + 1);    // 重新渲染一次
  setFlag(f => !f);        // 重新渲染一次
  // 总共重新渲染 2 次
}

// React 17：异步中不批处理
setTimeout(() => {
  setCount(c => c + 1);    // 重新渲染一次
  setFlag(f => !f);        // 重新渲染一次
  // 总共重新渲染 2 次
}, 1000);
```

#### React 18 的自动批处理

```javascript
// React 18：所有地方都自动批处理
function handleClick() {
  setCount(c => c + 1);    
  setFlag(f => !f);        
  // 总共只重新渲染 1 次！
}

// React 18：异步中也批处理
setTimeout(() => {
  setCount(c => c + 1);    
  setFlag(f => !f);        
  // 总共只重新渲染 1 次！
}, 1000);

// 甚至在 Promise 中也批处理
fetch('/api/data').then(() => {
  setCount(c => c + 1);    
  setFlag(f => !f);        
  // 总共只重新渲染 1 次！
});
```

### 3. 并发特性：startTransition

```javascript
import { startTransition, useTransition } from 'react';

function SearchApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 紧急更新：立即响应用户输入
    setQuery(e.target.value);
    
    // 非紧急更新：搜索结果可以延迟
    startTransition(() => {
      setResults(searchData(e.target.value));
    });
  };

  return (
    <div>
      <input 
        value={query} 
        onChange={handleChange}
        placeholder="搜索..." 
      />
      {isPending ? (
        <div>搜索中...</div>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
}
```

### 4. useDeferredValue Hook

```javascript
import { useDeferredValue, useMemo } from 'react';

function ProductList({ searchTerm }) {
  // 延迟更新搜索词，优先保证输入响应性
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // 只有当延迟值变化时才重新计算
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [deferredSearchTerm]);

  return (
    <div>
      {searchTerm !== deferredSearchTerm && (
        <div>正在搜索 "{searchTerm}"...</div>
      )}
      <div>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### 5. Suspense 的重大改进

#### 数据获取中的 Suspense

```javascript
import { Suspense } from 'react';

// 数据获取组件
function UserProfile({ userId }) {
  const user = use(fetchUser(userId)); // 使用 Suspense 兼容的数据获取
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 使用 Suspense 包装
function App() {
  return (
    <Suspense fallback={<div>加载用户信息...</div>}>
      <UserProfile userId={123} />
    </Suspense>
  );
}
```

#### 流式 SSR 中的 Suspense

```javascript
// 服务端渲染中的 Suspense
function ServerApp() {
  return (
    <html>
      <head><title>流式 SSR</title></head>
      <body>
        <Header />
        <Suspense fallback={<div>加载中...</div>}>
          <ExpensiveComponent />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}

// 流式渲染：Header 和 Footer 立即发送
// ExpensiveComponent 准备好后再流式传输
```

## 🔧 技术原理深度解析

### 1. 并发渲染的工作机制

```javascript
// React 18 并发调度器简化版
class ConcurrentScheduler {
  constructor() {
    this.taskQueue = [];
    this.isWorkLoopRunning = false;
    this.currentTask = null;
  }
  
  scheduleTask(task, priority) {
    const newTask = {
      callback: task,
      priority,
      startTime: performance.now(),
      expirationTime: performance.now() + this.getPriorityTimeout(priority)
    };
    
    this.taskQueue.push(newTask);
    this.sortTasksByPriority();
    
    if (!this.isWorkLoopRunning) {
      this.requestCallback(this.workLoop);
    }
  }
  
  workLoop = (deadline) => {
    this.isWorkLoopRunning = true;
    
    while (this.taskQueue.length > 0 && !deadline.didTimeout) {
      const task = this.taskQueue.shift();
      this.currentTask = task;
      
      // 执行任务，如果未完成会返回 continuation
      const continuation = task.callback();
      
      if (typeof continuation === 'function') {
        // 任务未完成，重新入队
        task.callback = continuation;
        this.taskQueue.unshift(task);
        break;
      }
    }
    
    this.isWorkLoopRunning = false;
    
    // 如果还有任务，继续调度
    if (this.taskQueue.length > 0) {
      this.requestCallback(this.workLoop);
    }
  };
  
  getPriorityTimeout(priority) {
    switch (priority) {
      case 'immediate': return -1;        // 立即执行
      case 'user-interaction': return 250; // 用户交互
      case 'normal': return 5000;         // 正常优先级
      case 'low': return 10000;           // 低优先级
      case 'idle': return 1073741823;     // 空闲时执行
    }
  }
}
```

### 2. startTransition 的内部实现

```javascript
// startTransition 实现原理
function startTransition(callback) {
  const prevTransition = getCurrentTransition();
  const currentTransition = {
    _callbacks: new Set(),
    _isPending: false
  };
  
  // 设置当前 transition 上下文
  setCurrentTransition(currentTransition);
  
  try {
    // 标记为 transition 更新
    markTransitionUpdate();
    callback();
  } finally {
    // 恢复之前的 transition 上下文
    setCurrentTransition(prevTransition);
  }
}

// useTransition Hook 实现
function useTransition() {
  const [isPending, setPending] = useState(false);
  
  const startTransition = useCallback((callback) => {
    setPending(true);
    
    // 调度 transition 更新
    scheduleTransitionUpdate(() => {
      try {
        callback();
      } finally {
        setPending(false);
      }
    });
  }, []);
  
  return [isPending, startTransition];
}
```

### 3. 自动批处理机制

```javascript
// React 18 自动批处理实现
let isBatchingUpdates = false;
let pendingUpdates = [];

function scheduleUpdate(update) {
  pendingUpdates.push(update);
  
  if (!isBatchingUpdates) {
    isBatchingUpdates = true;
    
    // 使用 MessageChannel 或 setTimeout 异步批处理
    scheduleCallback(() => {
      flushBatchedUpdates();
    });
  }
}

function flushBatchedUpdates() {
  const updates = pendingUpdates.slice();
  pendingUpdates = [];
  isBatchingUpdates = false;
  
  // 批量执行所有更新
  performBatchedUpdates(updates);
}

// React 17 vs React 18 对比
function onClick() {
  // React 17：可能触发 2 次渲染
  setCount(c => c + 1);
  setName(name => name + '!');
  
  // React 18：始终只触发 1 次渲染（自动批处理）
}
```

## 📊 性能优化策略

### 1. 智能优先级调度

```javascript
// React 18 的优先级系统
const Priority = {
  Immediate: 1,      // 立即：阻塞主线程的紧急更新
  UserBlocking: 2,   // 用户阻塞：点击、输入等交互
  Normal: 3,         // 正常：数据获取、非关键更新
  Low: 4,           // 低：分析、日志等
  Idle: 5           // 空闲：后台任务
};

function PriorityDemo() {
  const [urgentState, setUrgentState] = useState(0);
  const [normalState, setNormalState] = useState(0);
  
  const handleUrgentUpdate = () => {
    // 紧急更新：立即执行
    flushSync(() => {
      setUrgentState(s => s + 1);
    });
  };
  
  const handleNormalUpdate = () => {
    // 正常更新：可能被打断
    setNormalState(s => s + 1);
  };
  
  const handleLowPriorityUpdate = () => {
    // 低优先级更新：在空闲时执行
    startTransition(() => {
      setNormalState(s => s + 1);
    });
  };
  
  return (
    <div>
      <button onClick={handleUrgentUpdate}>
        紧急更新: {urgentState}
      </button>
      <button onClick={handleNormalUpdate}>
        正常更新: {normalState}
      </button>
      <button onClick={handleLowPriorityUpdate}>
        低优先级更新
      </button>
    </div>
  );
}
```

### 2. Suspense 边界优化

```javascript
// 嵌套 Suspense 边界策略
function App() {
  return (
    <div>
      {/* 页面级 Suspense */}
      <Suspense fallback={<PageSkeleton />}>
        <Header />
        
        {/* 组件级 Suspense */}
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        
        <main>
          {/* 内容级 Suspense */}
          <Suspense fallback={<ContentSkeleton />}>
            <MainContent />
          </Suspense>
        </main>
      </Suspense>
    </div>
  );
}

// 数据预加载策略
function DataPrefetching() {
  useEffect(() => {
    // 预加载可能需要的数据
    startTransition(() => {
      prefetchUserData();
      prefetchSettings();
    });
  }, []);
  
  return <App />;
}
```

### 3. 内存使用优化

```javascript
// React 18 内存优化最佳实践
function OptimizedComponent() {
  // 使用 useMemo 缓存昂贵计算
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(props.data);
  }, [props.data]);
  
  // 使用 useCallback 缓存函数
  const handleClick = useCallback((id) => {
    startTransition(() => {
      updateItem(id);
    });
  }, [updateItem]);
  
  // 使用 useDeferredValue 延迟非关键更新
  const deferredQuery = useDeferredValue(searchQuery);
  
  return (
    <div>
      <ExpensiveList 
        data={expensiveValue}
        onItemClick={handleClick}
        query={deferredQuery}
      />
    </div>
  );
}
```

## 🔄 迁移指南

### 1. 从 React 17 升级到 React 18

```bash
# 升级依赖
npm install react@18 react-dom@18

# 更新类型定义（TypeScript）
npm install @types/react@18 @types/react-dom@18
```

### 2. 更新根渲染逻辑

```javascript
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 3. 处理新的 Strict Mode 行为

```javascript
// React 18 StrictMode 会双重调用某些函数
function MyComponent() {
  useEffect(() => {
    // 这个函数在 StrictMode 中会被调用两次
    console.log('组件挂载');
    
    return () => {
      console.log('组件卸载');
    };
  }, []);
  
  return <div>内容</div>;
}

// 解决方案：确保 Effect 的幂等性
function IdempotentComponent() {
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      const data = await api.getData();
      if (!cancelled) {
        setData(data);
      }
    }
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, []);
}
```

### 4. 利用新特性优化现有代码

```javascript
// 优化前：React 17 代码
function SlowList({ items, filter }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    // 同步更新，可能造成卡顿
    setFilteredItems(
      items.filter(item => item.name.includes(query))
    );
  }, [items, query]);
  
  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {filteredItems.map(item => <Item key={item.id} item={item} />)}
    </div>
  );
}

// 优化后：React 18 代码
function FastList({ items, filter }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.includes(deferredQuery)
    );
  }, [items, deferredQuery]);
  
  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)} // 立即响应
      />
      {query !== deferredQuery && <div>搜索中...</div>}
      {filteredItems.map(item => <Item key={item.id} item={item} />)}
    </div>
  );
}
```

## 🌟 服务端渲染 (SSR) 改进

### 1. 流式渲染 (Streaming SSR)

```javascript
// React 18 流式 SSR
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe, abort } = renderToPipeableStream(
    <App />,
    {
      bootstrapScripts: ['/main.js'],
      onShellReady() {
        // 外壳准备好后立即开始流式传输
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        pipe(res);
      },
      onShellError(error) {
        // 外壳渲染错误
        res.statusCode = 500;
        res.send('<!doctype html><p>服务器错误</p>');
      },
      onAllReady() {
        // 所有内容准备完毕
        console.log('所有组件渲染完成');
      },
      onError(err) {
        console.error(err);
      },
    }
  );
  
  // 超时处理
  setTimeout(abort, 10000);
});
```

### 2. 选择性注水 (Selective Hydration)

```javascript
// 优先级注水
function App() {
  return (
    <html>
      <body>
        <Header /> {/* 立即注水 */}
        
        <Suspense fallback={<Spinner />}>
          <Sidebar /> {/* 延迟注水 */}
        </Suspense>
        
        <main>
          <Suspense fallback={<ContentSkeleton />}>
            <MainContent /> {/* 按需注水 */}
          </Suspense>
        </main>
        
        <Footer /> {/* 最后注水 */}
      </body>
    </html>
  );
}
```

## 📈 性能监控和调试

### 1. React DevTools 中的并发特性

```javascript
// 性能分析
function PerformanceTracking() {
  const [isPending, startTransition] = useTransition();
  
  const handleExpensiveUpdate = () => {
    // 标记为 transition，在 DevTools 中可以看到
    startTransition(() => {
      setLargeList(generateLargeData());
    });
  };
  
  return (
    <div>
      <button onClick={handleExpensiveUpdate}>
        {isPending ? '处理中...' : '更新大列表'}
      </button>
    </div>
  );
}
```

### 2. 自定义性能度量

```javascript
// 自定义性能监控
function usePerformanceMonitor(name) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      console.log(`${name} 渲染耗时: ${duration}ms`);
      
      // 发送到分析服务
      analytics.track('render_performance', {
        component: name,
        duration
      });
    };
  });
}

function MonitoredComponent() {
  usePerformanceMonitor('MonitoredComponent');
  
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    if (isPending) {
      console.log('开始 transition 更新');
    } else {
      console.log('transition 更新完成');
    }
  }, [isPending]);
  
  return <div>被监控的组件</div>;
}
```

## 🎯 总结

React 18 代表了 React 发展的新里程碑，它将并发渲染从概念变为现实，为构建高性能、响应式的用户界面提供了强大的工具。

### 🌟 核心价值

1. **并发渲染** - 真正的可中断、可恢复渲染
2. **自动批处理** - 大幅减少不必要的重新渲染
3. **优先级调度** - 智能的更新排序和执行
4. **流式 SSR** - 更快的首屏加载和更好的用户体验

### 🚀 对开发者的影响

- **性能提升** - 应用在重负载下依然保持响应
- **更好的 UX** - 复杂交互不再卡顿
- **开发体验** - 更直观的异步状态管理
- **架构简化** - 内置的性能优化减少了手动优化的需求

### 📅 在 React 演进中的地位

```
React 16 (2017) → Fiber 架构基础
React 17 (2020) → 零破坏性升级桥梁
React 18 (2022) → 并发特性正式版 ← 我们在这里
React 19 (2024) → 编译器优化时代
```

React 18 是现代 React 开发的**必备版本**，它不仅解决了性能问题，更重要的是改变了我们思考和构建用户界面的方式。掌握 React 18 的并发特性，对于构建现代 Web 应用至关重要。
