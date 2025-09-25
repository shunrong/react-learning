import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'React 生态学习指南',
  description: '全面深入的 React 生态系统学习与实践',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'React 生态学习指南',

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      {
        text: '核心概念',
        items: [
          { text: '版本演进', link: '/versions/' },
          { text: '架构原理', link: '/concepts/' },
          { text: '最佳实践', link: '/patterns/' },
        ],
      },
      {
        text: '进阶主题',
        items: [
          { text: '源码解析', link: '/source-analysis/' },
          { text: 'SSR/SSG', link: '/ssr/' },
          { text: '微前端', link: '/micro-fe/' },
          { text: '性能优化', link: '/concepts/performance' },
        ],
      },
      {
        text: '生态工具',
        items: [
          { text: '状态管理', link: '/concepts/state-management' },
          { text: '路由方案', link: '/concepts/routing' },
          { text: '样式方案', link: '/concepts/styling' },
          { text: '测试策略', link: '/testing/' },
          { text: '数据获取', link: '/data/' },
        ],
      },
      { text: '未来发展', link: '/future/' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
          ],
        },
      ],

      '/versions/': [
        {
          text: 'React 版本演进',
          items: [
            { text: '版本概览', link: '/versions/' },
            { text: 'React 15 - 栈协调', link: '/versions/react-15' },
            { text: 'React 16 - Fiber 架构', link: '/versions/react-16' },
            { text: 'React 17 - 渐进升级', link: '/versions/react-17' },
            { text: 'React 18 - 并发特性', link: '/versions/react-18' },
            { text: '架构对比分析', link: '/versions/comparison' },
          ],
        },
      ],

      '/concepts/': [
        {
          text: '核心概念',
          items: [
            { text: '概念总览', link: '/concepts/' },
            { text: 'JSX 与虚拟 DOM', link: '/concepts/jsx-vdom' },
            { text: '组件系统', link: '/concepts/components' },
            { text: 'Hooks 机制', link: '/concepts/hooks' },
            { text: '状态管理', link: '/concepts/state-management' },
            { text: '事件系统', link: '/concepts/events' },
            { text: '生命周期', link: '/concepts/lifecycle' },
            { text: '性能优化', link: '/concepts/performance' },
          ],
        },
      ],

      '/patterns/': [
        {
          text: '设计模式与最佳实践',
          items: [
            { text: '模式概览', link: '/patterns/' },
            { text: '组件设计模式', link: '/patterns/component-patterns' },
            { text: '状态管理模式', link: '/patterns/state-patterns' },
            { text: '代码组织模式', link: '/patterns/code-organization' },
            { text: '性能优化模式', link: '/patterns/performance-patterns' },
            { text: 'TypeScript 模式', link: '/patterns/typescript-patterns' },
          ],
        },
      ],

      '/source-analysis/': [
        {
          text: '源码深度解析',
          items: [
            { text: '源码导读', link: '/source-analysis/' },
            { text: 'Fiber 架构', link: '/source-analysis/fiber' },
            { text: '调度器原理', link: '/source-analysis/scheduler' },
            { text: 'Hooks 实现', link: '/source-analysis/hooks' },
            { text: '并发模式', link: '/source-analysis/concurrent' },
            { text: '时间切片', link: '/source-analysis/time-slicing' },
            { text: '车道模型', link: '/source-analysis/lanes' },
          ],
        },
      ],

      '/ssr/': [
        {
          text: '服务端渲染',
          items: [
            { text: 'SSR 概述', link: '/ssr/' },
            { text: 'Next.js 实践', link: '/ssr/nextjs' },
            { text: 'Remix 框架', link: '/ssr/remix' },
            { text: 'SSG 静态生成', link: '/ssr/ssg' },
            { text: 'Hydration 原理', link: '/ssr/hydration' },
            { text: 'SEO 优化', link: '/ssr/seo' },
          ],
        },
      ],

      '/testing/': [
        {
          text: '测试策略',
          items: [
            { text: '测试概述', link: '/testing/' },
            { text: '单元测试', link: '/testing/unit-testing' },
            { text: '集成测试', link: '/testing/integration-testing' },
            { text: 'E2E 测试', link: '/testing/e2e-testing' },
            { text: '测试工具链', link: '/testing/testing-tools' },
          ],
        },
      ],

      '/data/': [
        {
          text: '数据获取方案',
          items: [
            { text: '数据获取概述', link: '/data/' },
            { text: 'React Query', link: '/data/react-query' },
            { text: 'SWR', link: '/data/swr' },
            { text: 'Apollo Client', link: '/data/apollo' },
            { text: 'Suspense 模式', link: '/data/suspense' },
          ],
        },
      ],

      '/micro-fe/': [
        {
          text: '微前端架构',
          items: [
            { text: '微前端概述', link: '/micro-fe/' },
            { text: 'Module Federation', link: '/micro-fe/module-federation' },
            { text: 'Single-SPA', link: '/micro-fe/single-spa' },
            { text: '通信方案', link: '/micro-fe/communication' },
          ],
        },
      ],

      '/future/': [
        {
          text: 'React 未来发展',
          items: [
            { text: '未来展望', link: '/future/' },
            { text: 'React 19 新特性', link: '/future/react-19' },
            { text: 'Server Components', link: '/future/server-components' },
            { text: 'React Compiler', link: '/future/react-compiler' },
            { text: '发展趋势', link: '/future/trends' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/facebook/react' },
    ],

    // 页脚
    footer: {
      message: 'React 生态学习指南',
      copyright: 'Copyright © 2024',
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },

  // Markdown 配置
  markdown: {
    theme: 'github-dark',
    lineNumbers: true,
    codeTransformers: [
      // 代码高亮增强
    ],
  },

  // 构建配置
  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
  },
});
