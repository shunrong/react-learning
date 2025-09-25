# React Hooks Playground

> 🎣 全面深入的 React Hooks 学习与实践平台

## 🎯 项目概述

React Hooks Playground 是一个专门用于学习和掌握 React Hooks 的交互式平台。包含了所有内置 Hook 的详细示例、最佳实践、性能优化技巧，以及 Hook 底层原理的深度解析。

## ✨ 特色功能

- 🎮 **交互式学习** - 每个 Hook 都有可操作的实时示例
- 📚 **理论结合实践** - 原理解释 + 代码示例 + 最佳实践
- ⚡ **性能优化** - 详细的性能对比和优化技巧
- 🔍 **调试支持** - React DevTools 集成和调试信息
- 🎨 **现代化 UI** - 响应式设计，支持深色模式
- 📖 **完整文档** - 每个概念都有详细的说明和示例

## 🗂️ 内容结构

### 📋 基础 Hooks
- **[useState](./src/examples/UseStateExample.tsx)** - 状态管理基础
  - 基本类型状态（数字、字符串、布尔值）
  - 对象状态管理（展开运算符、不可变更新）
  - 数组状态管理（添加、删除、更新操作）
  - 函数式更新（避免闭包陷阱）
  - 最佳实践和常见陷阱

- **[useEffect](./src/examples/UseEffectExample.tsx)** - 副作用处理
  - 不同依赖数组的行为（无依赖、空依赖、有依赖）
  - 网络请求和数据获取
  - 定时器管理和资源清理
  - 事件监听器的添加和移除
  - 常见陷阱和解决方案

- **[useContext](./src/examples/UseContextExample.tsx)** - 上下文管理
  - 主题管理系统（深色/浅色模式）
  - 用户状态管理（登录、权限）
  - 多组件状态共享
  - 自定义 Hook 封装
  - 性能优化策略

- **[useReducer](./src/examples/UseReducerExample.tsx)** - 复杂状态管理
  - 基础 reducer 模式
  - 复杂状态逻辑管理
  - 与 useState 的对比分析
  - TypeScript 类型安全
  - Action 设计最佳实践

### ⚡ 性能优化 Hooks
- **[useMemo](./src/examples/UseMemoExample.tsx)** - 值缓存优化
  - 昂贵计算的缓存策略
  - 大数据集的处理优化
  - 对象引用稳定性
  - 与 React.memo 配合使用
  - 性能测试和对比

- **[useCallback](./src/examples/UseCallbackExample.tsx)** - 函数缓存优化
  - 函数引用稳定性
  - 子组件渲染优化
  - 列表操作性能优化
  - 与 useMemo 的对比
  - 渲染次数可视化

### 🔧 工具类 Hooks
- **[useRef](./src/examples/UseRefExample.tsx)** - 引用和存储
  - DOM 元素引用和操作
  - 值存储（不触发渲染）
  - 定时器和资源管理
  - 与 useState 的区别
  - forwardRef 配合使用

- **[useImperativeHandle](./src/examples/UseImperativeHandleExample.tsx)** - 命令式 API
  - 自定义组件 API 暴露
  - 与 forwardRef 配合使用
  - 复杂组件控制接口
  - 第三方库集成
  - 最佳设计实践

- **[useLayoutEffect](./src/examples/UseLayoutEffectExample.tsx)** - 同步副作用
  - 与 useEffect 的执行时机对比
  - DOM 测量和布局计算
  - 防止视觉闪烁
  - 动画和过渡控制
  - 性能考虑

- **[useDebugValue](./src/examples/UseDebugValueExample.tsx)** - 调试信息
  - 自定义 Hook 调试
  - React DevTools 集成
  - 复杂状态的调试信息
  - 性能监控
  - 开发效率提升

### 🚀 高级主题
- **[自定义 Hooks](./src/examples/CustomHooksExample.tsx)** - 逻辑复用
  - useCounter, useToggle, useLocalStorage
  - useDebounce, useFetch, useInterval
  - useWindowSize, usePrevious
  - Hook 组合模式
  - 设计原则和最佳实践

- **[Hooks 原理解析](./src/examples/HooksPrinciplesExample.tsx)** - 底层机制
  - Hook 调用规则和限制
  - 简化版 Hook 实现
  - Fiber 架构原理
  - 性能优化原理
  - 设计哲学和理念

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装和运行
```bash
# 在项目根目录
cd packages/hooks-playground

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3001
```

### 或者从 monorepo 根目录运行
```bash
# 启动 hooks-playground
pnpm --filter hooks-playground dev
```

## 🎯 学习路径

### 🌱 初学者路径 (0-3个月 React 经验)
1. **[useState](./src/examples/UseStateExample.tsx)** - 理解状态管理基础
2. **[useEffect](./src/examples/UseEffectExample.tsx)** - 掌握副作用处理
3. **[useContext](./src/examples/UseContextExample.tsx)** - 学习数据共享
4. **[useRef](./src/examples/UseRefExample.tsx)** - 了解 DOM 操作

### 🌿 进阶路径 (3-12个月经验)
1. **[useReducer](./src/examples/UseReducerExample.tsx)** - 复杂状态管理
2. **[useMemo](./src/examples/UseMemoExample.tsx)** - 性能优化入门
3. **[useCallback](./src/examples/UseCallbackExample.tsx)** - 函数优化技巧
4. **[自定义 Hooks](./src/examples/CustomHooksExample.tsx)** - 逻辑复用

### 🌳 高级路径 (1年+经验)
1. **[useLayoutEffect](./src/examples/UseLayoutEffectExample.tsx)** - 高级副作用处理
2. **[useImperativeHandle](./src/examples/UseImperativeHandleExample.tsx)** - 命令式 API 设计
3. **[useDebugValue](./src/examples/UseDebugValueExample.tsx)** - 开发调试技巧
4. **[Hooks 原理](./src/examples/HooksPrinciplesExample.tsx)** - 底层实现原理

## 🛠️ 技术栈

- **React 18** - 最新的 React 版本和特性
- **TypeScript** - 完整的类型安全支持
- **Vite** - 快速的开发构建工具
- **Tailwind CSS** - 现代化的样式解决方案
- **React Router** - 客户端路由管理

## 📚 核心特色

### 1. 🎮 交互式示例
每个 Hook 都配有完整的交互式示例：
- 实时状态展示
- 可操作的控制界面
- 即时的视觉反馈
- 控制台调试输出

### 2. 📊 性能可视化
- 渲染次数计数器
- 性能对比演示
- 优化效果展示
- 内存使用监控

### 3. 🔍 深度解析
- Hook 内部实现原理
- 执行时机详细说明
- 常见陷阱和解决方案
- 最佳实践指导

### 4. 🎨 用户体验
- 响应式设计适配各种屏幕
- 深色模式支持
- 清晰的信息层次结构
- 流畅的交互动画

## 💡 学习建议

### 📖 理论学习
1. **认真阅读每个 Hook 的原理解释**
2. **理解不同 Hook 的适用场景**
3. **掌握 Hook 的调用规则和限制**
4. **学习性能优化的策略和技巧**

### 🧪 实践探索
1. **操作每个示例，观察状态变化**
2. **修改代码参数，观察不同效果**
3. **查看浏览器控制台的调试信息**
4. **使用 React DevTools 观察组件状态**

### 🔬 深入研究
1. **阅读 Hook 原理解析部分**
2. **理解 Fiber 架构的工作机制**
3. **学习性能优化的底层原理**
4. **探索自定义 Hook 的设计模式**

## 🎓 学习成果

完成所有示例学习后，你将能够：

### 🎯 基础能力
- ✅ 熟练使用所有内置 Hook
- ✅ 理解 Hook 的执行机制和规则
- ✅ 掌握状态管理的最佳实践
- ✅ 处理各种副作用场景

### ⚡ 性能优化
- ✅ 识别和避免不必要的重渲染
- ✅ 使用 memo、useMemo、useCallback 优化性能
- ✅ 理解 React 的渲染机制
- ✅ 监控和分析组件性能

### 🏗️ 架构设计
- ✅ 设计可复用的自定义 Hook
- ✅ 合理组织组件状态和逻辑
- ✅ 处理复杂的组件交互
- ✅ 集成第三方库和工具

### 🔍 调试能力
- ✅ 使用 React DevTools 调试 Hook
- ✅ 理解 Hook 的执行时机
- ✅ 解决常见的 Hook 问题
- ✅ 优化开发工作流程

## 🤝 贡献指南

欢迎贡献代码和改进建议！

### 如何贡献
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

### 贡献类型
- 🐛 修复 Bug
- ✨ 新增示例
- 📝 改进文档
- 🎨 优化 UI
- ⚡ 性能优化

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE) 文件

## 🙏 致谢

感谢 React 团队创造了如此优秀的 Hook 系统，以及整个 React 社区的贡献和分享。

---

**开始你的 React Hooks 学习之旅吧！** 🚀

每个示例都是独立的学习单元，你可以按照自己的节奏和兴趣进行探索。记住，最好的学习方式就是动手实践！
