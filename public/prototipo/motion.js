const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const motionTargets = [...document.querySelectorAll("[data-reveal]")];
const motionHero = document.querySelector(".hero-cinema");
const heroCopy = motionHero.querySelector(".hero-copy");
const wallFace = document.querySelector(".hero-foreground .hero-wall-art");
const mobilityChapter = document.querySelector(".mobility-chapter");
let lastBackdropOffset = 0;
const storyVisual = document.querySelector(".story-visual");
const storySteps = [...document.querySelectorAll("[data-story-step]")];
let animationFrame = 0;
let revealObserver;

function updateScrollMotion() {
  animationFrame = 0;
  const viewport = innerHeight;
  if (currentPage === "home" && !motionPreference.matches) {
    const distance = Math.max(0, scrollY);
    const mobile = innerWidth <= 760;
    const backdropProgress = Math.min(1, distance / motionHero.offsetHeight);
    const depth = Math.min(1, distance / Math.min(420, viewport * .51));
    const backdropOffset = backdropProgress * (mobile ? 0 : 95);
    const wall = wallFace.getBoundingClientRect();
    const heroTop = motionHero.getBoundingClientRect().top;
    const copyTop = heroTop + heroCopy.offsetTop;
    const copyBottom = copyTop + heroCopy.offsetHeight;
    const {left, right} = heroCopy.getBoundingClientRect();

    // Follow the diagonal edge in recorte-murete-vertical.svg.
    const edgeAt = (x, offset) => {
      const position = Math.min(1, Math.max(0, (x - wall.left) / wall.width));
      return wall.top - lastBackdropOffset + offset + wall.height * (548 + 97 * position) / 1402;
    };
    const start = Math.min(0, edgeAt(left, 0) - copyBottom - 18);
    const end = edgeAt(right, backdropOffset) - copyTop + 14;
    document.body.style.setProperty("--hero-shift", backdropOffset + "px");
    motionHero.style.setProperty("--hero-copy-start", start + "px");
    motionHero.style.setProperty("--hero-copy-y", (start + depth * (end - start)) + "px");
    motionHero.toggleAttribute("data-content-exited", depth >= 1);
    lastBackdropOffset = backdropOffset;
  }
  if (storyVisual.getClientRects().length) {
    const trigger = viewport * (innerWidth <= 760 ? .72 : .56);
    const step = storySteps.findLast(candidate => candidate.getBoundingClientRect().top <= trigger) || storySteps[0];
    if (storyVisual.dataset.stage !== step.dataset.storyStep) {
      storyVisual.dataset.stage = step.dataset.storyStep;
    }
  }
}

function scheduleScrollMotion() {
  if (!animationFrame) animationFrame = requestAnimationFrame(updateScrollMotion);
}

function configureMotion() {
  revealObserver?.disconnect();
  removeEventListener("scroll", scheduleScrollMotion);
  removeEventListener("resize", scheduleScrollMotion);
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  addEventListener("scroll", scheduleScrollMotion, {passive:true});
  addEventListener("resize", scheduleScrollMotion);
  if (motionPreference.matches || !("IntersectionObserver" in window)) {
    document.body.removeAttribute("data-motion");
    lastBackdropOffset = 0;
    scheduleScrollMotion();
    return;
  }
  document.body.dataset.motion = "enabled";
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.dataset.revealed = "true";
      revealObserver.unobserve(entry.target);
    }
  }, {threshold: .08});
  for (const target of motionTargets) revealObserver.observe(target);
  scheduleScrollMotion();
}

if (currentPage === "home") {
  function sizeOpeningScene() {
    const sceneEnd = mobilityChapter.getBoundingClientRect().bottom + scrollY;
    document.body.style.setProperty("--opening-scene-height", Math.ceil(sceneEnd) + "px");
    if (!motionPreference.matches) scheduleScrollMotion();
  }
  if ("ResizeObserver" in window) {
    const openingObserver = new ResizeObserver(sizeOpeningScene);
    openingObserver.observe(motionHero);
    openingObserver.observe(mobilityChapter);
  }
  sizeOpeningScene();
}
motionPreference.addEventListener("change", configureMotion);
configureMotion();

if ("IntersectionObserver" in window && currentPage === "home") {
  const technologyChapter = document.querySelector(".home-technology");
  const headerObserver = new IntersectionObserver(() => {
    document.body.dataset.header = mobilityChapter.getBoundingClientRect().bottom > 84
      ? "clear"
      : technologyChapter.getBoundingClientRect().bottom > 84 ? "technology" : "solid";
  }, {rootMargin: "-84px 0px 0px"});
  headerObserver.observe(mobilityChapter);
  headerObserver.observe(technologyChapter);
}
