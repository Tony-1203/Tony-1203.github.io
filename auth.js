// 用户认证系统

// 全局变量存储当前用户信息
let currentUserData = null;

// 当页面加载完成时，检查用户是否已登录
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupAuthToggle();
    setupAuthListeners();
});

// 检查用户是否已经登录
async function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            
            // 特别处理开发者模式
            if (userData.id === 'dev' || userData.username === 'admin (开发者)') {
                currentUserData = { id: 'dev', username: 'admin' };
                // 显示主容器
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('main-container').style.display = 'block';
                document.getElementById('user-welcome').textContent = 'admin (开发者模式)';
                
                // 开发者模式直接显示主界面
                document.getElementById('welcome-tip-screen').style.display = 'none';
                document.getElementById('main-screen').style.display = 'block';
                
                // 更新测试次数显示
                if (typeof updateTestCountsDisplay === 'function') {
                    await updateTestCountsDisplay();
                }
                return;
            }
            
            // 验证普通用户是否仍然有效
            const { data: user, error } = await supabase
                .from('users')
                .select('id, username')
                .eq('username', userData.username)
                .single();
            
            if (user && !error) {
                currentUserData = user;
                // 用户已登录，显示主容器
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('main-container').style.display = 'block';
                document.getElementById('user-welcome').textContent = user.username;
                
                // 普通用户显示温馨提示界面
                document.getElementById('welcome-tip-screen').style.display = 'block';
                document.getElementById('main-screen').style.display = 'none';
                
                // 加载用户测试结果
                await loadUserTestResults(user.id);
                
                // 更新测试次数显示
                if (typeof updateTestCountsDisplay === 'function') {
                    await updateTestCountsDisplay();
                }
            } else {
                // 用户信息无效，清除本地存储
                localStorage.removeItem('currentUser');
                showAuthContainer();
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            localStorage.removeItem('currentUser');
            showAuthContainer();
        }
    } else {
        showAuthContainer();
    }
}

function showAuthContainer() {
    // 用户未登录，显示登录界面
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
}

// 设置登录/注册切换
function setupAuthToggle() {
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginToggle.addEventListener('click', function() {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerToggle.addEventListener('click', function() {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
}

// 设置登录和注册按钮的监听器
function setupAuthListeners() {
    // 登录按钮点击事件
    document.getElementById('login-btn').addEventListener('click', function() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        login(username, password);
    });

    // 登录表单回车事件
    document.getElementById('login-username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('login-password').focus();
        }
    });

    document.getElementById('login-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('login-btn').click();
        }
    });

    // 注册按钮点击事件
    document.getElementById('register-btn').addEventListener('click', function() {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        register(username, password, confirmPassword);
    });

    // 注册表单回车事件
    const registerFields = ['register-username', 'register-password', 'register-confirm-password'];
    registerFields.forEach((field, index) => {
        document.getElementById(field).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (index < registerFields.length - 1) {
                    document.getElementById(registerFields[index + 1]).focus();
                } else {
                    document.getElementById('register-btn').click();
                }
            }
        });
    });

    // 登出按钮点击事件
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// 登录函数
async function login(username, password) {
    const loginMessage = document.getElementById('login-message');

    if (!username || !password) {
        loginMessage.textContent = '用户名和密码不能为空';
        loginMessage.className = 'auth-message error';
        return;
    }

    // 检查是否为开发者模式
    if (username === 'admin' && password === 'admin1018') {
        loginMessage.textContent = '进入开发者模式...';
        loginMessage.className = 'auth-message success';
        
        // 模拟开发者用户数据
        currentUserData = { id: 'dev', username: 'admin' };
        const currentUser = { username: 'admin (开发者)', id: 'dev' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // 显示主内容
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        document.getElementById('user-welcome').textContent = 'admin (开发者模式)';
        
        // 开发者模式直接显示主界面，跳过温馨提示
        document.getElementById('welcome-tip-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'block';
        
        // 更新测试次数显示 (开发者模式显示为无限制)
        if (typeof updateTestCountsDisplay === 'function') {
            await updateTestCountsDisplay();
        }
        
        // 清空登录表单
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        loginMessage.textContent = '';
        
        // 延迟弹出开发者设置界面，确保DOM完全加载
        setTimeout(() => {
            showDeveloperSetup();
        }, 100);
        return;
    }

    try {
        // 显示加载状态
        loginMessage.textContent = '正在登录...';
        loginMessage.className = 'auth-message';

        const passwordHash = await hashPassword(password);
        
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', username)
            .eq('password_hash', passwordHash)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                loginMessage.textContent = '用户名或密码错误';
            } else {
                loginMessage.textContent = '登录失败，请重试';
                console.error('登录错误:', error);
            }
            loginMessage.className = 'auth-message error';
            return;
        }

        // 登录成功
        currentUserData = user;
        const currentUser = { username: user.username, id: user.id };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // 显示主内容容器
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        document.getElementById('user-welcome').textContent = username;
        
        // 首次登录显示温馨提示界面，隐藏主界面
        document.getElementById('welcome-tip-screen').style.display = 'block';
        document.getElementById('main-screen').style.display = 'none';
        
        // 加载用户测试结果
        await loadUserTestResults(user.id);
        
        // 更新测试次数显示（包括温馨提示界面）
        if (typeof updateTestCountsDisplay === 'function') {
            await updateTestCountsDisplay();
        }
        
        // 清空登录表单
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        loginMessage.textContent = '';
        
    } catch (error) {
        console.error('登录过程中发生错误:', error);
        loginMessage.textContent = '登录失败，请检查网络连接';
        loginMessage.className = 'auth-message error';
    }
}

// 注册函数
async function register(username, password, confirmPassword) {
    const registerMessage = document.getElementById('register-message');

    // 显示注册失败消息
    registerMessage.textContent = '注册失败，请联系管理员';
    registerMessage.className = 'auth-message error';
    
    // 清空注册表单
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
    
    return;
}

// 登出函数
function logout() {
    // 移除当前用户信息
    localStorage.removeItem('currentUser');
    currentUserData = null;
    
    // 重置全局变量
    if (typeof mbti_result !== 'undefined') mbti_result = "";
    if (typeof career_result !== 'undefined') career_result = "";
    if (typeof mbti_description !== 'undefined') mbti_description = "";
    if (typeof resetCurrentTest === 'function') resetCurrentTest();
    
    // 显示登录界面
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    
    // 清空登录表单
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-message').textContent = '';
}

// 加载用户测试结果
async function loadUserTestResults(userId) {
    try {
        const { data: testResults, error } = await supabase
            .from('test_results')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('加载测试结果失败:', error);
            return;
        }

        if (testResults && testResults.length > 0) {
            const result = testResults[0];
            // 恢复用户的测试结果
            if (typeof mbti_result !== 'undefined') mbti_result = result.mbti_result || "";
            if (typeof career_result !== 'undefined') career_result = result.career_result || "";
            if (typeof mbti_description !== 'undefined') mbti_description = result.mbti_description || "";
            if (typeof selectedDomain !== 'undefined') selectedDomain = result.selected_domain || "";
            
            // 更新界面显示状态
            if (typeof checkAndShowCombinedButton === 'function') {
                checkAndShowCombinedButton();
            }
        }
    } catch (error) {
        console.error('加载测试结果时发生错误:', error);
    }
}

// 保存用户测试结果
async function saveUserTestResults() {
    if (!currentUserData) {
        console.error('用户未登录，无法保存测试结果');
        return;
    }

    try {
        const testData = {
            user_id: currentUserData.id,
            mbti_result: typeof mbti_result !== 'undefined' ? mbti_result : "",
            career_result: typeof career_result !== 'undefined' ? career_result : "",
            mbti_description: typeof mbti_description !== 'undefined' ? mbti_description : "",
            selected_domain: typeof selectedDomain !== 'undefined' ? selectedDomain : ""
        };

        // 先检查是否已有记录
        const { data: existing } = await supabase
            .from('test_results')
            .select('id')
            .eq('user_id', currentUserData.id)
            .single();

        if (existing) {
            // 更新现有记录
            const { error } = await supabase
                .from('test_results')
                .update(testData)
                .eq('id', existing.id);

            if (error) {
                console.error('更新测试结果失败:', error);
            }
        } else {
            // 创建新记录
            const { error } = await supabase
                .from('test_results')
                .insert([testData]);

            if (error) {
                console.error('保存测试结果失败:', error);
            }
        }
    } catch (error) {
        console.error('保存测试结果时发生错误:', error);
    }
}

// 检查并递增测试次数
async function checkAndIncrementTestCount(testType) {
    if (!currentUserData) {
        console.error('用户未登录，无法检查测试次数');
        return { canTake: false, error: '请先登录' };
    }

    // 开发者模式无限制
    if (currentUserData.id === 'dev') {
        return { 
            canTake: true, 
            newCount: 0,
            remainingAttempts: 999,
            isDeveloperMode: true
        };
    }

    try {
        // 首先获取用户当前的测试次数
        const { data: existing, error: fetchError } = await supabase
            .from('test_results')
            .select('mbti_count, career_count')
            .eq('user_id', currentUserData.id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误码
            console.error('获取测试次数失败:', fetchError);
            return { canTake: false, error: '获取测试次数失败' };
        }

        const currentCounts = existing || { mbti_count: 0, career_count: 0 };
        const currentCount = testType === 'mbti' ? (currentCounts.mbti_count || 0) : (currentCounts.career_count || 0);

        // 检查是否已达到限制
        if (currentCount >= 3) {
            const testName = testType === 'mbti' ? 'MBTI性格测试' : '职业兴趣测试';
            return { 
                canTake: false, 
                error: `您已完成${testName}${currentCount}次，已达到最大次数限制（3次）` 
            };
        }

        // 递增测试次数
        const updateData = {
            user_id: currentUserData.id,
            [testType === 'mbti' ? 'mbti_count' : 'career_count']: currentCount + 1
        };

        if (existing) {
            // 更新现有记录
            const { error: updateError } = await supabase
                .from('test_results')
                .update(updateData)
                .eq('user_id', currentUserData.id);

            if (updateError) {
                console.error('更新测试次数失败:', updateError);
                return { canTake: false, error: '更新测试次数失败' };
            }
        } else {
            // 创建新记录，包含初始数据
            const initialData = {
                user_id: currentUserData.id,
                mbti_count: testType === 'mbti' ? 1 : 0,
                career_count: testType === 'career' ? 1 : 0,
                mbti_result: "",
                career_result: "",
                mbti_description: "",
                selected_domain: ""
            };

            const { error: insertError } = await supabase
                .from('test_results')
                .insert([initialData]);

            if (insertError) {
                console.error('创建测试记录失败:', insertError);
                return { canTake: false, error: '创建测试记录失败' };
            }
        }

        const newCount = currentCount + 1;
        const remainingAttempts = 3 - newCount;
        return { 
            canTake: true, 
            newCount: newCount,
            remainingAttempts: remainingAttempts
        };

    } catch (error) {
        console.error('检查测试次数时发生错误:', error);
        return { canTake: false, error: '检查测试次数时发生错误' };
    }
}

// 获取用户当前的测试次数
async function getUserTestCounts() {
    if (!currentUserData) {
        return { mbti_count: 0, career_count: 0 };
    }

    try {
        const { data: existing, error } = await supabase
            .from('test_results')
            .select('mbti_count, career_count')
            .eq('user_id', currentUserData.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('获取测试次数失败:', error);
            return { mbti_count: 0, career_count: 0 };
        }

        return {
            mbti_count: existing?.mbti_count || 0,
            career_count: existing?.career_count || 0
        };
    } catch (error) {
        console.error('获取测试次数时发生错误:', error);
        return { mbti_count: 0, career_count: 0 };
    }
}

// 开发者模式相关函数
function showDeveloperSetup() {
    console.log('🔧 开发者设置模态框被调用');
    
    const modal = document.getElementById('developer-modal');
    if (!modal) {
        console.error('❌ 开发者模态框元素未找到');
        return;
    }
    
    console.log('✅ 开发者模态框元素找到，正在显示');
    modal.style.display = 'flex';
    
    // 设置提交按钮事件监听器
    const submitBtn = document.getElementById('dev-submit-btn');
    if (submitBtn) {
        submitBtn.onclick = handleDeveloperSubmit;
        console.log('✅ 提交按钮事件监听器已设置');
    } else {
        console.error('❌ 提交按钮未找到');
    }
    
    // 清空之前的输入
    document.getElementById('dev-mbti-result').value = '';
    document.getElementById('dev-career-result').value = '';
    document.getElementById('dev-domain-select').value = '';
    document.getElementById('dev-message').textContent = '';
    
    // 添加输入验证
    const mbtiInput = document.getElementById('dev-mbti-result');
    const careerInput = document.getElementById('dev-career-result');
    
    mbtiInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        validateMBTIInput(this.value);
    });
    
    careerInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        validateCareerInput(this.value);
    });
    
    // 回车键提交
    [mbtiInput, careerInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleDeveloperSubmit();
            }
        });
    });
}

function closeDeveloperModal() {
    document.getElementById('developer-modal').style.display = 'none';
}

function validateMBTIInput(value) {
    const message = document.getElementById('dev-message');
    const validChars = /^[EINJSTFP]*$/;
    const validTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ];
    
    if (value.length === 0) {
        message.textContent = '';
        message.className = 'auth-message';
        return true;
    }
    
    if (!validChars.test(value)) {
        message.textContent = 'MBTI只能包含字母E/I、N/S、T/F、J/P';
        message.className = 'auth-message error';
        return false;
    }
    
    if (value.length === 4) {
        if (validTypes.includes(value)) {
            message.textContent = '';
            message.className = 'auth-message';
            return true;
        } else {
            message.textContent = '请输入有效的MBTI类型';
            message.className = 'auth-message error';
            return false;
        }
    }
    
    return true;
}

function validateCareerInput(value) {
    const message = document.getElementById('dev-message');
    const validChars = /^[RIASEC]*$/;
    
    if (value.length === 0) {
        message.textContent = '';
        message.className = 'auth-message';
        return true;
    }
    
    if (!validChars.test(value)) {
        message.textContent = '职业兴趣结果只能包含字母R、I、A、S、E、C';
        message.className = 'auth-message error';
        return false;
    }
    
    if (value.length > 3) {
        message.textContent = '职业兴趣结果最多3个字母';
        message.className = 'auth-message error';
        return false;
    }
    
    return true;
}

function handleDeveloperSubmit() {
    console.log('🚀 开发者提交按钮被点击');
    
    const mbtiValue = document.getElementById('dev-mbti-result').value.trim().toUpperCase();
    const careerValue = document.getElementById('dev-career-result').value.trim().toUpperCase();
    const domainValue = document.getElementById('dev-domain-select').value;
    const message = document.getElementById('dev-message');
    
    console.log('📝 输入值:', { mbtiValue, careerValue, domainValue });
    
    // 验证输入
    if (!mbtiValue || mbtiValue.length !== 4) {
        message.textContent = '请输入4个字母的MBTI结果';
        message.className = 'auth-message error';
        console.log('❌ MBTI输入验证失败');
        return;
    }
    
    if (!careerValue || careerValue.length !== 3) {
        message.textContent = '请输入3个字母的职业兴趣结果';
        message.className = 'auth-message error';
        console.log('❌ 职业兴趣输入验证失败');
        return;
    }
    
    if (!domainValue) {
        message.textContent = '请选择专业方向';
        message.className = 'auth-message error';
        console.log('❌ 专业方向选择验证失败');
        return;
    }
    
    // 最终验证
    if (!validateMBTIInput(mbtiValue) || !validateCareerInput(careerValue)) {
        console.log('❌ 最终验证失败');
        return;
    }
    
    console.log('✅ 所有验证通过，开始设置数据');
    
    // 设置全局变量 - 调用script.js中的函数来设置
    if (typeof setDeveloperData === 'function') {
        console.log('📊 调用setDeveloperData函数');
        
        const mbtiDescriptions = {
            'INTJ': '建筑师',
            'INTP': '思想家',
            'ENTJ': '指挥官',
            'ENTP': '辩论家',
            'INFJ': '提倡者',
            'INFP': '调停者',
            'ENFJ': '主人公',
            'ENFP': '竞选者',
            'ISTJ': '物流师',
            'ISFJ': '守卫者',
            'ESTJ': '总经理',
            'ESFJ': '执政官',
            'ISTP': '鉴赏家',
            'ISFP': '探险家',
            'ESTP': '企业家',
            'ESFP': '娱乐家'
        };
        
        const mbtiDesc = mbtiDescriptions[mbtiValue] || '';
        
        setDeveloperData(mbtiValue, careerValue, domainValue, mbtiDesc);
        
        message.textContent = '设置成功，正在生成综合分析...';
        message.className = 'auth-message success';
        
        console.log('✅ 开发者模式设置完成:', {
            mbti_result: mbtiValue,
            career_result: careerValue,
            selectedDomain: domainValue,
            mbti_description: mbtiDesc
        });
    } else {
        console.error('❌ setDeveloperData 函数未找到');
        message.textContent = 'setDeveloperData 函数未找到';
        message.className = 'auth-message error';
        return;
    }
    
    // 关闭模态框并调用综合分析
    setTimeout(() => {
        console.log('📊 准备调用generateCombinedReport');
        closeDeveloperModal();
        // 调用综合分析函数，传入选择的专业方向
        if (typeof generateCombinedReport === 'function') {
            console.log(`📈 调用generateCombinedReport("${domainValue}")`);
            generateCombinedReport(domainValue);
        } else {
            console.error('❌ generateCombinedReport 函数未找到');
        }
    }, 1000);
}


