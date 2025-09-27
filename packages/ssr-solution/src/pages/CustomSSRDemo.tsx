import { motion } from 'framer-motion';
import {
  Server,
  ExternalLink,
  BookOpen,
  Code,
  Database,
  Zap,
  Settings,
  CheckCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export default function CustomSSRDemo() {
  const architectureSteps = [
    {
      step: 1,
      title: '服务端渲染',
      description: '在 Node.js 服务器中渲染 React 组件',
      code: `import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

const server = express();

server.get('*', async (req, res) => {
  const initialData = await fetchInitialData(req.path);
  
  const html = renderToString(
    <StaticRouter location={req.url}>
      <App initialData={initialData} />
    </StaticRouter>
  );
  
  res.send(generateHTML(html, initialData));
});`,
      icon: Server,
    },
    {
      step: 2,
      title: '客户端水合',
      description: '在浏览器中接管已渲染的 DOM',
      code: `import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const initialData = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App initialData={initialData} />
  </BrowserRouter>
);`,
      icon: Zap,
    },
    {
      step: 3,
      title: '状态同步',
      description: '确保服务端和客户端状态一致',
      code: `function App({ initialData }) {
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    // 如果没有初始数据，客户端获取
    if (!initialData) {
      fetchData().then(setData);
    }
  }, [initialData]);
  
  return <ProductList data={data} />;
}`,
      icon: Database,
    },
  ];

  const advantages = [
    {
      title: '完全控制',
      description: '对整个渲染流程有完整的控制权',
      icon: Settings,
      details: [
        '自定义服务器逻辑',
        '灵活的缓存策略',
        '定制化错误处理',
        '特殊优化需求',
      ],
    },
    {
      title: '轻量级',
      description: '只包含必要的功能，没有冗余',
      icon: Zap,
      details: [
        '更小的包体积',
        '更快的启动时间',
        '减少依赖关系',
        '精确的性能控制',
      ],
    },
    {
      title: '学习价值',
      description: '深入理解 SSR 的工作原理',
      icon: BookOpen,
      details: [
        '掌握核心概念',
        '理解技术原理',
        '培养架构思维',
        '提升问题解决能力',
      ],
    },
  ];

  const challenges = [
    {
      title: '开发复杂度',
      description: '需要处理更多底层细节',
      solutions: ['构建工具配置', '热重载实现', '路由同步处理', '错误边界管理'],
    },
    {
      title: '性能优化',
      description: '需要手动实现各种优化',
      solutions: ['代码分割策略', '缓存机制设计', '资源预加载', '性能监控'],
    },
    {
      title: '生态集成',
      description: '与第三方库的集成需要额外工作',
      solutions: ['CSS-in-JS 支持', '状态管理集成', 'SEO 优化', '部署配置'],
    },
  ];

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6'>
          <Server className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          自定义 SSR 解决方案
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          从零构建服务端渲染方案，深入理解 SSR 的核心原理和实现细节
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/ssr'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看 SSR 理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
        </div>
      </motion.div>

      {/* 架构实现步骤 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>架构实现步骤</h2>

        <div className='space-y-8'>
          {architectureSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.2 }}
                className='flex items-start'
              >
                <div className='flex-shrink-0 mr-6'>
                  <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                    <span className='text-lg font-bold text-green-600'>
                      {step.step}
                    </span>
                  </div>
                </div>

                <div className='flex-1'>
                  <div className='flex items-center mb-3'>
                    <Icon className='w-6 h-6 text-green-600 mr-3' />
                    <h3 className='text-xl font-semibold text-gray-900'>
                      {step.title}
                    </h3>
                  </div>
                  <p className='text-gray-600 mb-4'>{step.description}</p>

                  <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
                    <pre className='text-gray-100 text-sm'>
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 核心优势 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          自定义方案的优势
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className='text-center'
              >
                <div className='w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                  <Icon className='w-8 h-8 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {advantage.title}
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  {advantage.description}
                </p>

                <div className='space-y-2'>
                  {advantage.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className='flex items-center text-sm text-gray-700'
                    >
                      <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 挑战与解决方案 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          挑战与解决方案
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className='bg-white border border-gray-200 rounded-lg p-6'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {challenge.title}
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                {challenge.description}
              </p>

              <div className='space-y-2'>
                <div className='text-sm font-medium text-gray-700 mb-2'>
                  解决方案：
                </div>
                {challenge.solutions.map((solution, idx) => (
                  <div
                    key={idx}
                    className='flex items-center text-sm text-gray-600'
                  >
                    <ArrowRight className='w-3 h-3 text-gray-400 mr-2' />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 适用场景 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='ssr-card'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          何时选择自定义 SSR？
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold text-green-700 mb-4 flex items-center'>
              <CheckCircle className='w-5 h-5 mr-2' />
              适合的场景
            </h3>
            <div className='space-y-3'>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>特殊性能要求</div>
                  <div className='text-sm text-gray-600'>
                    需要极致的性能优化和精确控制
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>学习研究目的</div>
                  <div className='text-sm text-gray-600'>
                    深入理解 SSR 原理和最佳实践
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>现有系统集成</div>
                  <div className='text-sm text-gray-600'>
                    需要与复杂的后端系统深度集成
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>定制化需求</div>
                  <div className='text-sm text-gray-600'>
                    标准框架无法满足的特殊需求
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-red-700 mb-4 flex items-center'>
              <ExternalLink className='w-5 h-5 mr-2' />
              不建议的场景
            </h3>
            <div className='space-y-3'>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>快速开发需求</div>
                  <div className='text-sm text-gray-600'>
                    时间紧张的商业项目
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>团队经验不足</div>
                  <div className='text-sm text-gray-600'>
                    缺乏 SSR 相关技术背景
                  </div>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3 mt-2'></div>
                <div>
                  <div className='font-medium text-gray-900'>标准化需求</div>
                  <div className='text-sm text-gray-600'>
                    需要成熟生态和社区支持
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-start'>
            <Lightbulb className='w-5 h-5 text-green-600 mr-2 mt-0.5' />
            <div>
              <div className='text-sm font-medium text-green-800 mb-1'>
                💡 实施建议
              </div>
              <div className='text-sm text-green-700'>
                自定义 SSR 方案适合有经验的团队和特殊需求的项目。
                建议先深入学习现有框架的实现原理，再根据具体需求决定是否自建。
                即使选择自建，也要借鉴成熟框架的设计思路和最佳实践。
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
