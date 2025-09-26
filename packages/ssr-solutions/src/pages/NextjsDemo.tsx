import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ExternalLink,
  BookOpen,
  Clock,
  Image,
  FileText,
  Layers,
  Globe,
  Code,
  Play,
  ArrowRight,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export default function NextjsDemo() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'ssr',
      title: '服务端渲染 (SSR)',
      description: '每次请求时在服务器生成 HTML',
      icon: Globe,
      code: `// pages/product/[id].js
export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    props: {
      product,
      timestamp: Date.now()
    }
  };
}

export default function ProductPage({ product, timestamp }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>服务端渲染时间: {new Date(timestamp).toLocaleString()}</p>
      <p>价格: ¥{product.price}</p>
    </div>
  );
}`,
      benefits: ['实时数据展示', 'SEO 友好', '首屏加载快', '社交分享支持'],
    },
    {
      id: 'ssg',
      title: '静态站点生成 (SSG)',
      description: '构建时预生成所有静态页面',
      icon: FileText,
      code: `// pages/blog/[slug].js
export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: { post }
  };
}

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}`,
      benefits: ['极速加载', 'CDN 友好', '成本低廉', '高可用性'],
    },
    {
      id: 'isr',
      title: '增量静态再生 (ISR)',
      description: '按需重新生成静态页面',
      icon: Layers,
      code: `// pages/products.js
export async function getStaticProps() {
  const products = await fetchProducts();
  
  return {
    props: { products },
    revalidate: 60, // 60秒后重新验证
  };
}

// 也可以按需重新验证
export default function api_revalidate(req, res) {
  try {
    await res.revalidate('/products');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}`,
      benefits: ['静态速度', '动态内容', '智能缓存', '按需更新'],
    },
    {
      id: 'image',
      title: '图片优化',
      description: '自动优化图片加载和格式转换',
      icon: Image,
      code: `import Image from 'next/image';

export default function ProductGallery({ product }) {
  return (
    <div>
      {/* 自动优化、懒加载、响应式 */}
      <Image
        src={product.image}
        alt={product.name}
        width={800}
        height={600}
        priority={true} // 首屏关键图片
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
      />
      
      {/* 填充容器 */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src={product.banner}
          alt="产品横幅"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}`,
      benefits: ['自动格式转换', '懒加载', '响应式图片', 'Web Vitals 优化'],
    },
  ];

  const bestPractices = [
    {
      title: '路由设计',
      description: '文件系统路由，自动代码分割',
      tips: [
        '使用动态路由 [id].js',
        '嵌套路由通过文件夹结构',
        '中间件处理认证和重定向',
        'API 路由处理服务端逻辑',
      ],
    },
    {
      title: '性能优化',
      description: '多种优化策略提升应用性能',
      tips: [
        '选择合适的渲染模式',
        '使用 Image 组件优化图片',
        '代码分割和懒加载',
        'Bundle Analyzer 分析包大小',
      ],
    },
    {
      title: '部署策略',
      description: 'Vercel 平台深度集成',
      tips: [
        'Vercel 一键部署',
        'Edge Runtime 边缘计算',
        '环境变量管理',
        'Preview 部署和 A/B 测试',
      ],
    },
  ];

  const demoProjects = [
    {
      title: '电商产品页面',
      description: 'SSR + ISR 结合的产品展示页面',
      features: ['动态路由', '实时价格', '用户评论', 'SEO 优化'],
      status: 'demo',
    },
    {
      title: '博客系统',
      description: 'SSG + Markdown 的静态博客',
      features: ['静态生成', 'MDX 支持', '代码高亮', '搜索功能'],
      status: 'demo',
    },
    {
      title: 'Dashboard 应用',
      description: 'CSR + SSR 混合的管理后台',
      features: ['用户认证', '实时数据', '图表展示', '权限控制'],
      status: 'demo',
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
        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6'>
          <Zap className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Next.js 服务端渲染
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          React 生态中最成熟的 SSR 框架，提供多种渲染模式和开箱即用的优化
        </p>

        <div className='mt-8'>
          <a
            href='/docs/concepts/ssr'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4'
          >
            <BookOpen className='w-5 h-5 mr-2' />
            查看 SSR 理论
            <ExternalLink className='w-4 h-4 ml-2' />
          </a>
          <a
            href='https://nextjs.org/docs'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <ExternalLink className='w-5 h-5 mr-2' />
            Next.js 官方文档
          </a>
        </div>
      </motion.div>

      {/* 核心特性演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>核心特性演示</h2>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;

            return (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                onClick={() => setActiveFeature(isActive ? null : feature.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className='flex items-center mb-3'>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isActive ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {feature.title}
                    </div>
                  </div>
                </div>
                <p className='text-sm text-gray-600'>{feature.description}</p>
              </motion.button>
            );
          })}
        </div>

        {activeFeature && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='border border-gray-200 rounded-lg p-6 bg-gray-50'
          >
            {(() => {
              const feature = features.find(f => f.id === activeFeature);
              if (!feature) return null;

              return (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      代码示例
                    </h3>
                    <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm'>
                      <code>{feature.code}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      核心优势
                    </h3>
                    <div className='space-y-3'>
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className='flex items-center'>
                          <CheckCircle className='w-5 h-5 text-green-500 mr-3' />
                          <span className='text-gray-700'>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>

      {/* 实践项目演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='ssr-card mb-12'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>实践项目演示</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {demoProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className='border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors'
            >
              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                  <Code className='w-8 h-8 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {project.title}
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  {project.description}
                </p>

                <div className='space-y-2 mb-4'>
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className='flex items-center text-sm text-gray-600'
                    >
                      <div className='w-1.5 h-1.5 bg-blue-400 rounded-full mr-2'></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className='btn btn-primary text-sm w-full'>
                  <Play className='w-4 h-4 mr-2' />
                  查看演示
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 最佳实践 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='ssr-card'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Next.js 最佳实践
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {bestPractices.map((practice, index) => (
            <motion.div
              key={practice.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className='bg-white border border-gray-200 rounded-lg p-6'
            >
              <div className='text-center mb-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Lightbulb className='w-6 h-6 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {practice.title}
                </h3>
                <p className='text-sm text-gray-600'>{practice.description}</p>
              </div>

              <div className='space-y-2'>
                {practice.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className='flex items-start text-sm text-gray-700'
                  >
                    <div className='w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0'></div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-start'>
            <Lightbulb className='w-5 h-5 text-blue-600 mr-2 mt-0.5' />
            <div>
              <div className='text-sm font-medium text-blue-800 mb-1'>
                💡 选择建议
              </div>
              <div className='text-sm text-blue-700'>
                Next.js 适合大多数 React SSR
                场景，特别是需要快速开发和部署的项目。 其丰富的生态系统和 Vercel
                平台的深度集成，让开发者能够专注于业务逻辑而非基础设施。
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
