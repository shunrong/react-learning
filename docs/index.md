---
layout: home

hero:
  name: React 生态学习指南
  text: 全面深入的 React 生态系统学习与实践
  tagline: 从基础架构到高级特性，从源码解析到最佳实践
  image:
    src: /logo.svg
    alt: React Learning Guide
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/getting-started
    - theme: alt
      text: 查看项目
      link: /guide/project-structure

features:
  - icon: ⚛️
    title: React 核心架构
    details: 深入理解 React 15 栈架构到 React 18 Fiber 架构的演进历程，掌握核心原理
  
  - icon: 🔧
    title: Hooks 系统
    details: 全面掌握 React Hooks 的使用方法、实现原理和最佳实践，包含自定义 Hook 开发
  
  - icon: 🏗️
    title: 状态管理
    details: 对比学习 Redux、Zustand、Jotai 等状态管理方案，理解各自的适用场景
  
  - icon: 🛣️
    title: 路由与导航
    details: React Router 演进历程，客户端路由实现原理，以及现代路由解决方案
  
  - icon: 🎨
    title: 样式解决方案
    details: CSS-in-JS、CSS Modules、Tailwind 等样式方案的对比与选择指南
  
  - icon: 📦
    title: 组件库开发
    details: 从零搭建组件库，包括设计系统、构建流程、文档生成和发布策略
  
  - icon: 🚀
    title: 性能优化
    details: React 应用性能优化的完整指南，从代码分割到渲染优化的全方位实践
  
  - icon: 🌐
    title: SSR/SSG
    details: 服务端渲染和静态站点生成的原理与实践，Next.js 和 Remix 框架对比
  
  - icon: 🧪
    title: 测试策略
    details: 完整的 React 应用测试方案，从单元测试到 E2E 测试的最佳实践
  
  - icon: 📡
    title: 数据获取
    details: 现代数据获取方案，React Query、SWR 和 Suspense 模式的深度实践
  
  - icon: 🏛️
    title: 微前端架构
    details: Module Federation 和 Single-SPA 等微前端解决方案的原理与实践
  
  - icon: 🔮
    title: 未来特性
    details: React 19、Server Components、React Compiler 等前沿特性的探索与实践
---

## 🎯 学习目标

这个项目旨在为 React 开发者提供一个全面、深入的学习路径，涵盖：

- **理论基础**：React 核心概念和架构原理的深度解析
- **实践项目**：真实可运行的代码示例和最佳实践演示  
- **源码解读**：关键模块的源码级别分析和理解
- **生态系统**：React 生态圈主要工具和库的对比学习
- **现代开发**：最新特性和发展趋势的前瞻性探索

## 📚 内容结构

### 🏗️ 核心架构
- React 15 栈协调算法
- React 16+ Fiber 架构
- 虚拟 DOM 和 Diff 算法
- 事件系统设计

### 🎣 Hooks 系统  
- 内置 Hooks 深度实践
- 自定义 Hooks 开发模式
- Hooks 实现原理解析
- 函数组件 vs 类组件

### 🗃️ 状态管理
- Context + useReducer 模式
- Redux 生态系统
- Zustand 轻量化方案  
- Jotai 原子化状态
- 各方案对比与选择

### 🧭 路由系统
- React Router 演进历程
- 客户端路由实现原理
- 嵌套路由和动态路由
- 路由守卫和权限控制

### 🎨 样式方案
- CSS-in-JS 方案对比
- CSS Modules 模块化
- Styled Components 实践
- Tailwind CSS 工具优先
- 主题系统设计

### 📦 组件库
- 设计系统构建
- 组件 API 设计
- 构建和打包流程
- 文档和 Storybook
- 测试和发布策略

### ⚡ 性能优化
- 渲染性能优化
- 代码分割策略
- 内存泄漏防范
- 打包体积优化
- 监控和分析工具

### 🌐 服务端渲染
- SSR 原理和实现
- Next.js 全栈框架
- Remix 现代方案
- SSG 静态生成
- Hydration 过程
- SEO 和首屏优化

### 🧪 测试策略
- Jest + Testing Library
- 组件测试最佳实践
- E2E 测试自动化
- 性能测试方法
- 测试覆盖率优化

### 📡 数据获取
- Fetch API 和 Axios
- React Query 缓存方案
- SWR 数据同步
- GraphQL + Apollo
- Suspense 数据模式

### 🏛️ 微前端
- Module Federation 实践
- Single-SPA 框架
- 微应用通信机制
- 独立部署策略
- 共享依赖管理

### 🔮 未来发展
- React 19 新特性预览
- Server Components 探索
- React Compiler 原理
- 并发渲染优化
- 社区发展趋势

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd react-learning
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动文档站点**
   ```bash
   pnpm docs:dev
   ```

4. **运行示例项目**
   ```bash
   # 选择感兴趣的包运行
   pnpm --filter hooks-playground dev
   pnpm --filter state-management dev
   ```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来完善这个学习资源！

- 报告错误或提出改进建议
- 补充遗漏的知识点
- 优化代码示例和文档
- 分享你的学习心得

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件
