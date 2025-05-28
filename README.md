# 性格与职业测试系统

## 配置说明

### 安全配置
为了保护敏感信息，本项目采用以下配置方式：

1. **config.js** - 公开的配置模板，不包含真实的API密钥
2. **config.local.js** - 本地配置文件，包含真实的API密钥（不会被git追踪）
3. **config.template.js** - 配置模板，供新开发者参考

### 设置步骤

1. 复制 `config.template.js` 为 `config.local.js`
2. 在 `config.local.js` 中填入真实的Supabase配置信息：
   ```javascript
   const SUPABASE_URL = 'your-supabase-url';
   const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
   ```

### 注意事项

- **config.local.js** 已被添加到 `.gitignore` 中，不会被提交到代码仓库
- 在部署到生产环境时，请确保正确配置环境变量
- 不要将真实的API密钥提交到公开仓库

## 文件结构

```
├── config.js          # 公开配置模板
├── config.local.js     # 本地配置（包含真实密钥，不被git追踪）
├── config.template.js  # 配置模板
├── .gitignore         # Git忽略文件配置
└── ...
```

## 开发环境设置

确保您的本地环境中存在 `config.local.js` 文件，否则应用将无法正常连接到数据库。
