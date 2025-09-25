/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { css, keyframes, ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Zap,
  Code,
  Palette,
  Settings,
  Eye,
  Play,
  ArrowRight,
  CheckCircle,
  ThumbsUp,
  Heart,
} from 'lucide-react';

// 定义主题类型
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: number;
}

// 主题配置
const lightTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: 8,
};

const darkTheme: Theme = {
  colors: {
    primary: '#60a5fa',
    secondary: '#a78bfa',
    background: '#1f2937',
    text: '#f9fafb',
    border: '#374151',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: 8,
};

// 动画关键帧
const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const Container = styled.div<{ theme: Theme }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large}px;
`;

const Card = styled.div<{
  theme: Theme;
  variant?: 'primary' | 'secondary' | 'default';
}>`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius}px;
  padding: ${props => props.theme.spacing.large}px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;

  ${props =>
    props.variant === 'primary' &&
    css`
      border-color: ${props.theme.colors.primary};
      background: linear-gradient(
        135deg,
        ${props.theme.colors.primary}10,
        ${props.theme.colors.primary}05
      );
    `}

  ${props =>
    props.variant === 'secondary' &&
    css`
      border-color: ${props.theme.colors.secondary};
      background: linear-gradient(
        135deg,
        ${props.theme.colors.secondary}10,
        ${props.theme.colors.secondary}05
      );
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const Button = styled.button<{
  theme: Theme;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}>`
  border: none;
  border-radius: ${props => props.theme.borderRadius}px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.small}px;
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return css`
          padding: ${props.theme.spacing.small}px
            ${props.theme.spacing.medium}px;
          font-size: 14px;
        `;
      case 'large':
        return css`
          padding: ${props.theme.spacing.medium}px
            ${props.theme.spacing.large}px;
          font-size: 18px;
        `;
      default:
        return css`
          padding: ${props.theme.spacing.medium}px
            ${props.theme.spacing.large}px;
          font-size: 16px;
        `;
    }
  }}

  /* Style variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.primary};
          color: white;
          &:hover {
            background: ${props.theme.colors.primary}dd;
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return css`
          background: ${props.theme.colors.secondary};
          color: white;
          &:hover {
            background: ${props.theme.colors.secondary}dd;
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary};
          &:hover {
            background: ${props.theme.colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${props.theme.colors.text};
          &:hover {
            background: ${props.theme.colors.primary}20;
          }
        `;
      default:
        return css`
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          &:hover {
            border-color: ${props.theme.colors.primary};
          }
        `;
    }
  }}

  ${props =>
    props.isLoading &&
    css`
      cursor: not-allowed;
      opacity: 0.7;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}
`;

const AnimatedBox = styled.div<{ isActive: boolean }>`
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 16px;
  margin: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props =>
    props.isActive &&
    css`
      animation: ${bounce} 2s infinite;
    `}

  &:hover {
    animation: ${pulse} 1s infinite;
  }
`;

const CodeBlock = styled.pre<{ theme: Theme }>`
  background: ${props =>
    props.theme.colors.background === '#ffffff' ? '#1f2937' : '#374151'};
  color: ${props =>
    props.theme.colors.background === '#ffffff' ? '#f9fafb' : '#e5e7eb'};
  padding: ${props => props.theme.spacing.large}px;
  border-radius: ${props => props.theme.borderRadius}px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: ${props => props.theme.spacing.medium}px 0;
`;

const GradientText = styled.h2<{ theme: Theme }>`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.secondary}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const InteractiveDemo = styled.div<{ theme: Theme }>`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius}px;
  padding: ${props => props.theme.spacing.large}px;
  text-align: center;
  background: ${props => props.theme.colors.background}22;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function EmotionDemo() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState('styled');

  const currentTheme = isDarkTheme ? darkTheme : lightTheme;

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const demos = [
    {
      id: 'styled',
      title: 'Styled Components',
      description: '使用 styled 语法创建样式组件',
      code: `const Button = styled.button\`
  background: \${props => props.theme.colors.primary};
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: \${props => props.theme.colors.primary}dd;
    transform: translateY(-1px);
  }
\`;`,
    },
    {
      id: 'css-prop',
      title: 'CSS Prop',
      description: '直接在 JSX 中使用 css prop',
      code: `<div
  css={css\`
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    padding: 20px;
    border-radius: 8px;
    color: white;
    
    &:hover {
      transform: scale(1.05);
    }
  \`}
>
  Emotion CSS Prop
</div>`,
    },
    {
      id: 'theming',
      title: '主题系统',
      description: '强大的主题支持和动态切换',
      code: `const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  }
};

<ThemeProvider theme={theme}>
  <Button theme={theme} />
</ThemeProvider>`,
    },
    {
      id: 'animations',
      title: '动画和关键帧',
      description: 'CSS-in-JS 中的动画处理',
      code: `const bounce = keyframes\`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
\`;

const AnimatedBox = styled.div\`
  animation: \${bounce} 2s infinite;
\`;`,
    },
  ];

  return (
    <ThemeProvider theme={currentTheme}>
      <div
        css={css`
          min-height: 100vh;
          background: ${currentTheme.colors.background};
          color: ${currentTheme.colors.text};
          transition: all 0.3s ease;
        `}
      >
        <Container theme={currentTheme}>
          {/* 头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            css={css`
              text-align: center;
              margin-bottom: 48px;
            `}
          >
            <div
              css={css`
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                border-radius: 20px;
                margin-bottom: 24px;
              `}
            >
              <Zap
                css={css`
                  width: 40px;
                  height: 40px;
                  color: white;
                `}
              />
            </div>

            <GradientText theme={currentTheme}>
              Emotion 样式方案演示
            </GradientText>

            <p
              css={css`
                font-size: 1.25rem;
                color: ${currentTheme.colors.text}aa;
                max-width: 600px;
                margin: 0 auto 32px;
                line-height: 1.6;
              `}
            >
              高性能的 CSS-in-JS 库，提供更好的 TypeScript 支持和灵活的 API 设计
            </p>

            {/* 主题切换 */}
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
                margin-bottom: 32px;
              `}
            >
              <span
                css={css`
                  font-size: 14px;
                `}
              >
                浅色主题
              </span>
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                css={css`
                  width: 60px;
                  height: 30px;
                  border-radius: 15px;
                  border: none;
                  background: ${isDarkTheme
                    ? currentTheme.colors.primary
                    : '#e5e7eb'};
                  position: relative;
                  cursor: pointer;
                  transition: all 0.3s ease;

                  &::after {
                    content: '';
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: white;
                    position: absolute;
                    top: 2px;
                    left: ${isDarkTheme ? '32px' : '2px'};
                    transition: all 0.3s ease;
                  }
                `}
              />
              <span
                css={css`
                  font-size: 14px;
                `}
              >
                深色主题
              </span>
            </div>
          </motion.div>

          {/* 演示选项卡 */}
          <Card
            theme={currentTheme}
            css={css`
              margin-bottom: 32px;
            `}
          >
            <div
              css={css`
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
                flex-wrap: wrap;
              `}
            >
              {demos.map(demo => (
                <Button
                  key={demo.id}
                  theme={currentTheme}
                  variant={activeDemo === demo.id ? 'primary' : 'outline'}
                  size='small'
                  onClick={() => setActiveDemo(demo.id)}
                >
                  {demo.title}
                </Button>
              ))}
            </div>

            {/* 当前演示内容 */}
            {demos.map(
              demo =>
                activeDemo === demo.id && (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      css={css`
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: ${currentTheme.colors.text};
                      `}
                    >
                      {demo.title}
                    </h3>
                    <p
                      css={css`
                        color: ${currentTheme.colors.text}aa;
                        margin-bottom: 16px;
                      `}
                    >
                      {demo.description}
                    </p>
                    <CodeBlock theme={currentTheme}>{demo.code}</CodeBlock>
                  </motion.div>
                )
            )}
          </Card>

          {/* 交互演示区域 */}
          <div
            css={css`
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
              margin-bottom: 32px;

              @media (max-width: 768px) {
                grid-template-columns: 1fr;
              }
            `}
          >
            {/* 组件演示 */}
            <Card theme={currentTheme} variant='primary'>
              <h3
                css={css`
                  font-size: 1.25rem;
                  font-weight: bold;
                  margin-bottom: 16px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                `}
              >
                <Play
                  css={css`
                    width: 20px;
                    height: 20px;
                  `}
                />
                组件演示
              </h3>

              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  align-items: center;
                `}
              >
                <Button
                  theme={currentTheme}
                  variant='primary'
                  onClick={handleLoadingDemo}
                  isLoading={isLoading}
                >
                  <ThumbsUp
                    css={css`
                      width: 16px;
                      height: 16px;
                    `}
                  />
                  {isLoading ? '加载中...' : '点赞按钮'}
                </Button>

                <Button theme={currentTheme} variant='secondary' size='large'>
                  <Heart
                    css={css`
                      width: 16px;
                      height: 16px;
                    `}
                  />
                  收藏按钮
                </Button>

                <Button theme={currentTheme} variant='outline'>
                  边框按钮
                </Button>

                <Button theme={currentTheme} variant='ghost' size='small'>
                  幽灵按钮
                </Button>
              </div>
            </Card>

            {/* 动画演示 */}
            <Card theme={currentTheme} variant='secondary'>
              <h3
                css={css`
                  font-size: 1.25rem;
                  font-weight: bold;
                  margin-bottom: 16px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                `}
              >
                <Zap
                  css={css`
                    width: 20px;
                    height: 20px;
                  `}
                />
                动画演示
              </h3>

              <InteractiveDemo theme={currentTheme}>
                <p
                  css={css`
                    margin-bottom: 16px;
                    color: ${currentTheme.colors.text}aa;
                  `}
                >
                  点击下方的盒子查看动画效果
                </p>

                <AnimatedBox
                  isActive={isAnimating}
                  onClick={() => setIsAnimating(!isAnimating)}
                />

                <Button
                  theme={currentTheme}
                  variant='outline'
                  size='small'
                  onClick={() => setIsAnimating(!isAnimating)}
                >
                  {isAnimating ? '停止动画' : '开始动画'}
                </Button>
              </InteractiveDemo>
            </Card>
          </div>

          {/* 特性展示 */}
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 24px;
              margin-bottom: 32px;
            `}
          >
            {[
              {
                icon: Code,
                title: 'TypeScript 支持',
                description: '完整的 TypeScript 类型定义，提供更好的开发体验',
                features: ['完整的类型推导', '主题类型安全', 'IDE 智能提示'],
              },
              {
                icon: Zap,
                title: '高性能',
                description: '优化的运行时性能，更小的包体积',
                features: ['源码映射', '自动厂商前缀', '死代码消除'],
              },
              {
                icon: Palette,
                title: '灵活的 API',
                description: '多种使用方式，适应不同的开发习惯',
                features: ['styled 语法', 'css prop', '对象样式'],
              },
              {
                icon: Settings,
                title: '强大的主题',
                description: '内置主题系统，支持动态主题切换',
                features: ['主题嵌套', '动态切换', '类型安全'],
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card theme={currentTheme}>
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      margin-bottom: 16px;
                    `}
                  >
                    <div
                      css={css`
                        width: 48px;
                        height: 48px;
                        background: linear-gradient(
                          135deg,
                          ${currentTheme.colors.primary},
                          ${currentTheme.colors.secondary}
                        );
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 16px;
                      `}
                    >
                      <feature.icon
                        css={css`
                          width: 24px;
                          height: 24px;
                          color: white;
                        `}
                      />
                    </div>
                    <h4
                      css={css`
                        font-size: 1.125rem;
                        font-weight: bold;
                        color: ${currentTheme.colors.text};
                      `}
                    >
                      {feature.title}
                    </h4>
                  </div>

                  <p
                    css={css`
                      color: ${currentTheme.colors.text}aa;
                      margin-bottom: 16px;
                      line-height: 1.5;
                    `}
                  >
                    {feature.description}
                  </p>

                  <ul
                    css={css`
                      list-style: none;
                      padding: 0;
                      margin: 0;
                    `}
                  >
                    {feature.features.map((feat, idx) => (
                      <li
                        key={idx}
                        css={css`
                          display: flex;
                          align-items: center;
                          margin-bottom: 8px;
                          font-size: 14px;
                          color: ${currentTheme.colors.text}dd;
                        `}
                      >
                        <CheckCircle
                          css={css`
                            width: 16px;
                            height: 16px;
                            color: #10b981;
                            margin-right: 8px;
                          `}
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 使用建议 */}
          <Card theme={currentTheme}>
            <div
              css={css`
                display: flex;
                items: center;
                margin-bottom: 16px;
              `}
            >
              <Eye
                css={css`
                  width: 24px;
                  height: 24px;
                  margin-right: 8px;
                  color: ${currentTheme.colors.primary};
                `}
              />
              <h3
                css={css`
                  font-size: 1.25rem;
                  font-weight: bold;
                  color: ${currentTheme.colors.text};
                `}
              >
                使用建议
              </h3>
            </div>

            <div
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;

                @media (max-width: 768px) {
                  grid-template-columns: 1fr;
                }
              `}
            >
              <div>
                <h4
                  css={css`
                    color: #10b981;
                    font-weight: bold;
                    margin-bottom: 12px;
                  `}
                >
                  ✅ 适用场景
                </h4>
                <ul
                  css={css`
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: ${currentTheme.colors.text}aa;
                    line-height: 1.6;
                  `}
                >
                  <li>• 需要强类型支持的项目</li>
                  <li>• 对性能有较高要求的应用</li>
                  <li>• 复杂的主题系统</li>
                  <li>• 需要动态样式的场景</li>
                </ul>
              </div>

              <div>
                <h4
                  css={css`
                    color: #ef4444;
                    font-weight: bold;
                    margin-bottom: 12px;
                  `}
                >
                  ⚠️ 注意事项
                </h4>
                <ul
                  css={css`
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: ${currentTheme.colors.text}aa;
                    line-height: 1.6;
                  `}
                >
                  <li>• 学习成本相对较高</li>
                  <li>• 需要配置 Babel 插件</li>
                  <li>• 运行时样式注入的性能考虑</li>
                  <li>• 服务端渲染需要额外配置</li>
                </ul>
              </div>
            </div>

            <div
              css={css`
                margin-top: 24px;
                padding: 16px;
                background: ${currentTheme.colors.primary}20;
                border-radius: 8px;
                display: flex;
                items: center;
                justify-content: space-between;
              `}
            >
              <span
                css={css`
                  color: ${currentTheme.colors.text};
                  font-weight: 500;
                `}
              >
                💡 Emotion 是现代 React 应用中 CSS-in-JS 的优秀选择
              </span>
                <a
                  href='https://emotion.sh/docs/introduction'
                  target='_blank'
                  rel='noopener noreferrer'
                  css={css`
                    display: inline-flex;
                    align-items: center;
                    padding: ${currentTheme.spacing.small}px ${currentTheme.spacing.medium}px;
                    background: ${currentTheme.colors.primary};
                    color: white;
                    text-decoration: none;
                    border-radius: ${currentTheme.borderRadius}px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    
                    &:hover {
                      background: ${currentTheme.colors.primary}dd;
                      transform: translateY(-1px);
                    }
                  `}
                >
                  查看文档
                  <ArrowRight
                    css={css`
                      width: 16px;
                      height: 16px;
                      margin-left: 4px;
                    `}
                  />
                </a>
            </div>
          </Card>
        </Container>
      </div>
    </ThemeProvider>
  );
}
