#!/bin/bash

# Netlify 构建脚本
# 将环境变量注入到 env.js 文件中

echo "开始构建..."

# 创建包含环境变量的 env.js 文件
cat > env.js << EOF
// 环境变量加载器 - 由构建脚本生成
window.ENV = {
    SUPABASE_URL: '${SUPABASE_URL}',
    SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}'
};
EOF

echo "环境变量已注入到 env.js"
echo "构建完成！"
