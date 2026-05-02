document.getElementById('activate').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleStealthHacker
  });
});

function toggleStealthHacker() {
  const existingCanvas = document.getElementById('stealth-canvas');
  
  if (existingCanvas) {
    existingCanvas.remove();
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'stealth-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    zIndex: '1000000', pointerEvents: 'none'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let p = [], e = [], tick = 0;

  const init = () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
  };
  window.onresize = init; init();

  function draw() {
    if (!document.getElementById('stealth-canvas')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick++;
    
    p.forEach(i => {
      i.y += i.vy + i.s; i.x += i.vx;
      i.vx *= 0.92; i.vy *= 0.92;
      if (i.y > canvas.height) { i.y = -20; i.x = Math.random() * canvas.width; }
      ctx.fillStyle = "#00ff00";
      ctx.globalAlpha = 0.3;
      ctx.font = "bold 16px monospace";
      ctx.fillText(Math.random() > 0.5 ? "0" : "1", i.x, i.y);
    });

    e = e.filter(i => {
      i.y += i.vy; i.x += i.vx; i.vx *= 0.95; i.vy *= 0.95; i.l -= 0.02;
      ctx.fillStyle = "#ff0000";
      ctx.globalAlpha = i.l;
      ctx.font = "bold 20px monospace";
      ctx.fillText(Math.random() > 0.5 ? "0" : "1", i.x, i.y);
      return i.l > 0;
    });
    requestAnimationFrame(draw);
  }

  for(let i=0; i<250; i++) p.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*3+2, vx: 0, vy: 0});

  const clickHandler = (event) => {
    if (!document.getElementById('stealth-canvas')) {
        window.removeEventListener('click', clickHandler);
        return;
    }
    for(let i=0; i<30; i++) {
      const ang = Math.random()*Math.PI*2;
      const spd = Math.random()*10+5;
      e.push({x: event.clientX, y: event.clientY, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, l: 1});
    }
    p.forEach(i => {
      const dx = i.x - event.clientX, dy = i.y - event.clientY;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 400) { i.vx = (dx/d)*(1200/(d+1)); i.vy = (dy/d)*(1200/(d+1)); }
    });
  };

  window.addEventListener('click', clickHandler);
  draw();
}
