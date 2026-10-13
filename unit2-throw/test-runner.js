const fs = require('fs');
const path = require('path');
const http = require('http');
const cp = require('child_process');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/unit2-throw/index.html';
  const filePath = path.join('C:\\Users\\maysa\\Desktop\\DV', reqPath);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log('Test server listening on port', port);

  const chromeProc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9235',
    'http://localhost:' + port + '/unit2-throw/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9235/json/list');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result || msg.error);
        pending.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Connected to target page via CDP');

    async function evaluate(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res && res.result ? res.result.value : res;
    }

    async function waitFor(expr, timeoutMs = 10000, intervalMs = 150) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const val = await evaluate(expr);
        if (val) return val;
        await new Promise(r => setTimeout(r, intervalMs));
      }
      throw new Error('waitFor timed out after ' + timeoutMs + 'ms for: ' + expr);
    }

    async function setViewport(width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false
      });
      await send('Emulation.setVisibleSize', { width, height });
      await evaluate('if (window.resizeCanvas) window.resizeCanvas();');
      await new Promise(r => setTimeout(r, 300));
    }

    async function screenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      if (res && res.data) {
        fs.writeFileSync(path.join('C:\\Users\\maysa\\Desktop\\DV\\unit2-throw\\screens', filename), Buffer.from(res.data, 'base64'));
        console.log('Saved screenshot:', filename);
      }
    }

    // 1. Take Settings screenshots
    console.log('--- 1. Testing Settings Screen ---');
    await waitFor('document.getElementById("screen-setup").classList.contains("active")');
    await setViewport(1920, 1080);
    await screenshot('settings_1920x1080.png');

    await setViewport(1134, 417);
    await screenshot('settings_1134x417.png');

    // 2. Button reachability on all 5 screen sizes in settings
    console.log('--- 2. Checking Buttons on 5 Screen Sizes ---');
    const sizes = [
      [1920, 1080],
      [1134, 417],
      [1024, 600],
      [800, 520],
      [1134, 914]
    ];

    for (const [w, h] of sizes) {
      await setViewport(w, h);
      const testResult = await evaluate(`
        (function() {
          const btns = Array.from(document.querySelectorAll('#screen-setup button:not([hidden])'));
          const issues = [];
          btns.forEach(b => {
            const rect = b.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const elAtPoint = document.elementFromPoint(cx, cy);
            if (!b.contains(elAtPoint) && !elAtPoint.contains(b)) {
              issues.push({ btn: b.textContent.trim(), issue: 'covered by ' + elAtPoint.tagName, el: elAtPoint.className });
            }
          });
          return { total: btns.length, issues };
        })()
      `);
      console.log('Size ' + w + 'x' + h + ' button checks:', testResult);
      if (testResult.issues.length > 0) {
        console.warn('Button issues detected at ' + w + 'x' + h, testResult.issues);
      }
    }

    // 3. Start game and test Question, Aiming, Throw, Hit, Miss, End screens
    console.log('--- 3. Testing Gameplay Screens ---');
    await setViewport(1920, 1080);
    await evaluate('document.getElementById("btn-start-game").click();');

    // Wait until game screen active AND question modal active AND options rendered
    console.log('Waiting for question overlay to become active...');
    await waitFor('document.getElementById("screen-game").classList.contains("active") && document.getElementById("q-overlay").classList.contains("active") && document.querySelectorAll(".q-opt").length > 0', 12000);
    await new Promise(r => setTimeout(r, 400)); // allow CSS pop animation to finish

    // Question modal screenshots
    console.log('Capturing question modal...');
    await screenshot('question_1920x1080.png');
    await setViewport(1134, 417);
    await screenshot('question_1134x417.png');

    // Check Question Options clickability at 1134x417 and 1920x1080
    for (const [w, h] of [[1920, 1080], [1134, 417]]) {
      await setViewport(w, h);
      const qCheck = await evaluate(`
        (function() {
          const opts = Array.from(document.querySelectorAll('.q-opt'));
          const issues = [];
          opts.forEach(b => {
            const rect = b.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const elAtPoint = document.elementFromPoint(cx, cy);
            if (!b.contains(elAtPoint) && !elAtPoint.contains(b)) {
              issues.push({ opt: b.textContent.trim(), issue: 'covered' });
            }
          });
          return { total: opts.length, issues };
        })()
      `);
      console.log('Question options clickability at ' + w + 'x' + h + ':', qCheck);
    }

    // Click correct answer to transition to aiming
    console.log('Clicking correct answer...');
    await evaluate(`
      (function() {
        const correctText = state.currentQ.a;
        const btn = Array.from(document.querySelectorAll('.q-opt')).find(b => b.dataset.opt === correctText) || document.querySelector('.q-opt');
        if (btn) btn.click();
      })()
    `);

    // Wait for question modal to close and aiming dock to open
    console.log('Waiting for aim dock...');
    await waitFor('!document.getElementById("q-overlay").classList.contains("active") && document.getElementById("aim-dock").classList.contains("active")', 6000);
    await new Promise(r => setTimeout(r, 400)); // allow dock transition

    // Aiming screenshots
    console.log('Capturing aiming screenshots...');
    await screenshot('aiming_1134x417.png');
    await setViewport(1920, 1080);
    await screenshot('aiming_1920x1080.png');

    // Launch throw and capture flying projectile at 1920x1080
    console.log('Launching fling for throw screenshot (1920x1080)...');
    await evaluate('launchFling();');
    await new Promise(r => setTimeout(r, 350)); // mid-air
    await screenshot('throw_1920x1080.png');

    // Wait for projectile flight to complete
    await waitFor('!state.isFlying', 5000);

    // Now set up throw capture for 1134x417
    await setViewport(1134, 417);
    await evaluate(`
      (function() {
        // Prepare aiming state directly
        state.isAiming = true;
        state.isFlying = false;
        document.getElementById('aim-dock').classList.add('active');
        document.getElementById('q-overlay').classList.remove('active');
      })()
    `);
    await new Promise(r => setTimeout(r, 300));
    console.log('Launching fling for throw screenshot (1134x417)...');
    await evaluate('launchFling();');
    await new Promise(r => setTimeout(r, 350)); // mid-air
    await screenshot('throw_1134x417.png');

    // Wait for flight to complete
    await waitFor('!state.isFlying', 5000);

    // Hit screen screenshots
    console.log('Triggering Hit state screenshots...');
    await evaluate(`
      (function() {
        showComicBubble("💥 BONK! −25", 860, 455);
        triggerMeme("win", "cat");
        updateCharacterPose("dog", "hit");
      })()
    `);
    await new Promise(r => setTimeout(r, 300));
    await setViewport(1920, 1080);
    await screenshot('hit_1920x1080.png');
    await setViewport(1134, 417);
    await screenshot('hit_1134x417.png');

    // Miss screen screenshots
    console.log('Triggering Miss state screenshots...');
    await evaluate(`
      (function() {
        showComicBubble("🪵 THUD! Hit the fence!", 500, 320);
        triggerMeme("miss", "cat");
        updateCharacterPose("cat", "hit");
      })()
    `);
    await new Promise(r => setTimeout(r, 300));
    await setViewport(1920, 1080);
    await screenshot('miss_1920x1080.png');
    await setViewport(1134, 417);
    await screenshot('miss_1134x417.png');

    // End game screen screenshots
    console.log('Triggering End game screenshots...');
    await evaluate('endGame(false, true, false);');
    await waitFor('document.getElementById("screen-end").classList.contains("active")', 3000);
    await new Promise(r => setTimeout(r, 500));
    await setViewport(1134, 417);
    await screenshot('end_1134x417.png');
    await setViewport(1920, 1080);
    await screenshot('end_1920x1080.png');

    // 4. Automated Game 1 (Grade 3) & Game 2 (Grade 4)
    console.log('--- 4. Running 2 Full Automated Games ---');
    for (let gameIdx = 1; gameIdx <= 2; gameIdx++) {
      console.log('Starting Game ' + gameIdx + '...');
      await evaluate('showScreen("screen-setup");');
      if (gameIdx === 2) {
        await evaluate('document.querySelector(\'.grade-card[data-grade="4"]\').click();');
      }
      await evaluate('document.querySelector(\'.chip[data-turns="6"]\').click();'); // short
      await evaluate('document.getElementById("btn-start-game").click();');

      let safety = 0;
      while (safety++ < 45) {
        const activeScreen = await evaluate('document.querySelector(".screen.active").id');
        if (activeScreen === 'screen-end') {
          console.log('Game ' + gameIdx + ' reached end screen!');
          break;
        }

        const isQ = await evaluate('document.getElementById("q-overlay").classList.contains("active")');
        if (isQ) {
          await evaluate(`
            (function() {
              const opts = Array.from(document.querySelectorAll('.q-opt:not(.wrong)'));
              if (opts.length) opts[0].click();
            })()
          `);
          await new Promise(r => setTimeout(r, 1400));
        }

        const isAim = await evaluate('document.getElementById("aim-dock").classList.contains("active")');
        if (isAim) {
          await evaluate('launchFling();');
          await new Promise(r => setTimeout(r, 2200));
        }

        const textCheck = await evaluate(`
          (function() {
            const txt = document.body.innerText;
            const hasUndef = /\\bundefined\\b/i.test(txt);
            const hasNull = /\\bnull\\b/i.test(txt);
            const hasNaN = /\\bNaN\\b/.test(txt);
            return { hasUndef, hasNull, hasNaN };
          })()
        `);
        if (textCheck.hasUndef || textCheck.hasNull || textCheck.hasNaN) {
          throw new Error('Invalid text on screen in game ' + gameIdx + ': ' + JSON.stringify(textCheck));
        }

        await new Promise(r => setTimeout(r, 300));
      }
    }

    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');

    ws.close();
    chromeProc.kill();
    server.close();
    process.exit(0);

  } catch (err) {
    console.error('Automation error:', err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
