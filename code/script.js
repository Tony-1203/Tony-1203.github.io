// 全局变量
let questionsData = [];  // 存储所有类别的题目
let flatQuestions = [];  // 扁平化后的所有题目
const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let current = 0;
let currentCategory = "";

// 加载题库
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
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
      scores[opt.dimension]++;
      current++;
      showQuestion();
    };
    optionsDiv.appendChild(btn);
  });
}

// 显示测试结果
function showResult() {
  const result =
    (scores.E > scores.I ? 'E' : 'I') +
    (scores.S > scores.N ? 'S' : 'N') +
    (scores.T > scores.F ? 'T' : 'F') +
    (scores.J > scores.P ? 'J' : 'P');

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
    <button class="restart-btn" onclick="resetTest()">重新测试</button>
  `;
}

// 重置测试
function resetTest() {
  // 重置分数
  Object.keys(scores).forEach(key => {
    scores[key] = 0;
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
  
  showQuestion();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', loadQuestions);