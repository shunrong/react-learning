/**
 * 样式方案类型定义
 */

// 样式方案枚举
export enum StyleSolution {
  CSS_MODULES = 'css-modules',
  STYLED_COMPONENTS = 'styled-components',
  EMOTION = 'emotion',
  TAILWIND = 'tailwind',
}

// 样式方案信息
export interface StyleSolutionInfo {
  id: StyleSolution;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  bestFor: string[];
  bundleSize: number; // KB
  learningCurve: 'easy' | 'medium' | 'hard';
  performance: number; // 1-10 评分
  devExperience: number; // 1-10 评分
  category: 'traditional' | 'css-in-js' | 'utility-first';
}

// 样式示例组件属性
export interface StyleExampleProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

// 组件状态
export interface ComponentState {
  isActive: boolean;
  isLoading: boolean;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// 主题配置
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    background: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// 性能测试结果
export interface PerformanceResult {
  solution: StyleSolution;
  renderTime: number; // ms
  bundleSize: number; // KB
  memoryUsage: number; // MB
  cssSizeGenerated: number; // KB
}

// 代码示例
export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: 'typescript' | 'css' | 'javascript';
}
