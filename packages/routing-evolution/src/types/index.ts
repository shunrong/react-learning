// 路由相关类型定义

export interface RouteExample {
  id: string;
  title: string;
  description: string;
  version: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  component: React.ComponentType;
}

export interface RouteVersion {
  version: string;
  name: string;
  releaseDate: string;
  description: string;
  keyFeatures: string[];
  breakingChanges?: string[];
  migrationGuide?: string;
  examples: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  badge?: string;
  external?: boolean;
}

export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  code: string;
  demo: React.ComponentType;
  concepts: string[];
  tips?: string[];
}

export interface RoutePattern {
  name: string;
  description: string;
  useCase: string;
  example: string;
  pros: string[];
  cons: string[];
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
  category: 'loading' | 'rendering' | 'navigation' | 'memory';
}

export interface BrowserSupport {
  feature: string;
  chrome: string;
  firefox: string;
  safari: string;
  edge: string;
  ie?: string;
}

// Hook 相关类型
export interface UseRouterResult {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  navigate: (to: string, options?: any) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
}

export interface RouteGuardConfig {
  requireAuth?: boolean;
  requireRoles?: string[];
  redirectTo?: string;
  fallback?: React.ComponentType;
}

export interface LazyRouteConfig {
  path: string;
  componentPath: string;
  preload?: boolean;
  chunkName?: string;
  prefetch?: boolean;
}

// 实验性功能类型
export interface ExperimentalFeature {
  name: string;
  description: string;
  status: 'experimental' | 'beta' | 'stable' | 'deprecated';
  since: string;
  example?: string;
  risks?: string[];
}

// 性能分析相关
export interface RoutePerformanceData {
  routePath: string;
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  bundleSize: number;
  timestamp: number;
}

export interface MetricsData {
  navigation: {
    total: number;
    avg: number;
    min: number;
    max: number;
  };
  routes: RoutePerformanceData[];
  errors: Array<{
    route: string;
    error: string;
    timestamp: number;
  }>;
}

// 工具函数类型
export type RouteTransition = 'fade' | 'slide' | 'scale' | 'none';

export interface RouteTransitionConfig {
  type: RouteTransition;
  duration: number;
  easing: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// 事件类型
export interface RouteEvent {
  type: 'navigation' | 'error' | 'load' | 'unload';
  route: string;
  timestamp: number;
  data?: any;
}

export type RouteEventHandler = (event: RouteEvent) => void;

// 路由配置类型
export interface AppRoute {
  path: string;
  element: React.ReactElement;
  children?: AppRoute[];
  index?: boolean;
  caseSensitive?: boolean;
  loader?: () => Promise<any>;
  action?: () => Promise<any>;
  errorElement?: React.ReactElement;
  handle?: any;
}

// 导出所有类型的联合类型，便于批量导入
export type * from './index';

// 常量类型
export const ROUTE_VERSIONS = ['v3', 'v4', 'v5', 'v6', 'v7'] as const;

export type RouteVersionType = (typeof ROUTE_VERSIONS)[number];

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const ROUTE_PATTERNS = [
  'basic-routing',
  'nested-routing',
  'dynamic-routing',
  'protected-routing',
  'lazy-routing',
  'modal-routing',
] as const;

export type RoutePatternType = (typeof ROUTE_PATTERNS)[number];
