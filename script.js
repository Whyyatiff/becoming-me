const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const EXERCISES = [
  ['Push‑ups','Bodyweight Squats','Plank 30s','Lunges'],
  ['Inclined Push‑ups','Wall Sit 30s','Glute Bridges','Mountain Climbers'],
  ['Diamond Push‑ups','Calf Raises','Side Plank 30s','Reverse Lunges']
];
const XP_PER = 20, XP_MAX = 100;
let state = JSON.parse(localStorage.getItem('state')) || { xp:0, level:1, lastDay:null };

const routineEl = document.getElementById('routine');
const completeBtn = document.getElementById('completeBtn');
const xpDisplay = document.getElementById('xpDisplay');

function getTodayRoutine() {
  const d = new Date();
  const day = DAYS[d.getDay()];
  let idx = d.getDay() % 3;
  return EXERCISES[idx];
}

function renderRoutine() {
  const list = getTodayRoutine();
  routineEl.innerHTML = list.map(ex => `<div>• ${ex}</div>`).join('');
}

function updateXPDisplay() {
  xpDisplay.textContent = `XP: ${state.xp} – Lv ${state.level}`;
}

function markComplete(){
  const today=new Date().toDateString();
  if(state.lastDay===today){
    alert('Already checked in today!');
    return;
  }
  state.xp += XP_PER;
  if(state.xp>=XP_MAX){
    state.xp -= XP_MAX; state.level++;
    party.confetti(document.querySelector('.center'),{count:40});
  }
  state.lastDay = today;
  localStorage.setItem('state', JSON.stringify(state));
  updateXPDisplay();
}

completeBtn.addEventListener('click', markComplete);

window.addEventListener('DOMContentLoaded', () => {
  renderRoutine();
  updateXPDisplay();

  // Overlay logic
  const signupOverlay = document.getElementById('signup-overlay');
  const loginOverlay = document.getElementById('login-overlay');

  document.getElementById('show-login').onclick = e => {
    e.preventDefault();
    signupOverlay.classList.add('hidden');
    loginOverlay.classList.remove('hidden');
  };
  document.getElementById('show-signup').onclick = e => {
    e.preventDefault();
    loginOverlay.classList.add('hidden');
    signupOverlay.classList.remove('hidden');
  };
  document.getElementById('close-signup').onclick = () => signupOverlay.classList.add('hidden');
  document.getElementById('close-login').onclick = () => loginOverlay.classList.add('hidden');
  document.getElementById('loginscreen-login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful!");
      document.getElementById('loginscreen-overlay').classList.add('hidden');
      // Redirect or load dashboard
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check console.");
  }
});


  // Show signup when clicking "Membership" button
  const membershipBtn = document.querySelector('.btn:nth-child(5)');
  if (membershipBtn) {
    membershipBtn.onclick = () => {
      signupOverlay.classList.remove('hidden');
    };
  }
});

gsap.registerPlugin(ScrollTrigger);

// Smooth scroll setup
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));

// Timeline for hero and scroll animations
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.app',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.2,
    pin: true,
  }
});

// Animate image scale down slightly while revealing below content
tl.to('.intro_media_image', { scale: 1, ease: 'power1.out' });

// Fade title/text on scroll
tl.fromTo('.hero-title', { y:0, autoAlpha:1 }, { y:-200, autoAlpha:0 }, 0);
tl.fromTo('.hero-sub', { y:0, autoAlpha:1 }, { y:-150, autoAlpha:0 }, 0);
