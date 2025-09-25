import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Download,
  Trash2,
  Edit3,
  Heart,
  MessageCircle,
  Code2,
  FileText,
  Palette,
} from 'lucide-react';
import Button from '@/examples/css-modules/Button';
import Card from '@/examples/css-modules/Card';
import {
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
  RadioGroup,
} from '@/examples/css-modules/FormField';

const codeExamples = {
  button: `// Button.module.css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

// Button.tsx
import styles from './Button.module.css';

export default function Button({ variant = 'primary', ... }) {
  const buttonClasses = [
    styles.button,
    styles[variant]
  ].filter(Boolean).join(' ');

  return <button className={buttonClasses} {...props} />;
}`,
  card: `// Card.module.css
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

// Card.tsx
import styles from './Card.module.css';

export default function Card({ variant = 'default', ... }) {
  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant]
  ].filter(Boolean).join(' ');

  return <div className={cardClasses}>{children}</div>;
}`,
};

export default function CSSModulesDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false,
    priority: '',
  });
  const [showCode, setShowCode] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className='max-w-6xl mx-auto space-y-12'>
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-6'>
          <FileText className='w-8 h-8 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          CSS Modules 样式方案
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          传统的作用域隔离方案，通过编译时处理实现样式封装，零运行时开销，支持所有CSS特性
        </p>
      </motion.div>

      {/* 特性介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
      >
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
          <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
            <Palette className='w-6 h-6 text-green-600' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            作用域隔离
          </h3>
          <p className='text-gray-600'>
            自动生成唯一类名，避免样式冲突，保证组件样式的独立性
          </p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
          <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
            <Code2 className='w-6 h-6 text-blue-600' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            零运行时开销
          </h3>
          <p className='text-gray-600'>
            编译时处理，不增加JavaScript包大小，性能优秀
          </p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
          <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
            <FileText className='w-6 h-6 text-purple-600' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            标准CSS语法
          </h3>
          <p className='text-gray-600'>
            使用熟悉的CSS语法，支持所有CSS特性和预处理器
          </p>
        </div>
      </motion.div>

      {/* 按钮组件示例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              按钮组件示例
            </h2>
            <button
              onClick={() =>
                setShowCode(showCode === 'button' ? null : 'button')
              }
              className='text-blue-600 hover:text-blue-700 font-medium text-sm'
            >
              {showCode === 'button' ? '隐藏代码' : '查看代码'}
            </button>
          </div>

          <div className='p-6'>
            <div className='space-y-6'>
              {/* 按钮变体 */}
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  按钮变体
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='primary'>主要按钮</Button>
                  <Button variant='secondary'>次要按钮</Button>
                  <Button variant='success'>成功按钮</Button>
                  <Button variant='warning'>警告按钮</Button>
                  <Button variant='error'>错误按钮</Button>
                </div>
              </div>

              {/* 按钮尺寸 */}
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  按钮尺寸
                </h3>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button size='small'>小按钮</Button>
                  <Button size='medium'>中等按钮</Button>
                  <Button size='large'>大按钮</Button>
                </div>
              </div>

              {/* 按钮状态 */}
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  按钮状态
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <Button icon={<Save className='w-4 h-4' />}>带图标</Button>
                  <Button loading>加载中</Button>
                  <Button disabled>禁用状态</Button>
                  <Button iconOnly icon={<Download className='w-4 h-4' />} />
                </div>
              </div>
            </div>
          </div>

          {showCode === 'button' && (
            <div className='border-t border-gray-200 bg-gray-50'>
              <pre className='p-6 text-sm overflow-x-auto'>
                <code className='text-gray-800'>{codeExamples.button}</code>
              </pre>
            </div>
          )}
        </div>
      </motion.div>

      {/* 卡片组件示例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              卡片组件示例
            </h2>
            <button
              onClick={() => setShowCode(showCode === 'card' ? null : 'card')}
              className='text-blue-600 hover:text-blue-700 font-medium text-sm'
            >
              {showCode === 'card' ? '隐藏代码' : '查看代码'}
            </button>
          </div>

          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <Card
                title='默认卡片'
                subtitle='基础样式'
                footer={
                  <div className='flex gap-2'>
                    <Button size='small' variant='secondary'>
                      <Heart className='w-4 h-4' />
                    </Button>
                    <Button size='small' variant='secondary'>
                      <MessageCircle className='w-4 h-4' />
                    </Button>
                  </div>
                }
              >
                <p>
                  这是一个使用CSS
                  Modules构建的基础卡片组件，具有悬停效果和响应式设计。
                </p>
              </Card>

              <Card
                variant='elevated'
                title='提升卡片'
                subtitle='带阴影效果'
                footer={
                  <Button size='small' variant='primary'>
                    查看详情
                  </Button>
                }
              >
                <p>提升样式的卡片具有更明显的阴影效果，适合突出重要内容。</p>
              </Card>

              <Card
                variant='outlined'
                title='描边卡片'
                subtitle='边框样式'
                selected
                footer={
                  <div className='flex gap-2'>
                    <Button size='small' variant='success'>
                      <Edit3 className='w-4 h-4' />
                    </Button>
                    <Button size='small' variant='error'>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                }
              >
                <p>
                  描边卡片使用边框样式，当前处于选中状态，适合列表选择场景。
                </p>
              </Card>
            </div>
          </div>

          {showCode === 'card' && (
            <div className='border-t border-gray-200 bg-gray-50'>
              <pre className='p-6 text-sm overflow-x-auto'>
                <code className='text-gray-800'>{codeExamples.card}</code>
              </pre>
            </div>
          )}
        </div>
      </motion.div>

      {/* 表单组件示例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>
              表单组件示例
            </h2>
          </div>

          <div className='p-6'>
            <div className='max-w-2xl mx-auto space-y-6'>
              <InputField
                label='姓名'
                required
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder='请输入您的姓名'
                helpText='这将用作您的显示名称'
              />

              <InputField
                label='邮箱地址'
                type='email'
                required
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder='your@email.com'
                error={
                  formData.email && !formData.email.includes('@')
                    ? '请输入有效的邮箱地址'
                    : undefined
                }
              />

              <SelectField
                label='消息分类'
                required
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                options={[
                  { value: 'general', label: '一般咨询' },
                  { value: 'support', label: '技术支持' },
                  { value: 'feedback', label: '反馈建议' },
                  { value: 'business', label: '商务合作' },
                ]}
                helpText='选择最符合您需求的分类'
              />

              <TextareaField
                label='消息内容'
                required
                value={formData.message}
                onChange={e => handleInputChange('message', e.target.value)}
                placeholder='请详细描述您的问题或建议...'
                rows={4}
                helpText='至少输入10个字符'
              />

              <RadioGroup
                label='优先级'
                name='priority'
                value={formData.priority}
                onChange={value => handleInputChange('priority', value)}
                options={[
                  { value: 'low', label: '低优先级' },
                  { value: 'medium', label: '中优先级' },
                  { value: 'high', label: '高优先级' },
                ]}
              />

              <CheckboxField
                type='checkbox'
                label='订阅我们的新闻简报'
                checked={formData.newsletter}
                onChange={e =>
                  handleInputChange('newsletter', e.target.checked)
                }
                helpText='我们会定期发送产品更新和技术文章'
              />

              <div className='flex gap-4 pt-4'>
                <Button variant='primary' className='flex-1'>
                  提交消息
                </Button>
                <Button variant='secondary' className='flex-1'>
                  重置表单
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 优势总结 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className='bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200'
      >
        <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
          CSS Modules 适用场景
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold text-green-700 mb-3'>
              ✅ 适合使用
            </h3>
            <ul className='space-y-2 text-gray-700'>
              <li>• 大型项目，需要样式隔离</li>
              <li>• 团队协作，避免样式冲突</li>
              <li>• 性能敏感的应用</li>
              <li>• 渐进式迁移现有项目</li>
              <li>• 需要使用现有CSS库</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-red-700 mb-3'>
              ❌ 不太适合
            </h3>
            <ul className='space-y-2 text-gray-700'>
              <li>• 需要动态主题切换</li>
              <li>• 大量条件样式</li>
              <li>• 运行时样式生成</li>
              <li>• 简单的原型项目</li>
              <li>• 需要样式与组件状态深度集成</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
