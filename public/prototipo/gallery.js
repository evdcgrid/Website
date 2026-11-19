const gallery = document.querySelector(".home-applications");
const galleryTrack = document.querySelector(".gallery-track");
const gallerySlides = [...galleryTrack.children];
const galleryChoices = [...gallery.querySelectorAll("[data-gallery-select]")];
const galleryPlay = document.querySelector(".gallery-play");
const galleryMotion = matchMedia("(prefers-reduced-motion: reduce)");
let galleryIndex = 0;
let galleryPaused = galleryMotion.matches;
let galleryVisible = false;
let galleryHovered = false;
let galleryTimer;
let galleryFrame = 0;

function queueGalleryAdvance() {
  clearTimeout(galleryTimer);
  if (!galleryVisible || galleryPaused || galleryHovered || document.hidden) return;
  galleryTimer = setTimeout(() => goToGallerySlide(galleryIndex + 1), 5200);
}

function setGalleryPaused(paused) {
  galleryPaused = paused;
  galleryPlay.querySelector(".gallery-pause-label").hidden = paused;
  galleryPlay.querySelector(".gallery-resume-label").hidden = !paused;
  queueGalleryAdvance();
}

function goToGallerySlide(index) {
  const slide = gallerySlides[(index + gallerySlides.length) % gallerySlides.length];
  galleryTrack.scrollTo({
    left: slide.offsetLeft + (slide.offsetWidth - galleryTrack.clientWidth) / 2,
    behavior: galleryMotion.matches ? "instant" : "smooth",
  });
  queueGalleryAdvance();
}

function updateGalleryPosition() {
  galleryFrame = 0;
  const center = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
  let closestDistance = Infinity;
  let closestIndex = 0;
  for (const [index, slide] of gallerySlides.entries()) {
    const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
    if (distance >= closestDistance) continue;
    closestDistance = distance;
    closestIndex = index;
  }
  if (closestIndex === galleryIndex) return;
  galleryIndex = closestIndex;
  galleryTrack.dataset.activeIndex = String(galleryIndex);
  for (const [index, choice] of galleryChoices.entries()) {
    choice.setAttribute("aria-pressed", String(index === galleryIndex));
  }
}

galleryTrack.addEventListener("scroll", () => {
  if (!galleryFrame) galleryFrame = requestAnimationFrame(updateGalleryPosition);
}, {passive: true});
galleryTrack.addEventListener("pointerdown", () => setGalleryPaused(true), {passive: true});
galleryTrack.addEventListener("focusin", () => setGalleryPaused(true));
galleryTrack.addEventListener("mouseenter", () => {
  galleryHovered = true;
  queueGalleryAdvance();
});
galleryTrack.addEventListener("mouseleave", () => {
  galleryHovered = false;
  queueGalleryAdvance();
});
galleryPlay.addEventListener("click", () => setGalleryPaused(!galleryPaused));
galleryMotion.addEventListener("change", () => setGalleryPaused(galleryMotion.matches));
document.addEventListener("visibilitychange", queueGalleryAdvance);

for (const choice of galleryChoices) {
  choice.addEventListener("click", () => {
    setGalleryPaused(true);
    goToGallerySlide(Number(choice.dataset.gallerySelect));
  });
}
for (const control of document.querySelectorAll("[data-gallery-direction]")) {
  control.addEventListener("click", () => {
    setGalleryPaused(true);
    goToGallerySlide(galleryIndex + Number(control.dataset.galleryDirection));
  });
}
if ("IntersectionObserver" in window && !gallery.hidden) {
  const galleryObserver = new IntersectionObserver(([entry]) => {
    galleryVisible = entry.intersectionRatio >= 0.35;
    queueGalleryAdvance();
  }, {threshold: 0.35});
  galleryObserver.observe(galleryTrack);
}
setGalleryPaused(galleryPaused);
