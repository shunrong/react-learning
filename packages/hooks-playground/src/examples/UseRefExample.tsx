import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

// 自定义输入组件 - 使用 forwardRef
const CustomInput = forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    onFocus?: () => void;
  }
>((props, ref) => {
  return <input ref={ref} {...props} className='input' />;
});

// 使用 useImperativeHandle 的组件
const FancyInput = forwardRef<
  {
    focus: () => void;
    clear: () => void;
    getValue: () => string;
  },
  { placeholder?: string }
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => {
      return value;
    },
  }));

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={props.placeholder}
      className='input'
    />
  );
});

const UseRefExample = () => {
  // DOM 引用示例
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 值存储示例
  const countRef = useRef(0);
  const previousValueRef = useRef<string>('');
  const renderCountRef = useRef(0);

  // 定时器引用
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 组件引用
  const fancyInputRef = useRef<{
    focus: () => void;
    clear: () => void;
    getValue: () => string;
  }>(null);

  // 状态
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');

  // 跟踪渲染次数
  renderCountRef.current += 1;

  // 跟踪前一个值
  useEffect(() => {
    previousValueRef.current = inputValue;
  });

  // DOM 操作函数
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const selectAllText = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  // 视频控制
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 值存储操作
  const incrementRefCount = () => {
    countRef.current += 1;
    setMessage(`Ref 计数: ${countRef.current} (不会触发重新渲染)`);
  };

  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const delayedMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage('正在准备延迟消息...');
    timeoutRef.current = setTimeout(() => {
      setMessage('延迟消息已显示！');
    }, 2000);
  };

  // 组件方法调用
  const handleFancyInputFocus = () => {
    fancyInputRef.current?.focus();
  };

  const handleFancyInputClear = () => {
    fancyInputRef.current?.clear();
  };

  const handleFancyInputGetValue = () => {
    const value = fancyInputRef.current?.getValue();
    setMessage(`FancyInput 的值: ${value}`);
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useRef Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useRef 返回一个可变的 ref 对象，可用于访问 DOM
          元素或存储任何可变值。与状态不同，修改 ref.current 不会触发重新渲染。
        </p>
      </div>

      {/* 渲染信息 */}
      <div className='info-message'>
        <strong>当前渲染次数:</strong> {renderCountRef.current} |
        <strong> Ref 计数:</strong> {countRef.current} |
        <strong> 前一个输入值:</strong> {previousValueRef.current || '(无)'}
      </div>

      {/* DOM 引用示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>DOM 元素引用</h2>
        <p className='hook-description'>
          使用 useRef 获取 DOM 元素的引用，进行直接的 DOM 操作。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 输入框操作 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                输入框控制
              </h3>
              <input
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='这是一个受控输入框'
                className='input'
              />
              <div className='flex space-x-2'>
                <button onClick={focusInput} className='btn-primary'>
                  聚焦输入框
                </button>
                <CustomInput ref={inputRef} placeholder='自定义输入框' />
              </div>
            </div>

            {/* 文本域操作 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                文本域控制
              </h3>
              <textarea
                ref={textareaRef}
                rows={4}
                placeholder='输入一些文本...'
                className='input resize-none'
                defaultValue='这是一段示例文本。\n可以进行全选和滚动操作。\n继续添加更多内容...\n测试滚动功能。'
              />
              <div className='flex space-x-2'>
                <button onClick={selectAllText} className='btn-primary'>
                  全选文本
                </button>
                <button onClick={scrollToBottom} className='btn-secondary'>
                  滚动到底部
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 1. 创建 ref
const inputRef = useRef<HTMLInputElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);

// 2. 绑定到 DOM 元素
<input ref={inputRef} />
<textarea ref={textareaRef} />

// 3. 操作 DOM 元素
const focusInput = () => {
  inputRef.current?.focus();
};

const selectAllText = () => {
  textareaRef.current?.select();
};

// 4. 与 forwardRef 配合使用
const CustomInput = forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} {...props} className='input' />;
});`}
          </pre>
        </div>
      </div>

      {/* 值存储示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>值存储与定时器管理</h2>
        <p className='hook-description'>
          useRef 可以存储任何可变值，不会触发重新渲染。常用于存储定时器
          ID、前一个值等。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 值存储测试 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                值存储测试
              </h3>
              <div className='state-display'>
                State 计数 (触发渲染): {seconds} | Ref 计数 (不触发渲染):{' '}
                {countRef.current}
              </div>
              <div className='flex space-x-2'>
                <button onClick={incrementRefCount} className='btn-primary'>
                  增加 Ref 计数
                </button>
                <button
                  onClick={() => setSeconds(seconds + 1)}
                  className='btn-secondary'
                >
                  增加 State 计数
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                观察两种计数方式的差异：Ref 不会触发重新渲染
              </p>
            </div>

            {/* 定时器管理 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                定时器管理
              </h3>
              <div className='state-display'>
                计时器: {Math.floor(seconds / 60)}:
                {(seconds % 60).toString().padStart(2, '0')}
              </div>
              <div className='flex space-x-2'>
                <button onClick={startTimer} className='btn-success'>
                  开始计时
                </button>
                <button onClick={stopTimer} className='btn-warning'>
                  停止计时
                </button>
                <button onClick={() => setSeconds(0)} className='btn-secondary'>
                  重置
                </button>
              </div>
            </div>

            {/* 延迟操作 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                延迟操作
              </h3>
              <button onClick={delayedMessage} className='btn-primary'>
                显示延迟消息 (2秒后)
              </button>
              {message && <div className='success-message'>{message}</div>}
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 值存储 - 不触发重新渲染
const countRef = useRef(0);
const previousValueRef = useRef('');

// 定时器引用
const intervalRef = useRef<NodeJS.Timeout | null>(null);

// 增加 ref 值不会触发渲染
const incrementRefCount = () => {
  countRef.current += 1; // 组件不会重新渲染
};

// 定时器管理
const startTimer = () => {
  intervalRef.current = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);
};

const stopTimer = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

// 跟踪前一个值
useEffect(() => {
  previousValueRef.current = inputValue;
});`}
          </pre>
        </div>
      </div>

      {/* 组件引用示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>组件引用与命令式 API</h2>
        <p className='hook-description'>
          使用 useRef 配合 useImperativeHandle 创建命令式的组件 API。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              自定义组件控制
            </h3>

            <FancyInput
              ref={fancyInputRef}
              placeholder='这是一个带命令式 API 的输入框'
            />

            <div className='flex space-x-2'>
              <button onClick={handleFancyInputFocus} className='btn-primary'>
                聚焦
              </button>
              <button onClick={handleFancyInputClear} className='btn-warning'>
                清空
              </button>
              <button
                onClick={handleFancyInputGetValue}
                className='btn-secondary'
              >
                获取值
              </button>
            </div>

            {message && <div className='info-message'>{message}</div>}
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 创建带命令式 API 的组件
const FancyInput = forwardRef<{
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}, { placeholder?: string }>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  
  // 暴露命令式方法
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => value
  }));
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

// 使用组件引用
const Parent = () => {
  const fancyInputRef = useRef(null);
  
  const handleFocus = () => {
    fancyInputRef.current?.focus();
  };
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={handleFocus}>聚焦输入框</button>
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* useRef vs useState 对比 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useRef vs useState</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useRef
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>不触发渲染</strong>：修改 current 值不会重新渲染
                </li>
                <li>
                  • <strong>可变对象</strong>：ref.current 可以直接修改
                </li>
                <li>
                  • <strong>持久存储</strong>：值在渲染间保持
                </li>
                <li>
                  • <strong>同步访问</strong>：立即获取最新值
                </li>
                <li>
                  • <strong>DOM 引用</strong>：访问实际 DOM 元素
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useState
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>触发渲染</strong>：状态更新会重新渲染组件
                </li>
                <li>
                  • <strong>不可变</strong>：需要通过 setter 更新
                </li>
                <li>
                  • <strong>异步更新</strong>：状态更新可能被批处理
                </li>
                <li>
                  • <strong>响应式</strong>：UI 会响应状态变化
                </li>
                <li>
                  • <strong>函数式</strong>：支持函数式更新
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            使用场景对比
          </h3>
          <pre className='code-block'>
            {`// useRef 适用场景
const ref = useRef(0);

// ✅ DOM 引用
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />

// ✅ 存储定时器 ID
const timerId = useRef<NodeJS.Timeout | null>(null);
timerId.current = setTimeout(...);

// ✅ 跟踪前一个值
const prevValue = useRef(props.value);
useEffect(() => {
  prevValue.current = props.value;
});

// ✅ 存储实例变量
const isUnmounted = useRef(false);

// useState 适用场景
const [count, setCount] = useState(0);

// ✅ UI 状态
const [isLoading, setIsLoading] = useState(false);

// ✅ 表单数据
const [formData, setFormData] = useState({});

// ✅ 需要触发重新渲染的值
const [currentUser, setCurrentUser] = useState(null);`}
          </pre>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              💡 核心原则
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
              <li>
                • <strong>DOM 操作</strong>：优先使用 React
                的声明式方式，必要时才用 ref
              </li>
              <li>
                • <strong>值存储</strong>
                ：存储不影响渲染的值（定时器ID、前一个值等）
              </li>
              <li>
                • <strong>避免滥用</strong>：不要用 ref 存储应该是状态的值
              </li>
              <li>
                • <strong>类型安全</strong>：使用 TypeScript 为 ref 声明正确类型
              </li>
              <li>
                • <strong>清理资源</strong>：在组件卸载时清理定时器等资源
              </li>
            </ul>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            最佳实践代码
          </h3>
          <pre className='code-block'>
            {`// ✅ 好的用法
const MyComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const prevValue = useRef(props.value);
  
  // DOM 操作
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  // 定时器管理
  useEffect(() => {
    timerId.current = setTimeout(() => {
      // 延迟操作
    }, 1000);
    
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);
  
  // 跟踪前一个值
  useEffect(() => {
    prevValue.current = props.value;
  });
  
  return <input ref={inputRef} />;
};

// ❌ 不好的用法
const BadExample = () => {
  const countRef = useRef(0);
  
  // 错误：应该使用 useState 的场景
  const increment = () => {
    countRef.current += 1; // UI 不会更新！
  };
  
  return (
    <div>
      <p>{countRef.current}</p> {/* 不会更新 */}
      <button onClick={increment}>增加</button>
    </div>
  );
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseRefExample;
