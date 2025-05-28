// Supabase 配置
const SUPABASE_URL = 'https://xgfjhunnohnplxfkksen.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZmpodW5ub2hucGx4Zmtrc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMTIsImV4cCI6MjA2Mzk5MzIxMn0.j10v6k7xzuz64NwMVtS1_xA-KjuOEoLIldWvsgU_0vw';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 简单的密码哈希函数
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
