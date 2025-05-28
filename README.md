# 性格与职业测试系统

## 配置说明

### 安全配置
为了保护敏感信息同时支持GitHub Pages部署，本项目采用以下配置方式：

1. **config.js** - 公开的配置模板，不包含真实的API密钥
2. **config.local.js** - 本地配置文件，包含真实的API密钥（不被Git追踪）
3. **config.prod.js** - 生产配置文件，用于GitHub Pages部署
4. **config.loader.js** - 智能配置加载器，自动检测环境并加载相应配置
5. **config.template.js** - 配置模板，供新开发者参考

### 自动环境检测
系统会自动检测运行环境：
- **GitHub Pages环境** (`*.github.io`): 自动加载 `config.prod.js`
- **本地开发环境**: 优先加载 `config.local.js`，失败时回退到 `config.prod.js`

### 设置步骤

1. **本地开发**: 复制 `config.template.js` 为 `config.local.js` 并填入配置
2. **GitHub Pages部署**: 系统自动使用 `config.prod.js`，无需额外配置

### 注意事项

- **config.local.js** 已被添加到 `.gitignore` 中，不会被提交到代码仓库
- 在部署到生产环境时，请确保正确配置环境变量
- 不要将真实的API密钥提交到公开仓库

## 文件结构

```
├── config.js           # 公开配置模板
├── config.local.js     # 本地配置（包含真实密钥，不被git追踪）
├── config.prod.js      # 生产配置（GitHub Pages使用）
├── config.loader.js    # 智能配置加载器
├── config.template.js  # 配置模板
├── .gitignore         # Git忽略文件配置
└── ...
```

## 部署说明

### GitHub Pages部署
1. 确保 `config.prod.js` 包含正确的生产环境配置
2. 推送代码到GitHub仓库
3. 启用GitHub Pages功能
4. 系统会自动使用生产配置

## 开发环境设置

确保您的本地环境中存在 `config.local.js` 文件，否则应用将无法正常连接到数据库。
