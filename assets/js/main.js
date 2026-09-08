/* utsavpoudel.com.np — interaction layer.
   Everything degrades to a fully readable static page without JS. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: hairline on scroll + mobile sheet ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__list a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseFloat(el.getAttribute('data-delay') || '0');
        setTimeout(function () { el.classList.add('is-in'); }, delay * 1000);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = target + suffix; return; }
      var start = null;
      var dur = 1300;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- hero parallax ---------- */
  var heroInner = document.querySelector('[data-parallax]');
  if (heroInner && !reduced) {
    var ticking = false;
    var frame = function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroInner.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(2) + 'px,0)';
        heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(frame); ticking = true; }
    }, { passive: true });
  }

  /* ---------- FAQ accordion (details-free, animated) ---------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    var item = btn.closest('.faq__item');
    var panel = item.querySelector('.faq__a');
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 40 + 'px' : '0px';
    });
  });

  /* ---------- current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
