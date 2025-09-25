import { useState, useEffect, useLayoutEffect, useRef } from 'react';

const UseLayoutEffectExample = () => {
  // 基础演示状态
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // DOM 引用
  const divRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // 滚动位置
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 执行时机对比
  const [effectLogs, setEffectLogs] = useState<string[]>([]);
  const [layoutEffectLogs, setLayoutEffectLogs] = useState<string[]>([]);

  // useEffect - 异步执行（在浏览器绘制之后）
  useEffect(() => {
    const timestamp = performance.now();
    const log = `useEffect 执行时间: ${timestamp.toFixed(2)}ms`;
    console.log('🔵 ' + log);
    setEffectLogs(prev => [...prev.slice(-4), log]);
  }, [count]);

  // useLayoutEffect - 同步执行（在浏览器绘制之前）
  useLayoutEffect(() => {
    const timestamp = performance.now();
    const log = `useLayoutEffect 执行时间: ${timestamp.toFixed(2)}ms`;
    console.log('🔴 ' + log);
    setLayoutEffectLogs(prev => [...prev.slice(-4), log]);
  }, [count]);

  // DOM 测量示例
  useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }
  }, [count]); // 当 count 变化时重新测量

  // 动画示例 - 防止布局闪烁
  useLayoutEffect(() => {
    if (animatedRef.current && count > 0) {
      // 在浏览器绘制前设置样式，避免闪烁
      animatedRef.current.style.transform = `translateX(${count * 10}px)`;
      animatedRef.current.style.backgroundColor = `hsl(${count * 36}, 70%, 60%)`;
    }
  }, [count]);

  // 滚动位置同步
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollPosition(scrollRef.current.scrollTop);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // 清理日志
  const clearLogs = () => {
    setEffectLogs([]);
    setLayoutEffectLogs([]);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useLayoutEffect Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useLayoutEffect 与 useEffect 类似，但它在所有 DOM
          变更之后同步调用。使用它来读取 DOM 布局并同步触发重渲染。
        </p>
      </div>

      {/* 执行时机对比 */}
      <div className='hook-example'>
        <h2 className='hook-title'>执行时机对比</h2>
        <p className='hook-description'>
          对比 useEffect 和 useLayoutEffect 的执行时机差异。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='state-display'>当前计数: {count}</div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setCount(count + 1)}
                  className='btn-primary'
                >
                  触发更新
                </button>
                <button onClick={clearLogs} className='btn-secondary'>
                  清空日志
                </button>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-3'>
                  🔴 useLayoutEffect 日志
                </h3>
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 h-40 overflow-y-auto'>
                  {layoutEffectLogs.map((log, index) => (
                    <div
                      key={index}
                      className='text-sm text-red-700 dark:text-red-300 font-mono'
                    >
                      {log}
                    </div>
                  ))}
                  {layoutEffectLogs.length === 0 && (
                    <div className='text-red-400 dark:text-red-500 text-sm'>
                      点击"触发更新"查看执行时机
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3'>
                  🔵 useEffect 日志
                </h3>
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 h-40 overflow-y-auto'>
                  {effectLogs.map((log, index) => (
                    <div
                      key={index}
                      className='text-sm text-blue-700 dark:text-blue-300 font-mono'
                    >
                      {log}
                    </div>
                  ))}
                  {effectLogs.length === 0 && (
                    <div className='text-blue-400 dark:text-blue-500 text-sm'>
                      点击"触发更新"查看执行时机
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='info-message'>
              <p className='font-semibold mb-2'>执行顺序:</p>
              <p className='text-sm'>
                1. 组件重新渲染 → 2. useLayoutEffect 执行 (同步) → 3. 浏览器绘制
                → 4. useEffect 执行 (异步)
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 执行时机对比
useLayoutEffect(() => {
  console.log('🔴 useLayoutEffect: DOM 更新后，浏览器绘制前');
  // 同步执行，会阻塞浏览器绘制
}, [count]);

useEffect(() => {
  console.log('🔵 useEffect: 浏览器绘制后');
  // 异步执行，不会阻塞浏览器绘制
}, [count]);

// 执行顺序：
// 1. 状态更新
// 2. 组件重新渲染
// 3. useLayoutEffect 执行 (同步)
// 4. 浏览器绘制
// 5. useEffect 执行 (异步)`}
          </pre>
        </div>
      </div>

      {/* DOM 测量示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>DOM 测量与布局</h2>
        <p className='hook-description'>
          使用 useLayoutEffect 进行 DOM
          测量，确保在浏览器绘制前获取准确的尺寸信息。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div
              ref={measureRef}
              className='bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 rounded-lg transition-all duration-300'
              style={{ fontSize: `${12 + count * 2}px` }}
            >
              <h3 className='font-bold mb-2'>动态内容区域</h3>
              <p>这个区域的大小会随着计数变化</p>
              <p>当前计数: {count}</p>
              <p>字体大小: {12 + count * 2}px</p>
            </div>

            <div className='state-display'>
              测量结果 - 宽度: {width.toFixed(1)}px | 高度: {height.toFixed(1)}
              px
            </div>

            <div className='grid grid-cols-3 gap-2'>
              <button
                onClick={() => setCount(count + 1)}
                className='btn-primary'
              >
                增加计数
              </button>
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className='btn-secondary'
              >
                减少计数
              </button>
              <button onClick={() => setCount(0)} className='btn-secondary'>
                重置
              </button>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// DOM 测量示例
const [width, setWidth] = useState(0);
const [height, setHeight] = useState(0);
const elementRef = useRef<HTMLDivElement>(null);

useLayoutEffect(() => {
  if (elementRef.current) {
    const rect = elementRef.current.getBoundingClientRect();
    setWidth(rect.width);
    setHeight(rect.height);
  }
}, [count]); // 当内容变化时重新测量

// 为什么使用 useLayoutEffect?
// - useEffect: 测量发生在绘制后，可能看到闪烁
// - useLayoutEffect: 测量发生在绘制前，避免视觉闪烁`}
          </pre>
        </div>
      </div>

      {/* 动画和布局示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>动画与布局控制</h2>
        <p className='hook-description'>
          使用 useLayoutEffect 控制动画和布局，防止视觉闪烁。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='relative h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden'>
              <div
                ref={animatedRef}
                className='absolute top-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300'
                style={{ transform: 'translateY(-50%)' }}
              >
                {count}
              </div>
            </div>

            <div className='info-message'>
              <p className='text-sm'>
                元素位置: {count * 10}px | 背景色: 基于计数值的 HSL 颜色
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 防止布局闪烁的动画
useLayoutEffect(() => {
  if (animatedRef.current && count > 0) {
    // 在浏览器绘制前设置样式，避免闪烁
    animatedRef.current.style.transform = \`translateX(\${count * 10}px)\`;
    animatedRef.current.style.backgroundColor = \`hsl(\${count * 36}, 70%, 60%)\`;
  }
}, [count]);

// 对比：使用 useEffect 可能会看到闪烁
useEffect(() => {
  // 这里的样式更新可能在绘制后发生，导致闪烁
  if (animatedRef.current) {
    animatedRef.current.style.transform = \`translateX(\${count * 10}px)\`;
  }
}, [count]);`}
          </pre>
        </div>
      </div>

      {/* 使用场景总结 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useLayoutEffect vs useEffect</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useLayoutEffect
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>同步执行</strong>：阻塞浏览器绘制
                </li>
                <li>
                  • <strong>DOM 操作</strong>：直接修改 DOM 样式
                </li>
                <li>
                  • <strong>测量布局</strong>：获取元素尺寸和位置
                </li>
                <li>
                  • <strong>防止闪烁</strong>：关键视觉更新
                </li>
                <li>
                  • <strong>滚动位置</strong>：同步滚动状态
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useEffect
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>异步执行</strong>：不阻塞浏览器绘制
                </li>
                <li>
                  • <strong>数据获取</strong>：API 调用和异步操作
                </li>
                <li>
                  • <strong>事件监听</strong>：添加和移除事件监听器
                </li>
                <li>
                  • <strong>订阅管理</strong>：WebSocket、定时器等
                </li>
                <li>
                  • <strong>副作用清理</strong>：清理资源和订阅
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            选择指南
          </h3>
          <pre className='code-block'>
            {`// ✅ 使用 useLayoutEffect 的场景
// 1. DOM 测量
useLayoutEffect(() => {
  const rect = elementRef.current?.getBoundingClientRect();
  setDimensions({ width: rect.width, height: rect.height });
}, [content]);

// 2. 同步 DOM 更新
useLayoutEffect(() => {
  if (shouldScrollToBottom) {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }
}, [messages]);

// 3. 防止视觉闪烁
useLayoutEffect(() => {
  elementRef.current.style.opacity = isVisible ? '1' : '0';
}, [isVisible]);

// ✅ 使用 useEffect 的场景
// 1. 数据获取
useEffect(() => {
  fetchUserData(userId).then(setUser);
}, [userId]);

// 2. 事件监听
useEffect(() => {
  const handleResize = () => setWindowSize(getWindowSize());
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// 3. 清理副作用
useEffect(() => {
  const subscription = subscribeToSomething();
  return () => subscription.unsubscribe();
}, []);

// 💡 选择原则
// - 99% 的情况使用 useEffect
// - 只有在需要同步 DOM 操作时使用 useLayoutEffect
// - 如果看到视觉闪烁，考虑改用 useLayoutEffect`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseLayoutEffectExample;
