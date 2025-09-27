#!/bin/bash

# 设置环境配置文件的脚本

echo "🔧 设置环境配置文件..."

# 创建开发环境配置
cat > .env.development << 'EOF'
NODE_ENV=development
VITE_BASE_URL=http://localhost
VITE_DOCS_URL=http://localhost:5173
EOF

# 创建生产环境配置
cat > .env.production << 'EOF'
NODE_ENV=production
VITE_BASE_URL=https://react.hilime.me
VITE_DOCS_URL=https://react.hilime.me
EOF

echo "✅ 环境配置文件创建完成！"
echo "  - .env.development (本地开发)"
echo "  - .env.production (生产环境)"

echo ""
echo "📝 使用说明："
echo "  1. 本地开发时会自动使用 .env.development"
echo "  2. 生产构建时会自动使用 .env.production"
echo "  3. 可以通过修改这些文件来调整环境配置"
