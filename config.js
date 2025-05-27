// Supabase 配置
const SUPABASE_URL = 'https://pvrhphegqewruutmdzpt.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cmhwaGVncWV3cnV1dG1kenB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTQ2NDksImV4cCI6MjA2MzkzMDY0OX0.5KJsUFmJwru8_DTC9npiwmMbZC8Mj95jZSWb6PQ1AuU'; // 替换为你的 Supabase Anon Key

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 简单的密码哈希函数
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
