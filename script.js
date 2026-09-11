const content = window.siteContent || { now: [], labs: [], garden: [], sideQuests: [] };
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const link = (href, label, className = "v2-text-link") => (
  `<a class="${className}" href="${escapeHtml(href)}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`
);

function projectLinks(project) {
  const caseStudy = project.caseStudy ? `<p>${link(project.caseStudy, "Open Case Study")}</p>` : "";
  const repository = project.repoPublic === true && project.repo ? link(project.repo, "Open repository") : "";
  return caseStudy + repository;
}

function renderNow() {
  const target = document.querySelector("[data-now-list]");
  if (!target) return;
  target.innerHTML = content.now.map((item, index) => `
    <a class="v2-now-item" href="${escapeHtml(item.href || "#lab")}">
      <span class="v2-item-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="v2-now-status status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
      <span class="v2-now-text">${escapeHtml(item.text)}</span>
      <span class="v2-row-arrow" aria-hidden="true">↗</span>
    </a>
  `).join("");
}

function labDetails(lab) {
  return `
    <div class="v2-lab-details">
      <div><span>Question</span><p>${escapeHtml(lab.question)}</p></div>
      <div><span>What I built</span><p>${escapeHtml(lab.whatBuilt)}</p></div>
      <div><span>What happened</span><p>${escapeHtml(lab.whatHappened)}</p></div>
      <div><span>Still unresolved</span><p>${escapeHtml(lab.nextQuestion)}</p></div>
    </div>
  `;
}

function pipelineMarkup() {
  return `
    <div class="v2-pipeline" data-pipeline>
      <div class="v2-pipeline-head"><span>inspectable path</span><span data-stage-counter>01 / 05</span></div>
      <div class="v2-pipeline-track">
        <span class="v2-pipeline-line" aria-hidden="true"></span>
        <span class="v2-pipeline-marker" data-pipeline-marker aria-hidden="true"></span>
        <div class="v2-pipeline-stages" role="tablist" aria-label="Excel Data Report Agent 工作流">
          ${["Ingest", "Plan", "Analyze", "Review", "Render"].map((stage, index) => `
            <button class="v2-pipeline-stage${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-stage="${stage.toLowerCase()}" data-stage-index="${String(index + 1).padStart(2, "0")}">
              <span class="v2-stage-dot"></span><span>${stage}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="v2-stage-detail" aria-live="polite">
        <span data-stage-label>01 / INGEST</span>
        <p data-stage-copy>读取工作簿、识别表结构与字段类型，把后续分析需要的事实先固定下来。</p>
      </div>
    </div>
  `;
}

function renderLab() {
  const target = document.querySelector("[data-lab-preview]");
  if (!target) return;
  const featured = content.labs.find((item) => item.featured) || content.labs[0];
  const secondary = content.labs.find((item) => item.id !== featured?.id) || content.labs[1];
  if (!featured || !secondary) return;

  target.innerHTML = `
    <article class="v2-lab-feature" id="${escapeHtml(featured.id)}">
      <div class="v2-lab-feature-copy">
        <div class="v2-kicker"><span>01</span><span>${escapeHtml(featured.eyebrow)}</span><span class="v2-state">${escapeHtml(featured.status)}</span></div>
        <h3>${escapeHtml(featured.title)}</h3>
        <p class="v2-lab-lead">${escapeHtml(featured.summary)}</p>
        ${labDetails(featured)}
        ${projectLinks(featured)}
      </div>
    </article>
    <article class="v2-lab-secondary" id="${escapeHtml(secondary.id)}">
      <div class="v2-secondary-copy">
        <div class="v2-kicker"><span>02</span><span>${escapeHtml(secondary.eyebrow)}</span><span class="v2-state">${escapeHtml(secondary.status)}</span></div>
        <h3>${escapeHtml(secondary.title)}</h3>
        <p class="v2-lab-lead">${escapeHtml(secondary.summary)}</p>
        ${labDetails(secondary)}
        ${projectLinks(secondary)}
      </div>
      ${pipelineMarkup()}
    </article>
  `;
  setupPipeline();
}

function renderGarden() {
  const target = document.querySelector("[data-garden-list]");
  if (!target) return;
  target.innerHTML = content.garden.slice(0, 2).map((item, index) => `
    <a class="v2-garden-item" href="${escapeHtml(item.href || `garden/#${item.id}`)}">
      <div class="v2-garden-meta"><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(item.date)}</span><span class="v2-status-label status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></div>
      <div class="v2-garden-main"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p></div>
      <span class="v2-row-arrow" aria-hidden="true">↗</span>
    </a>
  `).join("");
}

function renderSideQuests() {
  const target = document.querySelector("[data-sidequest-list]");
  if (!target) return;
  target.innerHTML = content.sideQuests.map((item, index) => `
    ${item.link ? `<a class="v2-sidequest-item" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">` : '<article class="v2-sidequest-item v2-sidequest-note">'}
      <div class="v2-sidequest-title"><span>SIDE QUEST #${String(index + 1).padStart(3, "0")}</span><strong>${escapeHtml(item.title)}</strong></div>
      <div>${item.subtitle ? `<p class="v2-sidequest-subtitle" lang="en">${escapeHtml(item.subtitle)}</p>` : ''}<p>${escapeHtml(item.summary)}</p></div>
      <span class="v2-merged">${escapeHtml(item.state)}${item.link ? ' ↗' : ''}</span>
    ${item.link ? '</a>' : '</article>'}
  `).join("");
}

function renderIndexPage() {
  const target = document.querySelector("[data-index-list]");
  if (!target) return;
  const type = document.body.dataset.page;
  if (type === "lab-index") {
    target.innerHTML = content.labs.map((item, index) => `
      <article class="v2-index-item" id="${escapeHtml(item.id)}">
        <div class="v2-index-item-head"><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(item.status)}</span></div>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="v2-lab-lead">${escapeHtml(item.summary)}</p>
        ${labDetails(item)}
        ${projectLinks(item)}
      </article>
    `).join("");
  }
  if (type === "garden-index") {
    target.innerHTML = content.garden.map((item, index) => `
      <article class="v2-index-item" id="${escapeHtml(item.id)}">
        <div class="v2-index-item-head"><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(item.date)} · ${escapeHtml(item.status)}</span></div>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="v2-lab-lead">${escapeHtml(item.summary)}</p>
        <p class="v2-index-body">${escapeHtml(item.body)}</p>
        ${item.href ? link(`../${item.href}`, "Read note") : ""}
      </article>
    `).join("");
  }
}

const stageContent = {
  ingest: ["01", "INGEST", "读取工作簿、识别表结构与字段类型，把后续分析需要的事实先固定下来。"],
  plan: ["02", "PLAN", "把自然语言目标拆成可执行计划，并在进入分析前校验计划是否完整、可落地。"],
  analyze: ["03", "ANALYZE", "用确定性代码完成统计、图表与数值计算，让关键结果不依赖模型临场发挥。"],
  review: ["04", "REVIEW", "通过数值引用审计、独立复核与人工复核，检查结论是否有证据、是否越过边界。"],
  render: ["05", "RENDER", "把经过检查的分析结果组织成结构化 HTML 报告，让读者能从结论回到过程。"],
};

function setupPipeline() {
  const pipeline = document.querySelector("[data-pipeline]");
  const marker = document.querySelector("[data-pipeline-marker]");
  const buttons = [...document.querySelectorAll("[data-stage]")];
  if (!pipeline || !marker || !buttons.length) return;

  const markerPosition = (button) => {
    const pipelineRect = pipeline.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    if (window.innerWidth <= 680) {
      return { axis: "top", value: buttonRect.top + buttonRect.height / 2 - pipelineRect.top };
    }
    return { axis: "left", value: buttonRect.left + buttonRect.width / 2 - pipelineRect.left };
  };

  const applyPosition = (axis, value) => {
    marker.style.setProperty("--marker-x", axis === "left" ? `${value}px` : "18px");
    marker.style.setProperty("--marker-y", axis === "top" ? `${value}px` : "40px");
  };

  const setMarker = (target) => {
    const axis = target.axis;
    const targetValue = target.value;
    const previousAxis = marker.dataset.axis;
    const current = previousAxis === axis ? Number.parseFloat(marker.dataset.position || String(targetValue)) : targetValue;
    const currentVelocity = previousAxis === axis ? Number.parseFloat(marker.dataset.velocity || "0") : 0;
    applyPosition(axis, current);
    marker.dataset.axis = axis;
    cancelAnimationFrame(Number(marker.dataset.frame || 0));
    if (reducedMotion.matches) {
      applyPosition(axis, targetValue);
      marker.dataset.position = String(targetValue);
      marker.dataset.velocity = "0";
      return;
    }
    const state = { value: current, velocity: currentVelocity };
    const stiffness = 420;
    const damping = 42;
    let lastTime = performance.now();
    const tick = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.032);
      lastTime = time;
      state.velocity += (targetValue - state.value) * stiffness * delta;
      state.velocity *= Math.exp(-damping * delta);
      state.value += state.velocity * delta;
      applyPosition(axis, state.value);
      marker.dataset.position = String(state.value);
      marker.dataset.velocity = String(state.velocity);
      if (Math.abs(targetValue - state.value) < 0.1 && Math.abs(state.velocity) < 0.1) {
        applyPosition(axis, targetValue);
        marker.dataset.position = String(targetValue);
        marker.dataset.velocity = "0";
        marker.dataset.frame = "0";
        return;
      }
      marker.dataset.frame = String(requestAnimationFrame(tick));
    };
    marker.dataset.frame = String(requestAnimationFrame(tick));
  };

  const activate = (button) => {
    const data = stageContent[button.dataset.stage];
    if (!data) return;
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    pipeline.querySelector("[data-stage-label]").textContent = `${data[0]} / ${data[1]}`;
    pipeline.querySelector("[data-stage-copy]").textContent = data[2];
    pipeline.querySelector("[data-stage-counter]").textContent = `${data[0]} / 05`;
    setMarker(markerPosition(button));
  };

  buttons.forEach((button) => button.addEventListener("click", () => activate(button)));
  const active = buttons[0];
  requestAnimationFrame(() => {
    const position = markerPosition(active);
    marker.dataset.axis = position.axis;
    marker.dataset.position = String(position.value);
    marker.dataset.velocity = "0";
    applyPosition(position.axis, position.value);
  });
  window.addEventListener("resize", () => {
    const current = buttons.find((button) => button.classList.contains("is-active")) || active;
    setMarker(markerPosition(current));
  });
  reducedMotion.addEventListener?.("change", () => {
    const current = buttons.find((button) => button.classList.contains("is-active")) || active;
    setMarker(markerPosition(current));
  });
}

const header = document.querySelector("[data-header]");
const sections = ["now", "lab", "garden", "side-quests", "about"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
let scrollFrame = 0;

function updateScrollState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  const current = sections.reduce((active, section) => {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.36) return section.id;
    return active;
  }, "");
  document.querySelectorAll("[data-nav-link]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.navLink === current);
  });
}

window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollState();
    scrollFrame = 0;
  });
}, { passive: true });

if (document.body.dataset.page === "home") {
  document.querySelector(".v2-trail-link")?.addEventListener("click", () => {
    window.location.assign("/somewhere-off-the-trail/");
  });
}

renderNow();
renderLab();
renderGarden();
renderSideQuests();
renderIndexPage();
updateScrollState();
