# 性格与职业测试系统

一个基于MBTI性格测试和霍兰德职业兴趣理论的综合测试系统，帮助用户了解自己的性格特质和职业倾向。

## 🌟 功能特性

- **MBTI性格测试**: 16种人格类型测试
- **霍兰德职业兴趣测试**: RIASEC六边形理论
- **综合分析**: 结合性格和兴趣的专业推荐
- **用户认证**: 基于Supabase的用户登录系统
- **数据持久化**: 测试结果保存和历史记录

## 🚀 在线访问

通过 GitHub Pages 访问：[https://tony-1203.github.io](https://tony-1203.github.io)

## 📁 项目文件结构

### 核心网站文件 (已部署)
```
├── index.html              # 主页面
├── styles.css              # 样式文件
├── script.js               # 主要逻辑
├── auth.js                 # 用户认证
├── predict.js              # 预测功能
├── config.js               # 配置文件（生产环境）
├── mbti_questions.json     # MBTI题库
├── career_questions.json   # 职业兴趣题库
├── majors_data.js          # 专业数据
├── majors_detail_data.js   # 专业详细信息
├── score_rank_data.js      # 分数排名数据
└── .gitignore              # Git忽略文件
```

### 开发文件 (不部署)
以下文件夹包含数据处理和开发工具，但不会部署到网站：
- `career_database/` - 职业数据库处理脚本
- `major_database/` - 专业数据库和Excel文件
- `mbti_database/` - MBTI测试数据处理
- `probability_database/` - 概率预测相关
- `relation_database/` - 关系映射数据库

## 🔧 本地开发

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

### 2. 启动本地开发

在本地环境中，系统会自动加载 `config.local.js` 文件。直接在浏览器中打开 `index.html` 即可开始使用。

## 📊 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **托管**: GitHub Pages
- **数据处理**: Python (开发阶段)

## 🔒 安全特性

- 敏感配置信息通过 `.gitignore` 保护
- 生产环境不包含真实的API密钥
- 使用Supabase的行级安全（RLS）保护用户数据
- 开发和生产环境配置分离

## 📈 数据流程

1. **题库生成**: Python脚本处理Excel数据 → JSON格式题库
2. **专业映射**: 关系数据库建立性格特质与专业的对应关系
3. **前端展示**: JavaScript读取JSON数据，实现测试逻辑
4. **结果存储**: Supabase数据库保存用户测试结果

## 🎯 主要功能模块

### MBTI性格测试
- 基于四个维度的性格分析
- 16种人格类型识别
- 详细的性格描述和特质分析

### 霍兰德职业兴趣测试
- RIASEC六边形理论实现
- 职业兴趣类型评估
- 相关职业推荐

### 综合分析
- 性格与兴趣的匹配度分析
- 个性化的专业推荐
- 基于历史数据的录取概率预测

## 📝 更新日志

### v2.0.1 (2025-05-28)
- ✅ 重构配置管理系统
- ✅ 移除敏感信息，提升安全性
- ✅ 优化Git仓库结构
- ✅ 完善文档说明

## 📄 许可证

© 2025 Tony. 保留所有权利。

## 🤝 贡献

欢迎提交问题和建议！如果您发现任何bug或有改进意见，请创建Issue。
