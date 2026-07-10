// Scroll-reveal: gently fade sections in as they enter the viewport.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var selectors = [
    '.heading', '.section__lede', '.eyebrow',
    '.about__text', '.about__photo', '.about__philosophy',
    '.timeline__item',
    '.skills__signature', '.skills__group',
    '.case__text', '.case__device',
    '.branding__text', '.branding__phones', '.branding__events',
    '.campaign__text', '.campaign__phones',
    '.work__header', '.group-heading',
    '.work__grid figure', '.events__item',
    '.contact__inner'
  ];

  var els = document.querySelectorAll(selectors.join(','));
  els.forEach(function (el) {
    el.classList.add('reveal');
    // Stagger siblings inside grids so tiles cascade in.
    var parent = el.parentElement;
    if (parent && (parent.classList.contains('work__grid') || parent.classList.contains('events__row') || parent.classList.contains('skills__groups'))) {
      var index = Array.prototype.indexOf.call(parent.children, el);
      el.style.transitionDelay = (index % 4) * 90 + 'ms';
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();
