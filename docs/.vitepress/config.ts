import { defineConfig } from 'vitepress';

// 环境变量控制链接
// 使用更直接的方式：如果没有设置 VERCEL 或 CI 环境变量，就认为是本地开发
const isDev = !process.env.VERCEL && !process.env.CI;
const baseUrl = isDev ? 'http://localhost' : 'https://react.hilime.me';

export default defineConfig({
  title: 'React 技术专家',
  description:
    'React 技术栈最佳实践学习和总结 - 10年前端React生涯的大总结，文档 + Demo 互补的完整学习体系',
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'React 技术专家成长之路',

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '版本', link: '/versions/' },
      { text: '概念', link: '/concepts/' },
      { text: '源码', link: '/source/' },
      { text: '架构', link: '/architecture/' },
      { text: '最佳实践', link: '/practice/' },
      {
        text: 'Demo',
        items: [
          {
            text: 'Hooks 交互演练',
            link: isDev ? `${baseUrl}:3001` : `${baseUrl}/hooks-playground`,
            target: '_blank',
          },
          {
            text: '状态管理对比',
            link: isDev ? `${baseUrl}:3002` : `${baseUrl}/state-management`,
            target: '_blank',
          },
          {
            text: '路由系统演进',
            link: isDev ? `${baseUrl}:3003` : `${baseUrl}/routing-system`,
            target: '_blank',
          },
          {
            text: '样式方案实战',
            link: isDev ? `${baseUrl}:3007` : `${baseUrl}/styling-solutions`,
            target: '_blank',
          },
          {
            text: '性能优化实践',
            link: isDev ? `${baseUrl}:3008` : `${baseUrl}/performance`,
            target: '_blank',
          },
          {
            text: 'SSR 解决方案',
            link: isDev ? `${baseUrl}:3009` : `${baseUrl}/ssr-solutions`,
            target: '_blank',
          },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '学习指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
          ],
        },
      ],

      '/concepts/': [
        {
          text: '核心概念',
          items: [
            { text: '概念总览', link: '/concepts/' },
            { text: 'Hooks 函数组件', link: '/concepts/hooks' },
            { text: '状态管理哲学与方案', link: '/concepts/state-management' },
            { text: '前端路由原理与实现', link: '/concepts/routing' },
            { text: '样式解决方案演进史', link: '/concepts/styling' },
            { text: '数据获取方案', link: '/concepts/data-fetching' },
            { text: '服务端渲染深度剖析', link: '/concepts/ssr' },
          ],
        },
      ],

      '/versions/': [
        {
          text: 'React 版本演进',
          items: [
            { text: '版本演进总览', link: '/versions/' },
            {
              text: 'React 15 - Stack 架构初探',
              link: '/versions/react-15',
            },
            { text: 'React 16 - Fiber 架构革命', link: '/versions/react-16' },
            { text: 'React 17 - 零破坏性升级', link: '/versions/react-17' },
            { text: 'React 18 - 并发特性', link: '/versions/react-18' },
            { text: 'React 19 - 编译器时代', link: '/versions/react-19' },
            { text: '架构对比分析', link: '/versions/comparison' },
          ],
        },
      ],

      '/source/': [
        {
          text: '源码解读',
          items: [
            { text: '源码解读导读', link: '/source/' },
            {
              text: 'Fiber 内部机制深度解析',
              link: '/source/fiber-internals',
            },
            {
              text: 'Hook 实现原理剖析',
              link: '/source/hooks-internals',
            },
            {
              text: '协调器核心算法',
              link: '/source/reconciler-deep-dive',
            },
            {
              text: '调度器原理解析',
              link: '/source/scheduler-analysis',
            },
            {
              text: '并发特性实现',
              link: '/source/concurrent-features',
            },
          ],
        },
      ],

      '/architecture/': [
        {
          text: '架构设计',
          items: [
            { text: '架构设计导读', link: '/architecture/' },
            {
              text: '中后台系统架构设计',
              link: '/architecture/admin-systems',
            },
            {
              text: '低代码平台架构设计',
              link: '/architecture/low-code-platforms',
            },
            {
              text: '微前端架构设计',
              link: '/architecture/micro-frontends',
            },
            {
              text: '领域驱动架构设计',
              link: '/architecture/domain-driven-design',
            },
          ],
        },
      ],

      '/practice/': [
        {
          text: '最佳实践',
          items: [
            { text: '最佳实践总览', link: '/practice/' },
            { text: '组件库开发实战', link: '/practice/component-library' },
            { text: 'Hooks 库开发指南', link: '/practice/hooks-library' },
            { text: '性能优化最佳实践', link: '/practice/performance' },
            { text: '单元测试', link: '/practice/testing' },
            { text: '构建工具集成', link: '/practice/build-tools' },
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
      message: 'React 技术栈最佳实践学习和总结 | 10年前端React生涯的大总结',
      copyright: 'Copyright © 2024 | 文档 + Demo 互补的完整学习体系',
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
    theme: {
      dark: 'github-dark',
      light: 'github-light',
    },
    lineNumbers: false,
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
