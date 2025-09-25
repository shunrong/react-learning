# 项目结构

了解 React 生态学习项目的组织结构，帮助你更好地导航和使用各种学习资源。

## 🗂️ 整体架构

```
react-learning/
├── 📚 docs/                    # VitePress 文档站点
├── 📦 packages/                # 实践项目包
├── 🛠️ tools/                   # 共享工具配置
├── 📝 README.md               # 项目说明
├── 📋 PROJECT_PLAN.md         # 项目实施计划
└── ⚙️ 配置文件                 # TypeScript, ESLint等
```

## 📚 文档站点结构

### 导航组织
文档按照学习路径和主题进行组织：

```
docs/
├── guide/                  # 学习指南
│   ├── index.md           # 学习指南总览
│   ├── getting-started.md # 快速开始
│   └── project-structure.md # 项目结构说明
├── versions/               # React 版本演进
│   ├── index.md           # 版本总览
│   ├── react-15.md        # React 15 详解
│   ├── react-16.md        # React 16 详解  
│   └── comparison.md      # 架构对比
├── concepts/               # 核心概念
│   ├── index.md           # 概念总览
│   ├── hooks.md           # Hooks 系统
│   ├── jsx-vdom.md        # JSX 与虚拟 DOM
│   ├── components.md      # 组件系统
│   ├── state-management.md # 状态管理
│   └── performance.md     # 性能优化
└── ...                    # 其他主题文档
```

### 内容分类

#### 🎯 **按学习路径分类**
- **guide/** - 新手入门和学习指导
- **concepts/** - 核心概念和原理解析  
- **patterns/** - 设计模式和最佳实践
- **source-analysis/** - 源码深度分析

#### 🛠️ **按技术主题分类**
- **versions/** - React 版本和架构演进
- **ssr/** - 服务端渲染技术
- **testing/** - 测试策略和工具
- **micro-fe/** - 微前端架构

## 📦 实践项目结构

### packages/ 目录组织

每个 package 都是一个独立的学习项目：

```
packages/
├── hooks-playground/       # ✅ Hooks 深度实践
│   ├── src/
│   │   ├── examples/      # 10个 Hook 示例
│   │   ├── components/    # 通用组件
│   │   └── main.tsx       # 应用入口
│   ├── README.md          # 项目说明
│   └── package.json       # 依赖配置
├── react-15-demo/         # 📋 React 15 演示 (进行中)
├── react-16-fiber/        # 📋 Fiber 架构对比 (待开始)
├── state-management/      # 📋 状态管理方案
└── ...                    # 其他专题项目
```

### 项目标准结构

每个 package 遵循统一的结构规范：

```
package-name/
├── src/
│   ├── components/        # 可复用组件
│   ├── examples/          # 示例和演示
│   ├── hooks/            # 自定义 Hook
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 类型
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 样式文件
├── public/               # 静态资源
├── README.md             # 项目文档
├── package.json          # 依赖和脚本
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # 构建配置
└── tailwind.config.js    # 样式配置
```

## 🛠️ 开发环境配置

### 共享配置

项目使用统一的开发工具配置：

```
根目录配置文件:
├── tsconfig.json         # TypeScript 根配置
├── .eslintrc.cjs        # ESLint 代码规范
├── .prettierrc          # Prettier 代码格式化
├── .gitignore           # Git 忽略规则
└── pnpm-workspace.yaml  # pnpm 工作空间配置
```

### 依赖管理

使用 pnpm workspace 进行依赖管理：

- **共享依赖** - React、TypeScript 等核心依赖在根目录
- **包独立性** - 每个包可以有自己的特殊依赖
- **版本统一** - 确保整个项目的依赖版本一致
- **构建优化** - 依赖提升和缓存优化

## 🚀 使用指南

### 启动文档站点

```bash
# 启动文档开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建结果
pnpm docs:serve
```

### 运行实践项目

```bash
# 运行特定项目
pnpm --filter hooks-playground dev
pnpm --filter react-15-demo dev

# 运行所有项目
pnpm dev

# 构建所有项目
pnpm build
```

### 开发工作流

```bash
# 安装依赖
pnpm install

# 代码质量检查
pnpm lint
pnpm format
pnpm type-check

# 清理构建产物
pnpm clean
```

## 📖 学习路径导航

### 推荐学习顺序

#### 🌱 初学者路径
1. **[快速开始](./getting-started.md)** - 环境搭建和项目运行
2. **[Hooks Playground](../../packages/hooks-playground/)** - 从基础 Hook 开始学习
3. **[核心概念](../concepts/)** - 理解 React 基本原理
4. **[版本演进](../versions/)** - 了解 React 的发展历程

#### 🌿 进阶路径  
1. **[架构对比](../versions/comparison.md)** - 深入理解设计演进
2. **[状态管理](../../packages/state-management/)** - 掌握状态管理方案
3. **[性能优化](../concepts/performance.md)** - 学习优化技巧
4. **[最佳实践](../patterns/)** - 应用设计模式

#### 🌳 专家路径
1. **[源码解析](../source-analysis/)** - 深入 React 内部实现
2. **[高级特性](../../packages/react-future/)** - 探索最新特性
3. **[架构设计](../../packages/micro-frontends/)** - 大型应用架构
4. **[生态工具](../../packages/build-tools-demo/)** - 工具链优化

### 内容交叉引用

文档和代码之间建立了完整的交叉引用：

- **理论文档** ↔️ **实践项目** - 每个概念都有对应的代码示例
- **版本对比** ↔️ **性能分析** - 理论分析配合实际测试
- **最佳实践** ↔️ **反面案例** - 正确做法和常见陷阱对比
- **基础概念** ↔️ **高级应用** - 从简单到复杂的递进关系

## 🎯 项目特色

### 1. **系统性学习**
- 从基础概念到高级应用的完整路径
- 理论和实践紧密结合
- 渐进式的难度设计

### 2. **深度和广度并重**
- 源码级别的深度分析
- 全生态圈的广度覆盖
- 实用性和理论性的平衡

### 3. **现代化开发**
- 最新的工具链和最佳实践
- 完整的 TypeScript 支持
- 现代化的用户界面设计

### 4. **持续更新**
- 跟进 React 最新发展
- 社区反馈的持续集成
- 内容质量的不断优化

## 🤝 贡献指南

如果你想为这个项目贡献内容：

### 文档贡献
- 在 `docs/` 目录下添加或修改 Markdown 文件
- 遵循现有的文档结构和写作风格
- 确保内容的准确性和实用性

### 代码贡献
- 在对应的 `packages/` 目录下添加示例
- 遵循项目的代码规范和质量标准
- 添加详细的注释和说明

希望这个项目结构能帮助你更好地学习和探索 React 生态系统！🚀
