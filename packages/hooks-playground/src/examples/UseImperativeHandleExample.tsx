import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// 1. 简单的输入框组件
const FocusableInput = forwardRef<
  { focus: () => void; clear: () => void },
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

// 2. 复杂的媒体播放器组件
const MediaPlayer = forwardRef<
  {
    play: () => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    getCurrentTime: () => number;
  },
  { src: string }
>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  useImperativeHandle(ref, () => ({
    play: () => {
      videoRef.current?.play();
      setIsPlaying(true);
    },
    pause: () => {
      videoRef.current?.pause();
      setIsPlaying(false);
    },
    stop: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    },
    setVolume: (vol: number) => {
      if (videoRef.current) {
        videoRef.current.volume = vol;
        setVolumeState(vol);
      }
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0;
    },
  }));

  return (
    <div className='bg-black rounded-lg overflow-hidden'>
      <video
        ref={videoRef}
        src={props.src}
        width='100%'
        height='200'
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className='w-full'
      />
      <div className='p-3 bg-gray-900 text-white'>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>
            状态: {isPlaying ? '播放中' : '暂停'} | 音量:{' '}
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
});

// 3. 计数器组件 - 完全控制的 API
const AdvancedCounter = forwardRef<
  {
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    reset: () => void;
    setValue: (value: number) => void;
    getValue: () => number;
  },
  { initialValue?: number; max?: number; min?: number }
>(({ initialValue = 0, max = 100, min = 0 }, ref) => {
  const [count, setCount] = useState(initialValue);

  useImperativeHandle(ref, () => ({
    increment: (step = 1) => {
      setCount(prev => Math.min(max, prev + step));
    },
    decrement: (step = 1) => {
      setCount(prev => Math.max(min, prev - step));
    },
    reset: () => {
      setCount(initialValue);
    },
    setValue: (value: number) => {
      setCount(Math.max(min, Math.min(max, value)));
    },
    getValue: () => count,
  }));

  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
      <div className='text-center'>
        <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
          {count}
        </div>
        <div className='text-sm text-blue-700 dark:text-blue-300'>
          范围: {min} - {max}
        </div>
        <div className='w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-3'>
          <div
            className='bg-blue-500 h-2 rounded-full transition-all duration-300'
            style={{ width: `${((count - min) / (max - min)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});

const UseImperativeHandleExample = () => {
  // 组件引用
  const inputRef = useRef<{ focus: () => void; clear: () => void }>(null);
  const playerRef = useRef<{
    play: () => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    getCurrentTime: () => number;
  }>(null);
  const counterRef = useRef<{
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    reset: () => void;
    setValue: (value: number) => void;
    getValue: () => number;
  }>(null);

  const [message, setMessage] = useState('');

  // 输入框控制
  const handleFocusInput = () => {
    inputRef.current?.focus();
    setMessage('输入框已聚焦');
  };

  const handleClearInput = () => {
    inputRef.current?.clear();
    setMessage('输入框已清空');
  };

  // 媒体播放器控制
  const handlePlay = () => {
    playerRef.current?.play();
    setMessage('开始播放');
  };

  const handlePause = () => {
    playerRef.current?.pause();
    setMessage('暂停播放');
  };

  const handleStop = () => {
    playerRef.current?.stop();
    setMessage('停止播放');
  };

  const handleVolumeChange = (volume: number) => {
    playerRef.current?.setVolume(volume);
    setMessage(`音量设置为 ${Math.round(volume * 100)}%`);
  };

  const handleGetCurrentTime = () => {
    const time = playerRef.current?.getCurrentTime() || 0;
    setMessage(`当前播放时间: ${time.toFixed(2)}秒`);
  };

  // 计数器控制
  const handleCounterIncrement = () => {
    counterRef.current?.increment(5);
    setMessage('计数器增加 5');
  };

  const handleCounterDecrement = () => {
    counterRef.current?.decrement(3);
    setMessage('计数器减少 3');
  };

  const handleCounterReset = () => {
    counterRef.current?.reset();
    setMessage('计数器已重置');
  };

  const handleGetCounterValue = () => {
    const value = counterRef.current?.getValue() || 0;
    setMessage(`当前计数器值: ${value}`);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useImperativeHandle Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useImperativeHandle 允许你在使用 ref
          时自定义暴露给父组件的实例值。它与 forwardRef
          一起使用，用于创建命令式的组件 API。
        </p>
      </div>

      {/* 操作消息 */}
      {message && (
        <div className='success-message'>
          <strong>操作结果:</strong> {message}
        </div>
      )}

      {/* 输入框示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>自定义输入框控制</h2>
        <p className='hook-description'>
          创建一个可以通过命令式 API 控制的输入框组件。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <FocusableInput ref={inputRef} placeholder='可控制的输入框' />

            <div className='flex space-x-2'>
              <button onClick={handleFocusInput} className='btn-primary'>
                聚焦输入框
              </button>
              <button onClick={handleClearInput} className='btn-warning'>
                清空内容
              </button>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 自定义输入框组件
const FocusableInput = forwardRef<
  { focus: () => void; clear: () => void },
  { placeholder?: string }
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  
  // 暴露自定义方法给父组件
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    }
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

// 父组件使用
const Parent = () => {
  const inputRef = useRef(null);
  
  return (
    <div>
      <FocusableInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>
        聚焦
      </button>
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* 高级计数器示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>高级计数器控制</h2>
        <p className='hook-description'>
          创建一个功能完整的计数器组件，支持范围限制和多种操作。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <AdvancedCounter
              ref={counterRef}
              initialValue={50}
              min={0}
              max={100}
            />

            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              <button onClick={handleCounterIncrement} className='btn-success'>
                +5
              </button>
              <button onClick={handleCounterDecrement} className='btn-warning'>
                -3
              </button>
              <button onClick={handleCounterReset} className='btn-secondary'>
                重置
              </button>
              <button onClick={handleGetCounterValue} className='btn-primary'>
                获取值
              </button>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 高级计数器组件
const AdvancedCounter = forwardRef<
  {
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    reset: () => void;
    setValue: (value: number) => void;
    getValue: () => number;
  },
  { initialValue?: number; max?: number; min?: number }
>(({ initialValue = 0, max = 100, min = 0 }, ref) => {
  const [count, setCount] = useState(initialValue);
  
  useImperativeHandle(ref, () => ({
    increment: (step = 1) => {
      setCount(prev => Math.min(max, prev + step));
    },
    decrement: (step = 1) => {
      setCount(prev => Math.max(min, prev - step));
    },
    reset: () => setCount(initialValue),
    setValue: (value: number) => {
      setCount(Math.max(min, Math.min(max, value)));
    },
    getValue: () => count
  }));
  
  return (
    <div className='counter-display'>
      <div className='text-3xl font-bold'>{count}</div>
      <div className='progress-bar' style={{
        width: \`\${((count - min) / (max - min)) * 100}%\`
      }} />
    </div>
  );
});`}
          </pre>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 适用场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 需要暴露 DOM 方法给父组件</li>
                <li>• 封装复杂的组件行为</li>
                <li>• 第三方库集成</li>
                <li>• 命令式操作需求</li>
                <li>• 组件库开发</li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ⚠️ 注意事项
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 优先使用声明式 props</li>
                <li>• 避免过度使用命令式 API</li>
                <li>• 必须与 forwardRef 配合使用</li>
                <li>• 不要在渲染过程中调用暴露的方法</li>
                <li>• 考虑组件的可维护性</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            设计原则
          </h3>
          <pre className='code-block'>
            {`// ✅ 好的设计 - 暴露必要的控制方法
const CustomComponent = forwardRef((props, ref) => {
  const elementRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    // 暴露清晰、有用的方法
    focus: () => elementRef.current?.focus(),
    clear: () => {/* 清空逻辑 */},
    validate: () => {/* 验证逻辑 */},
    getValue: () => {/* 获取值 */}
  }));
  
  return <input ref={elementRef} {...props} />;
});

// ❌ 不好的设计 - 暴露内部实现
const BadComponent = forwardRef((props, ref) => {
  const [state, setState] = useState(null);
  
  useImperativeHandle(ref, () => ({
    // 不要直接暴露内部状态
    state,
    setState,
    // 不要暴露过多细节
    internalMethod1: () => {},
    internalMethod2: () => {},
    // ...
  }));
});

// 使用原则
// 1. 声明式优于命令式
// 2. 最小化暴露的 API
// 3. 提供清晰的方法名称
// 4. 处理边界情况
// 5. 保持向后兼容性`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseImperativeHandleExample;
