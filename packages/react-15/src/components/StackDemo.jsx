import React from 'react';

// 深度嵌套组件演示
class DeepComponent extends React.Component {
  componentWillMount() {
    console.log('🔥 DeepComponent 层级 ' + this.props.depth + ' 即将挂载');
  }
  
  componentDidMount() {
    console.log('✅ DeepComponent 层级 ' + this.props.depth + ' 挂载完成');
  }
  
  render() {
    const depth = this.props.depth;
    const maxDepth = this.props.maxDepth;
    const value = this.props.value;
    
    // 模拟复杂计算
    let computedValue = value;
    for (let i = 0; i < 1000; i++) {
      computedValue = Math.sin(computedValue + depth) * 100;
    }
    
    return React.createElement('div', {
      style: { 
        marginLeft: (depth * 20) + 'px',
        padding: '8px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        marginBottom: '4px',
        backgroundColor: 'hsl(' + (depth * 30) + ', 70%, 95%)'
      }
    }, [
      React.createElement('div', {
        key: 'content',
        style: { fontSize: '0.9rem', color: '#4a5568' }
      }, '层级 ' + depth + ': ' + computedValue.toFixed(2)),
      
      depth < maxDepth ? React.createElement(DeepComponent, {
        key: 'child',
        depth: depth + 1,
        maxDepth: maxDepth,
        value: value + depth
      }) : null
    ]);
  }
}

class StackDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stackDepth: 5,
      stackValue: 42,
      showStack: true
    };
  }
  
  handleDepthChange = (e) => {
    const depth = parseInt(e.target.value);
    console.log('📏 更改栈深度为: ' + depth);
    this.setState({ stackDepth: depth });
  }
  
  handleValueChange = (e) => {
    const value = parseInt(e.target.value);
    console.log('🔢 更改传递值为: ' + value);
    this.setState({ stackValue: value });
  }
  
  toggleStack = () => {
    const willShow = !this.state.showStack;
    console.log('🔄 ' + (willShow ? '显示' : '隐藏') + ' 栈演示');
    this.setState({ showStack: willShow });
  }
  
  render() {
    const stackDepth = this.state.stackDepth;
    const stackValue = this.state.stackValue;
    const showStack = this.state.showStack;
    
    return React.createElement('div', { className: 'demo-section' }, [
      React.createElement('h2', { key: 'title' }, '🏗️ 栈协调器递归演示'),
      
      React.createElement('p', { key: 'description' }, 
        '演示 React 15 栈协调器的递归特性。调整栈深度观察渲染时间的变化，深度越大，同步渲染时间越长。'
      ),
      
      // 控制面板
      React.createElement('div', { key: 'controls', className: 'grid grid-3' }, [
        React.createElement('div', { key: 'depth', className: 'form-group' }, [
          React.createElement('label', { key: 'label', className: 'label' }, '栈深度: ' + stackDepth),
          React.createElement('input', {
            key: 'input',
            type: 'range',
            min: '1',
            max: '15',
            value: stackDepth,
            onChange: this.handleDepthChange,
            className: 'input'
          })
        ]),
        
        React.createElement('div', { key: 'value', className: 'form-group' }, [
          React.createElement('label', { key: 'label', className: 'label' }, '传递值: ' + stackValue),
          React.createElement('input', {
            key: 'input',
            type: 'range',
            min: '1',
            max: '100',
            value: stackValue,
            onChange: this.handleValueChange,
            className: 'input'
          })
        ]),
        
        React.createElement('div', { key: 'toggle', className: 'form-group' }, [
          React.createElement('label', { key: 'label', className: 'label' }, '显示控制'),
          React.createElement('button', {
            key: 'button',
            className: 'btn ' + (showStack ? 'btn-danger' : 'btn-primary'),
            onClick: this.toggleStack
          }, showStack ? '隐藏栈' : '显示栈')
        ])
      ]),
      
      // 性能警告
      stackDepth > 8 ? React.createElement('div', {
        key: 'warning',
        className: 'performance-warning'
      }, [
        React.createElement('h3', { key: 'title' }, '⚠️ 性能警告'),
        React.createElement('p', { key: 'content' }, 
          '栈深度 > 8 时，递归渲染可能造成明显的性能影响。'
        )
      ]) : null,
      
      // 栈演示
      React.createElement('div', { key: 'stack-demo' }, [
        React.createElement('h3', { key: 'title' }, '📚 递归栈调用演示'),
        showStack ? React.createElement('div', {
          key: 'stack-container',
          style: { 
            border: '2px solid #4299e1',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#f7fafc'
          }
        }, React.createElement(DeepComponent, {
          depth: 1,
          maxDepth: stackDepth,
          value: stackValue
        })) : null
      ])
    ]);
  }
}

export default StackDemo;