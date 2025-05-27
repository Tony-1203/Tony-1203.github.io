// 用户认证系统

// 当页面加载完成时，检查用户是否已登录
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupAuthToggle();
    setupAuthListeners();
});

// 检查用户是否已经登录
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // 用户已登录，显示主容器
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        document.getElementById('user-welcome').textContent = JSON.parse(currentUser).username;
    } else {
        // 用户未登录，显示登录界面
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
    }
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
function login(username, password) {
    const loginMessage = document.getElementById('login-message');

    if (!username || !password) {
        loginMessage.textContent = '用户名和密码不能为空';
        loginMessage.className = 'auth-message error';
        return;
    }

    // 从本地存储获取用户数据
    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        // 登录成功
        const currentUser = { username: username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // 显示主内容
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        document.getElementById('user-welcome').textContent = username;
        
        // 加载用户测试结果（如果有）
        loadUserTestResults(username);
    } else {
        loginMessage.textContent = '用户名或密码错误';
        loginMessage.className = 'auth-message error';
    }
}

// 注册函数
function register(username, password, confirmPassword) {
    const registerMessage = document.getElementById('register-message');

    // 验证输入
    if (!username || !password || !confirmPassword) {
        registerMessage.textContent = '所有字段都必须填写';
        registerMessage.className = 'auth-message error';
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent = '两次输入的密码不匹配';
        registerMessage.className = 'auth-message error';
        return;
    }

    // 从本地存储获取用户数据
    let users = JSON.parse(localStorage.getItem('users')) || {};

    // 检查用户名是否已存在
    if (users[username]) {
        registerMessage.textContent = '用户名已被使用';
        registerMessage.className = 'auth-message error';
        return;
    }

    // 创建新用户
    users[username] = {
        password: password,
        mbti_result: "",
        career_result: "",
        mbti_description: ""
    };

    // 保存用户数据到本地存储
    localStorage.setItem('users', JSON.stringify(users));

    // 显示成功消息
    registerMessage.textContent = '注册成功！请登录';
    registerMessage.className = 'auth-message success';

    // 清空注册表单
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';

    // 切换到登录表单
    setTimeout(() => {
        document.getElementById('login-toggle').click();
    }, 1000);
}

// 登出函数
function logout() {
    // 移除当前用户信息
    localStorage.removeItem('currentUser');
    
    // 重置全局变量
    mbti_result = "";
    career_result = "";
    mbti_description = "";
    resetCurrentTest();
    
    // 显示登录界面
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    
    // 清空登录表单
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-message').textContent = '';
}

// 加载用户测试结果
function loadUserTestResults(username) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userData = users[username];
    
    if (userData) {
        // 恢复用户的测试结果
        mbti_result = userData.mbti_result || "";
        career_result = userData.career_result || "";
        mbti_description = userData.mbti_description || "";
        
        // 更新界面显示状态
        checkAndShowCombinedButton();
    }
}

// 保存用户测试结果
function saveUserTestResults() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const username = currentUser.username;
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[username]) {
            users[username].mbti_result = mbti_result;
            users[username].career_result = career_result;
            users[username].mbti_description = mbti_description;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// 修改原有函数以保存用户测试结果
const originalShowMBTIResult = window.showMBTIResult;
if (originalShowMBTIResult) {
    window.showMBTIResult = function() {
        originalShowMBTIResult.apply(this, arguments);
        saveUserTestResults();
    };
}

const originalShowCareerResult = window.showCareerResult;
if (originalShowCareerResult) {
    window.showCareerResult = function() {
        originalShowCareerResult.apply(this, arguments);
        saveUserTestResults();
    };
}
