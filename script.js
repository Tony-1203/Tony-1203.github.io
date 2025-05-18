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

  career_result = scores[0].type + scores[1].type + scores[2].type;
  
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
  // 重置数据(但保留测试结果)
  resetCurrentTest();
  
  // 显示主界面，隐藏测试界面
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('app').style.display = 'none';
  
  // 检查是否两个测试都已完成，显示或隐藏综合分析按钮
  checkAndShowCombinedButton();
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

// 根据特质找出推荐专业
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
    const ratio = matchCount / traits.length;
    results[major] = ratio;
  }
  
  // 按匹配比例从高到低排序
  const sortedResults = Object.entries(results)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // 只取前10个专业
  
  return sortedResults;
}

// 显示综合分析结果
function showCombinedResult() {
  // 隐藏主界面，显示测试界面
  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('app').className = 'card combined-theme';
  
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
  
  // 获取MBTI关联信息
  const mbtiInfo = mbtiCareerRelations[mbti_result] || { 
    bestFit: [], 
    description: '你的性格组合非常独特，可以考虑探索多种职业领域。' 
  };
  
  // 解析职业兴趣类型
  const careerTypes = career_result.split('');
  
  // 计算匹配度
  const matchingTypes = mbtiInfo.bestFit.filter(type => careerTypes.includes(type));
  const matchPercentage = matchingTypes.length > 0 
    ? Math.round((matchingTypes.length / Math.min(mbtiInfo.bestFit.length, 2)) * 100) 
    : 0;
  
  // 使用特质和推荐逻辑计算推荐专业
  const characteristics = findCharacteristics(mbti_result, careerTypes);
  const historyMajors = findRecommendedMajors(characteristics, 'history');
  const physicsMajors = findRecommendedMajors(characteristics, 'physics');
  
  // 获取职业建议
  const recommendations = getCombinedRecommendations(mbti_result, careerTypes[0], careerTypes[1]);
  
  // 构建结果HTML
  let resultHTML = `
    <h2>综合分析结果</h2>
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
          <h4>文科类推荐专业</h4>
          <ul class="major-list">
            ${historyMajors.map(([major, score]) => 
              `<li><span class="major-name">${major}</span> <span class="match-score">${Math.round(score * 100)}% 匹配</span></li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="major-section">
          <h4>理工类推荐专业</h4>
          <ul class="major-list">
            ${physicsMajors.map(([major, score]) => 
              `<li><span class="major-name">${major}</span> <span class="match-score">${Math.round(score * 100)}% 匹配</span></li>`
            ).join('')}
          </ul>
        </div>
        
        <p class="recommendation-note">专业推荐基于你的MBTI性格类型和Holland职业兴趣类型的特质匹配度计算。匹配度越高，表示该专业所需的特质与你的特质越符合。</p>
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
    </div>
  `;
  
  document.getElementById('app').innerHTML = resultHTML;
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否两个测试都已完成
  checkAndShowCombinedButton();
});