// 全局变量
let questionsData = [];  // 存储所有类别的题目
let flatQuestions = [];  // 扁平化后的所有题目
let currentTest = '';    // 当前测试类型：'mbti' 或 'holland'

// MBTI相关变量
const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

// Holland六型相关变量
const hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
const hollandDescriptions = {
  R: "现实型 (Realistic)：喜欢在户外工作，喜欢使用工具和机械，喜欢体力活动。适合的职业如：工程师、技工、农民、园艺师等。",
  I: "研究型 (Investigative)：喜欢思考和解决问题，喜欢研究、分析和探索，喜欢独立工作。适合的职业如：科学家、研究员、医生、程序员等。",
  A: "艺术型 (Artistic)：喜欢创造性活动，如写作、音乐、舞蹈或设计，不喜欢常规和重复性工作。适合的职业如：艺术家、作家、设计师、演员等。",
  S: "社会型 (Social)：喜欢与人合作，帮助、引导和服务他人，善于沟通。适合的职业如：教师、顾问、社工、护士等。",
  E: "企业型 (Enterprising)：喜欢领导和说服他人，善于销售和管理，喜欢竞争和冒险。适合的职业如：经理、销售、企业家、律师等。",
  C: "常规型 (Conventional)：喜欢按规则和指示工作，善于细节和数据处理，喜欢有序和结构化的环境。适合的职业如：会计、银行职员、行政助理等。"
};

let current = 0;
let currentCategory = "";

// 选择测试类型
function selectTest(testType) {
  currentTest = testType;
  document.getElementById('test-selection').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  
  resetTest();
  
  if (testType === 'mbti') {
    loadQuestions('questions.json');
  } else if (testType === 'holland') {
    loadQuestions('holland_questions.json');
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
  } else if (q.category === '') {
    document.getElementById('category').style.display = 'none';
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
      if (currentTest === 'mbti') {
        mbtiScores[opt.dimension]++;
      } else if (currentTest === 'holland') {
        hollandScores[opt.dimension]++;
      }
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
  } else if (currentTest === 'holland') {
    showHollandResult();
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
    <button class="restart-btn" onclick="backToSelection()">返回选择</button>
  `;
}

// 显示Holland职业兴趣测试结果
function showHollandResult() {
  // 对分数排序以获取最高的三个维度
  const sortedDimensions = Object.entries(hollandScores)
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0]);
  
  const topThree = sortedDimensions.slice(0, 3);
  const hollandCode = topThree.join('');
  
  let resultHTML = `
    <h2>你的Holland职业兴趣代码是</h2>
    <div class="holland-code">${hollandCode}</div>
    <div class="holland-description">
      <p>你的主导类型是: <strong>${hollandDescriptions[topThree[0]].split('：')[0]}</strong></p>
      <p>${hollandDescriptions[topThree[0]]}</p>
    </div>
    
    <h3 class="result-subtitle">你的详细类型说明</h3>
    <div class="holland-description">
      <p><strong>${topThree[1]}型：</strong>${hollandDescriptions[topThree[1]].split('：')[1]}</p>
      <p><strong>${topThree[2]}型：</strong>${hollandDescriptions[topThree[2]].split('：')[1]}</p>
    </div>
    
    <h3 class="result-subtitle">所有维度得分</h3>
    <div class="holland-chart">
  `;
  
  // 创建图表
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  const maxScore = Math.max(...Object.values(hollandScores));
  
  dimensions.forEach((dim, index) => {
    const score = hollandScores[dim];
    const heightPercentage = (score / maxScore) * 100;
    
    resultHTML += `
      <div class="holland-bar" id="bar-${dim}" style="left: ${index * 60 + 30}px; height: 0;">
        <div class="holland-bar-label">${dim}<br>${score}</div>
      </div>
    `;
  });
  
  resultHTML += `
    </div>
    <button class="restart-btn" onclick="backToSelection()">返回选择</button>
  `;
  
  document.getElementById('app').innerHTML = resultHTML;
  
  // 添加动画效果
  setTimeout(() => {
    dimensions.forEach(dim => {
      const bar = document.getElementById(`bar-${dim}`);
      const score = hollandScores[dim];
      const heightPercentage = (score / maxScore) * 100;
      bar.style.height = `${heightPercentage}%`;
    });
  }, 100);
}

// 返回测试选择界面
function backToSelection() {
  document.getElementById('test-selection').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

// 重置测试
function resetTest() {
  // 重置分数
  if (currentTest === 'mbti') {
    Object.keys(mbtiScores).forEach(key => {
      mbtiScores[key] = 0;
    });
  } else if (currentTest === 'holland') {
    Object.keys(hollandScores).forEach(key => {
      hollandScores[key] = 0;
    });
  }
  
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 首页显示测试选择界面，不自动加载任何测试
});