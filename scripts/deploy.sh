#!/bin/bash

set -e

echo "🚀 开始构建所有应用..."

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查环境
log "检查 Node.js 和 pnpm 版本..."
node --version
pnpm --version

# 清理之前的构建
log "清理之前的构建..."
pnpm clean
rm -rf docs/.vitepress/dist
find packages -name "dist" -type d -exec rm -rf {} +

# 安装依赖
log "安装依赖..."
pnpm install

# 类型检查
log "运行类型检查..."
pnpm type-check

# 代码检查
log "运行代码检查..."
# pnpm lint  # 暂时禁用直到 ESLint 配置修复
warning "代码检查被跳过，需要修复 ESLint 配置"

# 构建文档
log "📚 构建文档站点..."
pnpm docs:build
success "文档构建完成"

# 构建所有 demo 应用
log "🔧 构建所有 Demo 应用..."

# Hooks Playground
log "构建 Hooks Playground..."
pnpm --filter hooks-playground build
success "Hooks Playground 构建完成"

# State Management
log "构建状态管理 Demo..."
pnpm --filter state-management-comparison build
success "状态管理 Demo 构建完成"

# Routing System
log "构建路由系统 Demo..."
pnpm --filter routing-evolution build
success "路由系统 Demo 构建完成"

# Styling Solutions
log "构建样式解决方案 Demo..."
pnpm --filter styling-solutions build
success "样式解决方案 Demo 构建完成"

# Performance Optimization
log "构建性能优化 Demo..."
pnpm --filter performance-optimization build
success "性能优化 Demo 构建完成"

# SSR Solutions
log "构建 SSR 解决方案 Demo..."
pnpm --filter ssr-solutions build
success "SSR 解决方案 Demo 构建完成"

success "🎉 所有应用构建完成！"

echo ""
echo "📁 构建产物位置："
echo "  - 📚 文档: docs/.vitepress/dist"
echo "  - 🎯 Hooks: packages/hooks-playground/dist"
echo "  - 🔄 State: packages/state-solution/dist"
echo "  - 🧭 Routing: packages/routing-solution/dist"
echo "  - 🎨 Styling: packages/styling-solution/dist"
echo "  - ⚡ Performance: packages/perf-solution/dist"
echo "  - 🚀 SSR: packages/ssr-solution/dist"

echo ""
echo "🌐 部署到 Vercel："
echo "  1. 将代码推送到 GitHub"
echo "  2. 在 Vercel 中导入项目"
echo "  3. Vercel 会自动检测 vercel.json 配置"
echo "  4. 部署后访问: https://react.hilime.me"

echo ""
echo "🎯 各应用访问地址："
echo "  - 文档主站: https://react.hilime.me/"
echo "  - Hooks: https://react.hilime.me/hooks-playground/"
echo "  - 状态管理: https://react.hilime.me/state-management/"
echo "  - 路由系统: https://react.hilime.me/routing-system/"
echo "  - 样式方案: https://react.hilime.me/styling-solutions/"
echo "  - 性能优化: https://react.hilime.me/performance/"
echo "  - SSR 方案: https://react.hilime.me/ssr-solutions/"
