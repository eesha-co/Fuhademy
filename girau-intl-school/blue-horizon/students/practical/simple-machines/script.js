// Simple Machines interactive behaviors
const fulcrumRange = document.getElementById('fulcrumRange');
const leftWeight = document.getElementById('leftWeight');
const rightWeight = document.getElementById('rightWeight');
const leftTorque = document.getElementById('leftTorque');
const rightTorque = document.getElementById('rightTorque');
const netTorque = document.getElementById('netTorque');
const status = document.getElementById('status');
const beam = document.getElementById('beam');
const leftWeightCircle = document.getElementById('left-weight');
const rightWeightCircle = document.getElementById('right-weight');

function updateLever() {
  const fulcrumPct = Number(fulcrumRange.value)/100; // 0-1
  const leftPos = -260 + (520 * fulcrumPct) - 180; // place left weight relative
  const rightPos = -260 + (520 * fulcrumPct) + 140; // place right weight

  // clamp positions within beam
  leftWeightCircle.setAttribute('cx', -120);
  rightWeightCircle.setAttribute('cx', 140);

  // Compute distances from fulcrum
  const fulcrumX = -260 + (520*fulcrumPct);
  const leftX = -120;
  const rightX = 140;
  const leftDist = Math.abs(leftX - fulcrumX) / 10; // scaled units
  const rightDist = Math.abs(rightX - fulcrumX) / 10;

  const leftF = Number(leftWeight.value);
  const rightF = Number(rightWeight.value);
  const leftT = +(leftF * leftDist).toFixed(2);
  const rightT = +(rightF * rightDist).toFixed(2);
  const netT = +(rightT - leftT).toFixed(2);

  leftTorque.textContent = leftT;
  rightTorque.textContent = rightT;
  netTorque.textContent = Math.abs(netT);

  if (Math.abs(netT) < 0.5) {
    status.textContent = 'Status: Balanced';
    beam.setAttribute('transform', 'translate(300,120) rotate(0)');
  } else if (netT > 0) {
    status.textContent = 'Status: Right side down';
    beam.setAttribute('transform', 'translate(300,120) rotate(8)');
  } else {
    status.textContent = 'Status: Left side down';
    beam.setAttribute('transform', 'translate(300,120) rotate(-8)');
  }
}

[fulcrumRange,leftWeight,rightWeight].forEach(el=>el.addEventListener('input', updateLever));
updateLever();

// Inclined plane
const angleRange = document.getElementById('angleRange');
const massRange = document.getElementById('massRange');
const downForce = document.getElementById('downForce');
const accel = document.getElementById('accel');
const plane = document.getElementById('plane');
const planeGroup = document.getElementById('plane-group');
const inclineStatus = document.getElementById('inclineStatus');
const block = document.getElementById('block');

function updateIncline() {
  const angleDeg = Number(angleRange.value);
  const mass = Number(massRange.value);
  const g = 9.81;
  const angleRad = angleDeg * Math.PI/180;
  const downhill = +(mass * g * Math.sin(angleRad)).toFixed(2);
  const a = +(g * Math.sin(angleRad)).toFixed(3);

  downForce.textContent = downhill;
  accel.textContent = a;
  inclineStatus.textContent = `Angle: ${angleDeg}°`;

  // rotate plane visual
  plane.setAttribute('transform', `rotate(${-angleDeg})`);
  planeGroup.setAttribute('transform', `translate(100,200) rotate(${-angleDeg})`);

  // move block along plane based on angle to give visual cue
  const slide = Math.min(1, angleDeg/80);
  const x = 40 + slide*220;
  const y = -44 + slide*100;
  block.setAttribute('x', x);
  block.setAttribute('y', y);
}

[angleRange,massRange].forEach(el=>el.addEventListener('input', updateIncline));
updateIncline();

// Quiz logic
const quizForm = document.getElementById('quizForm');
const submitQuiz = document.getElementById('submitQuiz');
const quizResult = document.getElementById('quizResult');

function gradeQuiz() {
  const answers = {q1:'a', q2:'b', q3:'b'};
  let score = 0;
  for (const q of ['q1','q2','q3']) {
    const val = quizForm[q] && [...quizForm[q]].find(r=>r.checked)?.value;
    if (val === answers[q]) score++;
  }
  quizResult.textContent = `You scored ${score}/3.`;
  if (score === 3) quizResult.style.color = 'green'; else quizResult.style.color = '#b13b3b';
}
submitQuiz.addEventListener('click', gradeQuiz);
