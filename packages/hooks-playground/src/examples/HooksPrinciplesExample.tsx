import { useState, useEffect, useRef } from 'react';

// 简化版的 useState 实现
let currentHookIndex = 0;
let hookStates: any[] = [];

const myUseState = <T,>(initialState: T) => {
  const hookIndex = currentHookIndex++;

  // 初始化状态
  if (hookStates[hookIndex] === undefined) {
    hookStates[hookIndex] =
      typeof initialState === 'function'
        ? (initialState as Function)()
        : initialState;
  }

  const setState = (newState: T | ((prev: T) => T)) => {
    const nextState =
      typeof newState === 'function'
        ? (newState as Function)(hookStates[hookIndex])
        : newState;

    if (hookStates[hookIndex] !== nextState) {
      hookStates[hookIndex] = nextState;
      // 在真实的 React 中，这里会触发重新渲染
      console.log('状态更新，重新渲染组件');
    }
  };

  return [hookStates[hookIndex], setState];
};

// 简化版的 useEffect 实现
let effectHooks: Array<{
  deps?: any[];
  cleanup?: () => void;
}> = [];

const myUseEffect = (callback: () => void | (() => void), deps?: any[]) => {
  const hookIndex = currentHookIndex++;
  const prevEffect = effectHooks[hookIndex];

  // 检查依赖是否变化
  const depsChanged =
    !prevEffect ||
    !deps ||
    !prevEffect.deps ||
    deps.some((dep, i) => dep !== prevEffect.deps![i]);

  if (depsChanged) {
    // 清理上一个 effect
    if (prevEffect?.cleanup) {
      prevEffect.cleanup();
    }

    // 执行新的 effect
    const cleanup = callback();
    effectHooks[hookIndex] = {
      deps: deps ? [...deps] : undefined,
      cleanup: typeof cleanup === 'function' ? cleanup : undefined,
    };
  }
};

// Hook 执行规则演示组件
const HookRulesDemo = () => {
  const [count, setCount] = useState(0);
  const [showConditional, setShowConditional] = useState(false);

  // ✅ 正确：Hook 在顶层调用
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // ✅ 正确：Hook 的调用顺序始终一致
  useEffect(() => {
    console.log('Effect 1: count 变化');
  }, [count]);

  useEffect(() => {
    console.log('Effect 2: name 变化');
  }, [name]);

  // ❌ 错误示例（已注释）：条件调用 Hook
  // if (showConditional) {
  //   const [conditionalState] = useState('wrong'); // 这是错误的！
  // }

  // ❌ 错误示例（已注释）：循环中调用 Hook
  // for (let i = 0; i < 3; i++) {
  //   const [loopState] = useState(i); // 这是错误的！
  // }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        Hook 调用规则演示
      </h3>

      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <label className='label'>计数</label>
          <div className='flex space-x-2'>
            <button onClick={() => setCount(count + 1)} className='btn-primary'>
              增加: {count}
            </button>
          </div>
        </div>

        <div>
          <label className='label'>姓名</label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='input'
          />
        </div>
      </div>

      <div className='state-display'>
        Hook 调用顺序保持一致：useState → useState → useEffect → useEffect
      </div>
    </div>
  );
};

// Fiber 架构简化演示
const FiberDemo = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 模拟 Fiber 的工作单元
  const simulateWork = (taskName: string, duration: number) => {
    return new Promise<void>(resolve => {
      const startTime = performance.now();
      console.log(`🚀 开始处理: ${taskName}`);

      const work = () => {
        const elapsed = performance.now() - startTime;
        if (elapsed < duration) {
          // 模拟可中断的工作
          requestIdleCallback(() => work());
        } else {
          console.log(
            `✅ 完成处理: ${taskName} (耗时: ${elapsed.toFixed(2)}ms)`
          );
          resolve();
        }
      };

      work();
    });
  };

  const addTask = () => {
    const taskName = `任务 ${tasks.length + 1}`;
    setTasks(prev => [...prev, taskName]);
  };

  const processAllTasks = async () => {
    setIsProcessing(true);

    for (const task of tasks) {
      await simulateWork(task, 100);
    }

    setIsProcessing(false);
    console.log('🎉 所有任务处理完成');
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        Fiber 工作原理演示
      </h3>

      <div className='state-display'>
        待处理任务: {tasks.length} | 状态: {isProcessing ? '处理中' : '空闲'}
      </div>

      <div className='flex space-x-2'>
        <button onClick={addTask} className='btn-primary'>
          添加任务
        </button>
        <button
          onClick={processAllTasks}
          disabled={isProcessing || tasks.length === 0}
          className={isProcessing ? 'btn-secondary opacity-50' : 'btn-success'}
        >
          {isProcessing ? '处理中...' : '处理所有任务'}
        </button>
        <button onClick={() => setTasks([])} className='btn-secondary'>
          清空任务
        </button>
      </div>

      <div className='info-message'>
        <p className='font-semibold mb-2'>Fiber 核心概念:</p>
        <ul className='list-disc list-inside space-y-1 text-sm'>
          <li>可中断的渲染过程</li>
          <li>优先级调度机制</li>
          <li>时间切片技术</li>
          <li>增量式更新</li>
        </ul>
      </div>
    </div>
  );
};

const HooksPrinciplesExample = () => {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          Hooks 原理解析
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          深入理解 React Hooks 的实现原理、调用规则和底层机制。
        </p>
      </div>

      {/* Hook 调用规则 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Hook 调用规则</h2>
        <p className='hook-description'>
          Hook 必须遵循特定的调用规则，确保在每次渲染时保持相同的调用顺序。
        </p>

        <div className='hook-demo'>
          <HookRulesDemo />
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            Hook 规则说明
          </h3>
          <pre className='code-block'>
            {`// ✅ 正确：Hook 在函数顶层调用
function MyComponent() {
  const [count, setCount] = useState(0);     // Hook 1
  const [name, setName] = useState('');      // Hook 2
  
  useEffect(() => {
    console.log('count updated');
  }, [count]);                               // Hook 3
  
  useEffect(() => {
    console.log('name updated');  
  }, [name]);                                // Hook 4
  
  // Hook 调用顺序：1 → 2 → 3 → 4 (每次渲染都相同)
}

// ❌ 错误：条件调用 Hook
function BadComponent() {
  const [count, setCount] = useState(0);
  
  if (count > 0) {
    const [name, setName] = useState(''); // 错误！条件调用
  }
  
  // Hook 调用顺序不一致：
  // 首次渲染：1 → 2
  // 后续渲染：1 (缺少 Hook 2)
}

// ❌ 错误：循环中调用 Hook
function AnotherBadComponent() {
  for (let i = 0; i < 3; i++) {
    const [state] = useState(i); // 错误！循环调用
  }
}`}
          </pre>
        </div>
      </div>

      {/* Hook 内部实现 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Hook 内部实现原理</h2>
        <p className='hook-description'>
          简化版的 Hook 实现，帮助理解 React 内部的工作机制。
        </p>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            简化版 Hook 实现
          </h3>
          <pre className='code-block'>
            {`// React 内部维护的 Hook 链表
let currentHookIndex = 0;
let hookStates = [];

// 简化版 useState 实现
const myUseState = (initialState) => {
  const hookIndex = currentHookIndex++;
  
  // 初始化状态
  if (hookStates[hookIndex] === undefined) {
    hookStates[hookIndex] = typeof initialState === 'function' 
      ? initialState() 
      : initialState;
  }
  
  const setState = (newState) => {
    const nextState = typeof newState === 'function' 
      ? newState(hookStates[hookIndex])
      : newState;
    
    if (hookStates[hookIndex] !== nextState) {
      hookStates[hookIndex] = nextState;
      // 触发重新渲染
      scheduleUpdate();
    }
  };
  
  return [hookStates[hookIndex], setState];
};

// 简化版 useEffect 实现
let effectHooks = [];

const myUseEffect = (callback, deps) => {
  const hookIndex = currentHookIndex++;
  const prevEffect = effectHooks[hookIndex];
  
  // 检查依赖是否变化
  const depsChanged = !prevEffect || 
    !deps || 
    !prevEffect.deps || 
    deps.some((dep, i) => dep !== prevEffect.deps[i]);
  
  if (depsChanged) {
    // 清理上一个 effect
    if (prevEffect?.cleanup) {
      prevEffect.cleanup();
    }
    
    // 执行新的 effect
    const cleanup = callback();
    effectHooks[hookIndex] = {
      deps: deps ? [...deps] : undefined,
      cleanup: typeof cleanup === 'function' ? cleanup : undefined,
    };
  }
};`}
          </pre>
        </div>
      </div>

      {/* Fiber 架构演示 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Fiber 架构原理</h2>
        <p className='hook-description'>
          理解 Fiber 如何实现可中断的渲染和优先级调度。
        </p>

        <div className='hook-demo'>
          <FiberDemo />
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            Fiber 工作原理
          </h3>
          <pre className='code-block'>
            {`// Fiber 节点结构 (简化版)
interface Fiber {
  type: string | Function;           // 组件类型
  props: any;                       // 属性
  child: Fiber | null;              // 子节点
  sibling: Fiber | null;            // 兄弟节点
  return: Fiber | null;             // 父节点
  
  // Hook 相关
  memoizedState: any;               // Hook 状态
  updateQueue: any;                 // 更新队列
  
  // 调度相关
  lanes: number;                    // 优先级车道
  effectTag: number;                // 副作用标记
}

// 工作循环 (简化版)
function workLoop(deadline) {
  let shouldYield = false;
  
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  
  if (!nextUnitOfWork && wipRoot) {
    commitRoot(); // 提交阶段
  }
  
  requestIdleCallback(workLoop);
}

// Hook 链表维护
function updateFunctionComponent(fiber) {
  // 重置 Hook 索引
  currentHookIndex = 0;
  hookStates = fiber.memoizedState || [];
  
  // 执行函数组件
  const children = fiber.type(fiber.props);
  
  // 保存 Hook 状态
  fiber.memoizedState = hookStates;
  
  return children;
}`}
          </pre>
        </div>
      </div>

      {/* 性能优化原理 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Hook 性能优化原理</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              🔍 深入理解
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  useState 内部机制
                </h4>
                <ul className='space-y-1 text-gray-600 dark:text-gray-400 text-sm'>
                  <li>• Hook 链表存储状态</li>
                  <li>• Object.is 比较检测变化</li>
                  <li>• 批量更新优化</li>
                  <li>• 函数式更新避免闭包陷阱</li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  useEffect 内部机制
                </h4>
                <ul className='space-y-1 text-gray-600 dark:text-gray-400 text-sm'>
                  <li>• 依赖数组浅比较</li>
                  <li>• 副作用队列管理</li>
                  <li>• 清理函数调度</li>
                  <li>• 异步执行时机</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            性能优化技巧
          </h3>
          <pre className='code-block'>
            {`// 1. 避免在渲染过程中创建新对象
// ❌ 每次都创建新对象
const style = { color: 'red', fontSize: '16px' };

// ✅ 使用 useMemo 缓存
const style = useMemo(() => ({ 
  color: 'red', 
  fontSize: '16px' 
}), []);

// 2. 合理拆分状态
// ❌ 过度集中的状态
const [state, setState] = useState({
  user: null,
  theme: 'light',
  isLoading: false,
  data: []
});

// ✅ 按关注点分离
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('light');
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState([]);

// 3. 优化 useEffect 依赖
// ❌ 不必要的依赖
useEffect(() => {
  fetchData(userId);
}, [userId, userData]); // userData 变化不需要重新获取

// ✅ 精确的依赖
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 4. 使用 useCallback 优化子组件
const Child = memo(({ onClick }) => <button onClick={onClick} />);

const Parent = () => {
  const [count, setCount] = useState(0);
  
  // ✅ 缓存回调函数
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
};`}
          </pre>
        </div>
      </div>

      {/* Hook 设计原则 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Hook 设计原则</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              🎯 核心理念
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  函数式编程
                </h4>
                <ul className='space-y-1 text-gray-600 dark:text-gray-400 text-sm'>
                  <li>• 纯函数组件</li>
                  <li>• 不可变数据</li>
                  <li>• 函数组合</li>
                  <li>• 副作用隔离</li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  声明式设计
                </h4>
                <ul className='space-y-1 text-gray-600 dark:text-gray-400 text-sm'>
                  <li>• 描述"是什么"而非"怎么做"</li>
                  <li>• 状态驱动 UI</li>
                  <li>• 自动依赖追踪</li>
                  <li>• 响应式更新</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            React Hook 的价值
          </h3>
          <pre className='code-block'>
            {`// Hook 解决的问题

// 1. 组件间逻辑复用困难
// 之前：高阶组件、渲染属性模式
// 现在：自定义 Hook

// 2. 复杂组件难以理解
// 之前：生命周期方法中混杂不相关逻辑
// 现在：useEffect 按关注点分离

// 3. Class 组件的复杂性
// 之前：this 绑定、生命周期、state 管理
// 现在：函数组件 + Hook

// Hook 的优势
// ✅ 更好的逻辑复用
// ✅ 更清晰的关注点分离  
// ✅ 更简洁的代码
// ✅ 更好的类型推导
// ✅ 更容易测试

// Hook 的设计哲学
// 1. 组合优于继承
// 2. 函数式优于面向对象
// 3. 声明式优于命令式
// 4. 简单优于复杂`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HooksPrinciplesExample;
