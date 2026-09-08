/* Landing animation — an interactive graph network, drawn on canvas.
   No libraries, no WebGL context cost: nodes and edges in 2D, retina-aware,
   cursor-reactive. Monochrome on white, deliberately quiet. */
(function () {
  'use strict';

  var canvas = document.getElementById('graph-canvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, dpr = 1;
  var nodes = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var raf = null;
  var LINK_DIST = 150;
  var POINTER_DIST = 190;

  function nodeCount() {
    var area = W * H;
    var n = Math.round(area / 15500);
    return Math.max(28, Math.min(reduced ? 46 : 104, n));
  }

  function seed() {
    nodes = [];
    var n = nodeCount();
    for (var i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.5 + 1.0,
        hub: Math.random() < 0.12
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    LINK_DIST = W < 700 ? 118 : 150;
    seed();
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    var i, j, a, b, dx, dy, d, alpha;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];

      a.x += a.vx;
      a.y += a.vy;

      if (a.x < -20) a.x = W + 20;
      if (a.x > W + 20) a.x = -20;
      if (a.y < -20) a.y = H + 20;
      if (a.y > H + 20) a.y = -20;

      // cursor pulls nearby nodes very gently
      if (pointer.active) {
        dx = pointer.x - a.x;
        dy = pointer.y - a.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < POINTER_DIST && d > 0.5) {
          var pull = (1 - d / POINTER_DIST) * 0.05;
          a.vx += (dx / d) * pull;
          a.vy += (dy / d) * pull;
        }
      }

      // friction + a floor on speed so the field never freezes
      a.vx *= 0.992;
      a.vy *= 0.992;
      var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      if (sp < 0.05) {
        a.vx += (Math.random() - 0.5) * 0.05;
        a.vy += (Math.random() - 0.5) * 0.05;
      } else if (sp > 0.9) {
        a.vx *= 0.9;
        a.vy *= 0.9;
      }
    }

    // edges
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x;
        dy = a.y - b.y;
        if (dx > LINK_DIST || dx < -LINK_DIST || dy > LINK_DIST || dy < -LINK_DIST) continue;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d > LINK_DIST) continue;
        alpha = (1 - d / LINK_DIST) * 0.15;
        ctx.strokeStyle = 'rgba(29,29,31,' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // edges to the cursor — the "attention" the graph pays to you
    if (pointer.active) {
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        dx = a.x - pointer.x;
        dy = a.y - pointer.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < POINTER_DIST) {
          alpha = (1 - d / POINTER_DIST) * 0.3;
          ctx.strokeStyle = 'rgba(29,29,31,' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.fillStyle = a.hub ? 'rgba(29,29,31,0.62)' : 'rgba(29,29,31,0.34)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.hub ? a.r * 1.7 : a.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(step);
  }

  function start() { if (raf === null) raf = requestAnimationFrame(step); }
  function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

  resize();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 180);
  });

  if (reduced) {
    // one static frame: the structure, none of the motion
    stop();
    ctx.clearRect(0, 0, W, H);
    var k, m, ax, ay, bx, by, dist;
    for (k = 0; k < nodes.length; k++) {
      for (m = k + 1; m < nodes.length; m++) {
        ax = nodes[k].x; ay = nodes[k].y; bx = nodes[m].x; by = nodes[m].y;
        dist = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
        if (dist < LINK_DIST) {
          ctx.strokeStyle = 'rgba(29,29,31,' + ((1 - dist / LINK_DIST) * 0.13).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        }
      }
    }
    for (k = 0; k < nodes.length; k++) {
      ctx.fillStyle = 'rgba(29,29,31,0.34)';
      ctx.beginPath(); ctx.arc(nodes[k].x, nodes[k].y, nodes[k].r, 0, Math.PI * 2); ctx.fill();
    }
    canvas.classList.add('is-ready');
    return;
  }

  window.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = pointer.x > 0 && pointer.x < W && pointer.y > 0 && pointer.y < H;
  }, { passive: true });

  window.addEventListener('pointerleave', function () { pointer.active = false; });
  window.addEventListener('blur', function () { pointer.active = false; });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  canvas.classList.add('is-ready');
  start();
})();
