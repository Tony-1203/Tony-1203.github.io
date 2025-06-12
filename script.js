// 全局变量
let questionsData = [];  // 存储所有类别的题目
let flatQuestions = [];  // 扁平化后的所有题目
const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
const careerScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0, X: 0 };
let currentScores = mbtiScores; // 默认为MBTI测试
let current = 0;
let currentCategory = "";
let currentTest = ""; // 当前测试类型: "mbti" 或 "career"
let mbti_result = "";
let career_result = "";

let mbti_description = ""; // 存储MBTI测试的性格描述
let selectedDomain = ""; // 新增：存储用户选择的学科方向
let global_userRank = 0;

// 开发者模式专用函数：设置测试数据
function setDeveloperData(mbtiValue, careerValue, domainValue, mbtiDesc) {
    console.log('🔧 setDeveloperData被调用，参数:', { mbtiValue, careerValue, domainValue, mbtiDesc });
    
    mbti_result = mbtiValue;
    career_result = careerValue;
    selectedDomain = domainValue;
    mbti_description = mbtiDesc;
    
    console.log('✅ 开发者数据已设置:', {
        mbti_result,
        career_result,
        selectedDomain,
        mbti_description
    });
}

// 选择测试类型
function selectTest(testType) {
  // 隐藏主界面，显示测试界面
  document.getElementById('main-screen').style.display = 'none';
  const appDiv = document.getElementById('app');
  appDiv.style.display = 'block';
  appDiv.innerHTML = ''; // 清空先前的内容，包括任何介绍文本

  currentTest = testType;
  
  // 重置通用状态，确保每次测试开始时都是干净的
  current = 0;
  currentCategory = "";

  if (testType === 'mbti') {
    appDiv.className = 'card mbti-theme';
    // 为MBTI测试显示介绍界面
    appDiv.innerHTML = `
      <div class="test-introduction-container" style="padding: 20px; max-width: 600px; margin: 0 auto; text-align: left;">
        <h2 style="text-align: center;">MBTI测试前须知</h2>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 15px;">
          1、参加测试的人员请务必诚实、独立地回答问题，只有如此，才能得到有效的结果。
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 15px;">
          2、《性格分析报告》展示的是你的性格倾向，而不是你的知识、技能、经验。
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 15px;">
          3、MBTI提供的性格类型描述仅供测试者确定自己的性格类型之用，性格类型没有好坏，只有不同。
          每一种性格特征都有其价值和优点，也有缺点和需要注意的地方。清楚地了解自己的性格优劣势，有利于更好地发挥自己的特长，
          而尽可能的在为人处事中避免自己性格中的劣势，更好地和他人相处，更好地作重要的决策。
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
          4、本测试分为四部分，共93题。所有题目没有对错之分，请根据自己的实际情况选择。<br>
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
          只要你是认真、真实地填写了测试问卷，那么通常情况下你都能得到一个确实和你的性格相匹配的类型。
          希望你能从中或多或少地获得一些有益的信息。<br>
        </p>

        <div style="display: flex; flex-direction: column; align-items: center;">
          <button class="option-btn" id="start-mbti-test-btn" style="width: 60%; margin-bottom:10px;">开始测试</button>
          <button class="restart-btn secondary-btn" onclick="backToMain()" style="width: 60%;">返回主页</button>
        </div>
      </div>
    `;
    document.getElementById('start-mbti-test-btn').onclick = async () => {
      // 检查并递增测试次数
      const testCountResult = await checkAndIncrementTestCount('mbti');
      
      if (!testCountResult.canTake) {
        // 显示错误信息
        showTestLimitMessage(testCountResult.error, 'mbti');
        return;
      }

      // 显示剩余次数提示
      if (testCountResult.remainingAttempts > 0) {
        console.log(`开始MBTI测试，剩余${testCountResult.remainingAttempts}次机会`);
      }

      currentScores = mbtiScores;
      // 为MBTI测试初始化问题加载UI
      appDiv.innerHTML = `
        <h3 id="category" class="question-category"></h3>
        <h2 id="question">加载中...</h2>
        <div class="progress-container">
          <div id="progress-bar" class="progress-bar"></div>
        </div>
        <p id="progress-text"></p>
        <div id="options" class="fade-in"></div>
      `;
      loadQuestions('mbti_questions.json');
    }
  } else if (testType === 'career') {
    appDiv.className = 'card career-theme';
    // 为职业兴趣测试显示介绍界面
    appDiv.innerHTML = `
      <div class="test-introduction-container" style="padding: 20px; max-width: 600px; margin: 0 auto; text-align: left;">
        <h2 style="text-align: center;">霍兰德职业兴趣测试说明</h2>
        <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px; text-indent: 2em;">
          本问卷共90道题目，每道题目是一个陈述。请您根据自己的真实情况对这些陈述进行评价，如果符合实际情况就在相应的题目选择“是”，否则选择“否”。
        </p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button class="option-btn" id="start-career-test-btn" style="width: 60%; margin-bottom:10px;">开始测试</button>
        <button class="restart-btn secondary-btn" onclick="backToMain()" style="width: 60%;">返回主页</button>
      </div>
    `;

    document.getElementById('start-career-test-btn').onclick = async () => {
      // 检查并递增测试次数
      const testCountResult = await checkAndIncrementTestCount('career');
      
      if (!testCountResult.canTake) {
        // 显示错误信息
        showTestLimitMessage(testCountResult.error, 'career');
        return;
      }

      // 显示剩余次数提示
      if (testCountResult.remainingAttempts > 0) {
        console.log(`开始职业兴趣测试，剩余${testCountResult.remainingAttempts}次机会`);
      }

      currentScores = careerScores;
      current = 0; // 确保从第一个问题开始
      currentCategory = ""; // 重置类别
      // 初始化问题加载UI
      appDiv.innerHTML = `
        <h3 id="category" class="question-category"></h3>
        <h2 id="question">加载中...</h2>
        <div class="progress-container">
          <div id="progress-bar" class="progress-bar"></div>
        </div>
        <p id="progress-text"></p>
        <div id="options" class="fade-in"></div>
      `;
      loadQuestions('career_questions.json');
    };
  }
}

// 加载题库
async function loadQuestions(jsonFile) {
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) {
      throw new Error('无法加载题库');
    }
    
    // 读取分类题目数据
    questionsData = await response.json();
    
    // 将所有题目扁平化处理
    flatQuestions = [];
    questionsData.forEach(category => {
      category.questions.forEach(q => {
        flatQuestions.push({
          category: category.category,
          question: q.question,
          options: q.options
        });
      });
    });
    
    showQuestion();
  } catch (error) {
    console.error('加载题库出错:', error);
    document.getElementById('question').textContent = '加载题库失败，请刷新页面重试';
  }
}

// 显示当前问题
function showQuestion() {
  if (current >= flatQuestions.length) {
    showResult();
    return;
  }

  const q = flatQuestions[current];
  
  // 如果类别变化，显示新类别
  if (q.category !== currentCategory) {
    currentCategory = q.category;
    document.getElementById('category').textContent = currentCategory;
    document.getElementById('category').style.display = 'block';
  }
  
  document.getElementById('question').textContent = q.question;

  // 更新进度条
  const progress = Math.round(((current) / flatQuestions.length) * 100);
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = `问题 ${current + 1}/${flatQuestions.length}`;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  // 添加淡入动画
  optionsDiv.classList.remove('fade-in');
  void optionsDiv.offsetWidth; // 重置动画
  optionsDiv.classList.add('fade-in');

  q.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.className = 'option-btn';
    btn.onclick = () => {
      currentScores[opt.dimension]++;
      current++;
      showQuestion();
    };
    optionsDiv.appendChild(btn);
  });
}

// 显示测试结果
function showResult() {
  if (currentTest === 'mbti') {
    showMBTIResult();
  } else if (currentTest === 'career') {
    showCareerResult();
  }
}

// 显示MBTI测试结果
function showMBTIResult() {
  const result =
    (mbtiScores.E > mbtiScores.I ? 'E' : 'I') +
    (mbtiScores.S > mbtiScores.N ? 'S' : 'N') +
    (mbtiScores.T > mbtiScores.F ? 'T' : 'F') +
    (mbtiScores.J > mbtiScores.P ? 'J' : 'P');
  
  mbti_result = result;

  const personalityDescriptions = {
    'ISTJ': '严肃、安静、通过全面性和可靠性获得成功。实际、有序、注重事实、逻辑清晰、负责任。',
    'ISFJ': '安静、友好、有责任感、谨慎。致力于履行义务，打造稳定有序的环境。',
    'INFJ': '寻求意义和联系，关注如何最好地服务人类共同利益。有组织有条理，对他人价值观很敏感。',
    'INTJ': '独立思考者，要求高的创新者，始终关注实现目标。有能力组织思想，并将其付诸实践。',
    'ISTP': '容忍性强，灵活，安静的观察者，直到出现问题。分析问题发生的原因，然后快速找到实用的解决方案。',
    'ISFP': '安静、友好、敏感、善良。喜欢自己的空间，适时工作。对自己和他人的需求保持现实和忠实。',
    'INFP': '理想主义者，忠于自己的价值观和重要的人。外在生活与内在价值观一致。好奇，善于发现可能性。',
    'INTP': '寻求合乎逻辑的解释，理论和抽象的兴趣。分析思考而非社交。安静、内省、思考灵活深入。',
    'ESTP': '灵活、容忍，实用主义者，专注于直接结果。理论和概念解释令人厌烦。喜欢积极参与解决问题。',
    'ESFP': '外向、友好、接受性强。热爱生活、人类和物质享受。喜欢与他人一起完成事情，带来现实感和乐趣。',
    'ENFP': '热情、想象力丰富。视生活为充满可能性。快速建立联系，帮助他人，并渴望得到欣赏。',
    'ENTP': '反应快、聪明，善于各种事物。喜欢挑战别人，机智灵活，可能争论只为好玩。',
    'ESTJ': '现实、注重事实，果断，专注于业务或机械。喜欢组织和管理活动，领导决策制定。',
    'ESFJ': '热情、有良心、合作。希望和谐关系和环境，与他人一起精确可靠地完成任务。',
    'ENFJ': '温暖、同理心强、负责任、对他人感受敏感。善于发现他人潜力并帮助发展。可能成为团体催化剂。',
    'ENTJ': '坦率、果断，承担领导责任。迅速发现不合逻辑或低效的程序和政策，制定全面系统的解决方案。'
  };

  // 存储性格描述，用于综合结果展示
  mbti_description = personalityDescriptions[result] || '这是一个独特而有趣的性格组合。';

  // 保存测试结果到 Supabase
  if (typeof saveUserTestResults === 'function') {
    saveUserTestResults();
  }

  document.getElementById('app').innerHTML = `
    <h2>你的MBTI性格类型是</h2>
    <div class="result-type">${result}</div>
    <div class="result">
      <p>${mbti_description}</p>
    </div>
    <button class="restart-btn" onclick="backToMain()">返回主页</button>
  `;
}

// 显示职业兴趣测试结果
function showCareerResult() {
  // 定义 RIASEC 类型及其描述
  const scores = [
    { type: 'R', score: careerScores.R, name: '现实型 (Realistic)', description: '喜欢动手操作或使用工具和机器，倾向于技术性和实用性工作。' },
    { type: 'I', score: careerScores.I, name: '研究型 (Investigative)', description: '喜欢分析和解决问题，倾向于研究性和科学性工作。' },
    { type: 'A', score: careerScores.A, name: '艺术型 (Artistic)', description: '喜欢创造性和表达性活动，倾向于艺术、音乐或写作工作。' },
    { type: 'S', score: careerScores.S, name: '社会型 (Social)', description: '喜欢帮助他人，倾向于教育、咨询或社会服务工作。' },
    { type: 'E', score: careerScores.E, name: '企业型 (Enterprising)', description: '喜欢领导和说服他人，倾向于销售、管理或创业工作。' },
    { type: 'C', score: careerScores.C, name: '常规型 (Conventional)', description: '喜欢有序和结构化的活动，倾向于组织、数据处理或行政工作。' }
  ];

  // 六边形邻近处理逻辑
  function getTopRIASECTypes(scores) {
    const riasecOrder = ['R', 'C', 'E', 'S', 'A', 'I'];
    const adjacencyMap = {
      R: ['C', 'I'],
      C: ['R', 'E'],
      E: ['C', 'S'],
      S: ['E', 'A'],
      A: ['S', 'I'],
      I: ['A', 'R']
    };

    // 主排序：分数；次排序：六边形顺序
    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return riasecOrder.indexOf(a.type) - riasecOrder.indexOf(b.type);
    });

    const result = [scores[0]];

    for (let i = 1; i < scores.length && result.length < 3; i++) {
      const current = scores[i];
      const sameScore = current.score === result[result.length - 1].score;
      const isAdjacent = result.some(r => adjacencyMap[r.type].includes(current.type));

      if (!result.find(r => r.type === current.type)) {
        if (sameScore && isAdjacent) {
          result.push(current);
        } else if (!sameScore) {
          result.push(current);
        }
      }
    }

    // 补足 3 个
    for (let i = 0; result.length < 3 && i < scores.length; i++) {
      if (!result.find(r => r.type === scores[i].type)) {
        result.push(scores[i]);
      }
    }

    return result;
  }

  const topScores = getTopRIASECTypes(scores);
  const typeCombo = topScores.map(s => s.type).join('');
  career_result = typeCombo;

  // 保存测试结果到 Supabase
  if (typeof saveUserTestResults === 'function') {
    saveUserTestResults();
  }

  // 构建结果 HTML
  let resultHTML = `
    <h2>你的职业兴趣类型</h2>
    <div class="result-type">${typeCombo}</div>
    <div class="result">
      <p>你的职业兴趣类型组合是：<strong>${typeCombo}</strong>，以下是各项得分（从高到低）：</p>
      <div class="career-scores">
  `;

  // 添加前3项图表
  topScores.forEach(item => {
    const percentage = (item.score / flatQuestions.length) * 100;
    resultHTML += `
      <div class="career-score-item">
        <div class="career-score-label">${item.name}</div>
        <div class="career-score-bar">
          <div class="career-score-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="career-score-value">${item.score}</div>
      </div>
      <p class="career-description">${item.description}</p>
    `;
  });

  // 主导类型和建议职业
  resultHTML += `
      </div>
      <div class="career-explanation">
        <p>你的主导类型是：<strong>${topScores[0].name}</strong></p>
        <p>根据霍兰德职业兴趣理论，你可能适合的职业领域包括：</p>
        <div class="career-suggestions">
          ${getCareerSuggestions(topScores[0].type, topScores[1].type)}
        </div>
      </div>
    </div>
    <button class="restart-btn" onclick="backToMain()">返回主页</button>
  `;

  document.getElementById('app').innerHTML = resultHTML;
}


// 获取职业建议
function getCareerSuggestions(primaryType, secondaryType) {
  const suggestions = {
    'R': ['工程师', '技术员', '机械师', '农业/森林工作者', '军人', '电工'],
    'I': ['科学家', '研究员', '医生', '分析师', '程序员', '数学家'],
    'A': ['艺术家', '音乐家', '作家', '演员', '设计师', '建筑师'],
    'S': ['教师', '咨询师', '社工', '护士', '治疗师', '人力资源专员'],
    'E': ['经理', '销售人员', '律师', '政治家', '企业家', '市场营销专员'],
    'C': ['会计', '行政助理', '财务分析师', '银行职员', '编辑', '质检员']
  };
  
  let result = `<p><strong>${primaryType}型</strong>相关职业：${suggestions[primaryType].slice(0, 3).join('、')}等</p>`;
  result += `<p><strong>${secondaryType}型</strong>相关职业：${suggestions[secondaryType].slice(0, 3).join('、')}等</p>`;
  result += `<p><strong>${primaryType}-${secondaryType}组合</strong>可能适合：`;
  
  // 组合建议
  const combinedSuggestions = {
    'RI': ['工程师', '技术研究员', '农业科学家'],
    'RA': ['工业设计师', '建筑工程师', '声音技术员'],
    'RS': ['职业培训师', '安全工程师', '消防员'],
    'RE': ['建筑承包商', '工程主管', '农场管理员'],
    'RC': ['质量控制员', '制图员', '航空技术员'],
    
    'IR': ['医学工程师', '环境科学家', '技术研究员'],
    'IA': ['医学插画师', '心理学家', '软件设计师'],
    'IS': ['药剂师', '营养学家', '临床心理学家'],
    'IE': ['科学创业者', '医学行政人员', '研究主管'],
    'IC': ['实验室技术员', '统计学家', '系统分析师'],
    
    // 更多组合...
    'AR': ['产品设计师', '景观设计师', '摄影技术员'],
    'AI': ['医学插画师', '建筑师', '用户体验设计师'],
    'AS': ['艺术治疗师', '表演艺术教师', '语言治疗师'],
    'AE': ['创意总监', '时尚设计师', '媒体制作人'],
    'AC': ['编辑', '网页设计师', '技术作家'],
    
    'SR': ['运动教练', '运动物理治疗师', '职业健康专家'],
    'SI': ['心理咨询师', '学校心理学家', '职业顾问'],
    'SA': ['音乐治疗师', '戏剧治疗师', '特殊教育教师'],
    'SE': ['教育管理员', '社区组织者', '康复主管'],
    'SC': ['学校辅导员', '图书馆员', '医疗记录员'],
    
    'ER': ['建筑经理', '农业企业主', '安全总监'],
    'EI': ['医疗管理人员', '投资分析师', '科研管理者'],
    'EA': ['广告经理', '公关专员', '艺术指导'],
    'ES': ['人力资源经理', '销售培训师', '健康服务管理员'],
    'EC': ['财务经理', '数据分析主管', '行政经理'],
    
    'CR': ['工程检验员', '安全检查员', '测量技术员'],
    'CI': ['数据分析师', '预算分析师', '研究助理'],
    'CA': ['校对编辑', '音乐管理员', '博物馆登记员'],
    'CS': ['就业面试官', '保险理赔员', '医疗记录技术员'],
    'CE': ['信贷分析师', '税务专家', '政府监管员']
  };
  
  // 确保组合顺序一致
  const combinationKey = primaryType + secondaryType;
  const reversedKey = secondaryType + primaryType;
  
  if (combinedSuggestions[combinationKey]) {
    result += combinedSuggestions[combinationKey].join('、');
  } else if (combinedSuggestions[reversedKey]) {
    result += combinedSuggestions[reversedKey].join('、');
  } else {
    result += "多样化的职业选择";
  }
  
  result += '</p>';
  return result;
}

// 返回主界面
function backToMain() {
  // 重置数据(但保留测试结果)
  resetCurrentTest();
  
  // 显示主界面，隐藏测试界面
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('app').style.display = 'none';
  
  // 检查是否两个测试都已完成，显示或隐藏综合分析按钮
  checkAndShowCombinedButton();
  
  // 更新测试次数显示
  if (typeof updateTestCountsDisplay === 'function') {
    updateTestCountsDisplay();
  }
}

// 显示主界面（从温馨提示界面切换到主界面）
function showMainScreen() {
  document.getElementById('welcome-tip-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'block';
  
  // 更新测试次数显示
  if (typeof updateTestCountsDisplay === 'function') {
    updateTestCountsDisplay();
  }
}

// 检查并显示综合分析按钮
function checkAndShowCombinedButton() {
  const combinedBtn = document.getElementById('combined-analysis-btn');
  const completionStatus = document.getElementById('completion-status');
  
  if (mbti_result && career_result) {
    // 两个测试都完成了
    combinedBtn.style.display = 'block';
    completionStatus.style.display = 'block';
    document.getElementById('completed-tests-info').innerHTML = 
      `<span class="completed-test mbti-completed">MBTI (${mbti_result})</span> 和 
       <span class="completed-test career-completed">${career_result}</span>`;
  } else if (mbti_result || career_result) {
    // 只完成了一个测试
    combinedBtn.style.display = 'none';
    completionStatus.style.display = 'block';
    let completedTest = '';
    let pendingTest = '';
    
    if (mbti_result) {
      completedTest = `<span class="completed-test mbti-completed">MBTI (${mbti_result})</span>`;
      pendingTest = '<span class="pending-test">职业兴趣测试</span>';
    } else {
      completedTest = `<span class="completed-test career-completed">${career_result}</span>`;
      pendingTest = '<span class="pending-test">MBTI测试</span>';
    }
    
    document.getElementById('completed-tests-info').innerHTML = 
      `已完成 ${completedTest}，还需完成 ${pendingTest} 才能查看综合分析`;
  } else {
    // 两个测试都没完成
    combinedBtn.style.display = 'none';
    completionStatus.style.display = 'none';
  }
}

// 从MBTI和Holland组合中找出特质
function findCharacteristics(mbti, holland) {
  const characteristics = new Set();
  
  for (let char of holland) {
    const combination = `${mbti}+${char}`;
    if (personality_keywords[combination]) {
      personality_keywords[combination].forEach(keyword => {
        characteristics.add(keyword);
      });
    } else {
      console.log(`未找到${combination}的相关关键词`);
    }
  }
  
  return characteristics;
}

// 修改函数findRecommendedMajors的返回部分的实现，不改变基本逻辑
function findRecommendedMajors(characteristics, domainType) {
  const mapping = domainType === 'history' ? majors_traits_history : majors_traits_physics;
  const results = {};
  
  for (const [major, traits] of Object.entries(mapping)) {
    // 计算特质匹配数量
    const traitsSet = new Set(traits);
    let matchCount = 0;
    characteristics.forEach(char => {
      if (traitsSet.has(char)) {
        matchCount++;
      }
    });
    
    // 计算匹配比例
    const ratio = traits.length > 0 ? matchCount / traits.length : 0; // Avoid division by zero
    results[major] = { matchCount: matchCount, ratio: ratio };
  }
  
  // 按匹配数量从高到低排序，如果匹配数量相同，则按匹配比例从高到低排序
  const sortedResults = Object.entries(results)
    .sort(([, aData], [, bData]) => {
      if (bData.matchCount !== aData.matchCount) {
        return bData.matchCount - aData.matchCount;
      }
      return bData.ratio - aData.ratio; // Secondary sort by ratio
    })
    .slice(0, 10) // 只取前10个专业
    .map(([major, data]) => [major, data.ratio]); // 返回 [major, ratio] 格式
  
  return sortedResults;
}

// 显示专业详情的函数
function showMajorDetail(major, matchScore) {
  // 获取专业详情，如果没有则使用默认值
  const domainSpecificDetails = selectedDomain === 'history' ? majorDetailsHistory : majorDetailsPhysics;
  const detail = domainSpecificDetails[major] || defaultMajorDetail;
  
  // 创建模态窗口
  const modal = document.createElement('div');
  modal.className = 'major-detail-modal';
  
  // 定义可用的年份列表
  const availableYears = Object.keys(detail.scores).sort((a, b) => b - a); // 按年份降序排列
  let currentYear = null; // 默认不选择任何年份
  
  // 获取指定年份的分数数据
  function getScoresByYear(year) {
    return detail.scores[year] || {};
  }
  
  // 构建年份选择器 - 默认不选中任何年份
  let yearSelectorHtml = '<div class="year-selector">';
  yearSelectorHtml += '<span>选择年份: </span>';
  availableYears.forEach(year => {
    yearSelectorHtml += `
      <label class="year-option">
        <input type="checkbox" name="score-year" value="${year}">
        <span>${year}年</span>
      </label>
    `;
  });
  yearSelectorHtml += '</div>';
  
  // 构建学校和分数线列表的初始显示
  function buildSchoolsList(year) {
    // 如果没有选择年份，返回提示信息
    if (!year) {
      return '<p class="no-year-selected">请选择一个年份以查看对应院校及分数线</p>';
    }
    
    const yearScores = getScoresByYear(year);
    let schoolsHtml = '';
    
    // 如果是2024年，添加特殊提示
    if (year === '2024') {
      schoolsHtml += '<p class="year-2024-note" style="font-size: 14px; color: #6b7280; margin-bottom: 10px; font-style: italic;">带星号数据表示该专业组最低分及排名</p>';
    }
    
    schoolsHtml += '<ul class="schools-list">';
    // 直接遍历 yearScores 的键值对，顺序就是 yearScores 的插入顺序
      if (year === '2024') {
        Object.entries(yearScores).forEach(([school, score]) => {
          schoolsHtml += `<li><span class="school-name">${school}</span> <span class="school-score">${score.split('，')[0].trim()}</span></li>`;
        });
      }
      else {
        Object.entries(yearScores).forEach(([school, score]) => {
          schoolsHtml += `<li><span class="school-name">${school}</span> <span class="school-score">${score}</span></li>`;
        });
    }
    schoolsHtml += '</ul>';
    return schoolsHtml;
  }
  
  // 创建新的模态窗口HTML结构，将年份选择和预测概率按钮并排放置
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${major}</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <!-- 专业介绍部分 -->
        <div class="detail-section">
          <h4>专业介绍</h4>
          <p>${detail.description}</p>
        </div>
        
        <!-- 按钮选择区域 - 两个按钮并排 -->
        <div class="detail-section tab-buttons">
          <button class="tab-btn active" id="scores-tab-btn">查看历年分数线</button>
          <button class="tab-btn" id="prediction-tab-btn">预测录取概率</button>
        </div>
        
        <!-- 分割线 -->
        <div class="custom-divider"></div>

        <!-- 院校分数线部分 - 默认显示 -->
        <div class="detail-section tab-content" id="scores-tab">
          <div class="year-control-panel">
            ${yearSelectorHtml}
          </div>
          <div id="schools-data">
            ${buildSchoolsList(currentYear)}
          </div>
        </div>
        
        <!-- 预测概率部分 - 默认隐藏 -->
        <div class="detail-section tab-content" id="prediction-tab" style="display:none;">
          <div class="prediction-controls">
            <button id="predict-probability-btn" class="predict-btn">开始预测录取概率</button>
          </div>
          <div id="probability-results" class="probability-results" style="display: none;">
            <p class="prediction-note">注：预测结果仅供参考，实际录取情况受多种因素影响。</p>
            <ul id="probability-list" class="probability-list"></ul>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(modal);
  
  // 防止滚动
  document.body.style.overflow = 'hidden';
  
  // 添加关闭事件
  const closeBtn = modal.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  });
  
  // 点击模态窗口外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }
  });
  
  // 添加标签切换功能
  const scoresTabBtn = modal.querySelector('#scores-tab-btn');
  const predictionTabBtn = modal.querySelector('#prediction-tab-btn');
  const scoresTab = modal.querySelector('#scores-tab');
  const predictionTab = modal.querySelector('#prediction-tab');
  
  scoresTabBtn.addEventListener('click', () => {
    // 激活分数线标签
    scoresTabBtn.classList.add('active');
    predictionTabBtn.classList.remove('active');
    scoresTab.style.display = 'block';
    predictionTab.style.display = 'none';
  });
  
  predictionTabBtn.addEventListener('click', () => {
    // 激活预测标签
    predictionTabBtn.classList.add('active');
    scoresTabBtn.classList.remove('active');
    predictionTab.style.display = 'block';
    scoresTab.style.display = 'none';
  });
  
  // 添加年份切换事件 - 复选框处理逻辑
  const yearCheckboxes = modal.querySelectorAll('input[name="score-year"]');
  yearCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      // 如果当前复选框被选中，则取消选中其他复选框
      if (e.target.checked) {
        currentYear = e.target.value;
        yearCheckboxes.forEach(cb => {
          if (cb !== e.target) {
            cb.checked = false;
          }
        });
        const schoolsDataContainer = modal.querySelector('#schools-data');
        schoolsDataContainer.innerHTML = buildSchoolsList(currentYear);
      } else {
        // 如果当前复选框被取消选中，则清空当前年份，不显示任何数据
        currentYear = null;
        const schoolsDataContainer = modal.querySelector('#schools-data');
        schoolsDataContainer.innerHTML = buildSchoolsList(null);
      }
    });
  });
  
  // 添加预测概率按钮事件
  const predictBtn = modal.querySelector('#predict-probability-btn');
  predictBtn.addEventListener('click', () => {
    // 使用自定义输入框获取用户的高考位次
    showCustomPrompt("请输入您的高考位次", (userRank) => {
      if (userRank === null) return; // 用户取消输入

      // 验证输入
      const rank = parseInt(userRank);
      if (isNaN(rank) || rank <= 0 || rank > 1000000) {
        showCustomAlert("请输入有效的高考位次（1-1000000之间的数字）");
        return;
      }
      global_userRank = rank; // 更新全局变量
      
      // 预测各学校的录取概率
      predictAdmissionProbability(detail, rank);
    });
  });
}

function showCustomPrompt(message, callback) {
  const promptModal = document.createElement('div');
  promptModal.className = 'custom-prompt-modal';
  promptModal.innerHTML = `
    <div class="custom-prompt-content">
      <p>${message}</p>
      <input type="number" id="custom-prompt-input" min="1" max="50000" placeholder="在此输入位次">
      <div class="custom-prompt-actions">
        <button id="custom-prompt-ok" class="custom-prompt-btn">确定</button>
        <button id="custom-prompt-cancel" class="custom-prompt-btn cancel">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(promptModal);
  document.body.style.overflow = 'hidden'; // 防止背景滚动

  // Trigger reflow to ensure transition is applied
  void promptModal.offsetWidth; 

  // Add class for fade-in effect
  promptModal.classList.add('fade-in-prompt');


  const inputField = promptModal.querySelector('#custom-prompt-input');
  inputField.focus(); // 自动聚焦到输入框

  const okButton = promptModal.querySelector('#custom-prompt-ok');
  const cancelButton = promptModal.querySelector('#custom-prompt-cancel');

  const closePrompt = (value) => {
    // Add class for fade-out effect
    promptModal.classList.remove('fade-in-prompt');
    promptModal.classList.add('fade-out-prompt');

    // Wait for animation to complete before removing
    setTimeout(() => {
      if (document.body.contains(promptModal)) {
        document.body.removeChild(promptModal);
      }
      document.body.style.overflow = '';
      callback(value);
    }, 300); // Match CSS transition duration
  };

  okButton.addEventListener('click', () => {
    closePrompt(inputField.value);
  });

  cancelButton.addEventListener('click', () => {
    closePrompt(null); // 用户取消
  });

  // 允许回车键提交
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      okButton.click();
    }
  });

  promptModal.addEventListener('click', (e) => {
    if (e.target === promptModal) {
      closePrompt(null);
    }
  });
}


function predictAdmissionProbability(detail, userRank) {
  console.log('🎯 预测录取概率 - 调试信息');
  console.log('detail 完整对象:', detail);
  console.log('detail.scores:', detail.scores);
  console.log('用户位次:', userRank);
  console.log('选择的学科方向:', selectedDomain);  const probResults = document.getElementById('probability-results');
  const probList = document.getElementById('probability-list');
  
  // 清空旧结果
  probList.innerHTML = '';
  
  // 更新预测结果区域的标题，显示用户输入的位次
  probResults.innerHTML = `
    <h4>录取概率预测结果 <span class="user-rank-info">(位次: ${userRank})</span></h4>
    <p class="prediction-note">注：预测结果仅供参考，实际录取情况受多种因素影响。</p>
    <ul id="probability-list" class="probability-list"></ul>
  `;
  
  // 获取新的列表元素（因为我们重新创建了HTML结构）
  const newProbList = document.getElementById('probability-list');
  
  // 准备学校和历年分数线数据
  const schoolProbabilities = [];
  const scores = detail.scores;
  let admissionCount = null; // 招生人数
  
  // 遍历每个学校
  for (const school of Object.keys(scores[Object.keys(scores)[0]] || {})) {
    // 获取该学校在各年的分数线（位次）
    const schoolRanks = [];
    
    for (const year of Object.keys(scores).sort()) {
      const scoreValue = scores[year][school];
    if (typeof scoreValue === 'string' && scoreValue.includes('*')) {
      console.log(`处理 ${school} 在 ${year} 年的分数线: ${scoreValue}`);
      // scoreValue形如"443*分(位次：251826*)，招生人数：25"，提取位次数据
      const rankMatch = scoreValue.match(/位次：(\d+)\*/);
      if (rankMatch) {
        // 提取位次并转换为数字
        const rank = parseInt(rankMatch[1]);
        if (!isNaN(rank)) {
          schoolRanks.push(rank + '*');
        } else {
          console.warn(`无法解析 ${school} 在 ${year} 年的位次: ${rankMatch[1]}`);
        }
      }
    }
    else {
        // 如果不包含星号，转换为数字
        schoolRanks.push(parseInt(scoreValue));
      }
          
      // 提取字符串中的招生人数（使用最新年份的数据）
      const admissionMatch = scoreValue.match(/招生人数：(\d+)/);
      if (admissionMatch) {
        const count = parseInt(admissionMatch[1]);
        if (!isNaN(count) && !isNaN(admissionCount)) {
          admissionCount = count;
        } else {
          console.warn(`无法解析 ${school} 在 ${year} 年的招生人数: ${admissionMatch[1]}`);
        }
      }
    }
    if (selectedDomain === 'history') {
      const yearToScoreRank = {
        2024: score_rank_2024history,
        2023: score_rank_2023history,
        2022: score_rank_2022history,
        2021: score_rank_2021history
      };

      const sortedYears = Object.keys(scores).sort();

      for (let i = 0; i < schoolRanks.length; i++) {
        const year = sortedYears[i];
        const score = schoolRanks[i];
        if (isNaN(score)) continue;

        const scoreRankMap = yearToScoreRank[year];
        if (!scoreRankMap) continue;

        // 尝试精确获取该分数的排名
        const rank = scoreRankMap[score];
        if (rank !== undefined) {
          schoolRanks[i] = rank;
        } else {
          // 如果没有匹配，使用该年份 rank 表中的第一个值
          const firstRank = Object.values(scoreRankMap)[0];
          schoolRanks[i] = firstRank;
        }
      }
    }
    else if (selectedDomain === 'physics') {
      const yearToScoreRank = {
        2024: score_rank_2024physics,
        2023: score_rank_2023physics,
        2022: score_rank_2022physics,
        2021: score_rank_2021physics
    };

    const sortedYears = Object.keys(scores).sort();

    for (let i = 0; i < schoolRanks.length; i++) {
      const year = sortedYears[i];
      const score = schoolRanks[i];
      if (isNaN(score)) continue;

      const scoreRankMap = yearToScoreRank[year];
      if (!scoreRankMap) continue;

      // 尝试精确获取该分数的排名
      const rank = scoreRankMap[score];
      if (rank !== undefined) {
        schoolRanks[i] = rank;
      } else {
        // 如果没有匹配，使用该年份 rank 表中的第一个值
        const firstRank = Object.values(scoreRankMap).at(-1);
        schoolRanks[i] = firstRank;
      }
    }
  }
    // 如果有历年数据，计算录取概率
    if (schoolRanks.length > 0) {
      let probability, mu, sigma;
      console.log(`正在计算 ${school} 的录取概率，位次：${userRank}，历年位次：${schoolRanks.join(', ')}`);
      try {
        // 使用predict.js中的函数预测概率
        const result = estimateProbGeneral(schoolRanks, userRank);
        probability = result.probability;
        mu = result.mu;
        sigma = result.sigma;
        
        schoolProbabilities.push({
          school,
          probability: probability * 100, // 转换为百分比
          mu, // mu 代表平均位次，数值越小排名越靠前
          sigma,
          ranks: schoolRanks.join(', '),
          admissionCount: admissionCount // 添加招生人数
        });
      } catch (error) {
        console.error(`计算${school}录取概率时出错:`, error);
      }
    }
  }
  
  schoolProbabilities.sort((a, b) => {
    return a.mu - b.mu;
  });
  
  // 显示预测结果
  for (const item of schoolProbabilities) {
    const probabilityClass = getProbabilityClass(item.probability);

    newProbList.innerHTML += `
      <li class="${probabilityClass}">
        <span class="school-name">${item.school}</span>
        <span class="probability-value">${item.probability.toFixed(2)}%</span>
        ${item.admissionCount ? `<span class="admission-count"><i class="admission-icon">🎓</i>${item.admissionCount} 人</span>` : ''}
        <span class="probability-detail">
          综合位次=${Math.round(item.mu)}，标准差≈${Math.round(item.sigma)}，历年位次：${item.ranks.split(', ').reverse().join(', ')}
        </span>
      </li>
    `;
  }
  
  // 显示结果区域
  probResults.style.display = 'block';
  
  // 更改按钮文本为"重新预测录取概率"
  const predictBtn = document.getElementById('predict-probability-btn');
  if (predictBtn) {
    predictBtn.textContent = '重新预测录取概率';
  }
}

// 根据概率值获取对应的CSS类
function getProbabilityClass(probability) {
  if (probability >= 80) return 'high-probability';
  if (probability >= 50) return 'medium-probability';
  if (probability >= 20) return 'low-probability';
  return 'very-low-probability';
}

function showCombinedResult(is_developer = false){
  // 隐藏主界面，显示测试界面
  if (is_developer) {
    mbti_result = 'INTJ'; // 开发者模式下默认MBTI结果
    career_result = 'RIA'; // 开发者模式下默认职业兴趣结果
  }

  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('app').className = 'card'; // 使用通用卡片样式

  let selectionHTML = `
    <h2>请选择你的学科方向</h2>
    <p>根据你的方向，我们将为你推荐相应类别的专业。</p>
    <div class="domain-selection" style="margin-top: 20px; margin-bottom: 20px;">
      <button class="option-btn" onclick="generateCombinedReport('history')">历史方向</button>
      <button class="option-btn" onclick="generateCombinedReport('physics')">物理方向</button>
    </div>
    <button class="restart-btn secondary-btn" onclick="backToMain()">返回主页</button>
  `;
  document.getElementById('app').innerHTML = selectionHTML;
}

function sortMatchedMajors(matchList, searchTerm) {
  const majorPriorityHistory = {
    "汉语言文学": 7967,
    "英语": 5934,
    "会计学": 4731,
    "法学": 4229,
    "国际经济与贸易": 2693,
    "商务英语": 2230,
    "财务管理": 2075,
    "网络与新媒体": 2028,
    "工商管理": 1982,
    "电子商务": 1837,
    "小学教育": 1809,
    "金融学": 1793,
    "人力资源管理": 1636,
    "日语": 1611,
    "市场营销": 1505,
    "行政管理": 1345,
    "物流管理": 1266,
    "学前教育": 1258,
    "历史学": 1232,
    "工商管理类": 1069,
    "思想政治教育": 1024,
    "社会工作": 926,
    "旅游管理": 914,
    "新闻学": 893,
    "经济学": 784,
    "汉语国际教育": 742,
    "审计学": 690,
    "护理学": 653,
    "翻译": 645,
    "广播电视编导": 599,
    "公共事业管理": 546,
    "应用心理学": 518,
    "地理科学": 498,
    "广告学": 490,
    "外国语言文学类": 477,
    "投资学": 437,
    "跨境电子商务": 431,
    "新闻传播学类": 420,
    "法律": 402,
    "国际商务": 368,
    "金融学类": 359,
    "经济与金融": 355,
    "互联网金融": 337,
    "中国语言文学类": 319,
    "风景园林": 309,
    "健康服务与管理": 286,
    "服装设计与工程": 258,
    "城乡规划": 257,
    "西班牙语": 256,
    "资产评估": 253,
    "文化产业管理": 251,
    "土地资源管理": 248,
    "经济学类": 237,
    "法语": 235,
    "广播电视学": 225,
    "社会学": 224,
    "人文地理与城乡规划": 221,
    "建筑学": 218,
    "酒店管理": 218,
    "会展经济与管理": 208,
    "秘书学": 206,
    "劳动与社会保障": 202,
    "税收学": 201,
    "传播学": 196,
    "德语": 186,
    "供应链管理": 182,
    "保险学": 177,
    "大数据与财务管理": 156,
    "地理信息科学": 152,
    "心理学": 147,
    "戏剧影视文学": 145,
    "大数据与会计": 133,
    "信用管理": 128,
    "教育学": 125,
    "法学类": 120,
    "知识产权": 114,
    "公共管理类": 112,
    "哲学": 109,
    "朝鲜语": 104,
    "人文科学试验班": 102,
    "应用英语": 100,
    "国际经贸规则": 100,
    "政治学与行政学": 99,
    "信用风险管理与法律防控": 97,
    "园林": 97,
    "特殊教育": 92,
    "国际新闻与传播": 91,
    "艺术管理": 84,
    "社会科学试验班": 83,
    "公共关系学": 82,
    "农林经济管理": 81,
    "现代物流管理": 77,
    "财政学类": 77,
    "财政学": 77,
    "社会学类": 75,
    "创业管理": 72,
    "俄语": 68,
    "电影学": 66,
    "中药学": 65,
    "应用日语": 60,
    "政治学类": 59,
    "企业数字化管理": 59,
    "护理": 58,
    "历史学类": 56,
    "马克思主义理论": 53,
    "建筑类": 51,
    "葡萄牙语": 50,
    "健康管理": 50,
    "档案学": 49,
    "交通管理": 46,
    "医疗保险": 46,
    "时尚传播": 43,
    "旅游管理类": 43,
    "阿拉伯语": 43,
    "金融管理": 42,
    "泰语": 40,
    "自然地理与资源环境": 39,
    "经济管理试验班": 37,
    "建筑设计": 35,
    "海事管理": 33,
    "国际法": 32,
    "哲学类": 32,
    "城市管理": 31,
    "助产学": 31,
    "艺术设计学": 31,
    "康复治疗": 30,
    "国际政治": 29,
    "汽车服务工程技术": 29,
    "财务会计教育": 29,
    "经济与贸易类": 28,
    "旅游管理与服务教育": 26,
    "婴幼儿发展与健康管理": 25,
    "文科试验班类": 23,
    "艺术教育": 22,
    "数字媒体艺术": 21,
    "科学教育": 20,
    "物流工程技术": 20,
    "国际事务与国际关系": 19,
    "电子商务及法律": 16,
    "地理科学类": 15,
    "教育学类": 14,
    "意大利语": 12,
    "越南语": 11,
    "考古学": 11,
    "影视技术": 11,
    "信息资源管理": 10,
    "汉语言": 9,
    "非物质文化遗产保护": 9,
    "艺术学理论类": 9,
    "艺术史论": 9,
    "图书情报与档案管理类": 9,
    "戏剧学": 9,
    "体育经济与管理": 9,
    "外交学": 8,
    "贸易经济": 8,
    "戏剧与影视学类": 8,
    "养老服务管理": 7,
    "文物与博物馆学": 7,
    "编辑出版学": 6,
    "护理学类": 6,
    "马克思主义理论类": 6,
    "摄影": 6,
    "印度尼西亚语": 6,
    "本科预科班": 6,
    "美术学": 5,
    "慈善管理": 5,
    "波兰语": 5,
    "法学试验班": 5,
    "智慧健康养老管理": 5,
    "图书馆学": 5,
    "金融科技应用": 5,
    "匈牙利语": 5,
    "捷克语": 5,
    "商务经济学": 4,
    "语言学": 4,
    "国际组织与全球治理": 4,
    "国际经济发展合作": 4,
    "数字出版": 4,
    "戏剧教育": 3,
    "商学院": 3,
    "塞尔维亚语": 3,
    "劳动关系": 3,
    "电子竞技运动与管理": 3,
    "古典文献学": 3,
    "文化遗产": 3,
    "纪检监察": 3,
    "文学与社会科学院": 3,
    "水路运输与海事管理": 3,
    "波斯语": 3,
    "运动康复": 3,
    "农村区域发展": 2,
    "全媒体电商运营": 2,
    "休闲体育": 2,
    "影视摄影与制作": 2,
    "孤独症儿童教育": 2,
    "监狱学": 2,
    "海外利益安全": 2,
    "烹饪与餐饮管理": 2,
    "采购管理": 1,
    "政治学、经济学与哲学": 1,
    "马来语": 1,
    "药事管理": 1,
    "艺术与科技": 1,
    "体育教育": 1,
    "侦查学": 1,
    "公共卫生管理": 1,
    "劳动经济学": 1,
    "司法鉴定学": 1,
    "国民经济管理": 1,
    "大数据与审计": 1,
    "心理学类": 1,
    "手语翻译": 1,
    "世界史": 1,
    "教育康复学": 1,
    "数字人文": 1,
    "文物保护技术": 1,
    "无障碍管理": 1,
    "民族学": 1,
    "物业管理": 1,
    "现代家政管理": 1,
    "缅甸语": 1,
    "能源经济": 1,
    "自然资源登记与管理": 1,
    "航空安防管理": 1
  };
  const majorPriorityPhysics = {
    "计算机科学与技术": 9095,
    "软件工程": 7701,
    "电子信息工程": 5309,
    "电气工程及其自动化": 5236,
    "数据科学与大数据技术": 4939,
    "机械设计制造及其自动化": 4615,
    "会计学": 3782,
    "临床医学": 3725,
    "护理学": 3427,
    "人工智能": 3339,
    "数学与应用数学": 3009,
    "计算机类": 2953,
    "通信工程": 2939,
    "土木工程": 2763,
    "物联网工程": 2680,
    "英语": 2602,
    "药学": 2564,
    "数字媒体技术": 2414,
    "自动化": 2387,
    "国际经济与贸易": 2318,
    "财务管理": 2194,
    "法学": 2192,
    "电子信息类": 2023,
    "汉语言文学": 1962,
    "机器人工程": 1953,
    "电子商务": 1881,
    "网络工程": 1848,
    "物理学": 1821,
    "应用化学": 1816,
    "生物科学": 1790,
    "金融学": 1761,
    "机械电子工程": 1752,
    "工科试验班": 1662,
    "信息管理与信息系统": 1592,
    "工商管理": 1582,
    "食品科学与工程": 1533,
    "数字经济": 1498,
    "金融工程": 1488,
    "环境工程": 1485,
    "食品质量与安全": 1482,
    "商务英语": 1472,
    "化学": 1433,
    "大数据管理与应用": 1408,
    "中药学": 1384,
    "网络与新媒体": 1379,
    "光电信息科学与工程": 1329,
    "化学工程与工艺": 1288,
    "车辆工程": 1283,
    "工业设计": 1266,
    "智能制造工程": 1240,
    "生物技术": 1185,
    "市场营销": 1183,
    "材料类": 1167,
    "经济学": 1141,
    "物流管理": 1128,
    "集成电路设计与集成系统": 1080,
    "信息与计算科学": 1039,
    "人力资源管理": 936,
    "工程造价": 927,
    "学前教育": 916,
    "金融科技": 911,
    "工程管理": 910,
    "小学教育": 904,
    "材料科学与工程": 897,
    "中医学": 893,
    "智能科学与技术": 893,
    "日语": 890,
    "电子信息科学与技术": 888,
    "建筑学": 873,
    "生物医学工程": 865,
    "网络空间安全": 858,
    "医学检验技术": 854,
    "电子科学与技术": 841,
    "应用统计学": 830,
    "交通工程": 821,
    "工商管理类": 816,
    "数学类": 814,
    "统计学": 814,
    "预防医学": 804,
    "自动化类": 803,
    "审计学": 786,
    "制药工程": 750,
    "口腔医学": 741,
    "教育技术学": 730,
    "能源与动力工程": 723,
    "微电子科学与工程": 716,
    "交通运输": 674,
    "旅游管理": 674,
    "高分子材料与工程": 670,
    "工业工程": 630,
    "行政管理": 614,
    "生物工程": 603,
    "机械工程": 581,
    "康复治疗学": 571,
    "应用心理学": 571,
    "投资学": 542,
    "经济统计学": 541,
    "纺织工程": 539,
    "翻译": 527,
    "风景园林": 520,
    "园艺": 510,
    "环境科学": 508,
    "智能医学工程": 507,
    "动物科学": 501,
    "地理科学": 500,
    "材料成型及控制工程": 488,
    "机械设计制造及自动化": 461,
    "医学影像学": 460,
    "园林": 460,
    "动物医学": 459,
    "互联网金融": 448,
    "社会工作": 445,
    "地理信息科学": 435,
    "临床药学": 418,
    "跨境电子商务": 409,
    "服装设计与工程": 407,
    "经济与金融": 406,
    "新能源汽车工程": 403,
    "新能源科学与工程": 395,
    "化妆品科学与技术": 393,
    "供应链管理": 393,
    "机械类": 373,
    "大数据工程技术": 372,
    "麻醉学": 372,
    "智能制造工程技术": 367,
    "中西医临床医学": 366,
    "测控技术与仪器": 364,
    "新闻学": 362,
    "城乡规划": 360,
    "给排水科学与工程": 356,
    "生物科学类": 336,
    "汽车服务工程": 335,
    "心理学": 334,
    "经济学类": 332,
    "智能建造": 326,
    "应用物理学": 325,
    "国际商务": 323,
    "能源动力类": 322,
    "针灸推拿学": 320,
    "信息工程": 303,
    "计算机应用工程": 302,
    "建筑环境与能源应用工程": 295,
    "健康服务与管理": 292,
    "科学教育": 290,
    "物理学类": 289,
    "安全工程": 281,
    "儿科学": 280,
    "思想政治教育": 275,
    "水产养殖学": 273,
    "电气类": 272,
    "护理": 271,
    "金融数学": 271,
    "海洋科学": 269,
    "新能源材料与器件": 266,
    "环境科学与工程类": 265,
    "化学类": 264,
    "生物制药": 259,
    "理科试验班": 258,
    "管理科学与工程类": 258,
    "储能科学与工程": 257,
    "软件工程技术": 257,
    "物流工程": 257,
    "土木类": 256,
    "农学": 254,
    "公共事业管理": 251,
    "船舶与海洋工程": 251,
    "化工与制药类": 249,
    "税收学": 247,
    "金融学类": 245,
    "材料化学": 244,
    "卫生检验与检疫": 244,
    "食品营养与健康": 240,
    "广告学": 235,
    "中药学类": 233,
    "精算学": 227,
    "电气工程及自动化": 227,
    "智能感知工程": 227,
    "汉语国际教育": 221,
    "中药制药": 218,
    "人文地理与城乡规划": 216,
    "过程装备与控制工程": 208,
    "新能源汽车工程技术": 208,
    "港口航道与海岸工程": 206,
    "无机非金属材料工程": 205,
    "资产评估": 203,
    "烹饪与营养教育": 201,
    "智能车辆工程": 199,
    "药物分析": 196,
    "道路桥梁与渡河工程": 187,
    "眼视光学": 186,
    "光源与照明": 183,
    "酒店管理": 182,
    "药物制剂": 181,
    "海洋技术": 181,
    "知识产权": 178,
    "功能材料": 178,
    "大数据与财务管理": 177,
    "网络工程技术": 176,
    "植物保护": 176,
    "精细化工": 174,
    "广播电视编导": 173,
    "土地资源管理": 170,
    "能源化学工程": 170,
    "文化产业管理": 167,
    "环境生态工程": 167,
    "智能电网信息工程": 165,
    "工科试验班类": 163,
    "中医骨伤科学": 160,
    "食品科学与工程类": 158,
    "测绘工程": 154,
    "财政学": 154,
    "消防工程技术": 150,
    "药事管理": 149,
    "汽车服务工程技术": 142,
    "无人驾驶航空器系统工程": 142,
    "新闻传播学类": 142,
    "资源勘查工程": 142,
    "数字印刷工程": 140,
    "西班牙语": 139,
    "油气储运工程": 139,
    "航空航天类": 130,
    "建筑类": 130,
    "会展经济与管理": 126,
    "材料物理": 124,
    "医学影像技术": 124,
    "口腔医学技术": 123,
    "标准化工程": 121,
    "水利水电工程": 121,
    "财政学类": 119,
    "电子与计算机工程": 119,
    "机器人技术": 118,
    "化妆品技术与工程": 115,
    "保险学": 115,
    "医学信息工程": 114,
    "海洋药学": 114,
    "精神医学": 112,
    "历史学": 111,
    "虚拟现实技术": 111,
    "基础医学": 110,
    "物联网工程技术": 109,
    "农林经济管理": 109,
    "德语": 108,
    "林学": 107,
    "生态学": 105,
    "核工程与核技术": 104,
    "机电技术教育": 104,
    "信息安全": 104,
    "建筑电气与智能化": 103,
    "土地科学与技术": 102,
    "大气科学": 101,
    "建筑设计": 100,
    "机械电子工程技术": 100,
    "中草药栽培与鉴定": 99,
    "生物信息学": 98,
    "中药资源与开发": 96,
    "遥感科学与技术": 92,
    "食品营养与检验教育": 92,
    "海洋油气工程": 92,
    "石油工程": 91,
    "生物医学工程类": 89,
    "农业机械化及其自动化": 89,
    "理科试验班类": 88,
    "法医学": 88,
    "秘书学": 88,
    "法语": 88,
    "广播电视学": 87,
    "交通运输类": 87,
    "资源环境科学": 86,
    "康复治疗": 86,
    "海洋资源与环境": 85,
    "智能建造工程": 82,
    "中国语言文学类": 81,
    "应用气象学": 80,
    "应用英语": 80,
    "种子科学与工程": 77,
    "生物统计学": 76,
    "水生动物医学": 75,
    "药学类": 75,
    "企业数字化管理": 75,
    "医疗保险": 75,
    "助产学": 74,
    "环保设备工程": 74,
    "地理科学类": 72,
    "工程力学": 71,
    "食品卫生与营养学": 71,
    "智能交互设计": 70,
    "建筑工程": 70,
    "劳动与社会保障": 70,
    "包装工程": 70,
    "大数据与会计": 70,
    "轮机工程": 69,
    "自然地理与资源环境": 69,
    "康复物理治疗": 68,
    "药物化学": 68,
    "医学实验技术": 67,
    "焊接技术与工程": 67,
    "密码科学与技术": 66,
    "现代物流管理": 65,
    "智能工程与创意设计": 65,
    "智慧交通": 65,
    "水利类": 64,
    "技术科学试验班": 63,
    "区块链工程": 62,
    "金属材料工程": 62,
    "中医养生学": 61,
    "管理科学": 60,
    "特殊教育": 59,
    "档案学": 59,
    "环境科学与工程": 58,
    "信用风险管理与法律防控": 57,
    "核工程类": 56,
    "交通管理": 56,
    "微机电系统工程": 56,
    "国际经贸规则": 56,
    "电子信息工程技术": 56,
    "法学类": 55,
    "国际新闻与传播": 54,
    "能源与环境系统工程": 54,
    "海洋资源开发技术": 53,
    "地理空间信息工程": 52,
    "农业资源与环境": 52,
    "健康管理": 50,
    "海洋渔业科学与技术": 50,
    "质量管理工程": 50,
    "飞行器设计与工程": 50,
    "金融管理": 50,
    "婴幼儿发展与健康管理": 50,
    "朝鲜语": 50,
    "教育学": 50,
    "社会学": 49,
    "海事管理": 49,
    "城市地下空间工程": 49,
    "轻工类": 48,
    "人工智能工程技术": 47,
    "公共管理类": 47,
    "传播学": 46,
    "电子商务及法律": 46,
    "草业科学": 45,
    "眼视光医学": 45,
    "家具设计与工程": 45,
    "经济管理试验班": 45,
    "外国语言文学类": 45,
    "飞行器制造工程": 44,
    "应急管理": 44,
    "社会科学试验班": 44,
    "应用生物科学": 43,
    "现代精细化工技术": 42,
    "现代通信工程": 42,
    "物流工程技术": 42,
    "房地产开发与管理": 42,
    "轻化工程": 41,
    "智能网联汽车工程技术": 40,
    "财务会计教育": 39,
    "合成生物技术": 38,
    "统计学类": 38,
    "集成电路工程技术": 37,
    "时尚传播": 37,
    "测绘类": 37,
    "木材科学与工程": 37,
    "公共关系学": 36,
    "城市管理": 36,
    "运动康复": 34,
    "自动化技术与应用": 32,
    "信用管理": 32,
    "大气科学类": 32,
    "听力与言语康复学": 32,
    "艺术管理": 31,
    "勘查技术与工程": 31,
    "宝石及材料工艺学": 30,
    "农业工程": 30,
    "俄语": 30,
    "海洋工程类": 30,
    "动物医学类": 29,
    "经济与贸易类": 29,
    "茶学": 28,
    "广播电视工程": 28,
    "生物育种科学": 27,
    "轨道交通信号与控制": 27,
    "应急技术与管理": 27,
    "政治学与行政学": 27,
    "智慧农业": 26,
    "制药工程技术": 26,
    "生物医学科学": 25,
    "农业水利工程": 25,
    "公共卫生与预防医学类": 24,
    "旅游管理与服务教育": 24,
    "水文与水资源工程": 24,
    "艺术设计学": 24,
    "天文学": 23,
    "资源循环科学与工程": 23,
    "冶金工程": 23,
    "电气工程与智能控制": 23,
    "葡萄牙语": 23,
    "医学试验班": 22,
    "戏剧影视文学": 22,
    "临床医学类": 22,
    "新材料与应用技术": 22,
    "政治学类": 21,
    "地质学类": 21,
    "飞行器动力工程": 21,
    "植物生产类": 21,
    "水产类": 21,
    "创业管理": 20,
    "阿拉伯语": 20,
    "纺织类": 20,
    "应用日语": 20,
    "中医康复学": 19,
    "设施农业科学与工程": 18,
    "旅游管理类": 18,
    "信息资源管理": 18,
    "矿物加工工程": 17,
    "导航工程": 17,
    "艺术教育": 17,
    "心理学类": 17,
    "林学类": 17,
    "国际法": 16,
    "消防工程": 15,
    "电信工程及管理": 15,
    "泰语": 15,
    "生物质能源与材料": 15,
    "海洋科学类": 15,
    "地球物理学类": 15,
    "数据计算及应用": 15,
    "哲学": 14,
    "交通设备与控制工程": 14,
    "影视技术": 14,
    "空间信息与数字技术": 14,
    "智慧牧业科学与工程": 14,
    "智能装备与系统": 13,
    "农业智能装备工程": 13,
    "印刷工程": 13,
    "地质类": 13,
    "社会学类": 12,
    "生物工程类": 12,
    "矿物资源工程": 12,
    "烟草": 12,
    "海洋信息工程": 12,
    "量子信息科学": 12,
    "马克思主义理论": 12,
    "仪器类": 11,
    "智慧水利": 11,
    "森林保护": 11,
    "复合材料与工程": 11,
    "林产化工": 11,
    "地球物理学": 11,
    "合成生物学": 11,
    "地质工程": 11,
    "动物药学": 11,
    "智能建造与智慧交通": 10,
    "水务工程": 10,
    "飞行器适航技术": 10,
    "哲学类": 10,
    "自然科学试验班": 10,
    "电影制作": 10,
    "邮政工程": 10,
    "本科预科班": 10,
    "野生动物与自然保护区管理": 10,
    "汉语言": 10,
    "临床工程技术": 10,
    "铁道工程": 10,
    "安全科学与工程类": 10,
    "化工安全工程": 10,
    "物流管理与工程类": 10,
    "水土保持与荒漠化防治": 10,
    "智慧建筑与建造": 9,
    "植物科学与技术": 9,
    "中医学类": 9,
    "非织造材料与工程": 9,
    "智能测控工程": 8,
    "纳米材料与技术": 8,
    "运动人体科学": 8,
    "放射医学": 8,
    "意大利语": 8,
    "草坪科学与工程": 8,
    "兵器类": 8,
    "林业工程类": 8,
    "海洋工程与技术": 8,
    "森林工程": 8,
    "氢能科学与工程": 8,
    "海外安全管理": 8,
    "信息对抗技术": 8,
    "电子商务类": 7,
    "增材制造工程": 7,
    "数据科学": 7,
    "葡萄与葡萄酒工程": 7,
    "碳储科学与工程": 7,
    "化学生物学": 7,
    "医学技术类": 7,
    "工业工程类": 7,
    "教育学类": 7,
    "护理学类": 7,
    "航空航天工程": 7,
    "体育经济与管理": 7,
    "动植物检疫": 7,
    "水声工程": 7,
    "弹药工程与爆炸技术": 6,
    "大功率半导体科学与工程": 6,
    "农业工程类": 6,
    "飞行器运维工程": 6,
    "工业智能": 6,
    "应用化工技术": 6,
    "特种能源技术与工程": 6,
    "国际事务与国际关系": 6,
    "地质学": 6,
    "国际政治": 6,
    "水族科学与技术": 6,
    "动物生产类": 6,
    "化学工程与工业生物工程": 6,
    "智能材料与结构": 6,
    "酿酒工程": 6,
    "土地整治工程": 6,
    "柔性电子学": 6,
    "飞行器质量与可靠性": 5,
    "艺术史论": 5,
    "资源环境大数据工程": 5,
    "金融科技应用": 5,
    "防灾减灾科学与工程": 5,
    "视觉传达设计": 5,
    "蜂学": 5,
    "中医儿科学": 5,
    "安全生产监管": 5,
    "应急装备技术与工程": 5,
    "数理基础科学": 5,
    "电影学": 5,
    "康复工程": 5,
    "电子封装技术": 5,
    "妇幼保健医学": 5,
    "智能控制技术": 5,
    "商学院": 5,
    "数控技术": 5,
    "汽车工程技术": 5,
    "语言学": 4,
    "工程软件": 4,
    "工业互联网技术": 4,
    "声学": 4,
    "船舶电子电气工程": 4,
    "行星科学": 4,
    "工程审计": 4,
    "教育康复学": 4,
    "智慧林业": 4,
    "文物保护技术": 4,
    "地球化学": 4,
    "实验动物学": 4,
    "香料香精技术与工程": 4,
    "探测制导与控制技术": 4,
    "能源化学": 4,
    "假肢矫形工程": 4,
    "电磁场与无线技术": 4,
    "印度尼西亚语": 3,
    "文物与博物馆学": 3,
    "核生化消防": 3,
    "机械工艺技术": 3,
    "武器发射工程": 3,
    "图书馆学": 3,
    "医疗产品管理": 3,
    "摄影": 3,
    "采矿工程": 3,
    "地下水科学与工程": 3,
    "光电信息材料与器件": 3,
    "消防指挥": 3,
    "数字媒体艺术": 3,
    "医学试验班类": 3,
    "生物医药数据科学": 3,
    "能源经济": 3,
    "农村区域发展": 3,
    "电子竞技运动与管理": 3,
    "生态环境工程技术": 3,
    "理工学院": 3,
    "监狱学": 3,
    "马业科学": 3,
    "经济动物学": 2,
    "高分子材料工程技术": 2,
    "人文科学试验班": 2,
    "国民经济管理": 2,
    "智能影像工程": 2,
    "智能地球探测": 2,
    "城市轨道交通信号与控制技术": 2,
    "智慧海洋技术": 2,
    "智慧气象技术": 2,
    "眼视光技术": 2,
    "国际税收": 2,
    "缅甸语": 2,
    "无障碍管理": 2,
    "饲料工程": 2,
    "国际组织与全球治理": 2,
    "国际经济发展合作": 2,
    "飞行器控制与信息工程": 2,
    "空间科学与技术": 2,
    "地球信息科学与技术": 2,
    "建设工程管理": 2,
    "金融审计": 2,
    "新媒体技术": 2,
    "孤独症儿童教育": 2,
    "涂料工程": 2,
    "咖啡科学与工程": 2,
    "海洋机器人": 2,
    "中兽医学": 2,
    "蚕学": 2,
    "海外利益安全": 2,
    "外交学": 2,
    "火灾勘查": 2,
    "波斯语": 2,
    "法律": 2,
    "匈牙利语": 2,
    "劳动经济学": 2,
    "气象技术与工程": 2,
    "生态修复学": 2,
    "核电技术与控制工程": 2,
    "核物理": 2,
    "康复作业治疗": 2,
    "贸易经济": 2,
    "艺术与科技": 2,
    "材料智能技术": 2,
    "农林智能装备工程": 2,
    "航空智能制造技术": 2,
    "木结构建筑与材料": 2,
    "飞行器维修工程技术": 2,
    "休闲体育": 2,
    "智能飞行器技术": 2,
    "智能采矿工程": 2,
    "城市设计": 1,
    "食品安全与检测": 1,
    "马来语": 1,
    "导航工程技术": 1,
    "编辑出版学": 1,
    "文学与社会科学院": 1,
    "现代家政管理": 1,
    "光电信息工程技术": 1,
    "罗马尼亚语": 1,
    "公共卫生管理": 1,
    "老挝语": 1,
    "儿童康复治疗": 1,
    "养老服务管理": 1,
    "纪检监察": 1,
    "自然资源登记与管理": 1,
    "刑事科学技术": 1,
    "劳动关系": 1,
    "物业管理": 1,
    "新能源发电工程技术": 1,
    "区块链技术": 1,
    "菌物科学与工程": 1,
    "信息安全与管理": 1,
    "装甲车辆工程": 1,
    "柬埔寨语": 1,
    "资源与环境经济学": 1,
    "商务经济学": 1,
    "智能无人系统技术": 1,
    "通信软件工程": 1,
    "智能体育工程": 1
  }
  let majorPriority;
  if (selectedDomain === 'physics') {
    majorPriority = majorPriorityPhysics;
  }
  else {
    majorPriority = majorPriorityHistory;
  }

  return matchList.sort((a, b) => {
    // 优先级1：完全匹配的优先
    if (a === searchTerm) return -1;
    if (b === searchTerm) return 1;

    // 优先级2：自定义专业优先级
    const aPriority = majorPriority[a] || 0;
    const bPriority = majorPriority[b] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;

    // 优先级3：从开头匹配的优先
    const aStartsWith = a.startsWith(searchTerm);
    const bStartsWith = b.startsWith(searchTerm);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // 优先级4：包含搜索词位置越靠前的优先
    const aIndex = a.indexOf(searchTerm);
    const bIndex = b.indexOf(searchTerm);
    if (aIndex !== bIndex && aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // 优先级5：匹配长度较短的优先
    if (a.length !== b.length) return a.length - b.length;

    // 优先级6：按字母顺序排序
    return a.localeCompare(b);
  });
}

// 新增函数：根据选择的学科方向生成综合报告
function generateCombinedReport(domain) {
  console.log('📈 generateCombinedReport被调用，参数:', domain);
  console.log('📊 当前全局变量状态:', {
    mbti_result,
    career_result,
    mbti_description,
    selectedDomain: selectedDomain
  });
  
  selectedDomain = domain; // 保存选择的方向

  // 保存测试结果到 Supabase（包含学科选择）
  if (typeof saveUserTestResults === 'function') {
    saveUserTestResults();
  }

  // 确保显示正确的界面
  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // 清空旧内容
  appDiv.className = 'card combined-theme'; // 应用综合报告主题
  
  console.log('🎨 界面已切换到综合报告模式');

  // 获取MBTI与RIASEC关联度分析
  const mbtiCareerRelations = {
    'ISTJ': { bestFit: ['C', 'R'], description: '你的性格注重细节和系统化，适合常规型和现实型职业。' },
    'ISFJ': { bestFit: ['S', 'C'], description: '你的性格关心他人和具有组织性，适合社会型和常规型职业。' },
    'INFJ': { bestFit: ['S', 'A'], description: '你的性格富有洞察力和创造性，适合社会型和艺术型职业。' },
    'INTJ': { bestFit: ['I', 'E'], description: '你的性格注重战略和独立性，适合研究型和企业型职业。' },
    'ISTP': { bestFit: ['R', 'I'], description: '你的性格务实和分析性强，适合现实型和研究型职业。' },
    'ISFP': { bestFit: ['A', 'R'], description: '你的性格艺术性和实用性并重，适合艺术型和现实型职业。' },
    'INFP': { bestFit: ['A', 'S'], description: '你的性格理想主义和富有同情心，适合艺术型和社会型职业。' },
    'INTP': { bestFit: ['I', 'A'], description: '你的性格理论性和创新性强，适合研究型和艺术型职业。' },
    'ESTP': { bestFit: ['E', 'R'], description: '你的性格注重行动和实用性，适合企业型和现实型职业。' },
    'ESFP': { bestFit: ['S', 'E'], description: '你的性格社交性强和实用性，适合社会型和企业型职业。' },
    'ENFP': { bestFit: ['S', 'A'], description: '你的性格热情和创造性，适合社会型和艺术型职业。' },
    'ENTP': { bestFit: ['E', 'I'], description: '你的性格创新和分析性，适合企业型和研究型职业。' },
    'ESTJ': { bestFit: ['E', 'C'], description: '你的性格注重组织和效率，适合企业型和常规型职业。' },
    'ESFJ': { bestFit: ['S', 'E'], description: '你的性格注重和谐和责任感，适合社会型和企业型职业。' },
    'ENFJ': { bestFit: ['S', 'E'], description: '你的性格关注他人成长和组织性，适合社会型和企业型职业。' },
    'ENTJ': { bestFit: ['E', 'I'], description: '你的性格领导力强和战略性，适合企业型和研究型职业。' }
  };
  
  const mbtiInfo = mbtiCareerRelations[mbti_result] || { 
    bestFit: [], 
    description: '你的性格组合非常独特，可以考虑探索多种职业领域。' 
  };
  
  const careerTypes = career_result.split('');
  
  const matchingTypes = mbtiInfo.bestFit.filter(type => careerTypes.includes(type));
  const matchPercentage = matchingTypes.length > 0 
    ? Math.round((matchingTypes.length / Math.min(mbtiInfo.bestFit.length, 2)) * 100) 
    : 0;
  
  const characteristics = findCharacteristics(mbti_result, careerTypes);
  
  let recommendedMajorsHTML = '';
  let majorSectionTitle = '';

  if (selectedDomain === 'history') {
    const historyMajors = findRecommendedMajors(characteristics, 'history');
    majorSectionTitle = '历史方向推荐专业';
    recommendedMajorsHTML = `
      <ul class="major-list">
        ${historyMajors.map(([major, score]) => 
          `<li>
            <span class="major-name">${major}</span>
            <button class="major-detail-btn" onclick="showMajorDetail('${major}', ${score})">查看详情</button>
          </li>`
        ).join('')}
      </ul>`;
  } else if (selectedDomain === 'physics') {
    const physicsMajors = findRecommendedMajors(characteristics, 'physics');
    majorSectionTitle = '物理方向推荐专业';
    recommendedMajorsHTML = `
      <ul class="major-list">
        ${physicsMajors.map(([major, score]) => 
          `<li>
            <span class="major-name">${major}</span>
            <button class="major-detail-btn" onclick="showMajorDetail('${major}', ${score})">查看详情</button>
          </li>`
        ).join('')}
      </ul>`;
  }


  const recommendations = getCombinedRecommendations(mbti_result, careerTypes[0], careerTypes[1]);
  
  let resultHTML = `
    <h2>综合分析结果 (${selectedDomain === 'history' ? '历史方向' : '物理方向'})</h2>
    <div class="combined-results">
      <div class="combined-section">
        <div class="combined-header">
          <div class="combined-icon mbti-icon">MBTI</div>
          <h3>性格类型: <span class="mbti-type">${mbti_result}</span></h3>
        </div>
        <p>${mbti_description}</p>
      </div>
      
      <div class="combined-section">
        <div class="combined-header">
          <div class="combined-icon career-icon">RIASEC</div>
          <h3>职业兴趣: <span class="career-type">${career_result}</span></h3>
        </div>
        <p>你的主导职业兴趣类型是 ${getTypeFullName(careerTypes[0])}，次要类型是 ${getTypeFullName(careerTypes[1])}。</p>
      </div>
      
      <div class="combined-analysis">
        <h3>性格与职业匹配分析</h3>
        <div class="match-meter">
          <div class="match-label">匹配度</div>
          <div class="match-bar">
            <div class="match-fill" style="width: ${matchPercentage}%"></div>
          </div>
          <div class="match-value">${matchPercentage}%</div>
        </div>
        <p class="match-description">${mbtiInfo.description}</p>
        
        <div class="match-details">
          <p>基于你的MBTI性格类型(${mbti_result})，你可能适合${mbtiInfo.bestFit.map(t => getTypeFullName(t)).join('和')}相关的职业。</p>
          <p>你的职业兴趣测试显示你偏好${careerTypes.slice(0, 3).map(t => getTypeFullName(t)).join('、')}类型的工作。</p>
          ${matchingTypes.length > 0 ? 
            `<p class="match-highlight">你的性格类型和职业兴趣在${matchingTypes.map(t => getTypeFullName(t)).join('、')}方面有很好的一致性。</p>` : 
            `<p class="match-alert">你的性格类型和职业兴趣可能有一些差异，这提示你可能需要在工作中更注重平衡。</p>`}
        </div>
      </div>
      
      <div class="recommended-majors">
        <h3>推荐专业</h3>
        <div class="major-section">
          <h4>${majorSectionTitle}</h4>
          ${recommendedMajorsHTML}
        </div>
        <p class="recommendation-note">专业推荐基于你的MBTI性格类型和Holland职业兴趣类型的特质匹配度计算。匹配度越高，表示该专业所需的特质与你的特质越符合。</p>
        <div class="major-search-section" style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 12px 0; color: #374151; font-size: 16px;">没有心仪的专业？试试搜索吧～</h4>
          <div style="display: flex; gap: 10px; align-items: flex-start;">
            <input 
              id="major-search-input" 
              type="text" 
              placeholder="输入专业名称，如：心理学、计算机科学" 
              style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none;"
            >
            <button 
              id="major-search-btn" 
              style="padding: 10px 20px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; white-space: nowrap;"
            >
              搜索
            </button>
          </div>
          <div id="major-search-message" style="margin-top: 8px; font-size: 13px; color: #ef4444;"></div>
        </div>
      </div>
      
      <div class="career-recommendations">
        <h3>根据你的综合结果，推荐以下职业方向：</h3>
        <ul class="recommendations-list">
          ${recommendations.map(career => `<li>${career}</li>`).join('')}
        </ul>
        <p class="recommendation-note">这些推荐基于你的性格特点和职业兴趣的结合分析，但记住，最终的职业选择还应考虑你的个人价值观、能力和实际情况。</p>
      </div>
    </div>
    <div class="combined-actions">
      <button class="restart-btn" onclick="backToMain()">返回主页</button>
      <button class="restart-btn secondary-btn" onclick="resetAllTests()">重新测试</button>
      <button class="restart-btn secondary-btn" onclick="showCombinedResult()">重新选择方向</button>
    </div>
  `;
  
  appDiv.innerHTML = resultHTML;
  
  // 添加专业搜索功能
  const searchInput = document.getElementById('major-search-input');
  const searchBtn = document.getElementById('major-search-btn');
  const searchMsg = document.getElementById('major-search-message');
  
  // 修改搜索逻辑以根据selectedDomain选择对应的数据源

if (searchInput && searchBtn && searchMsg) {
    const performSearch = () => {
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) {
        searchMsg.textContent = '请输入要搜索的专业名称';
        return;
      }
      searchMsg.textContent = '';
      let majorDataSource = null;
      if (selectedDomain === 'physics' && typeof major_names_physics === 'object') {
        majorDataSource = major_names_physics;
      } else if (selectedDomain === 'history' && typeof major_names_history === 'object') {
        majorDataSource = major_names_history;
      } else if (typeof major_names === 'object') {
        majorDataSource = major_names;
      }
      let foundMajor = null;
      let matchScore = 75;
      let matchList = [];
      if (majorDataSource) {
        // 精确匹配
        for (const major in majorDataSource) {
          if (major === searchTerm) {
            foundMajor = major;
            break;
          }
        }
        // 模糊匹配
        if (!foundMajor) {
          for (const major in majorDataSource) {
            if (major.includes(searchTerm) || searchTerm.includes(major)) {
              matchList.push(major);
            }
          }
        }
        // 关键词宽泛匹配
        if (!foundMajor && matchList.length === 0) {
          const searchKeywords = searchTerm.split(/[，,\s]+/);
          for (const major in majorDataSource) {
            for (const keyword of searchKeywords) {
              if (keyword.length > 1 && major.includes(keyword)) {
                matchList.push(major);
                break;
              }
            }
          }
        }
        matchList = sortMatchedMajors(matchList, searchTerm)
      }
      if (foundMajor) {
        showMajorDetail(foundMajor, matchScore);
      } else if (matchList.length === 1) {
        showMajorDetail(matchList[0], matchScore);
      } else if (matchList.length > 1) {
        // 多个匹配，弹窗让用户选择
        showOptionsToUser(matchList, (selected) => {
          if (selected) {
            showMajorDetail(selected, matchScore);
          }
        });
      } else {
        const domainText = selectedDomain === 'physics' ? '物理方向' : 
                          selectedDomain === 'history' ? '历史方向' : '当前方向';
        searchMsg.textContent = `未找到"${searchTerm}"在${domainText}中的相关专业，请尝试其他关键词`;
      }
    };
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    searchInput.addEventListener('focus', () => {
      searchMsg.textContent = '';
    });
  }
}

// 弹窗让用户选择多个匹配项 - 美化版本
function showOptionsToUser(options, callback) {
  // 创建遮罩层和弹窗
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border-radius: 20px;
    max-width: 420px;
    width: 90%;
    padding: 32px 28px;
    box-shadow: 
      0 20px 60px rgba(0,0,0,0.15),
      0 8px 25px rgba(0,0,0,0.1),
      inset 0 1px 0 rgba(255,255,255,0.6);
    position: relative;
    text-align: center;
    transform: scale(0.8) translateY(20px);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border: 1px solid rgba(255,255,255,0.2);
  `;

  // 添加装饰性元素
  const decorativeElement = document.createElement('div');
  decorativeElement.style.cssText = `
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  `;
  modal.appendChild(decorativeElement);

  // 图标
  const icon = document.createElement('div');
  icon.style.cssText = `
    width: 56px;
    height: 56px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  `;
  icon.innerHTML = '🎯';
  modal.appendChild(icon);

  const title = document.createElement('div');
  title.textContent = '发现多个匹配结果';
  title.style.cssText = `
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #1f2937, #374151);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `;
  modal.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.textContent = '请选择您想要查看的专业';
  subtitle.style.cssText = `
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 24px;
    line-height: 1.5;
  `;
  modal.appendChild(subtitle);

  // 创建选项容器
  const optionsContainer = document.createElement('div');
  optionsContainer.style.cssText = `
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 24px;
    padding: 0 4px;
  `;

  // 自定义滚动条样式
  const style = document.createElement('style');
  style.textContent = `
    .modal-options-container::-webkit-scrollbar {
      width: 6px;
    }
    .modal-options-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    .modal-options-container::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 3px;
    }
    .modal-options-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
    }
  `;
  document.head.appendChild(style);
  optionsContainer.className = 'modal-options-container';

  options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.cssText = `
      width: 100%;
      padding: 14px 20px;
      margin: 6px 0;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: linear-gradient(145deg, #ffffff, #f8fafc);
      color: #374151;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;

    // 添加箭头图标
    const arrow = document.createElement('span');
    arrow.innerHTML = '→';
    arrow.style.cssText = `
      color: #9ca3af;
      font-size: 16px;
      transition: all 0.25s ease;
      transform: translateX(-5px);
      opacity: 0;
    `;
    btn.appendChild(arrow);

    // 鼠标悬停效果
    btn.addEventListener('mouseenter', () => {
      btn.style.cssText += `
        border-color: #3b82f6;
        background: linear-gradient(145deg, #dbeafe, #bfdbfe);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      `;
      arrow.style.cssText += `
        transform: translateX(0);
        opacity: 1;
        color: #3b82f6;
      `;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.cssText = btn.style.cssText.replace(/border-color[^;]*;|background[^;]*;|transform[^;]*;|box-shadow[^;]*;/g, '');
      btn.style.borderColor = '#e2e8f0';
      btn.style.background = 'linear-gradient(145deg, #ffffff, #f8fafc)';
      btn.style.transform = 'none';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      arrow.style.cssText = arrow.style.cssText.replace(/transform[^;]*;|opacity[^;]*;|color[^;]*;/g, '');
      arrow.style.transform = 'translateX(-5px)';
      arrow.style.opacity = '0';
      arrow.style.color = '#9ca3af';
    });

    // 点击效果
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translateY(-1px) scale(0.98)';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'translateY(-2px)';
    });

    // 延迟动画
    setTimeout(() => {
      btn.style.cssText += `
        animation: slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s both;
      `;
    }, 50);

    btn.onclick = () => {
      // 点击动画
      btn.style.cssText += `
        background: linear-gradient(145deg, #10b981, #059669);
        color: white;
        border-color: #10b981;
        transform: scale(0.95);
      `;
      
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.05)';
        modal.style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          document.body.style.overflow = '';
          callback(opt);
        }, 300);
      }, 150);
    };
    optionsContainer.appendChild(btn);
  });

  modal.appendChild(optionsContainer);

  // 取消按钮
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.style.cssText = `
    width: 100%;
    padding: 14px 20px;
    border: 2px solid #ef4444;
    border-radius: 12px;
    background: linear-gradient(145deg, #ffffff, #fef2f2);
    color: #ef4444;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    margin-top: 8px;
  `;

  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.cssText += `
      background: linear-gradient(145deg, #ef4444, #dc2626);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
    `;
  });

  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.background = 'linear-gradient(145deg, #ffffff, #fef2f2)';
    cancelBtn.style.color = '#ef4444';
    cancelBtn.style.transform = 'none';
    cancelBtn.style.boxShadow = 'none';
  });

  cancelBtn.onclick = () => {
    overlay.style.opacity = '0';
    overlay.style.transform = 'scale(1.05)';
    modal.style.transform = 'scale(0.9) translateY(20px)';
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      document.body.style.overflow = '';
      callback(null);
    }, 300);
  };
  modal.appendChild(cancelBtn);

  // 添加动画样式
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes modalEntrance {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(animationStyle);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // 入场动画
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    modal.style.transform = 'scale(1) translateY(0)';
    modal.style.animation = 'modalEntrance 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  // 点击遮罩层关闭
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      cancelBtn.click();
    }
  });

  // ESC键关闭
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      cancelBtn.click();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// 返回主界面
function backToMain() {
  // 重置数据(但保留测试结果)
  resetCurrentTest();
  
  // 显示主界面，隐藏测试界面
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('app').style.display = 'none';
  
  // 检查是否两个测试都已完成，显示或隐藏综合分析按钮
  checkAndShowCombinedButton();
  
  // 更新测试次数显示
  if (typeof updateTestCountsDisplay === 'function') {
    updateTestCountsDisplay();
  }
}

// 检查并显示综合分析按钮
function checkAndShowCombinedButton() {
  const combinedBtn = document.getElementById('combined-analysis-btn');
  const completionStatus = document.getElementById('completion-status');
  
  if (mbti_result && career_result) {
    // 两个测试都完成了
    combinedBtn.style.display = 'block';
    completionStatus.style.display = 'block';
    document.getElementById('completed-tests-info').innerHTML = 
      `<span class="completed-test mbti-completed">MBTI (${mbti_result})</span> 和 
       <span class="completed-test career-completed">${career_result}</span>`;
  } else if (mbti_result || career_result) {
    // 只完成了一个测试
    combinedBtn.style.display = 'none';
    completionStatus.style.display = 'block';
    let completedTest = '';
    let pendingTest = '';
    
    if (mbti_result) {
      completedTest = `<span class="completed-test mbti-completed">MBTI (${mbti_result})</span>`;
      pendingTest = '<span class="pending-test">职业兴趣测试</span>';
    } else {
      completedTest = `<span class="completed-test career-completed">${career_result}</span>`;
      pendingTest = '<span class="pending-test">MBTI测试</span>';
    }
    
    document.getElementById('completed-tests-info').innerHTML = 
      `已完成 ${completedTest}，还需完成 ${pendingTest} 才能查看综合分析`;
  } else {
    // 两个测试都没完成
    combinedBtn.style.display = 'none';
    completionStatus.style.display = 'none';
  }
}

// 从MBTI和Holland组合中找出特质
function findCharacteristics(mbti, holland) {
  const characteristics = new Set();
  
  for (let char of holland) {
    const combination = `${mbti}+${char}`;
    if (personality_keywords[combination]) {
      personality_keywords[combination].forEach(keyword => {
        characteristics.add(keyword);
      });
    } else {
      console.log(`未找到${combination}的相关关键词`);
    }
  }
  
  return characteristics;
}

// 修改函数findRecommendedMajors的返回部分的实现，不改变基本逻辑
function findRecommendedMajors(characteristics, domainType) {
  const mapping = domainType === 'history' ? majors_traits_history : majors_traits_physics;
  const results = {};
  
  for (const [major, traits] of Object.entries(mapping)) {
    // 计算特质匹配数量
    const traitsSet = new Set(traits);
    let matchCount = 0;
    characteristics.forEach(char => {
      if (traitsSet.has(char)) {
        matchCount++;
      }
    });
    
    // 计算匹配比例
    const ratio = traits.length > 0 ? matchCount / traits.length : 0; // Avoid division by zero
    results[major] = { matchCount: matchCount, ratio: ratio };
  }
  
  // 按匹配数量从高到低排序，如果匹配数量相同，则按匹配比例从高到低排序
  const sortedResults = Object.entries(results)
    .sort(([, aData], [, bData]) => {
      if (bData.matchCount !== aData.matchCount) {
        return bData.matchCount - aData.matchCount;
      }
      return bData.ratio - aData.ratio; // Secondary sort by ratio
    })
    .slice(0, 10) // 只取前10个专业
    .map(([major, data]) => [major, data.ratio]); // 返回 [major, ratio] 格式
  
  return sortedResults;
}

// 获取类型全称
function getTypeFullName(typeCode) {
  const typeNames = {
    'R': '现实型(Realistic)',
    'I': '研究型(Investigative)',
    'A': '艺术型(Artistic)',
    'S': '社会型(Social)',
    'E': '企业型(Enterprising)',
    'C': '常规型(Conventional)'
  };
  return typeNames[typeCode] || typeCode;
}

// 获取综合职业推荐
function getCombinedRecommendations(mbtiType, primaryCareer, secondaryCareer) {
  // 职业推荐数据库
  const careerRecommendations = {
    // 内向+现实型
    'I_R': ['系统工程师', '质量控制工程师', '软件开发工程师', '环境科学家', '农业研究员'],
    // 内向+研究型
    'I_I': ['数据科学家', '研究员', '生物学家', '程序员', '统计学家', '医学研究员'],
    // 内向+艺术型
    'I_A': ['作家', '音乐制作人', '独立艺术家', '平面设计师', '网页设计师', '建筑师'],
    // 内向+社会型
    'I_S': ['咨询师', '图书馆员', '特殊教育教师', '社会工作者', '职业顾问'],
    // 内向+企业型
    'I_E': ['财务分析师', '市场研究分析师', '项目经理', '投资顾问', '战略规划师'],
    // 内向+常规型
    'I_C': ['会计', '数据分析师', '审计师', '税务专家', '研究助理', '行政专员'],
    
    // 外向+现实型
    'E_R': ['土木工程师', '施工经理', '环保工程师', '体育教练', '农场经理'],
    // 外向+研究型
    'E_I': ['医生', '法医科学家', '高校教授', '经济学家', '科研机构负责人'],
    // 外向+艺术型
    'E_A': ['演员', '艺术总监', '广告创意总监', '游戏设计师', '媒体制作人'],
    // 外向+社会型
    'E_S': ['教师', '人力资源经理', '公共关系专员', '健康服务管理员', '社区组织者'],
    // 外向+企业型
    'E_E': ['市场营销经理', '销售总监', '企业家', '政治家', '房地产经纪人'],
    // 外向+常规型
    'E_C': ['行政经理', '运营经理', '物流主管', '客户服务主管', '办公室经理']
  };
  
  // 确定E/I前缀
  const prefix = mbtiType.charAt(0); // 获取MBTI的第一个字母(E或I)
  
  // 获取主要和次要职业推荐
  const primaryKey = `${prefix}_${primaryCareer}`;
  const secondaryKey = `${prefix}_${secondaryCareer}`;
  
  let recommendations = [];
  
  // 添加主要职业类型推荐
  if (careerRecommendations[primaryKey]) {
    recommendations = recommendations.concat(careerRecommendations[primaryKey].slice(0, 3));
  }
  
  // 添加次要职业类型推荐
  if (careerRecommendations[secondaryKey]) {
    recommendations = recommendations.concat(careerRecommendations[secondaryKey].slice(0, 2));
  }
  
  // 如果推荐不足，添加更多通用推荐
  if (recommendations.length < 5) {
    const generalRecommendations = [
      '自由职业者', '顾问', '创业者', '内容创作者', '在线教育工作者'
    ];
    recommendations = recommendations.concat(generalRecommendations.slice(0, 5 - recommendations.length));
  }
  
  return recommendations;
}

// 重置当前测试
function resetCurrentTest() {
  // 重置分数
  Object.keys(mbtiScores).forEach(key => {
    mbtiScores[key] = 0;
  });
  Object.keys(careerScores).forEach(key => {
    careerScores[key] = 0;
  });
  
  current = 0;
  currentCategory = "";
  
  // 重新初始化UI
  document.getElementById('app').innerHTML = `
    <h3 id="category" class="question-category"></h3>
    <h2 id="question">加载中...</h2>
    <div class="progress-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>
    <p id="progress-text"></p>
    <div id="options" class="fade-in"></div>
  `;
}

// 重置所有测试
function resetAllTests() {
  mbti_result = "";
  career_result = "";
  mbti_description = "";
  resetCurrentTest();
  backToMain();
}

// 显示测试限制消息
function showTestLimitMessage(message, testType) {
  const appDiv = document.getElementById('app');
  const testName = testType === 'mbti' ? 'MBTI性格测试' : '职业兴趣测试';
  const themeClass = testType === 'mbti' ? 'mbti-theme' : 'career-theme';
  
  appDiv.className = `card ${themeClass}`;
  appDiv.innerHTML = `
    <div class="test-limit-container" style="text-align: center; padding: 40px 20px;">
      <div class="test-limit-icon" style="font-size: 60px; margin-bottom: 20px; color: #ef4444;">
        ⚠️
      </div>
      <h2 style="color: #ef4444; margin-bottom: 20px;">测试次数已达上限</h2>
      <div class="test-limit-message" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <p style="color: #dc2626; font-size: 16px; margin: 0;">${message}</p>
      </div>
      <div class="test-limit-info" style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: left;">
        <h4 style="color: #374151; margin-bottom: 15px;">为什么有次数限制？</h4>
        <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
          <li>确保测试结果的可信度和一致性</li>
          <li>避免过度测试影响结果准确性</li>
          <li>鼓励深入思考每个问题而非随意作答</li>
        </ul>
      </div>
      <button class="restart-btn" onclick="backToMain()" style="background: #6b7280;">返回主页</button>
    </div>
  `;
}

// 更新主界面显示测试次数信息
async function updateTestCountsDisplay() {
  if (typeof getUserTestCounts !== 'function') {
    return; // 如果函数不存在，直接返回
  }

  // 检查是否为开发者模式
  const isDeveloperMode = currentUserData && currentUserData.id === 'dev';

  const counts = await getUserTestCounts();
  const mbtiBtn = document.querySelector('.mbti-btn');
  const careerBtn = document.querySelector('.career-btn');
  
  if (mbtiBtn) {
    const mbtiDesc = mbtiBtn.querySelector('.test-desc');
    
    if (isDeveloperMode) {
      // 开发者模式显示无限制
      mbtiBtn.style.opacity = '1';
      mbtiBtn.style.cursor = 'pointer';
      mbtiDesc.innerHTML = `了解你的人格特质与行为倾向<br><small style="color: #10b981;">开发者模式 - 无限制</small>`;
    } else {
      const mbtiCount = counts.mbti_count || 0;
      const mbtiRemaining = Math.max(0, MAX_TEST_ATTEMPTS - mbtiCount);
      
      if (mbtiCount >= MAX_TEST_ATTEMPTS) {
        mbtiBtn.style.opacity = '0.6';
        mbtiBtn.style.cursor = 'not-allowed';
        mbtiDesc.innerHTML = `已完成 ${mbtiCount}/${MAX_TEST_ATTEMPTS} 次 - <span style="color: #ef4444;">已达上限</span>`;
      } else {
        mbtiBtn.style.opacity = '1';
        mbtiBtn.style.cursor = 'pointer';
        mbtiDesc.innerHTML = `了解你的人格特质与行为倾向<br><small style="color: #6b7280;">剩余 ${mbtiRemaining} 次机会</small>`;
      }
    }
  }
  
  if (careerBtn) {
    const careerDesc = careerBtn.querySelector('.test-desc');
    
    if (isDeveloperMode) {
      // 开发者模式显示无限制
      careerBtn.style.opacity = '1';
      careerBtn.style.cursor = 'pointer';
      careerDesc.innerHTML = `发现适合你的职业发展方向<br><small style="color: #10b981;">开发者模式 - 无限制</small>`;
    } else {
      const careerCount = counts.career_count || 0;
      const careerRemaining = Math.max(0, MAX_TEST_ATTEMPTS - careerCount);
      
      if (careerCount >= MAX_TEST_ATTEMPTS) {
        careerBtn.style.opacity = '0.6';
        careerBtn.style.cursor = 'not-allowed';
        careerDesc.innerHTML = `已完成 ${careerCount}/${MAX_TEST_ATTEMPTS} 次 - <span style="color: #ef4444;">已达上限</span>`;
      } else {
        careerBtn.style.opacity = '1';
        careerBtn.style.cursor = 'pointer';
        careerDesc.innerHTML = `发现适合你的职业发展方向<br><small style="color: #6b7280;">剩余 ${careerRemaining} 次机会</small>`;
      }
    }
  }
  
  // 更新温馨提示界面的测试次数显示
  const welcomeTestCounts = document.getElementById('welcome-test-counts');
  if (welcomeTestCounts) {
    if (isDeveloperMode) {
      welcomeTestCounts.innerHTML = `
        <div class="test-count-item">
          <span class="test-count-label">当前状态:</span>
          <span class="test-count-value developer-mode">开发者模式 - 无限制测试</span>
        </div>
      `;
    } else {
      const mbtiCount = counts.mbti_count || 0;
      const careerCount = counts.career_count || 0;
      const mbtiRemaining = Math.max(0, MAX_TEST_ATTEMPTS - mbtiCount);
      const careerRemaining = Math.max(0, MAX_TEST_ATTEMPTS - careerCount);
      
      welcomeTestCounts.innerHTML = `
        <div class="test-count-item">
          <span class="test-count-label">MBTI性格测试:</span>
          <span class="test-count-value">剩余 ${mbtiRemaining}/${MAX_TEST_ATTEMPTS} 次</span>
        </div>
        <div class="test-count-item">
          <span class="test-count-label">职业兴趣测试:</span>
          <span class="test-count-value">剩余 ${careerRemaining}/${MAX_TEST_ATTEMPTS} 次</span>
        </div>
      `;
    }
  }
}