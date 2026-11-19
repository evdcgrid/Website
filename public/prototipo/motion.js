const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const motionTargets = [...document.querySelectorAll("[data-reveal]")];
const motionHero = document.querySelector(".hero-cinema");
const motionHeadline = document.querySelector("#headline");
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
  if (currentPage === "home") {
    const distance = Math.max(0, scrollY);
    const mobile = innerWidth <= 760;
    const backdropProgress = Math.min(1, distance / motionHero.offsetHeight);
    const depth = Math.min(1, distance / Math.min(420, viewport * .51));
    const backdropOffset = backdropProgress * (mobile ? 0 : 95);
    const headline = motionHeadline.getBoundingClientRect();
    const wall = wallFace.getBoundingClientRect();
    const right = Math.min(1, Math.max(0, (headline.right - wall.left) / wall.width));
    // The upper edge of recorte-murete-vertical.svg runs from y=548 to y=652.
    const wallEdge = wall.top - lastBackdropOffset + backdropOffset + wall.height * (548 + 104 * right) / 1402;
    const titleStart = motionHero.getBoundingClientRect().top + motionHeadline.offsetTop;
    const titleTravel = Math.max(0, wallEdge - titleStart + 14);
    document.body.style.setProperty("--hero-shift", backdropOffset + "px");
    motionHero.style.setProperty("--headline-shift-y", (depth * titleTravel).toFixed(1) + "px");
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
  if (motionPreference.matches || !("IntersectionObserver" in window)) {
    document.body.removeAttribute("data-motion");
    lastBackdropOffset = 0;
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
  addEventListener("scroll", scheduleScrollMotion, {passive:true});
  addEventListener("resize", scheduleScrollMotion);
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
