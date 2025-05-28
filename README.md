# 性格与职业测试系统

一个基于MBTI性格测试和霍兰德职业兴趣理论的综合测试系统，帮助用户了解自己的性格特质和职业倾向。

## 功能特性

- **MBTI性格测试**: 16种人格类型测试
- **霍兰德职业兴趣测试**: RIASEC六边形理论
- **综合分析**: 结合性格和兴趣的专业推荐
- **用户认证**: 基于Supabase的用户登录系统
- **数据持久化**: 测试结果保存和历史记录

## 快速开始

### 1. 环境配置

首先需要配置Supabase连接信息：

```bash
# 复制配置模板
cp config.template.js config.local.js
```

然后编辑 `config.local.js` 文件，填入您的Supabase配置信息：

```javascript
const SUPABASE_URL = '您的Supabase URL'; 
const SUPABASE_ANON_KEY = '您的Supabase匿名密钥';
```

### 2. 本地开发

在本地环境中，系统会自动加载 `config.local.js` 文件。直接在浏览器中打开 `index.html` 即可开始使用。

### 3. 生产部署

对于GitHub Pages或其他静态托管：

1. 确保 `config.js` 中使用环境变量或安全的配置方式
2. 敏感信息不应直接暴露在客户端代码中
3. 使用Supabase的RLS（行级安全）来保护数据

## 项目结构

```
├── index.html              # 主页面
├── config.template.js      # 配置模板
├── config.local.js         # 本地配置（不提交）
├── config.js              # 生产配置
├── auth.js                # 用户认证
├── script.js              # 主要逻辑
├── styles.css             # 样式文件
├── mbti_questions.json    # MBTI题库
├── career_questions.json  # 职业兴趣题库
└── major_database/        # 专业数据库
```

## 安全注意事项

- `config.js` 和 `config.local.js` 已添加到 `.gitignore`
- 生产环境请使用环境变量或其他安全方式管理敏感信息
- Supabase密钥应设置适当的权限限制

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **托管**: GitHub Pages

## 开发指南

### 添加新的测试题目

1. 编辑 `mbti_questions.json` 或 `career_questions.json`
2. 按照现有格式添加新题目
3. 确保题目分类和选项格式正确

### 修改专业推荐算法

1. 查看 `relation_database/` 目录下的映射文件
2. 修改特质与专业的对应关系
3. 更新 `majors_data.js` 中的专业信息

## 许可证

© 2025 Tony. 保留所有权利。