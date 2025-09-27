import React, { useState, useTransition, useDeferredValue, useMemo, Suspense } from 'react';

// 模拟重搜索组件
const HeavySearchResults = ({ query }) => {
  const deferredQuery = useDeferredValue(query);
  
  const searchResults = useMemo(() => {
    if (!deferredQuery) return [];
    
    console.log(`🔍 执行搜索: "${deferredQuery}"`);
    
    // 模拟复杂的搜索计算
    const results = [];
    const startTime = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      if (Math.random() > 0.7) { // 30% 匹配率
        results.push({
          id: i,
          title: `搜索结果 ${i} - ${deferredQuery}`,
          description: `与 "${deferredQuery}" 相关的内容描述 ${i}`,
          relevance: Math.random(),
          category: ['文档', '代码', '视频', '教程'][i % 4]
        });
      }
    }
    
    const duration = performance.now() - startTime;
    console.log(`⏱️ 搜索计算完成，耗时: ${duration.toFixed(2)}ms`);
    
    return results.slice(0, 20); // 只返回前20个结果
  }, [deferredQuery]);
  
  const isStale = query !== deferredQuery;
  
  return (
    <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      <h4>🔍 搜索结果 ({searchResults.length} 项)</h4>
      {isStale && (
        <div style={{ 
          color: '#f6ad55', 
          fontSize: '0.9rem', 
          marginBottom: '1rem' 
        }}>
          ⏳ 正在更新搜索结果...
        </div>
      )}
      
      <div style={{ 
        maxHeight: '300px', 
        overflow: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        {searchResults.map(result => (
          <div key={result.id} style={{
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {result.title}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#718096' }}>
              {result.description}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#a0aec0',
              marginTop: '0.25rem'
            }}>
              分类: {result.category} | 相关度: {(result.relevance * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 高优先级计数器
const HighPriorityCounter = () => {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    // 🚀 高优先级更新 - 立即响应
    React.flushSync(() => {
      setCount(c => c + 1);
    });
    console.log('⚡ 高优先级计数器更新 (flushSync)');
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #68d391'
    }}>
      <h4>⚡ 高优先级计数器</h4>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#22543d',
        margin: '1rem 0'
      }}>
        {count}
      </div>
      <button 
        className="btn btn-success"
        onClick={handleIncrement}
      >
        🚀 立即更新 (flushSync)
      </button>
      <p style={{ fontSize: '0.8rem', color: '#2f855a', marginTop: '0.5rem' }}>
        使用 flushSync，确保立即响应用户交互
      </p>
    </div>
  );
};

// 低优先级数据展示
const LowPriorityData = ({ data }) => {
  console.log('📊 LowPriorityData 重新渲染');
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #f6ad55'
    }}>
      <h4>📊 低优先级数据处理</h4>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '0.5rem',
        margin: '1rem 0'
      }}>
        {data.map((item, index) => (
          <div 
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '0.5rem',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            {item.toFixed(2)}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: '#c05621' }}>
        这个组件的更新可以被用户交互中断
      </p>
    </div>
  );
};

const ConcurrentDemo = () => {
  const [userInput, setUserInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [heavyData, setHeavyData] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // 🚀 用户输入 - 最高优先级，立即更新
    setUserInput(value);
    
    // ⏰ 搜索查询 - 低优先级，可以被中断
    startTransition(() => {
      setSearchQuery(value);
    });
    
    console.log(`📝 用户输入: "${value}" (高优先级)`);
  };
  
  const generateHeavyData = () => {
    console.log('🏭 开始生成大量数据');
    
    // ⏰ 数据生成 - 低优先级，不阻塞用户交互
    startTransition(() => {
      const data = Array.from({ length: 100 }, () => Math.random() * 1000);
      setHeavyData(data);
      console.log('📊 大量数据生成完成');
    });
  };
  
  const clearData = () => {
    setHeavyData([]);
    setSearchQuery('');
    setUserInput('');
  };
  
  return (
    <div className="demo-section">
      <h2>🚀 并发特性演示</h2>
      <p>
        体验 React 18 的并发特性：startTransition 和 useDeferredValue。
        用户输入保持即时响应，而复杂计算在后台非阻塞执行。
      </p>
      
      {/* 并发特性说明 */}
      <div className="concurrent-demo">
        <h4>🎯 并发特性工作原理</h4>
        <ul style={{ paddingLeft: '1.5rem', color: '#c05621' }}>
          <li><strong>用户输入</strong>: 最高优先级，立即更新显示</li>
          <li><strong>搜索计算</strong>: 低优先级，可被用户交互中断</li>
          <li><strong>数据处理</strong>: 后台执行，不影响界面响应</li>
          <li><strong>视觉反馈</strong>: pending 状态提供用户反馈</li>
        </ul>
      </div>
      
      {/* 交互控制 */}
      <div className="grid grid-2">
        <div>
          <h3>📝 实时输入测试</h3>
          <div className="form-group">
            <label className="label">
              用户输入 (高优先级) {isPending && '⏳'}
            </label>
            <input
              type="text"
              className="input"
              value={userInput}
              onChange={handleInputChange}
              placeholder="输入内容观察响应性..."
            />
          </div>
          
          <div style={{
            background: '#e6fffa',
            border: '1px solid #81e6d9',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <div><strong>实时显示:</strong> "{userInput}"</div>
            <div><strong>搜索查询:</strong> "{searchQuery}"</div>
            <div><strong>处理状态:</strong> {isPending ? '🔄 计算中' : '✅ 完成'}</div>
          </div>
        </div>
        
        <div>
          <h3>📊 低优先级数据操作</h3>
          <div className="controls">
            <button 
              className="btn btn-primary"
              onClick={generateHeavyData}
            >
              🏭 生成大量数据
            </button>
            <button 
              className="btn btn-secondary"
              onClick={clearData}
            >
              🧹 清空数据
            </button>
          </div>
          
          {isPending && (
            <div style={{
              background: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
              color: '#c53030'
            }}>
              🔄 后台处理中... (尝试在输入框中输入，观察响应性)
            </div>
          )}
        </div>
      </div>
      
      {/* 搜索结果 */}
      {searchQuery && (
        <div style={{ marginTop: '2rem' }}>
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
              🔍 正在搜索...
            </div>
          }>
            <HeavySearchResults query={searchQuery} />
          </Suspense>
        </div>
      )}
      
      {/* 数据展示 */}
      {heavyData.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <LowPriorityData data={heavyData} />
        </div>
      )}
      
      {/* 并发特性说明 */}
      <div style={{
        background: '#e6fffa',
        border: '1px solid #81e6d9',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#234e52' }}>🎯 React 18 并发特性优势</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>startTransition</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>标记非紧急更新</li>
              <li>可以被用户交互中断</li>
              <li>保持界面响应性</li>
              <li>提供 pending 状态</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>useDeferredValue</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>延迟更新衍生值</li>
              <li>减少重复计算</li>
              <li>智能批量处理</li>
              <li>自动优化性能</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>时间切片</h4>
            <ul style={{ color: '#285e61', fontSize: '0.9rem', paddingLeft: '1rem' }}>
              <li>工作单元可中断</li>
              <li>保持 60fps 流畅度</li>
              <li>优先处理用户交互</li>
              <li>后台处理复杂任务</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentDemo;
