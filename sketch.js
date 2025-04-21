// --- Quiz Data & State ---
let questions = [
  { text: "What did we have for dinner on our first date?", choices: ["Pizza", "Tacos", "Pasta"], answer: 1 },
  { text: "Where did we first hug?", choices: ["Trapper's cove", "Spartan Village", "Movie Theatre"], answer: 1 },
  { text: "Would you rather", choices: ["Get spanked", "Do the spanking", "-_-"], answer: 0},
  { text: "What is my favorite food?", choices: ["Daal", "Alu Bhaat", "Begun Bhaja", "Gorom Bhaat", "All of the above"], answer: 4},
  { text: "What was the first gift I sent you?", choices: ["Canned Tuna", "Butter Chicken", "Smoked Salmon"], answer: 2},
  { text: "What is my zodiac sign? NO GOOGLING.", choices: ["Capricorn", "Cancer", "Leo"], answer: 1},
  { text: "What was the movie we watched in a cinema hall?", choices: ["Love Hurts", "Love Actually", "Love is Fun", "Love in the Air"], answer: 0},
  { text: "Would you rather", choices: ["Never wear underwear again", "Never wear socks again"], answer: 0},
  { text: "Would you rather", choices: ["Hold my hands for hours straight", "Or never hold them again"], answer: 0},
  { text: "What is the color of my eyes?", choices: ["Blue", "Brown", "Black"], answer: 2},
  { text: "How tall am?", choices: ["6'1", "Tall enough", "1 feet taller than you"], answer: 2},
  { text: "Life would be hard but we will go through it together.", choices: ["I don't trust you", "I trust you"], answer: 1},
  { text: "Do you trust me?", choices: ["YES", "YES BUT WITH MORE ENTHUSIASM"], answer: 1},
  { text: "Do you love me Jaima?", choices: ["I love you Shihab"], answer: 0}
];
const pastelColors = ["#FFD4D4", "#D4FFD4", "#D4E4FF", "#FFF4D4", "#EED4FF"];
let current = 0, correctCount = 0, quizActive = true;
let easterEggClicks = 0;

// --- Grab your screens & quiz container ---
const welcomeScreen = document.getElementById('welcome-screen');
const container     = document.getElementById('quiz-container');

function startCountdown(seconds) {
  let remaining = seconds;
  const counterEl = document.getElementById('countdown');
  counterEl.textContent = remaining;

  const timer = setInterval(() => {
    remaining--;
    counterEl.textContent = remaining >= 0 ? remaining : 0;
    if (remaining <= 0) {
      clearInterval(timer);
      transitionToQuiz();
    }
  }, 1000);
}

function transitionToQuiz() {
  // optional fade‑out
  welcomeScreen.classList.add('hidden');
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    container.style.display     = 'block';
    container.classList.remove('hidden');
    showQuestion();  // your quiz starter
  }, 500);
}

// kick it off as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  startCountdown(10);
});


// --- p5.js Preload for Assets ---
let catImg, failSound;
function preload() {
  catImg = loadImage('assets/crying_cat.png');                     
  failSound = loadSound('assets/fail.mp3');
  perfectSound = loadSound('assets/perfect.mp3');
}

// --- DOM Reference ---
//const container = document.getElementById('quiz-container');

// --- Display a Question ---
function showQuestion() {
  document.body.style.backgroundColor = pastelColors[current % pastelColors.length];
  const q = questions[current];
  container.innerHTML = `
    <p>${q.text}</p>
    ${q.choices.map((c,i)=>`
      <label>
        <input type="radio" name="opt" value="${i}">
        ${c}
      </label>
    `).join('')}
    <button id="submit-btn">Submit</button>
  `;
  container.style.display = 'block';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-btn').addEventListener('click', submitAnswer);
}

// --- Answer Handling with Feedback Delay ---
function submitAnswer() {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  const sel = document.querySelector('input[name="opt"]:checked'),
        isCorrect = sel && +sel.value === questions[current].answer;

  if (isCorrect) {
    confetti({ particleCount: 100, spread: 70, origin: { y:0.6 } });
    advanceQuiz(true);
  } else {
    container.style.display = 'none';
    const cat = document.createElement('img');
    cat.id = 'feedback-cat'; cat.src = 'assets/crying_cat.png';
    Object.assign(cat.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)', width: '200px', zIndex: '3'
    });
    document.body.appendChild(cat);
    setTimeout(()=>{
      cat.remove();
      advanceQuiz(false);
    }, 2000);
  }
}

// --- Easter Egg ---
function initEasterEgg() {
  const clickHandler = () => {
    easterEggClicks++;                                          // track clicks :contentReference[oaicite:4]{index=4}
    if (easterEggClicks >= 5) {
      document.removeEventListener('click', clickHandler);      // stop listening :contentReference[oaicite:5]{index=5}
      showProposalScreen();
    }
  };
  document.addEventListener('click', clickHandler);            // start listening :contentReference[oaicite:6]{index=6}
}

// --- Quiz Progression ---
function advanceQuiz(correct) {
  if (correct) correctCount++;
  current++;
  if (current < questions.length) showQuestion();
  else endQuiz();
}

// --- End Quiz with Audio & Heart Rain ---
function endQuiz() {
  quizActive = false;
  container.style.display = 'none';
  if (correctCount === questions.length) {
    perfectSound.play();  // p5.SoundFile.play() initiates playback :contentReference[oaicite:6]{index=6}
  } else {
    perfectSound.play();
  }
  startHearts(correctCount === questions.length);
  initEasterEgg();
}

// Initialize first question
//showQuestion();

// --- p5.js Heart‑Rain & Sparkle Animation ---
let hearts = [], sparkles = [], perfect;
function startHearts(isPerfect) {
  perfect = isPerfect;
  quizActive = false;
}

// Draw loop
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255,100,150);
}
function draw() {
  if (quizActive) return;
  background(20);
  
  if (perfect) {
    textAlign(CENTER, CENTER);           // horiz & vert centering :contentReference[oaicite:1]{index=1}
    textSize(48);
    textLeading(54);                     // optional line spacing :contentReference[oaicite:2]{index=2}
    fill(255, 200, 200);
    text(
      "In every falling heart, a wish for you\nHappy Birthday Jaima",
      width/2,                          // x‑center
      height/2,                         // y‑center
    );
    }
  // Hearts
  if (frameCount % 10 === 0) hearts.push(new Heart());
  hearts.forEach((h,i)=>{
    h.update(); h.show();
    if (h.offscreen()) hearts.splice(i,1);
    // Sparkles around each heart 
    if (random() < 0.05) sparkles.push(new Sparkle(h.x, h.y));
    // Occasional starbursts :contentReference[oaicite:6]{index=6}
    if (random() < 0.02) {
      push();
      noFill(); stroke(255,255,200,200); strokeWeight(1.5);
      star(h.x, h.y, 4, 8, 5);
      pop();
    }
  });

  // Update & show sparkles
  sparkles = sparkles.filter(s => {
    s.update(); s.show();
    return !s.isDead();
  });

  // Failure message
  if (!perfect) text("You couldn't get all correct. But, you’ve still stolen my heart!\nHappy Birthday Jaima", width/2, height-60);
}

// Handle window resize 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Heart class with glow effect :contentReference[oaicite:7]{index=7}
class Heart {
  constructor() {
    this.x     = random(width);
    this.y     = -20;
    this.size  = random(20, 50);
    this.speed = random(1, 3);
  }
  update() {
    this.y += this.speed;
  }
  show() {
    // 1. Isolate transform & style
    push();                                         // p5.js push/pop to isolate transforms :contentReference[oaicite:4]{index=4}
    translate(this.x, this.y);                      // Move (0,0) to the heart’s position :contentReference[oaicite:5]{index=5}

    // 2. Configure glow on the raw Canvas context
    const ctx = drawingContext;                    
    ctx.save();                                     // Save pre‑glow state :contentReference[oaicite:6]{index=6}
    ctx.shadowBlur    = 20;                         // How fuzzy the glow is 
    ctx.shadowColor   = 'rgba(255,100,150,0.8)';    // Pinkish glow matching the fill :contentReference[oaicite:7]{index=7}
    ctx.shadowOffsetX = 0;                          // Required non‑zero blur context in some browsers 
    ctx.shadowOffsetY = 0;

    // 3. Set the actual fill color for the heart
    fill(255, 100, 150);                            // p5.js fill() sets ctx.fillStyle to the RGB color :contentReference[oaicite:8]{index=8}
    noStroke();                                     // Optionally disable stroke for a clean fill :contentReference[oaicite:9]{index=9}

    // 4. Draw the heart shape at the new (0,0)
    beginShape();
      vertex(0, -this.size/2);
      bezierVertex(this.size, -this.size,
                   this.size*1.5, this.size/4,
                   0, this.size);
      bezierVertex(-this.size*1.5, this.size/4,
                   -this.size, -this.size,
                   0, -this.size/2);
    endShape(CLOSE);

    // 5. Restore to remove glow for subsequent drawings
    ctx.restore();                                  // Reverts shadowBlur, shadowColor, etc. :contentReference[oaicite:10]{index=10}

    // 6. End transform isolation
    pop();                                          // Restores translation and fill style :contentReference[oaicite:11]{index=11}
  }
  offscreen() { return this.y > height + this.size; }
}

function showProposalScreen() {
    noLoop();                                                                 // stops the draw() loop :contentReference[oaicite:3]{index=3}
  remove(); 

  // 4. Show your proposal using the existing quiz-container DOM element
  container.style.display = 'flex';                            // make it visible :contentReference[oaicite:10]{index=10}
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.innerHTML = `
    <div id="proposal-text">
      <h1>Jaima,</h1>
      <p>Will you marry me? ❤️</p>
    </div>
  `;

  // 5. Apply inline styling (or add to your CSS file)
  const p = document.getElementById('proposal-text');
  p.style.color = '#FFB6C1';
  p.style.textAlign = 'center';
  p.style.fontSize = '3rem';
  p.style.lineHeight = '1.2';
}

// Sparkle particle class :contentReference[oaicite:13]{index=13}
class Sparkle {
  constructor(x,y) {
    this.pos = createVector(x + random(-10,10), y + random(-10,10));
    this.vel = p5.Vector.random2D().mult(0.5);
    this.life = 60;
  }
  update() {
    this.pos.add(this.vel);
    this.life--;
  }
  show() {
    noStroke();
    fill(255,255,255, map(this.life,0,60,0,255));
    rect(this.pos.x, this.pos.y, 2, 2);
  }
  isDead() { return this.life <= 0; }
}

// Star helper from p5.js examples :contentReference[oaicite:14]{index=14}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints, half = angle/2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    vertex(x + cos(a)*radius2, y + sin(a)*radius2);
    vertex(x + cos(a+half)*radius1, y + sin(a+half)*radius1);
  }
  endShape(CLOSE);
}
