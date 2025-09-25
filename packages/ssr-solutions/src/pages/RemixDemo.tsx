import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  ExternalLink,
  BookOpen,
  Globe,
  FileText,
  Shield,
  Zap,
  Play,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Database,
  Router,
  FormInput,
} from 'lucide-react';

export default function RemixDemo() {
  const [activeExample, setActiveExample] = useState<string | null>(null);

  const coreFeatures = [
    {
      id: 'nested-routing',
      title: '嵌套路由',
      description: '组件化的路由和数据加载',
      icon: Router,
      code: `// app/routes/dashboard.tsx - 父路由
export async function loader() {
  return json({
    user: await getUser(request),
    stats: await getDashboardStats()
  });
}

export default function Dashboard() {
  const { user, stats } = useLoaderData();
  
  return (
    <div>
      <h1>欢迎, {user.name}</h1>
      <nav>
        <Link to="orders">订单管理</Link>
        <Link to="products">产品管理</Link>
      </nav>
      <Outlet /> {/* 子路由渲染位置 */}
    </div>
  );
}

// app/routes/dashboard.orders.tsx - 子路由
export async function loader({ request }) {
  const user = await getUser(request);
  const orders = await getUserOrders(user.id);
  
  return json({ orders });
}

export default function Orders() {
  const { orders } = useLoaderData();
  
  return (
    <div>
      <h2>我的订单</h2>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}`,
      benefits: [
        '组件级数据加载',
        '并行数据获取',
        '错误边界隔离',
        '加载状态管理'
      ]
    },
    {
      id: 'form-actions',
      title: '表单优先',
      description: '基于 Web 标准的表单处理',
      icon: FormInput,
      code: `// app/routes/products.new.tsx
export async function action({ request }) {
  const formData = await request.formData();
  const product = {
    name: formData.get("name"),
    price: parseFloat(formData.get("price")),
    description: formData.get("description")
  };

  // 验证数据
  const errors = validateProduct(product);
  if (errors) {
    return json({ errors }, { status: 400 });
  }

  // 保存到数据库
  const newProduct = await createProduct(product);
  
  // 重定向到产品页面
  return redirect(\`/products/\${newProduct.id}\`);
}

export default function NewProduct() {
  const actionData = useActionData();
  const navigation = useNavigation();
  
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <input 
        name="name" 
        placeholder="产品名称"
        className={actionData?.errors?.name ? "error" : ""}
      />
      {actionData?.errors?.name && (
        <span className="error">{actionData.errors.name}</span>
      )}
      
      <input 
        name="price" 
        type="number" 
        placeholder="价格"
      />
      
      <textarea 
        name="description" 
        placeholder="产品描述"
      />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "创建中..." : "创建产品"}
      </button>
    </Form>
  );
}`,
      benefits: [
        'Web 标准表单',
        '渐进增强',
        '服务端验证',
        '乐观 UI 更新'
      ]
    },
    {
      id: 'error-boundaries',
      title: '错误边界',
      description: '组件级错误处理和恢复',
      icon: Shield,
      code: `// app/routes/products.$id.tsx
export async function loader({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return json({ product });
}

export default function Product() {
  const { product } = useLoaderData();
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}

// 错误边界 - 捕获该路由的所有错误
export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>糟糕！出现了错误</h1>
      <p>{error.message}</p>
    </div>
  );
}`,
      benefits: [
        '组件级错误处理',
        '用户友好的错误页面',
        '错误隔离',
        '自动错误恢复'
      ]
    },
    {
      id: 'data-mutations',
      title: '数据变更',
      description: '声明式的数据更新和同步',
      icon: Database,
      code: `// app/routes/todos.tsx
export async function loader() {
  const todos = await getTodos();
  return json({ todos });
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  switch (intent) {
    case "create": {
      const text = formData.get("text");
      await createTodo({ text, completed: false });
      break;
    }
    case "toggle": {
      const id = formData.get("id");
      const todo = await getTodo(id);
      await updateTodo(id, { completed: !todo.completed });
      break;
    }
    case "delete": {
      const id = formData.get("id");
      await deleteTodo(id);
      break;
    }
  }
  
  return redirect("/todos");
}

export default function Todos() {
  const { todos } = useLoaderData();
  const fetcher = useFetcher();
  
  return (
    <div>
      <Form method="post">
        <input name="text" placeholder="添加待办事项" />
        <input type="hidden" name="intent" value="create" />
        <button type="submit">添加</button>
      </Form>
      
      {todos.map(todo => (
        <div key={todo.id}>
          <fetcher.Form method="post">
            <input type="hidden" name="id" value={todo.id} />
            <input type="hidden" name="intent" value="toggle" />
            <button type="submit">
              {todo.completed ? "✅" : "⬜"}
            </button>
          </fetcher.Form>
          <span>{todo.text}</span>
        </div>
      ))}
    </div>
  );
}`,
      benefits: [
        '声明式数据变更',
        '乐观 UI 更新',
        '自动重新验证',
        '并发安全'
      ]
    }
  ];

  const designPhilosophy = [
    {
      title: 'Web 标准优先',
      description: '基于现有 Web 平台 API 构建',
      icon: Globe,
      details: [
        '使用原生 HTML 表单',
        '基于 Web Fetch API',
        '支持 Progressive Enhancement',
        '与浏览器行为一致'
      ]
    },
    {
      title: '嵌套路由架构',
      description: '组件化的路由和数据管理',
      icon: Router,
      details: [
        '路由即组件边界',
        '并行数据加载',
        '独立错误处理',
        '细粒度加载状态'
      ]
    },
    {
      title: '服务端优先',
      description: '默认在服务端处理逻辑',
      icon: Database,
      details: [
        'Loader 函数预取数据',
        'Action 函数处理变更',
        '服务端验证和处理',
        '客户端渐进增强'
      ]
    }
  ];

  const comparisonPoints = [
    {
      aspect: '学习曲线',
      remix: '需要理解 Web 标准',
      nextjs: '基于 React 开发经验',
      winner: 'nextjs'
    },
    {
      aspect: '性能优化',
      remix: '默认优化的数据获取',
      nextjs: '多种渲染模式选择',
      winner: 'tie'
    },
    {
      aspect: '开发体验',
      remix: '表单优先，声明式',
      nextjs: '零配置，生态丰富',
      winner: 'nextjs'
    },
    {
      aspect: '部署灵活性',
      remix: '支持多种运行时',
      nextjs: 'Vercel 平台优化',
      winner: 'remix'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
          <Code className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Remix 服务端渲染
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          现代 Web 标准的拥护者，专注于 Web 平台基础和用户体验
        </p>

        <div className="mt-8">
          <a
            href="/docs/concepts/ssr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-4"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看 SSR 理论
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          <a
            href="https://remix.run/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Remix 官方文档
          </a>
        </div>
      </motion.div>

      {/* 核心特性演示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          核心特性演示
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeExample === feature.id;
            
            return (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                onClick={() => setActiveExample(isActive ? null : feature.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    isActive ? 'bg-purple-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{feature.title}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.button>
            );
          })}
        </div>

        {activeExample && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-200 rounded-lg p-6 bg-gray-50"
          >
            {(() => {
              const feature = coreFeatures.find(f => f.id === activeExample);
              if (!feature) return null;

              return (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      代码示例
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                      <code>{feature.code}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      核心优势
                    </h3>
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">{benefit}</span>
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

      {/* 设计哲学 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Remix 设计哲学
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designPhilosophy.map((philosophy, index) => {
            const Icon = philosophy.icon;
            return (
              <motion.div
                key={philosophy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {philosophy.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{philosophy.description}</p>
                
                <div className="space-y-2">
                  {philosophy.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Remix vs Next.js 对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="ssr-card mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Remix vs Next.js 对比
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">对比维度</th>
                <th className="text-left py-3 px-4 text-purple-600">Remix</th>
                <th className="text-left py-3 px-4 text-blue-600">Next.js</th>
                <th className="text-left py-3 px-4">优势方</th>
              </tr>
            </thead>
            <tbody>
              {comparisonPoints.map((point, index) => (
                <tr key={point.aspect} className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {point.aspect}
                  </td>
                  <td className="py-4 px-4 text-gray-700">{point.remix}</td>
                  <td className="py-4 px-4 text-gray-700">{point.nextjs}</td>
                  <td className="py-4 px-4">
                    {point.winner === 'remix' && (
                      <span className="badge badge-purple">Remix</span>
                    )}
                    {point.winner === 'nextjs' && (
                      <span className="badge badge-blue">Next.js</span>
                    )}
                    {point.winner === 'tie' && (
                      <span className="badge badge-yellow">平分秋色</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 适用场景建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="ssr-card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          何时选择 Remix？
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              适合的场景
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">表单密集型应用</div>
                  <div className="text-sm text-gray-600">
                    后台管理系统、数据录入系统
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">渐进增强项目</div>
                  <div className="text-sm text-gray-600">
                    需要在 JavaScript 失败时仍能工作
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">多平台部署</div>
                  <div className="text-sm text-gray-600">
                    需要部署到不同的云服务商
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">原生 Web 体验</div>
                  <div className="text-sm text-gray-600">
                    重视 Web 标准和浏览器原生行为
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2" />
              不太适合的场景
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">静态站点生成</div>
                  <div className="text-sm text-gray-600">
                    主要是静态内容的网站
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">客户端密集应用</div>
                  <div className="text-sm text-gray-600">
                    如在线图表、游戏等交互密集型应用
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">快速原型开发</div>
                  <div className="text-sm text-gray-600">
                    需要快速搭建 MVP 的项目
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <Lightbulb className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-purple-800 mb-1">
                💡 选择建议
              </div>
              <div className="text-sm text-purple-700">
                Remix 适合重视 Web 标准、需要强大表单处理能力的项目。
                如果你的团队对 Web 平台有深入理解，追求原生的 Web 体验，
                Remix 是一个优秀的选择。
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
