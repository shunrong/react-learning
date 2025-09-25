// 简化版的模拟数据，确保 React 15 兼容性

const categories = ['work', 'personal', 'study', 'health'];
const priorities = ['low', 'medium', 'high', 'urgent'];

const titleTemplates = [
  '完成项目报告',
  '学习新技术', 
  '锻炼身体',
  '阅读专业书籍',
  '整理代码仓库',
  '优化应用性能',
  '编写技术文档',
  '参加团队会议',
  '复习面试题目',
  '规划职业发展'
];

const descriptionTemplates = [
  '需要仔细分析需求并制定详细的实施计划',
  '通过实践和理论学习相结合的方式掌握核心概念',
  '保持良好的作息习惯，提高工作效率',
  '深入研究技术原理，提升专业技能',
  '整理和优化代码结构，提高可维护性'
];

function generateMockTodos(count) {
  if (count === undefined) count = 10;
  
  var todos = [];
  var now = Date.now();
  
  for (var i = 0; i < count; i++) {
    var todo = {
      id: now + i,
      title: titleTemplates[i % titleTemplates.length] + ' #' + (i + 1),
      description: descriptionTemplates[i % descriptionTemplates.length],
      completed: Math.random() > 0.7,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      createdAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
    
    todos.push(todo);
  }
  
  return todos;
}

export default {
  generateMockTodos: generateMockTodos
};