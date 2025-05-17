// 全局变量
let questionsData = [];  // 存储所有类别的题目
let flatQuestions = [];  // 扁平化后的所有题目
const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
const careerScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0, X: 0 };
let currentScores = mbtiScores; // 默认为MBTI测试
let current = 0;
let currentCategory = "";
let currentTest = ""; // 当前测试类型: "mbti" 或 "career"

// 选择测试类型
function selectTest(testType) {
  // 隐藏主界面，显示测试界面
  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  
  // 设置当前测试类型
  currentTest = testType;
  
  // 根据测试类型加载不同的题库和计分系统
  if (testType === 'mbti') {
    // MBTI测试
    document.getElementById('app').className = 'card mbti-theme';
    currentScores = mbtiScores;
    loadQuestions('mbti_questions.json');
  } else if (testType === 'career') {
    // 职业兴趣测试
    document.getElementById('app').className = 'card career-theme';
    currentScores = careerScores;
    loadQuestions('career_questions.json');
  }
  
  // 重置其他状态
  current = 0;
  currentCategory = "";
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

  document.getElementById('app').innerHTML = `
    <h2>你的MBTI性格类型是</h2>
    <div class="result-type">${result}</div>
    <div class="result">
      <p>${personalityDescriptions[result] || '这是一个独特而有趣的性格组合。'}</p>
    </div>
    <button class="restart-btn" onclick="backToMain()">返回主页</button>
  `;
}

// 显示职业兴趣测试结果
function showCareerResult() {
  // 计算RIASEC得分并排序
  const scores = [
    { type: 'R', score: careerScores.R, name: '现实型 (Realistic)', description: '喜欢动手操作或使用工具和机器，倾向于技术性和实用性工作。' },
    { type: 'I', score: careerScores.I, name: '研究型 (Investigative)', description: '喜欢分析和解决问题，倾向于研究性和科学性工作。' },
    { type: 'A', score: careerScores.A, name: '艺术型 (Artistic)', description: '喜欢创造性和表达性活动，倾向于艺术、音乐或写作工作。' },
    { type: 'S', score: careerScores.S, name: '社会型 (Social)', description: '喜欢帮助他人，倾向于教育、咨询或社会服务工作。' },
    { type: 'E', score: careerScores.E, name: '企业型 (Enterprising)', description: '喜欢领导和说服他人，倾向于销售、管理或创业工作。' },
    { type: 'C', score: careerScores.C, name: '常规型 (Conventional)', description: '喜欢有序和结构化的活动，倾向于组织、数据处理或行政工作。' }
  ];
  
  // 按分数排序
  scores.sort((a, b) => b.score - a.score);
  
  // 构建结果展示
  let resultHTML = `
    <h2>你的职业兴趣类型</h2>
    <div class="result-type">${scores[0].type}${scores[1].type}${scores[2].type}</div>
    <div class="result">
      <p>你的职业兴趣类型组合是：<strong>${scores[0].type}${scores[1].type}${scores[2].type}</strong>，以下是各项得分（从高到低）：</p>
      <div class="career-scores">
  `;
  
  // 添加每个类型的得分条形图
  scores.forEach(item => {
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
  
  resultHTML += `
      </div>
      <div class="career-explanation">
        <p>你的主导类型是：<strong>${scores[0].name}</strong></p>
        <p>根据霍兰德职业兴趣理论，你可能适合的职业领域包括：</p>
        <div class="career-suggestions">
          ${getCareerSuggestions(scores[0].type, scores[1].type)}
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
  // 重置数据
  resetTest();
  
  // 显示主界面，隐藏测试界面
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

// 重置测试
function resetTest() {
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
  
  if (currentTest) {
    loadQuestions(currentTest === 'mbti' ? 'mbti_questions.json' : 'career_questions.json');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 不再自动加载问题，而是等待用户选择测试类型
});