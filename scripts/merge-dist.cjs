#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(message) {
  console.log(`🔧 ${message}`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    log(`警告: 源目录不存在: ${src}`);
    return;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  execSync(`cp -r "${src}"/* "${dest}"/`, { stdio: 'inherit' });
  log(`✅ 复制 ${src} 到 ${dest}`);
}

async function mergeDistributions() {
  try {
    log('🚀 开始合并构建产物...');
    
    // 清理并创建目标目录
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      execSync(`rm -rf "${distDir}"`, { stdio: 'inherit' });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // 复制文档站点（作为根路径）
    const docsSource = path.join(process.cwd(), 'docs/.vitepress/dist');
    if (fs.existsSync(docsSource)) {
      copyDir(docsSource, distDir);
    } else {
      log('❌ 文档构建产物不存在');
    }
    
    // 复制各个应用
    const apps = [
      { name: 'hooks-playground', path: 'hooks-playground' },
      { name: 'state-solution', path: 'state-management' },
      { name: 'routing-solution', path: 'routing-system' },
      { name: 'styling-solution', path: 'styling-solutions' },
      { name: 'perf-solution', path: 'performance' },
      { name: 'ssr-solution', path: 'ssr-solutions' }
    ];
    
    for (const app of apps) {
      const appSource = path.join(process.cwd(), `packages/${app.name}/dist`);
      const appDest = path.join(distDir, app.path);
      copyDir(appSource, appDest);
    }
    
    log('🎉 构建产物合并完成！');
    
    // 列出最终的目录结构
    log('📁 最终目录结构:');
    execSync(`find "${distDir}" -maxdepth 2 -type d`, { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ 合并构建产物失败:', error.message);
    process.exit(1);
  }
}

mergeDistributions();
