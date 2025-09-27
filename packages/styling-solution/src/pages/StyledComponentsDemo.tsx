import { useState } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import {
  Save,
  Trash2,
  Edit3,
  Heart,
  MessageCircle,
  Palette,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

// 主题定义
const lightTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#374151',
    textSecondary: '#6b7280',
    textLight: '#6b7280',
    border: '#e5e7eb',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#1f2937',
    surface: '#374151',
    text: '#f9fafb',
    textLight: '#d1d5db',
    border: '#4b5563',
  },
};

// 全局样式
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

// 样式化组件
const StyledButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return '0.5rem 1rem';
      case 'large':
        return '1rem 2rem';
      default:
        return '0.75rem 1.5rem';
    }
  }};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return '0.75rem';
      case 'large':
        return '1rem';
      default:
        return '0.875rem';
    }
  }};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};

  background: ${props => {
    switch (props.variant) {
      case 'secondary':
        return props.theme.colors.surface;
      case 'success':
        return props.theme.colors.success;
      case 'warning':
        return props.theme.colors.warning;
      case 'error':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};

  color: ${props =>
    props.variant === 'secondary' ? props.theme.colors.text : 'white'};

  border: ${props =>
    props.variant === 'secondary'
      ? `1px solid ${props.theme.colors.border}`
      : 'none'};

  box-shadow: ${props => props.theme.shadows.sm};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};

    background: ${props => {
      switch (props.variant) {
        case 'secondary':
          return props.theme.colors.border;
        case 'success':
          return '#059669';
        case 'warning':
          return '#d97706';
        case 'error':
          return '#dc2626';
        default:
          return '#2563eb';
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  ${props =>
    props.isLoading &&
    `
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1rem;
      height: 1rem;
      margin: -0.5rem 0 0 -0.5rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;

const StyledCard = styled.div<{
  variant?: 'default' | 'elevated' | 'outlined';
  isSelected?: boolean;
  isHoverable?: boolean;
}>`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  transition: all 0.3s ease;

  ${props =>
    props.variant === 'elevated' &&
    `
    box-shadow: ${props.theme.shadows.md};
    border: none;
  `}

  ${props =>
    props.variant === 'outlined' &&
    `
    border: 2px solid ${props.theme.colors.border};
    box-shadow: none;
  `}
  
  ${props =>
    props.isSelected &&
    `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
  
  ${props =>
    props.isHoverable &&
    `
    &:hover {
      box-shadow: ${props.theme.shadows.lg};
      transform: translateY(-2px);
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const CardContent = styled.div`
  padding: 1.5rem;

  p {
    margin: 0 0 1rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label<{ required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};

  ${props =>
    props.required &&
    `
    &::after {
      content: ' *';
      color: ${props.theme.colors.error};
    }
  `}
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid
    ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  &:disabled {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid
    ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  min-height: 6rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid
    ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const HelpText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled(motion.div)`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const codeExamples = {
  button: `// Styled Components 按钮
const StyledButton = styled.button\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: \${props => {
    switch (props.size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  
  background: \${props => {
    switch (props.variant) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      default: return props.theme.colors.primary;
    }
  }};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: \${props => props.theme.shadows.md};
  }
\`;

// 使用
<StyledButton variant="primary" size="large">
  点击我
</StyledButton>`,
  theme: `// 主题定义
const lightTheme = {
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#374151'
  }
};

const darkTheme = {
  colors: {
    primary: '#3b82f6',
    background: '#1f2937',
    text: '#f9fafb'
  }
};

// 主题切换
<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
  <App />
</ThemeProvider>`,
};

export default function StyledComponentsDemo() {
  const [isDark, setIsDark] = useState(false);
  const [showCode, setShowCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
  });

  const theme = isDark ? darkTheme : lightTheme;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <ThemeToggle onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
        </ThemeToggle>

        {/* 页面头部 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
                borderRadius: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <Palette className='w-8 h-8 text-white' />
            </div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: '0 0 1rem',
                color: theme.colors.text,
              }}
            >
              Styled Components
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                color: theme.colors.textLight,
                maxWidth: '48rem',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              流行的 CSS-in-JS
              库，提供组件级样式封装、动态主题支持和强大的样式组合能力
            </p>
          </div>
        </Section>

        {/* 特性介绍 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <StyledCard variant='elevated'>
              <CardContent>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Palette
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      color: '#ec4899',
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  动态样式
                </h3>
                <p>基于 props 和 state 动态生成样式，支持复杂的条件样式逻辑</p>
              </CardContent>
            </StyledCard>

            <StyledCard variant='elevated'>
              <CardContent>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Zap
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      color: '#3b82f6',
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  主题支持
                </h3>
                <p>内置主题系统，轻松实现深色模式和主题切换功能</p>
              </CardContent>
            </StyledCard>

            <StyledCard variant='elevated'>
              <CardContent>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(168, 85, 247, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Edit3
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      color: '#a855f7',
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  组件封装
                </h3>
                <p>样式与组件紧密结合，更好的组件化和代码组织</p>
              </CardContent>
            </StyledCard>
          </div>
        </Section>

        {/* 按钮组件示例 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionHeader>
            <SectionTitle>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                动态按钮组件
              </h2>
              <button
                onClick={() =>
                  setShowCode(showCode === 'button' ? null : 'button')
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {showCode === 'button' ? '隐藏代码' : '查看代码'}
              </button>
            </SectionTitle>

            <SectionContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}
              >
                {/* 按钮变体 */}
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '1rem',
                    }}
                  >
                    按钮变体（支持主题切换）
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <StyledButton variant='primary'>主要按钮</StyledButton>
                    <StyledButton variant='secondary'>次要按钮</StyledButton>
                    <StyledButton variant='success'>成功按钮</StyledButton>
                    <StyledButton variant='warning'>警告按钮</StyledButton>
                    <StyledButton variant='error'>错误按钮</StyledButton>
                  </div>
                </div>

                {/* 按钮尺寸 */}
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '1rem',
                    }}
                  >
                    动态尺寸
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <StyledButton size='small'>小按钮</StyledButton>
                    <StyledButton size='medium'>中等按钮</StyledButton>
                    <StyledButton size='large'>大按钮</StyledButton>
                  </div>
                </div>

                {/* 按钮状态 */}
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '1rem',
                    }}
                  >
                    交互状态
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <StyledButton>
                      <Save className='w-4 h-4' />
                      带图标
                    </StyledButton>
                    <StyledButton isLoading>加载中</StyledButton>
                    <StyledButton disabled>禁用状态</StyledButton>
                    <StyledButton fullWidth>全宽按钮</StyledButton>
                  </div>
                </div>
              </div>
            </SectionContent>

            {showCode === 'button' && (
              <div
                style={{
                  borderTop: `1px solid ${theme.colors.border}`,
                  background: theme.colors.surface,
                  padding: '1.5rem',
                }}
              >
                <pre
                  style={{
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    margin: 0,
                    color: theme.colors.text,
                  }}
                >
                  <code>{codeExamples.button}</code>
                </pre>
              </div>
            )}
          </SectionHeader>
        </Section>

        {/* 卡片组件示例 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SectionHeader>
            <SectionTitle>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                主题化卡片组件
              </h2>
            </SectionTitle>

            <SectionContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                <StyledCard variant='default' isHoverable>
                  <CardHeader>
                    <CardTitle>默认卡片</CardTitle>
                    <CardSubtitle>自适应主题</CardSubtitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      这个卡片会根据当前主题自动调整颜色，试试切换深色模式！
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <StyledButton size='small' variant='secondary'>
                        <Heart className='w-4 h-4' />
                      </StyledButton>
                      <StyledButton size='small' variant='secondary'>
                        <MessageCircle className='w-4 h-4' />
                      </StyledButton>
                    </div>
                  </CardFooter>
                </StyledCard>

                <StyledCard variant='elevated' isHoverable>
                  <CardHeader>
                    <CardTitle>提升卡片</CardTitle>
                    <CardSubtitle>带阴影效果</CardSubtitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      提升样式的卡片具有更明显的阴影效果，适合突出重要内容。
                    </p>
                  </CardContent>
                  <CardFooter>
                    <StyledButton size='small' variant='primary'>
                      查看详情
                    </StyledButton>
                  </CardFooter>
                </StyledCard>

                <StyledCard variant='outlined' isSelected isHoverable>
                  <CardHeader>
                    <CardTitle>选中卡片</CardTitle>
                    <CardSubtitle>描边 + 选中状态</CardSubtitle>
                  </CardHeader>
                  <CardContent>
                    <p>这个卡片当前处于选中状态，注意边框和阴影的变化。</p>
                  </CardContent>
                  <CardFooter>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <StyledButton size='small' variant='success'>
                        <Edit3 className='w-4 h-4' />
                      </StyledButton>
                      <StyledButton size='small' variant='error'>
                        <Trash2 className='w-4 h-4' />
                      </StyledButton>
                    </div>
                  </CardFooter>
                </StyledCard>
              </div>
            </SectionContent>
          </SectionHeader>
        </Section>

        {/* 表单组件示例 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SectionHeader>
            <SectionTitle>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                主题化表单组件
              </h2>
            </SectionTitle>

            <SectionContent>
              <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
                <FormGroup>
                  <Label required>姓名</Label>
                  <Input
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='请输入您的姓名'
                  />
                  <HelpText>这将用作您的显示名称</HelpText>
                </FormGroup>

                <FormGroup>
                  <Label required>邮箱地址</Label>
                  <Input
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='your@email.com'
                    hasError={
                      formData.email ? !formData.email.includes('@') : false
                    }
                  />
                  {formData.email && !formData.email.includes('@') && (
                    <ErrorText>请输入有效的邮箱地址</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>消息分类</Label>
                  <Select
                    value={formData.category}
                    onChange={e =>
                      handleInputChange('category', e.target.value)
                    }
                  >
                    <option value=''>请选择...</option>
                    <option value='general'>一般咨询</option>
                    <option value='support'>技术支持</option>
                    <option value='feedback'>反馈建议</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label required>消息内容</Label>
                  <Textarea
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                    placeholder='请详细描述您的问题或建议...'
                    rows={4}
                  />
                </FormGroup>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <StyledButton variant='primary' fullWidth>
                    提交消息
                  </StyledButton>
                  <StyledButton variant='secondary' fullWidth>
                    重置表单
                  </StyledButton>
                </div>
              </div>
            </SectionContent>
          </SectionHeader>
        </Section>

        {/* 主题系统演示 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SectionHeader>
            <SectionTitle>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                主题系统演示
              </h2>
              <button
                onClick={() =>
                  setShowCode(showCode === 'theme' ? null : 'theme')
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {showCode === 'theme' ? '隐藏代码' : '查看代码'}
              </button>
            </SectionTitle>

            <SectionContent>
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    marginBottom: '2rem',
                    color: theme.colors.textLight,
                  }}
                >
                  点击右上角的主题切换按钮，观察所有组件如何无缝切换主题
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      background: theme.colors.primary,
                      color: 'white',
                      borderRadius: theme.borderRadius.lg,
                      fontWeight: '500',
                    }}
                  >
                    主色调
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      background: theme.colors.background,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.lg,
                      fontWeight: '500',
                    }}
                  >
                    背景色
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      background: theme.colors.surface,
                      color: theme.colors.text,
                      borderRadius: theme.borderRadius.lg,
                      fontWeight: '500',
                    }}
                  >
                    表面色
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      background: theme.colors.success,
                      color: 'white',
                      borderRadius: theme.borderRadius.lg,
                      fontWeight: '500',
                    }}
                  >
                    成功色
                  </div>
                </div>
                <StyledButton onClick={() => setIsDark(!isDark)} size='large'>
                  {isDark ? (
                    <Sun className='w-4 h-4' />
                  ) : (
                    <Moon className='w-4 h-4' />
                  )}
                  切换到{isDark ? '浅色' : '深色'}主题
                </StyledButton>
              </div>
            </SectionContent>

            {showCode === 'theme' && (
              <div
                style={{
                  borderTop: `1px solid ${theme.colors.border}`,
                  background: theme.colors.surface,
                  padding: '1.5rem',
                }}
              >
                <pre
                  style={{
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    margin: 0,
                    color: theme.colors.text,
                  }}
                >
                  <code>{codeExamples.theme}</code>
                </pre>
              </div>
            )}
          </SectionHeader>
        </Section>

        {/* 动态样式演示 - Styled Components的核心特点 */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.secondary}15)`,
              borderRadius: '1rem',
              padding: '2rem',
              border: `2px solid ${theme.colors.primary}50`,
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '2rem',
                color: theme.colors.text,
              }}
            >
              🎛️ 动态样式 + 主题切换演示
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* 主题切换展示 */}
              <div
                style={{
                  background: theme.colors.surface,
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: `2px dashed ${theme.colors.primary}`,
                }}
              >
                <h3
                  style={{
                    color: theme.colors.primary,
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  🎨 实时主题切换
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: theme.colors.textSecondary,
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  点击下方按钮，看看整个页面如何瞬间切换主题：
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <StyledButton
                    variant='secondary'
                    size='small'
                    onClick={() => setIsDark(false)}
                    style={{
                      opacity: theme === lightTheme ? 1 : 0.7,
                      transform:
                        theme === lightTheme ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Sun size={16} style={{ marginRight: '0.5rem' }} />
                    浅色主题
                  </StyledButton>
                  <StyledButton
                    variant='secondary'
                    size='small'
                    onClick={() => setIsDark(true)}
                    style={{
                      opacity: theme === darkTheme ? 1 : 0.7,
                      transform:
                        theme === darkTheme ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Moon size={16} style={{ marginRight: '0.5rem' }} />
                    深色主题
                  </StyledButton>
                </div>
                <div
                  style={{
                    background: theme.colors.background,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: theme.colors.textSecondary,
                  }}
                >
                  📊 当前主题数据：
                  <br />
                  名称: {theme === lightTheme ? 'Light Theme' : 'Dark Theme'}
                  <br />
                  主色: {theme.colors.primary}
                  <br />
                  背景: {theme.colors.background}
                  <br />
                  文字: {theme.colors.text}
                </div>
              </div>

              {/* props动态样式展示 */}
              <div
                style={{
                  background: theme.colors.surface,
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: `2px dashed ${theme.colors.secondary}`,
                }}
              >
                <h3
                  style={{
                    color: theme.colors.secondary,
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  ⚡ Props驱动的动态样式
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: theme.colors.textSecondary,
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  同一个组件，不同的props = 完全不同的样式：
                </p>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <StyledButton variant='primary' size='small'>
                    Primary Small
                  </StyledButton>
                  <StyledButton variant='secondary' size='medium'>
                    Secondary Medium
                  </StyledButton>
                  <StyledButton variant='warning' size='large'>
                    Warning Large
                  </StyledButton>
                  <StyledButton variant='primary' disabled>
                    Disabled State
                  </StyledButton>
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: theme.colors.textLight,
                    fontStyle: 'italic',
                  }}
                >
                  💡 每个按钮的样式都是基于props实时计算生成的
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '2rem',
                background: `${theme.colors.warning}20`,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: `1px solid ${theme.colors.warning}`,
              }}
            >
              <h4
                style={{
                  color: theme.colors.warning,
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                🚀 这就是Styled Components的威力！
              </h4>
              <p
                style={{
                  color: theme.colors.text,
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                通过JavaScript的表达能力，样式不再是静态的CSS，而是可以基于组件状态、props、context
                动态生成的"活"样式，实现传统CSS难以实现的复杂交互效果。
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </ThemeProvider>
  );
}
