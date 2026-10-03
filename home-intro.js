(() => {
  const root = document.documentElement;
  if (!root.hasAttribute("data-home-intro")) return;

  const dialog = document.getElementById("home-intro");
  const screen = dialog.querySelector(".home-intro-screen");
  const curve = dialog.querySelector(".home-intro-curve");
  const label = dialog.querySelector(".home-intro-label");
  const word = dialog.querySelector("[data-home-intro-word]");
  const animations = new Set();
  const timers = new Set();
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    animations.forEach(animation => animation.cancel());
    window.removeEventListener("home-intro-release", finish);
    if (dialog.open) dialog.close();
    root.removeAttribute("data-home-intro");
    window.dispatchEvent(new Event("home-intro-finished"));
  }

  function active() {
    return !finished && root.hasAttribute("data-home-intro");
  }

  function wait(duration) {
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        resolve();
      }, duration);
      timers.add(timer);
    });
  }

  function animate(element, frames, options) {
    const animation = element.animate(frames, { fill: "both", ...options });
    animations.add(animation);
    // Escape 或超时取消动画时，finished 会拒绝。
    animation.finished.catch(() => {});
    return animation;
  }

  async function play() {
    window.addEventListener("home-intro-release", finish);
    const watchdog = setTimeout(finish, 5000);
    timers.add(watchdog);

    if (!active()) {
      finish();
      return;
    }

    if (!dialog.open) dialog.showModal();
    await Promise.race([document.fonts.ready, wait(300)]);
    if (!active()) return;

    await animate(label, [
      { opacity: 0, transform: "translate(-50%, calc(-50% + 20px))" },
      { opacity: 1, transform: "translate(-50%, -50%)" }
    ], { duration: 700, delay: 250, easing: "cubic-bezier(.16,1,.3,1)" }).finished;
    for (const greeting of ["Bonjour", "Ciao", "Olá", "こんにちは", "Hallå", "Guten Tag", "你好"]) {
      if (!active()) return;
      word.textContent = greeting;
      await wait(greeting === "你好" ? 400 : 150);
    }
    if (!active()) return;

    animate(label, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "linear" });
    animate(curve, [{ height: getComputedStyle(curve).height }, { height: "0px" }], {
      duration: 850, delay: 150, easing: "cubic-bezier(.76,0,.24,1)"
    });
    await animate(screen, [{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], {
      duration: 800, easing: "cubic-bezier(.76,0,.24,1)"
    }).finished;
    finish();
  }

  play().catch(finish);
})();
