// Always open on the cover: drop any #section marker from the URL,
// start at the top, and keep menu clicks from writing markers back.
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  if (location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  window.addEventListener('pageshow', function () { window.scrollTo(0, 0); });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// Cover: split the name into letters and stagger them in on load.
(function () {
  var name = document.querySelector('.cover__name');
  if (!name) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var nodes = Array.prototype.slice.call(name.childNodes);
  name.textContent = '';
  var i = 0;
  nodes.forEach(function (node) {
    if (node.nodeType === 1 && node.tagName === 'BR') {
      name.appendChild(document.createElement('br'));
      return;
    }
    (node.textContent || '').split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'ltr';
      span.textContent = ch;
      span.style.setProperty('--d', (0.25 + i * 0.1).toFixed(3) + 's');
      name.appendChild(span);
      i++;
    });
  });
})();

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
    '.reel__titlecard', '.reel__compare', '.storyboard__frame', '.cast-item',
    '.cs-chapter', '.featured__item', '.cs-next',
    '.skills__dark-head', '.skills__badge', '.skills__cert-frame',
    '.contact__inner'
  ];

  var els = document.querySelectorAll(selectors.join(','));
  els.forEach(function (el) {
    el.classList.add('reveal');
    // Stagger siblings inside grids so tiles cascade in.
    var parent = el.parentElement;
    if (parent && (parent.classList.contains('work__grid') || parent.classList.contains('events__row') || parent.classList.contains('skills__groups') || parent.classList.contains('storyboard') || parent.classList.contains('cast-row') || parent.classList.contains('featured__list') || parent.classList.contains('skills__badges') || parent.classList.contains('skills__cert-frames'))) {
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

// Case-study pages: sticky chapter nav highlights the section currently
// in view as the reader scrolls (anchor-scroll itself is handled by the
// generic a[href^="#"] handler above).
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.cs-nav'), function (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('.deck__tab'));
    var sections = links
      .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  });
})();

// Wireframe stacks: click a sheet to shuffle it to the front
// (clicking the front sheet sends it to the back).
(function () {
  var classes = ['wf-img--front', 'wf-img--back1', 'wf-img--back2'];

  Array.prototype.forEach.call(document.querySelectorAll('.wf-stack__pile'), function (pile) {
    var sheets = Array.prototype.slice.call(pile.querySelectorAll('.wf-img'));

    function posOf(sheet) {
      for (var i = 0; i < classes.length; i++) {
        if (sheet.classList.contains(classes[i])) return i;
      }
      return classes.length;
    }

    pile.addEventListener('click', function (e) {
      var sheet = e.target.closest('.wf-img');
      if (!sheet) return;
      var order = sheets.slice().sort(function (a, b) { return posOf(a) - posOf(b); });
      var i = order.indexOf(sheet);
      var newOrder = i === 0
        ? order.slice(1).concat(order[0])
        : [sheet].concat(order.filter(function (s) { return s !== sheet; }));
      newOrder.forEach(function (s, p) {
        classes.forEach(function (c) { s.classList.remove(c); });
        s.classList.add(classes[p]);
      });
    });
  });
})();

// Event carousel: center card active, faint peeks either side.
// Hovering a peek slides it in (desktop); tap/click, arrows, dots and
// arrow keys work everywhere.
(function () {
  var carousel = document.querySelector('.ev-carousel');
  if (!carousel) return;

  var cards = Array.prototype.slice.call(carousel.querySelectorAll('.ev-card'));
  var dotsWrap = carousel.querySelector('.ev-carousel__dots');
  var n = cards.length;
  var current = 0;
  var hoverTimer = null;

  cards.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'ev-carousel__dot';
    dot.setAttribute('aria-label', 'Show event ' + (i + 1) + ' of ' + n);
    dot.addEventListener('click', function () { go(i); });
    dotsWrap.appendChild(dot);
  });

  function render() {
    cards.forEach(function (card, i) {
      var rel = (i - current + n) % n;
      card.classList.toggle('is-active', rel === 0);
      card.classList.toggle('is-next', rel === 1);
      card.classList.toggle('is-prev', rel === n - 1);
      card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
    });
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function go(i) { current = ((i % n) + n) % n; render(); }
  function step(d) { go(current + d); }

  Array.prototype.forEach.call(carousel.querySelectorAll('.ev-carousel__arrow'), function (btn) {
    btn.addEventListener('click', function () { step(parseInt(btn.dataset.dir, 10)); });
  });

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.classList.contains('is-next')) step(1);
      else if (card.classList.contains('is-prev')) step(-1);
    });
    card.addEventListener('mouseenter', function () {
      if (card.classList.contains('is-active')) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        if (card.classList.contains('is-next')) step(1);
        else if (card.classList.contains('is-prev')) step(-1);
      }, 220);
    });
    card.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
  });

  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });

  render();
})();
