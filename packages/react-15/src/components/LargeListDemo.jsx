import React from 'react';

class LargeListDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      listSize: 50,
      isLoading: false
    };
  }
  
  generateLargeList = () => {
    console.log('🏭 生成大列表，大小: ' + this.state.listSize);
    
    this.setState({ isLoading: true });
    
    setTimeout(() => {
      const items = [];
      for (let i = 0; i < this.state.listSize; i++) {
        items.push({
          id: Date.now() + i,
          title: '列表项 ' + (i + 1),
          value: Math.random() * 1000
        });
      }
      
      this.setState({ 
        items: items,
        isLoading: false
      });
    }, 100);
  }
  
  handleSizeChange = (e) => {
    this.setState({ listSize: parseInt(e.target.value) });
  }
  
  clearList = () => {
    this.setState({ items: [] });
  }
  
  render() {
    const items = this.state.items;
    const listSize = this.state.listSize;
    const isLoading = this.state.isLoading;
    
    return React.createElement('div', { className: 'demo-section' }, [
      React.createElement('h2', { key: 'title' }, '📊 大列表性能演示'),
      
      React.createElement('p', { key: 'description' }, 
        '测试 React 15 栈协调器处理大量组件的性能表现。'
      ),
      
      // 控制面板
      React.createElement('div', { key: 'controls', className: 'form-group' }, [
        React.createElement('label', { key: 'label', className: 'label' }, '列表大小: ' + listSize),
        React.createElement('input', {
          key: 'range',
          type: 'range',
          min: '10',
          max: '200',
          value: listSize,
          onChange: this.handleSizeChange,
          className: 'input'
        }),
        React.createElement('div', { key: 'buttons', className: 'controls' }, [
          React.createElement('button', {
            key: 'generate',
            className: 'btn btn-primary',
            onClick: this.generateLargeList,
            disabled: isLoading
          }, isLoading ? '生成中...' : '生成列表'),
          React.createElement('button', {
            key: 'clear',
            className: 'btn btn-secondary',
            onClick: this.clearList
          }, '清空')
        ])
      ]),
      
      // 列表显示
      items.length > 0 ? React.createElement('div', { key: 'list' }, [
        React.createElement('h3', { key: 'list-title' }, '📋 列表内容 (' + items.length + ' 项)'),
        React.createElement('div', { key: 'list-container', className: 'todo-list' },
          items.map(function(item) {
            return React.createElement('div', {
              key: item.id,
              className: 'todo-item'
            }, [
              React.createElement('div', { key: 'content', className: 'todo-content' }, [
                React.createElement('div', { key: 'title', className: 'todo-title' }, item.title),
                React.createElement('div', { key: 'value', className: 'todo-description' }, 
                  '值: ' + item.value.toFixed(2)
                )
              ])
            ]);
          })
        )
      ]) : null
    ]);
  }
}

export default LargeListDemo;