# React 性能优化深度解析

> 🚀 深入探索 React 应用性能优化的核心技术、最佳实践和实战经验

## 📖 目录

- [性能优化概述](#性能优化概述)
- [React 渲染机制](#react-渲染机制)
- [渲染优化技术](#渲染优化技术)
- [内存管理与优化](#内存管理与优化)
- [代码分割与懒加载](#代码分割与懒加载)
- [虚拟化技术](#虚拟化技术)
- [性能监控与诊断](#性能监控与诊断)
- [高级优化策略](#高级优化策略)
- [性能优化最佳实践](#性能优化最佳实践)

## 🎯 性能优化概述

### 为什么性能优化如此重要？

在现代 Web 应用中，用户对页面响应速度的期望越来越高。根据研究数据：

- **53%** 的用户会放弃加载时间超过 **3 秒** 的页面
- 页面加载时间每增加 **1 秒**，转化率下降 **7%**
- **1 秒** 的延迟会导致页面浏览量减少 **11%**

React 应用的性能问题主要体现在：

1. **首屏加载慢** - 大型 bundle、资源加载
2. **交互响应慢** - 复杂计算、频繁重渲染
3. **内存泄漏** - 事件监听器、定时器、闭包
4. **卡顿掉帧** - 大量 DOM 操作、长任务阻塞

### 性能优化的核心目标

#### 🎯 Core Web Vitals

Google 提出的核心网络指标，是衡量用户体验的关键指标：

- **LCP (Largest Contentful Paint)** - 最大内容绘制时间 < 2.5s
- **FID (First Input Delay)** - 首次输入延迟 < 100ms  
- **CLS (Cumulative Layout Shift)** - 累积布局偏移 < 0.1

#### 📊 React 特定指标

- **组件渲染时间** - 单次渲染 < 16ms (60fps)
- **内存使用** - 合理控制在 50MB 以下
- **包体积** - 主包 < 500KB，总体积 < 2MB
- **重渲染频率** - 避免不必要的重渲染

## ⚙️ React 渲染机制

### React 渲染流程深度解析

React 的渲染过程分为两个主要阶段：

#### 1. Reconciliation (协调阶段)

```
触发更新 → 创建 Fiber 树 → Diff 算法 → 标记副作用
```

**Fiber 架构的优势**：
- **可中断渲染** - 高优先级任务可以打断低优先级任务
- **时间切片** - 将长任务分解为多个小任务
- **优先级调度** - 不同类型的更新有不同优先级

#### 2. Commit (提交阶段)

```
Dom 更新 → 生命周期调用 → ref 更新 → 副作用清理
```

### 触发重渲染的条件

React 组件重新渲染的触发条件：

1. **State 变化** - useState、useReducer
2. **Props 变化** - 父组件传递的 props 发生变化
3. **Context 变化** - useContext 监听的 Context 值变化
4. **强制更新** - forceUpdate (类组件) 或 key 变化

### 渲染性能的关键因素

#### 🔄 组件更新频率

```jsx
// ❌ 问题：父组件频繁更新导致子组件无意义重渲染
function Parent() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  
  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <ExpensiveChild data={someStaticData} />
    </>
  );
}

// ✅ 解决：使用 React.memo 包装子组件
const ExpensiveChild = React.memo(({ data }) => {
  return <div>{/* 昂贵的渲染逻辑 */}</div>;
});
```

#### 🧮 计算复杂度

```jsx
// ❌ 问题：每次渲染都进行复杂计算
function Component({ items }) {
  const expensiveValue = items.filter(...).map(...).reduce(...);
  return <div>{expensiveValue}</div>;
}

// ✅ 解决：使用 useMemo 缓存计算结果
function Component({ items }) {
  const expensiveValue = useMemo(() => {
    return items.filter(...).map(...).reduce(...);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
}
```

## 🎨 渲染优化技术

### 1. React.memo - 组件记忆化

React.memo 是一个高阶组件，用于防止不必要的重渲染：

```jsx
// 基础用法
const MyComponent = React.memo(function MyComponent({ name, age }) {
  return <div>{name} is {age} years old</div>;
});

// 自定义比较函数
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.user.name}</div>;
}, (prevProps, nextProps) => {
  // 返回 true 表示 props 相等，不需要重渲染
  return prevProps.user.id === nextProps.user.id;
});
```

**使用场景**：
- 纯展示组件
- props 变化频率低的组件
- 渲染成本较高的组件

**注意事项**：
- 对象和函数 props 可能导致记忆化失效
- 过度使用可能影响性能（比较成本）

### 2. useMemo - 值记忆化

缓存昂贵计算的结果：

```jsx
function ExpensiveComponent({ items, filter }) {
  // 缓存过滤和排序的结果
  const filteredItems = useMemo(() => {
    console.log('Computing filtered items...');
    return items
      .filter(item => item.category === filter)
      .sort((a, b) => b.score - a.score);
  }, [items, filter]);

  // 缓存复杂的计算
  const statistics = useMemo(() => {
    console.log('Computing statistics...');
    return {
      total: filteredItems.length,
      average: filteredItems.reduce((sum, item) => sum + item.score, 0) / filteredItems.length,
      max: Math.max(...filteredItems.map(item => item.score))
    };
  }, [filteredItems]);

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total: {statistics.total}</p>
      <p>Average: {statistics.average.toFixed(2)}</p>
      <p>Max Score: {statistics.max}</p>
      
      <h3>Items</h3>
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}: {item.score}</div>
      ))}
    </div>
  );
}
```

### 3. useCallback - 函数记忆化

缓存函数引用，防止子组件不必要的重渲染：

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // 缓存添加函数
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []);

  // 缓存切换函数
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  // 缓存过滤后的数据
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
    }
  }, [todos, filter]);

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
    </div>
  );
}

// 子组件使用 memo 优化
const TodoInput = React.memo(({ onAdd }) => {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
});
```

### 4. 列表渲染优化

#### 使用正确的 key

```jsx
// ❌ 使用数组索引作为 key（可能导致渲染问题）
{items.map((item, index) => (
  <TodoItem key={index} todo={item} />
))}

// ✅ 使用稳定的唯一标识符
{items.map(item => (
  <TodoItem key={item.id} todo={item} />
))}

// ✅ 对于真正静态的列表，索引是可以的
{staticItems.map((item, index) => (
  <StaticItem key={index} item={item} />
))}
```

#### 避免在渲染中创建新对象

```jsx
// ❌ 每次渲染都创建新对象
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          style={{ margin: '10px' }} // 每次都是新对象
          onClick={() => console.log(user.id)} // 每次都是新函数
        />
      ))}
    </div>
  );
}

// ✅ 将静态值提取到组件外部
const cardStyle = { margin: '10px' };

function UserList({ users }) {
  const handleClick = useCallback((userId) => {
    console.log(userId);
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          style={cardStyle}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
```

## 🧠 内存管理与优化

### 内存泄漏的常见原因

#### 1. 事件监听器未清理

```jsx
// ❌ 问题：事件监听器未清理
function Component() {
  useEffect(() => {
    const handleScroll = () => {
      console.log('scrolling...');
    };
    
    window.addEventListener('scroll', handleScroll);
    // 忘记清理监听器
  }, []);

  return <div>Content</div>;
}

// ✅ 解决：正确清理事件监听器
function Component() {
  useEffect(() => {
    const handleScroll = () => {
      console.log('scrolling...');
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div>Content</div>;
}
```

#### 2. 定时器未清理

```jsx
// ❌ 问题：定时器未清理
function Timer() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    // 忘记清理定时器
  }, []);

  return <div>Count: {count}</div>;
}

// ✅ 解决：清理定时器
function Timer() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>Count: {count}</div>;
}
```

#### 3. 异步操作未取消

```jsx
// ❌ 问题：组件卸载后异步操作仍在执行
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data); // 组件可能已经卸载
        setLoading(false);
      });
  }, []);

  return loading ? <div>Loading...</div> : <div>{data}</div>;
}

// ✅ 解决：使用 AbortController 或标志位
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    fetch('/api/data', { signal: controller.signal })
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      });
    
    return () => {
      controller.abort();
    };
  }, []);

  return loading ? <div>Loading...</div> : <div>{data}</div>;
}
```

### 内存优化策略

#### 1. 对象池模式

```jsx
// 对象池减少垃圾回收压力
class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }
  
  get() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const pointPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (point) => { point.x = 0; point.y = 0; }
);
```

#### 2. WeakMap 避免循环引用

```jsx
// 使用 WeakMap 存储私有数据
const privateData = new WeakMap();

class Component {
  constructor(props) {
    privateData.set(this, {
      internalState: {},
      cache: new Map()
    });
  }
  
  getPrivateData() {
    return privateData.get(this);
  }
}
```

## 📦 代码分割与懒加载

### 路由级别的代码分割

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// 预加载策略
const Dashboard = lazy(() => 
  import(/* webpackPreload: true */ './pages/Dashboard')
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 组件级别的懒加载

```jsx
import { useState, lazy, Suspense } from 'react';

// 按需加载重型组件
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('chart')}>Chart</button>
        <button onClick={() => setActiveTab('data')}>Data</button>
      </nav>
      
      <Suspense fallback={<div>Loading component...</div>}>
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'chart' && <HeavyChart />}
        {activeTab === 'data' && <DataTable />}
      </Suspense>
    </div>
  );
}
```

### 智能预加载

```jsx
// 鼠标悬停时预加载
function NavigationLink({ to, children }) {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isHovered) {
      // 预加载路由组件
      import(`./pages/${to}`);
    }
  }, [isHovered, to]);
  
  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

// 基于交叉观察器的预加载
function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return [ref, isVisible];
}
```

## 🎯 虚拟化技术

### 固定高度虚拟列表

```jsx
function VirtualList({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  // 计算可见范围
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );
  
  // 可见项目
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      item: items[i],
      offsetY: i * itemHeight
    });
  }
  
  const totalHeight = items.length * itemHeight;
  
  return (
    <div 
      style={{ 
        height: containerHeight, 
        overflow: 'auto' 
      }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, offsetY }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetY,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 动态高度虚拟列表

```jsx
function DynamicVirtualList({ 
  items, 
  estimatedItemHeight, 
  containerHeight, 
  renderItem 
}) {
  const [itemHeights, setItemHeights] = useState(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  
  // 计算每个项目的位置
  const getItemOffset = (index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemHeights.get(i) || estimatedItemHeight;
    }
    return offset;
  };
  
  // 找到可见项目
  const getVisibleItems = () => {
    const visibleItems = [];
    let accumulatedHeight = 0;
    
    for (let i = 0; i < items.length; i++) {
      const itemHeight = itemHeights.get(i) || estimatedItemHeight;
      const itemTop = accumulatedHeight;
      const itemBottom = accumulatedHeight + itemHeight;
      
      if (itemBottom >= scrollTop && itemTop <= scrollTop + containerHeight) {
        visibleItems.push({
          index: i,
          item: items[i],
          offsetY: itemTop
        });
      }
      
      if (itemTop > scrollTop + containerHeight) {
        break;
      }
      
      accumulatedHeight += itemHeight;
    }
    
    return visibleItems;
  };
  
  const visibleItems = getVisibleItems();
  const totalHeight = getItemOffset(items.length);
  
  // 测量项目高度
  const measureItem = useCallback((index, height) => {
    setItemHeights(prev => {
      if (prev.get(index) !== height) {
        const newMap = new Map(prev);
        newMap.set(index, height);
        return newMap;
      }
      return prev;
    });
  }, []);
  
  return (
    <div 
      style={{ 
        height: containerHeight, 
        overflow: 'auto' 
      }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, offsetY }) => (
          <MeasuredItem
            key={index}
            index={index}
            offsetY={offsetY}
            onMeasure={measureItem}
          >
            {renderItem(item, index)}
          </MeasuredItem>
        ))}
      </div>
    </div>
  );
}

// 测量组件
function MeasuredItem({ index, offsetY, onMeasure, children }) {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(([entry]) => {
        onMeasure(index, entry.contentRect.height);
      });
      
      resizeObserver.observe(ref.current);
      
      return () => resizeObserver.disconnect();
    }
  }, [index, onMeasure]);
  
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: offsetY,
        left: 0,
        right: 0
      }}
    >
      {children}
    </div>
  );
}
```

## 📊 性能监控与诊断

### Web Vitals 监控

```jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function setupPerformanceMonitoring() {
  // 监控核心指标
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// 自定义性能监控 Hook
function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const handleMetric = (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value
      }));
    };
    
    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }, []);
  
  return metrics;
}
```

### React 性能分析

```jsx
// React Profiler API
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) {
  console.log('Component:', id);
  console.log('Phase:', phase); // "mount" or "update"
  console.log('Actual duration:', actualDuration);
  console.log('Base duration:', baseDuration);
  
  // 发送到分析服务
  if (actualDuration > 16) { // 超过 16ms
    analytics.track('slow-render', {
      componentId: id,
      duration: actualDuration,
      phase
    });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Profiler>
  );
}
```

### 自定义性能监控

```jsx
// 渲染时间监控
function useRenderTime(componentName) {
  const renderCount = useRef(0);
  const renderTimes = useRef([]);
  
  useEffect(() => {
    renderCount.current += 1;
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimes.current.push(renderTime);
      
      // 保持最近 10 次记录
      if (renderTimes.current.length > 10) {
        renderTimes.current = renderTimes.current.slice(-10);
      }
      
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    };
  });
  
  const getAverageRenderTime = () => {
    if (renderTimes.current.length === 0) return 0;
    const sum = renderTimes.current.reduce((a, b) => a + b, 0);
    return sum / renderTimes.current.length;
  };
  
  return {
    renderCount: renderCount.current,
    getAverageRenderTime
  };
}
```

## 🎯 高级优化策略

### 1. 状态结构优化

```jsx
// ❌ 扁平状态导致过多重渲染
function App() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState(0);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  
  // 任何一个字段变化都会重渲染整个组件
}

// ✅ 分组相关状态
function App() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  
  // 或者使用多个 context 进一步分离
}
```

### 2. Context 优化

```jsx
// ❌ 单一大 Context 导致过多重渲染
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [posts, setPosts] = useState([]);
  
  const value = {
    user, setUser,
    theme, setTheme,
    posts, setPosts
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ 分离不同关注点的 Context
const UserContext = createContext();
const ThemeContext = createContext();
const PostsContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 进一步优化：分离读写
const UserStateContext = createContext();
const UserActionsContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const actions = useMemo(() => ({
    updateUser: setUser,
    clearUser: () => setUser(null)
  }), []);
  
  return (
    <UserStateContext.Provider value={user}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserStateContext.Provider>
  );
}
```

### 3. 批量更新优化

```jsx
// React 18 自动批量更新
function handleClick() {
  setCount(prev => prev + 1);
  setFlag(prev => !prev);
  // React 18 会自动批量这些更新
}

// 手动控制批量更新
import { unstable_batchedUpdates } from 'react-dom';

function handleAsyncUpdate() {
  setTimeout(() => {
    unstable_batchedUpdates(() => {
      setCount(prev => prev + 1);
      setFlag(prev => !prev);
    });
  }, 1000);
}

// 使用 useTransition 标记非紧急更新
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (newQuery) => {
    setQuery(newQuery); // 紧急更新，立即响应用户输入
    
    startTransition(() => {
      // 非紧急更新，可以被中断
      setResults(performExpensiveSearch(newQuery));
    });
  };
  
  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      {isPending ? <div>Searching...</div> : <Results data={results} />}
    </div>
  );
}
```

## 🎯 性能优化最佳实践

### 开发阶段最佳实践

1. **使用 React DevTools Profiler**
   - 识别性能瓶颈
   - 分析组件渲染频率
   - 查看 commit 阶段耗时

2. **设置性能预算**
   ```javascript
   // webpack.config.js
   module.exports = {
     performance: {
       maxAssetSize: 250000, // 250KB
       maxEntrypointSize: 250000,
       hints: 'error'
     }
   };
   ```

3. **使用 ESLint 规则**
   ```json
   {
     "rules": {
       "react-hooks/exhaustive-deps": "error",
       "react/jsx-no-bind": "error",
       "react/jsx-no-literals": "warn"
     }
   }
   ```

### 生产环境优化

1. **Tree Shaking**
   ```javascript
   // 只导入需要的部分
   import { debounce } from 'lodash/debounce'; // ✅
   import _ from 'lodash'; // ❌
   
   // 使用 ES6 模块
   export const utility1 = () => {};
   export const utility2 = () => {};
   ```

2. **资源优化**
   ```javascript
   // 图片懒加载
   function LazyImage({ src, alt }) {
     const [imageSrc, setImageSrc] = useState(null);
     const [imageRef, isIntersecting] = useIntersectionObserver({
       threshold: 0.1
     });
     
     useEffect(() => {
       if (isIntersecting) {
         setImageSrc(src);
       }
     }, [isIntersecting, src]);
     
     return (
       <img
         ref={imageRef}
         src={imageSrc}
         alt={alt}
         loading="lazy"
       />
     );
   }
   ```

3. **Service Worker 缓存**
   ```javascript
   // 缓存策略
   const CACHE_NAME = 'react-app-v1';
   const urlsToCache = [
     '/',
     '/static/js/bundle.js',
     '/static/css/main.css'
   ];
   
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then(cache => cache.addAll(urlsToCache))
     );
   });
   ```

### 性能监控和持续优化

1. **建立性能指标基线**
   ```javascript
   const performanceThresholds = {
     FCP: 1800, // ms
     LCP: 2500, // ms
     FID: 100,  // ms
     CLS: 0.1,  // score
     renderTime: 16, // ms
     bundleSize: 500 // KB
   };
   ```

2. **自动化性能测试**
   ```javascript
   // 使用 Lighthouse CI
   module.exports = {
     ci: {
       collect: {
         numberOfRuns: 3,
         settings: {
           chromeFlags: '--no-sandbox'
         }
       },
       assert: {
         assertions: {
           'categories:performance': ['error', { minScore: 0.9 }],
           'categories:accessibility': ['error', { minScore: 0.9 }]
         }
       }
     }
   };
   ```

### 性能优化检查清单

#### 🎯 渲染优化
- [ ] 使用 React.memo 包装纯组件
- [ ] 使用 useMemo 缓存昂贵计算
- [ ] 使用 useCallback 缓存函数引用
- [ ] 避免在渲染中创建对象和函数
- [ ] 正确使用 key 属性

#### 🧠 内存优化
- [ ] 清理事件监听器
- [ ] 清理定时器和间隔器
- [ ] 取消未完成的异步操作
- [ ] 避免闭包内存泄漏
- [ ] 使用 WeakMap 和 WeakSet

#### 📦 代码分割
- [ ] 路由级别代码分割
- [ ] 组件级别懒加载
- [ ] 第三方库按需导入
- [ ] 智能预加载策略

#### 🎯 虚拟化
- [ ] 大列表使用虚拟化
- [ ] 无限滚动优化
- [ ] 图片懒加载
- [ ] 内容可见性优化

#### 📊 监控诊断
- [ ] Web Vitals 监控
- [ ] React 性能分析
- [ ] 自定义性能指标
- [ ] 错误边界处理

## 🔗 相关资源

### 🎮 实战演示
- **[性能优化实践演示 →](http://localhost:3008)** - 完整的性能优化技术实战
- **[渲染优化演示 →](http://localhost:3008/render-optimization)** - React.memo, useMemo, useCallback 实战
- **[内存管理演示 →](http://localhost:3008/memory-management)** - 内存泄漏检测与优化
- **[代码分割演示 →](http://localhost:3008/code-splitting)** - 懒加载和预加载策略
- **[虚拟化演示 →](http://localhost:3008/virtualization)** - 大列表性能优化
- **[性能监控演示 →](http://localhost:3008/performance-monitoring)** - 实时性能指标监控
- **[优化对比分析 →](http://localhost:3008/comparison)** - 优化前后效果对比

### 📚 理论延伸
- [React Hooks 深度解析 →](/docs/concepts/hooks)
- [状态管理最佳实践 →](/docs/concepts/state-management)
- [React 版本演进 →](/docs/versions/)
- [组件设计模式 →](/docs/patterns/component-patterns)

### 🛠️ 工具推荐
- **React DevTools Profiler** - 组件性能分析
- **Lighthouse** - 网页性能审计
- **Web Vitals Extension** - 实时性能监控
- **Bundle Analyzer** - 包体积分析
- **React Window** - 虚拟化组件库

---

*持续学习，持续优化 - React 性能优化是一个永恒的话题* 🚀
