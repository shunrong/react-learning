# 快速开始

这个指南将帮助你快速搭建开发环境并开始学习 React 生态系统。

## 📋 前置要求

在开始之前，请确保你的系统满足以下要求：

### 系统要求
- **操作系统**: macOS, Windows, 或 Linux
- **Node.js**: 18.0.0 或更高版本
- **包管理器**: pnpm 8.0.0 或更高版本

### 检查环境
```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本  
npm --version

# 安装 pnpm (如果还没有安装)
npm install -g pnpm

# 检查 pnpm 版本
pnpm --version
```

## 🚀 项目设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd react-learning
```

### 2. 安装依赖
```bash
# 安装所有包的依赖
pnpm install
```

这个命令会：
- 安装根目录的开发依赖
- 安装所有子包的依赖  
- 建立包之间的链接关系

### 3. 启动文档站点
```bash
# 启动开发服务器
pnpm docs:dev
```

文档站点将在 `http://localhost:5173` 启动，你可以在浏览器中查看完整的学习指南。

## 🏗️ 项目结构概览

```
react-learning/
├── packages/                 # 实践项目包
│   ├── react-15-demo/       # React 15 栈架构演示
│   ├── react-16-fiber/      # React 16+ Fiber 架构
│   ├── hooks-playground/    # Hooks 各种实践
│   ├── state-management/    # 状态管理方案对比
│   ├── routing-evolution/   # 路由方案演进
│   ├── styling-solutions/   # 样式方案对比
│   ├── component-library/   # 组件库开发实践
│   ├── build-tools-demo/    # 构建工具集成
│   ├── typescript-react/    # TypeScript + React
│   ├── performance-opt/     # 性能优化实践
│   ├── react18-source/      # React 18 源码解析
│   ├── ssr-solutions/       # 服务端渲染方案
│   ├── testing-strategies/  # 测试策略
│   ├── data-fetching/       # 数据获取方案
│   ├── micro-frontends/     # 微前端架构
│   └── react-future/        # React 新特性
├── docs/                    # 文档站点
├── tools/                   # 共享工具和配置
└── README.md               # 项目说明
```

## 🎮 运行示例项目

每个 `packages` 目录下都包含一个独立的示例项目，你可以单独运行：

### 运行单个包
```bash
# 运行 Hooks 实践项目
pnpm --filter hooks-playground dev

# 运行状态管理对比项目  
pnpm --filter state-management dev

# 运行样式方案对比项目
pnpm --filter styling-solutions dev
```

### 查看可用命令
```bash
# 查看所有可用的脚本命令
pnpm run

# 查看特定包的可用命令
pnpm --filter hooks-playground run
```

### 常用命令汇总
```bash
# 开发相关
pnpm dev                     # 启动所有包的开发服务器
pnpm build                   # 构建所有包
pnpm test                    # 运行所有测试

# 文档相关  
pnpm docs:dev               # 启动文档开发服务器
pnpm docs:build             # 构建文档站点
pnpm docs:serve             # 预览构建后的文档

# 代码质量
pnpm lint                   # 运行 ESLint 检查
pnpm format                 # 运行 Prettier 格式化
pnpm type-check             # 运行 TypeScript 类型检查

# 清理
pnpm clean                  # 清理所有构建产物和依赖
```

## 🎯 学习建议

### 初学者路径
如果你是 React 初学者，建议按以下顺序学习：

1. **基础概念** - 从 [核心概念](/concepts/) 开始
2. **版本对比** - 了解 [React 版本演进](/versions/)
3. **Hooks 实践** - 运行 `hooks-playground` 项目
4. **状态管理** - 学习不同的状态管理方案
5. **实际项目** - 尝试构建一个完整的应用

### 有经验开发者路径
如果你已经有 React 经验，可以直接关注：

1. **架构原理** - 深入 [源码解析](/source-analysis/)
2. **性能优化** - 学习各种优化技巧
3. **工程化实践** - 掌握现代开发工具链
4. **高级特性** - 探索最新的 React 特性

### 实践建议

#### 动手操作
- 不要只看文档，一定要运行代码
- 尝试修改示例代码观察效果
- 实现类似功能验证你的理解

#### 深入思考
- 思考为什么要这样设计
- 对比不同方案的优劣势
- 关注边界情况和性能影响

#### 持续学习
- 关注 React 官方博客和 RFC
- 参与开源项目和技术社区
- 分享你的学习心得和经验

## 🛠️ 开发工具推荐

### VS Code 扩展
```bash
# React 开发必备扩展
ES7+ React/Redux/React-Native snippets
TypeScript Hero
Prettier - Code formatter
ESLint
Auto Rename Tag
Bracket Pair Colorizer 2
GitLens
Thunder Client
```

### 浏览器扩展
- **React Developer Tools** - React 组件调试
- **Redux DevTools** - Redux 状态调试
- **React Query DevTools** - 数据获取调试

### 命令行工具
```bash
# 全局安装有用的工具
npm install -g @storybook/cli
npm install -g create-react-app
npm install -g serve
```

## ❓ 常见问题

### Q: pnpm install 失败怎么办？
A: 尝试以下步骤：
```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### Q: 端口冲突怎么办？
A: 大多数开发服务器会自动选择可用端口，如果需要指定端口：
```bash
# 指定端口运行文档
pnpm docs:dev --port 3000

# 指定端口运行示例项目
pnpm --filter hooks-playground dev --port 3001
```

### Q: TypeScript 报错怎么办？
A: 确保所有依赖都已正确安装：
```bash
# 重新构建 TypeScript 项目引用
pnpm run type-check

# 如果还有问题，尝试重启 TypeScript 服务
# 在 VS Code 中按 Ctrl+Shift+P，输入 "TypeScript: Restart TS Server"
```

## 🎉 下一步

现在你已经成功设置了开发环境，建议：

1. 浏览 [项目结构说明](/guide/project-structure)
2. 查看 [学习路径建议](/guide/)
3. 开始第一个实践项目

准备好开始你的 React 学习之旅了吗？🚀
