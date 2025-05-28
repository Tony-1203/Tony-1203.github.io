# Netlify 部署指南

## 🚀 快速部署步骤

### 1. 连接 GitHub 仓库到 Netlify

1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 "New site from Git"
3. 选择 "GitHub" 并授权访问
4. 选择您的仓库：`Tony-1203/Tony-1203.github.io`

### 2. 配置构建设置

在 Netlify 部署设置中配置：

```
Build command: ./build.sh
Publish directory: .
```

### 3. 设置环境变量

在 Netlify 控制台中，进入：
**Site settings > Environment variables > Add variable**

添加以下环境变量：

```
变量名: SUPABASE_URL
值: https://xgfjhunnohnplxfkksen.supabase.co

变量名: SUPABASE_ANON_KEY  
值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZmpodW5ub2hucGx4Zmtrc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMTIsImV4cCI6MjA2Mzk5MzIxMn0.j10v6k7xzuz64NwMVtS1_xA-KjuOEoLIldWvsgU_0vw
```

### 4. 部署

点击 "Deploy site" 按钮，Netlify 会自动：

1. 拉取您的 GitHub 代码
2. 运行 `build.sh` 脚本
3. 将环境变量注入到 `env.js` 文件中
4. 部署静态网站

## 🔒 安全特性

✅ **敏感信息保护**：API 密钥只存在于 Netlify 环境变量中，不会暴露在源代码中

✅ **自动构建**：每次推送代码到 GitHub 都会自动触发重新部署

✅ **环境隔离**：本地开发和生产环境使用不同的配置文件

## 🛠 本地开发

```bash
# 设置本地开发环境
./dev.sh

# 直接在浏览器中打开 index.html
```

## 📋 文件说明

- `env.js` - 生产环境配置模板
- `env.local.js` - 本地开发配置（包含真实密钥，不提交到Git）
- `build.sh` - Netlify 构建脚本
- `netlify.toml` - Netlify 配置文件
- `dev.sh` - 本地开发设置脚本

## 🚨 重要提醒

1. 永远不要将真实的 API 密钥提交到 Git 仓库
2. `env.local.js` 文件已在 `.gitignore` 中，确保不会被意外提交
3. 如需更新密钥，只需在 Netlify 环境变量中修改即可
