// Supabase 配置
// 从环境变量获取配置信息，如果没有则使用占位符
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'your-supabase-url'; 
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 简单的密码哈希函数
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
