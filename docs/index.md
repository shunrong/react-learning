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

