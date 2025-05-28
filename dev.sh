#!/bin/bash

# 本地开发脚本
# 为本地开发环境设置配置

echo "设置本地开发环境..."

# 检查是否存在本地环境配置
if [ -f "env.local.js" ]; then
    # 复制本地配置到 env.js
    cp env.local.js env.js
    echo "✅ 本地环境配置已设置"
else
    echo "❌ 找不到 env.local.js 文件"
    echo "请先创建 env.local.js 文件并添加您的 Supabase 配置"
    exit 1
fi

echo "🚀 可以开始本地开发了！"
echo "直接在浏览器中打开 index.html 即可"
