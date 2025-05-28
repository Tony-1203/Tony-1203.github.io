// 环境变量加载器 - 生产环境版本
// 这个文件会在 Netlify 构建时被替换为包含真实环境变量的版本
window.ENV = {
    SUPABASE_URL: 'your-supabase-url-placeholder',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key-placeholder'
};
