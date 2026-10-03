(() => {
  const $ = id => document.getElementById(id);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width:700px)');
  const fine = matchMedia('(min-width:760px) and (hover:hover) and (pointer:fine)');
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const canvas = $('field');
  const context = canvas.getContext('2d');
  if (!context || typeof HTMLDialogElement === 'undefined') return;
  document.documentElement.classList.add('js-scene');
  const stage = $('stage');
  const journey = $('journey');
  const opening = $('opening');
  const worldCopy = $('world-copy');
  const constellation = $('constellation');
  const nodeButtons = [...document.querySelectorAll('[data-node]')];
  const nodes = { doupo: { u: -.68, v: -.67, dx: 0, dy: 0 }, excel: { u: .56, v: -.1, dx: 0, dy: 0 }, ashline: { u: -.1, v: .7, dx: 0, dy: 0 } };
  let width = 0, height = 0, radius = 0, centerX = 0, centerY = 0, progress = 0, particles = [], animation = 0;
  let pointer = { x: -1000, y: -1000, inside: false };
  let selected = null, hovered = null, drag = null, dismissClick = false, lastTime = 0;
  let lastReady = false;
  let previousMobile = mobile.matches;
  function measure() {
    if (mobile.matches !== previousMobile) {
      Object.values(nodes).forEach(node => { node.dx = 0; node.dy = 0; });
      previousMobile = mobile.matches;
    }
    $('world-instruction').textContent = mobile.matches ? '点一个实验，打开看看。' : '拖动节点，或者点一个实验。';
    width = stage.clientWidth; height = stage.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    radius = mobile.matches ? Math.min(width * .39, height * .23) : Math.min(width * .255, height * .34);
    centerX = mobile.matches ? width * .5 : width * .7;
    centerY = mobile.matches ? height * .57 : height * .52;
    const sample = document.createElement('canvas');
    sample.width = Math.round(width); sample.height = Math.round(height);
    const c = sample.getContext('2d', { willReadFrequently: true });
    const font = Math.min(width * .198, height * .35);
    c.font = '700 ' + font + 'px Arial';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('AENEAS', width / 2, height * .5);
    const image = c.getImageData(0, 0, sample.width, sample.height).data;
    const points = [];
    const gap = mobile.matches ? 4 : 7;
    for (let y = Math.max(0, Math.floor(height * .5 - font)); y < Math.min(height, height * .5 + font); y += gap) {
      for (let x = 0; x < width; x += gap) if (image[(y * sample.width + x) * 4 + 3] > 120) points.push({ x, y });
    }
    const step = Math.max(1, Math.ceil(points.length / 1600));
    particles = points.filter((_, i) => i % step === 0).map((p, i, list) => {
      const latitude = 1 - 2 * (i + .5) / list.length;
      const r = Math.sqrt(1 - latitude * latitude), angle = i * 2.39996323;
      return { homeX: p.x, homeY: p.y, x: p.x, y: p.y, sx: Math.cos(angle) * r, sy: latitude, sz: Math.sin(angle) * r, shade: .32 + (i % 7) * .065, size: mobile.matches ? 1.2 : 1.75 };
    });
    updateProgress();
    if (reduced.matches) render(0);
  }
  function updateProgress() {
    const rect = journey.getBoundingClientRect();
    progress = reduced.matches ? 1 : clamp(-rect.top / Math.max(1, journey.offsetHeight - height));
    const fade = 1 - smooth(.06, .45, progress), mapFade = smooth(.28, .65, progress);
    opening.style.opacity = fade;
    opening.style.transform = 'translateY(' + (-progress * 80) + 'px) scale(' + (1 - progress * .04) + ')';
    opening.inert = fade < .12;
    worldCopy.style.opacity = mapFade;
    worldCopy.style.transform = 'translateY(' + ((1 - mapFade) * 28) + 'px)';
    worldCopy.setAttribute('aria-hidden', String(mapFade < .4));
    $('world-hint').style.opacity = mapFade;
    constellation.style.opacity = smooth(.38, .7, progress);
    const ready = progress > .61 || reduced.matches;
    if (ready !== lastReady) { constellation.inert = !ready; constellation.classList.toggle('is-ready', ready); lastReady = ready; }
    $('scene-progress').style.transform = 'scaleX(' + progress + ')';
    $('scene-label').textContent = progress < .5 ? 'KEEP THE CURIOSITY.' : 'THREE EXPERIMENTS. MANY QUESTIONS.';
    $('scene-count').textContent = progress < .5 ? '01 / 02' : '02 / 02';
    document.querySelector('.header').classList.toggle('is-scrolled', scrollY > height * .24);
    positionNodes();
    if (reduced.matches) render(0);
  }
  function positionNodes() {
    const scale = lerp(.8, 1, smooth(.35, .85, progress));
    for (const button of nodeButtons) {
      const n = nodes[button.dataset.node];
      n.x = clamp(centerX + n.u * radius * scale + n.dx, 85, width - 85);
      n.y = clamp(centerY + n.v * radius * scale + n.dy, height * .29, height - 118);
      button.style.left = n.x + 'px'; button.style.top = n.y + 'px';
      const core = button.querySelector('.node-core');
      n.linkX = n.x - button.offsetWidth / 2 + core.offsetLeft + core.offsetWidth / 2;
      n.linkY = n.y - button.offsetHeight / 2 + core.offsetTop + core.offsetHeight / 2;
      button.classList.toggle('is-active', selected === button.dataset.node);
    }
  }
  function render(time) {
    context.clearRect(0, 0, width, height);
    const morph = smooth(.02, .78, progress);
    const mapAlpha = smooth(.35, .8, progress);
    const spin = reduced.matches ? .15 : time * .000045;
    const cos = Math.cos(spin), sin = Math.sin(spin);
    const shiftX = !reduced.matches && pointer.inside ? (pointer.x / width - .5) * 9 * morph : 0;
    const shiftY = !reduced.matches && pointer.inside ? (pointer.y / height - .5) * 7 * morph : 0;
    if (mapAlpha > .01) {
      context.strokeStyle = 'rgba(75,101,73,' + (.16 * mapAlpha) + ')';
      context.lineWidth = .65;
      for (let i = 0; i < 3; i++) {
        context.beginPath(); context.ellipse(centerX + shiftX, centerY + shiftY, radius * (1.13 + i * .17), radius * (.53 + i * .12), -.38 + i * .35, 0, Math.PI * 2); context.stroke();
      }
      for (const [id, n] of Object.entries(nodes)) {
        context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(n.linkX, n.linkY);
        context.strokeStyle = selected === id || hovered === id ? 'rgba(52,94,244,' + (.65 * mapAlpha) + ')' : 'rgba(81,105,75,' + (.25 * mapAlpha) + ')'; context.stroke();
        if (selected === id || hovered === id) { context.beginPath(); context.arc(n.linkX, n.linkY, 22, 0, Math.PI * 2); context.strokeStyle = 'rgba(52,94,244,' + (.15 * mapAlpha) + ')'; context.stroke(); }
      }
      context.fillStyle = 'rgba(66,82,60,' + (.5 * mapAlpha) + ')'; context.font = '9px monospace'; context.textAlign = 'center'; context.fillText('AENEAS / LAB', centerX, centerY + 5);
    }
    const frameFactor = lastTime ? Math.min((time - lastTime) / 16.7, 2) : 1;
    for (const p of particles) {
      const rx = p.sx * cos - p.sz * sin, z = p.sx * sin + p.sz * cos;
      let tx = lerp(p.homeX, centerX + rx * radius + shiftX, morph);
      let ty = lerp(p.homeY, centerY + p.sy * radius * .87 + shiftY, morph);
      if (!reduced.matches && pointer.inside && morph < .9) {
        const dx = tx - pointer.x, dy = ty - pointer.y, distance = Math.hypot(dx, dy), reach = mobile.matches ? 75 : 115;
        if (distance > .1 && distance < reach) { const push = (1 - distance / reach) * 39 * (1 - morph); tx += dx / distance * push; ty += dy / distance * push; }
      }
      const speed = reduced.matches ? 1 : .14 * frameFactor;
      p.x = lerp(p.x, tx, speed); p.y = lerp(p.y, ty, speed);
      const alpha = lerp(p.shade, .19 + (z + 1) * .18, morph);
      context.fillStyle = 'rgba(53,75,48,' + alpha + ')';
      const size = p.size * lerp(1, .75 + (z + 1) * .33, morph);
      context.fillRect(p.x, p.y, size, size);
    }
    lastTime = time;
  }
  function loop(time) {
    if (!document.hidden && journey.getBoundingClientRect().bottom > 0 && journey.getBoundingClientRect().top < innerHeight) render(time);
    if (!document.hidden && !reduced.matches) animation = requestAnimationFrame(loop);
  }
  stage.addEventListener('pointermove', e => { if (e.pointerType !== 'touch') { const rect = stage.getBoundingClientRect(); pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }; } });
  stage.addEventListener('pointerleave', () => { pointer.inside = false; });
  for (const button of nodeButtons) {
    button.addEventListener('pointerenter', () => { hovered = button.dataset.node; if (reduced.matches) render(0); });
    button.addEventListener('pointerleave', () => { hovered = null; if (reduced.matches) render(0); });
    button.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      const n = nodes[button.dataset.node];
      drag = { button, id: button.dataset.node, startX: e.clientX, startY: e.clientY, baseDX: n.dx, baseDY: n.dy, moved: false, touch: e.pointerType === 'touch' };
      button.setPointerCapture(e.pointerId);
    });
    button.addEventListener('pointermove', e => {
      if (!drag || drag.button !== button) return;
      const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < 8) return;
      if (drag.touch && !drag.moved && Math.abs(dy) > Math.abs(dx)) return;
      drag.moved = true; button.classList.add('is-dragging');
      nodes[drag.id].dx = clamp(drag.baseDX + dx, -radius * .52, radius * .52);
      nodes[drag.id].dy = clamp(drag.baseDY + dy, -radius * .35, radius * .35);
      positionNodes();
      if (reduced.matches) render(0);
    });
    button.addEventListener('pointerup', () => { if (drag?.button === button) { dismissClick = drag.moved; button.classList.remove('is-dragging'); drag = null; } });
    button.addEventListener('pointercancel', () => { button.classList.remove('is-dragging'); drag = null; dismissClick = false; });
    button.addEventListener('click', e => { if (dismissClick) { dismissClick = false; e.preventDefault(); e.stopImmediatePropagation(); } });
  }
  $('world-instruction').textContent = mobile.matches ? '点一个实验，打开看看。' : '拖动节点，或者点一个实验。';
  const content = window.siteContent || { labs: [], garden: [], now: [], sideQuests: [] };
  const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const siteHref = value => {
    const href = String(value || '');
    if (/^(https?:|mailto:)/i.test(href)) return href;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return '#';
    return href.replace(/^\/+/, '');
  };
  const projectIds = { doupo: 'doupo-analysis', excel: 'excel-data-report', ashline: 'ashline' };
  const data = {};
  for (const [key, id] of Object.entries(projectIds)) {
    const project = content.labs.find(item => item.id === id);
    if (!project) continue;
    const links = [];
    if (project.play) links.push(['打开游戏，试一试', siteHref(project.play)]);
    if (project.caseStudy) links.push([project.play ? '阅读开发记录' : '打开完整实验记录', siteHref(project.caseStudy)]);
    if (project.repoPublic === true && project.repo) links.push(['查看项目仓库', siteHref(project.repo)]);
    data[key] = {
      title: project.title,
      type: project.eyebrow + ' / ' + project.status,
      summary: project.summary,
      media: key,
      blocks: [['THE QUESTION', project.question], ['WHAT I BUILT', project.whatBuilt], ['WHAT HAPPENED', project.whatHappened], ['STILL OPEN', project.nextQuestion]],
      links,
    };
    const node = document.querySelector('[data-node="' + key + '"]');
    node.querySelector('strong').textContent = project.title;
    node.href = links[0]?.[1] || 'lab/#' + project.id;
    node.setAttribute('aria-label', '打开 ' + project.title + ' 实验');
  }
  const workflow = content.garden.find(item => item.id === 'workflow-not-prompts');
  const olist = content.garden.find(item => item.id === 'olist-rabbit-hole');
  if (workflow) {
    data.workflow = {
      title: workflow.title,
      type: 'GARDEN / ' + workflow.status,
      summary: workflow.summary,
      media: 'workflow',
      blocks: [['THE TRAIL', workflow.body], ...(olist ? [[olist.title, olist.summary]] : [])],
      links: [[ '读完整笔记', siteHref(workflow.href || 'garden/#' + workflow.id)], ['进入 Garden', 'garden/']],
    };
  }
  data.about = {
    title: '一个保存过程的地方。', type: 'ABOUT / THE PERSON BEHIND THE LAB',
    summary: 'Aeneas 是我在网上使用的名字。我更习惯通过真的做点什么，来搞懂自己还不会的东西。', media: 'about',
    blocks: [['WHY I BUILD','我经常不是因为已经知道该怎么做，才开始一个项目。更多时候只是先碰到一个让我好奇的问题，然后用代码、AI 和 Agent，一点点把它拆开。'],['KEEP THE TRAIL','有些最后变成了完整实验，有些只留下了一篇笔记，还有一些做到一半就停了。我想把这些过程留下来，包括中间绕过的路、改过的想法和还没回答的问题。']],
    links: [['最近在做什么', '#now'], ['顺手追进去的问题', '#side-quests'], ['更多过程，在 GitHub','https://github.com/hxy-asdw'], ['Email', 'mailto:2870854049@qq.com']],
  };
  data.now = {
    title: '最近在做什么。', type: 'NOW / CURRENTLY OPEN', media: 'about',
    summary: '这里会变。不是完整的 changelog，只是我最近在推进的几件事。',
    blocks: content.now.map(item => [item.status, item.text, item.href === '#lab' ? 'lab/' : item.href === '#garden' ? 'garden/' : item.href]),
    links: [['进入 Lab', 'lab/'], ['进入 Garden', 'garden/']],
  };
  data.sidequests = {
    title: '顺手追进去的小问题。', type: 'SIDE QUESTS / RABBIT HOLES', media: 'about',
    summary: '有些问题本来只是顺手看看，后来不知不觉就追得比预想更远。',
    blocks: content.sideQuests.map(item => [item.title + ' / ' + item.state, item.summary, item.link]),
    links: [['更多过程，在 GitHub', 'https://github.com/hxy-asdw']],
  };
  const steps = [['INGEST','读取工作簿、识别表结构与字段类型，把后续分析需要的事实先固定下来。'],['PLAN','把自然语言目标拆成可执行计划，并在进入分析前检查计划是否完整、可落地。'],['ANALYZE','用确定性代码完成统计、图表与数值计算，让关键结果不依赖模型临场发挥。'],['REVIEW','通过数值引用审计、独立复核与人工复核，检查结论是否有证据、是否越过边界。'],['RENDER','把经过检查的分析结果组织成结构化 HTML 报告，让读者能从结论回到过程。']];
  const dialog = $('detail-dialog');
  const detailHashes = { doupo: '#doupo-analysis', excel: '#excel-data-report', ashline: '#ashline', workflow: '#workflow-not-prompts', about: '#about', now: '#now', sidequests: '#side-quests' };
  const hashDetail = hash => Object.keys(detailHashes).find(key => detailHashes[key] === hash);
  let returnFocus = null, savedScroll = 0, closeTarget = null, currentDetail = null, pendingClose = false;
  function renderShot(which = 'runtime') {
    const replay = which === 'replay';
    $('detail-media').innerHTML = '<img src="assets/lab/doupo-analysis/' + (replay ? 'seed93-replay.png' : 'runtime-lab.png') + '" alt="' + (replay ? 'Seed 93 重放记录真实截图' : '离线调试面板真实截图') + '"><div class="shot-switch"><button type="button" data-shot="runtime" aria-pressed="' + !replay + '">运行面板</button><button type="button" data-shot="replay" aria-pressed="' + replay + '">重放记录</button><span class="mono muted">SAVED SNAPSHOT</span></div>';
  }
  function showDetail(id, trigger, writeHistory = true) {
    const item = data[id]; if (!item) return;
    const openingDetail = !dialog.open;
    if (openingDetail) { returnFocus = trigger || document.querySelector('[data-node="' + id + '"]') || document.querySelector('.brand'); savedScroll = writeHistory ? scrollY : (history.state?.aeneasScroll ?? scrollY); closeTarget = null; document.body.style.overflow = 'hidden'; }
    if (writeHistory) {
      // Each open detail has one history entry; switching keeps Back tied to the scene.
      const state = { ...history.state, aeneasDetail: id, aeneasScroll: savedScroll };
      if (openingDetail) history.pushState(state, '', detailHashes[id]);
      else history.replaceState(state, '', detailHashes[id]);
    }
    currentDetail = id;
    selected = Object.keys(nodes).includes(id) ? id : null; positionNodes();
    $('detail-title').textContent = item.title; $('detail-type').textContent = item.type;
    $('detail-kicker').textContent = selected ? 'AN OPEN EXPERIMENT' : 'KEEP THE TRAIL';
    $('detail-summary').textContent = item.summary;
    $('detail-copy').innerHTML = item.blocks.map(block => '<section class="copy-block"><h3>' + escapeHtml(block[0]) + '</h3><p>' + escapeHtml(block[1]) + '</p>' + (block[2] ? '<a href="' + escapeHtml(siteHref(block[2])) + '">继续看看 ↗</a>' : '') + '</section>').join('');
    $('detail-actions').innerHTML = item.links.map((link, i) => '<a href="' + escapeHtml(link[1]) + '"' + (/^https?:/i.test(link[1]) ? ' target="_blank" rel="noreferrer"' : '') + (i ? ' class="secondary"' : '') + '>' + escapeHtml(link[0]) + '<span aria-hidden="true">↗</span></a>').join('');
    dialog.classList.toggle('is-note', !selected); $('detail-switch').hidden = !selected;
    document.querySelectorAll('[data-detail-project]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.detailProject === id)));
    if (item.media === 'doupo') renderShot();
    if (item.media === 'ashline') $('detail-media').innerHTML = '<img src="assets/lab/ashline/preview.png" alt="Ashline 灰烬前庭的真实游戏画面"><p class="media-label">ASHLINE / 灰烬前庭 · 真实游戏截图</p>';
    if (item.media === 'excel') $('detail-media').innerHTML = '<div class="workflow"><div class="workflow-top"><span>AN INSPECTABLE PATH</span><span id="workflow-count">01 / 05</span></div><div class="workflow-steps" aria-label="五阶段工作流">' + steps.map((s, i) => '<button type="button" data-step="' + i + '" aria-label="' + s[0] + '" aria-pressed="' + (i === 0) + '">' + String(i + 1).padStart(2, '0') + '</button>').join('') + '</div><div class="workflow-output"><span class="mono" id="workflow-title">01 / INGEST</span><p id="workflow-copy">' + steps[0][1] + '</p></div></div>';
    if (item.media === 'workflow') $('detail-media').innerHTML = '<div class="note-art"><p class="mono">GROWING / AGENT WORKFLOWS</p><strong>把任务变小。<br>把过程留下。</strong><p>一次个人网站开发中的学习笔记。</p></div>';
    if (item.media === 'about') $('detail-media').innerHTML = '<div class="about-art">I build things<br>to find out.</div>';
    document.querySelector('.detail-body').scrollTop = 0;
    if (!dialog.open) { dialog.showModal(); dialog.querySelector('.close-dialog').focus(); }
    else {
      if (!dialog.contains(document.activeElement)) $('detail-title').focus({ preventScroll: true });
      if (!reduced.matches) document.querySelector('.detail-intro').animate([{ opacity: .2, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
    }
    if (reduced.matches) render(0);
  }
  function closeDetail(toTop = false) {
    if (!dialog.open || pendingClose) return;
    if (toTop) { closeTarget = 0; returnFocus = document.querySelector('.brand'); }
    if (history.state?.aeneasDetail) { pendingClose = true; history.back(); }
    else {
      if (hashDetail(location.hash)) history.replaceState(history.state, '', location.pathname + location.search + (toTop ? '#top' : ''));
      dialog.close();
    }
  }
  dialog.querySelector('.close-dialog').addEventListener('click', () => closeDetail());
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; selected = null; currentDetail = null; positionNodes(); window.scrollTo({ top: closeTarget ?? savedScroll, behavior: 'instant' }); closeTarget = null; if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); if (reduced.matches) render(0); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientY < rect.top) closeDetail(); } });
  $('detail-home').addEventListener('click', event => { event.preventDefault(); closeDetail(true); });
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); const fromMenu = !!button.closest('.mobile-menu'); if (fromMenu) hideMenu(); hidePeek(); showDetail(button.dataset.open, fromMenu ? menuButton : button); }));
  document.querySelectorAll('[data-detail-project]').forEach(button => button.addEventListener('click', () => showDetail(button.dataset.detailProject)));
  $('detail-media').addEventListener('click', e => {
    const shot = e.target.closest('[data-shot]'); if (shot) { renderShot(shot.dataset.shot); $('detail-media').querySelector('[data-shot="' + shot.dataset.shot + '"]').focus(); return; }
    const step = e.target.closest('[data-step]'); if (step) { const index = Number(step.dataset.step); $('workflow-title').textContent = String(index + 1).padStart(2, '0') + ' / ' + steps[index][0]; $('workflow-copy').textContent = steps[index][1]; $('workflow-count').textContent = String(index + 1).padStart(2, '0') + ' / 05'; document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === step))); }
  });
  for (const section of ['detail-actions', 'detail-copy']) $(section).addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const id = hashDetail(link.getAttribute('href'));
    if (id && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); showDetail(id); }
  });
  const menuButton = document.querySelector('.menu-button'), menu = $('mobile-menu');
  function hideMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); if (!menu.hidden) menu.querySelector('a').focus(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', hideMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { hideMenu(); menuButton.focus(); } });
  document.addEventListener('pointerdown', e => { if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) hideMenu(); });
  const peek = $('cursor-preview'); let peekRow = null;
  function hidePeek() { peekRow = null; peek.classList.remove('is-visible'); }
  function positionPeek(x, y) {
    const w = peek.offsetWidth, h = peek.offsetHeight;
    const px = clamp(x + 24 + w < innerWidth - 20 ? x + 24 : x - w - 24, 20, innerWidth - w - 20);
    const py = clamp(y - h * .45, 95, innerHeight - h - 20);
    peek.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
  }
  function showPeek(row, x, y) { if (!fine.matches || dialog.open) return; peekRow = row; document.querySelectorAll('[data-peek-card]').forEach(card => { card.hidden = card.dataset.peekCard !== row.dataset.peek; }); const rect = row.getBoundingClientRect(); positionPeek(x ?? rect.right - 300, y ?? rect.top + rect.height / 2); peek.classList.add('is-visible'); }
  document.querySelectorAll('[data-peek]').forEach(row => { row.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') showPeek(row, e.clientX, e.clientY); }); row.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && fine.matches) { if (peekRow !== row) showPeek(row, e.clientX, e.clientY); else positionPeek(e.clientX, e.clientY); } }); row.addEventListener('pointerleave', hidePeek); row.addEventListener('focusin', () => showPeek(row)); row.addEventListener('focusout', event => { if (!row.contains(event.relatedTarget)) hidePeek(); }); });
  addEventListener('scroll', () => { updateProgress(); hidePeek(); }, { passive: true });
  addEventListener('resize', () => { measure(); hidePeek(); });
  addEventListener('blur', hidePeek);
  reduced.addEventListener('change', () => { cancelAnimationFrame(animation); measure(); if (!reduced.matches) animation = requestAnimationFrame(loop); });
  fine.addEventListener('change', hidePeek);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(animation); animation = 0; hidePeek(); } else if (!reduced.matches && !animation) animation = requestAnimationFrame(loop); });
  function synchronizeRoute() {
    // Let the existing greeting finish before putting a detail in the modal layer.
    if (document.documentElement.hasAttribute('data-home-intro')) return;
    if (pendingClose) {
      pendingClose = false;
      if (closeTarget === 0) history.replaceState(history.state, '', location.pathname + location.search + '#top');
      if (dialog.open) dialog.close();
      return;
    }
    const id = hashDetail(location.hash);
    if (id && data[id]) { if (!dialog.open || currentDetail !== id) showDetail(id, null, false); }
    else if (dialog.open) dialog.close();
  }
  addEventListener('popstate', synchronizeRoute);
  addEventListener('hashchange', synchronizeRoute);
  addEventListener('home-intro-release', synchronizeRoute);
  addEventListener('home-intro-finished', synchronizeRoute);
  document.querySelectorAll('a[href="#explore"],a[href="#lab"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const target = $('explore');
    target.scrollIntoView({ behavior: 'instant' });
    updateProgress();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    nodeButtons[0].focus({ preventScroll: true });
    hideMenu();
  }));
  measure(); if (!reduced.matches) animation = requestAnimationFrame(loop);
  requestAnimationFrame(() => {
    if (location.hash === '#writing') $('garden').scrollIntoView();
    if (location.hash === '#explore' || location.hash === '#lab') { $('explore').scrollIntoView({ behavior: 'instant' }); updateProgress(); }
    synchronizeRoute();
  });
})();
