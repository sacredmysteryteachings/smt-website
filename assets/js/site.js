// Sacred Mystery Teachings — small page helpers. The page reads fine without this file.

// Tap-to-flip topic cards
document.querySelectorAll('.card').forEach(function (card) {
  card.addEventListener('click', function () {
    var on = card.getAttribute('aria-pressed') === 'true';
    card.setAttribute('aria-pressed', on ? 'false' : 'true');
  });
});

// Click-to-load YouTube video. Put the video's ID in data-video-id on .video
// and the "coming soon" face swaps for a thumbnail with a play button.
// Nothing loads from YouTube until the visitor taps play.
document.querySelectorAll('.video[data-video-id]').forEach(function (box) {
  var id = box.getAttribute('data-video-id');
  if (!/^[\w-]{11}$/.test(id)) return;
  var title = box.getAttribute('data-video-title') || 'Video';
  var face = box.querySelector('.video-face');
  face.className = 'video-face';
  face.innerHTML = '';
  var img = document.createElement('img');
  img.className = 'thumb';
  img.alt = '';
  img.width = 1280; img.height = 720;
  img.loading = 'lazy';
  img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'video-play';
  btn.setAttribute('aria-label', 'Play: ' + title);
  btn.innerHTML = '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 5v14l11-7z"/></svg>';
  face.appendChild(img);
  face.appendChild(btn);
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    f.title = title;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(f);
  });
});

// Faint star field behind the hero. Gold-white points that drift very slowly and
// twinkle. Static under Reduce Motion, paused when the hero is off screen.
(function () {
  var canvas = document.querySelector('.hero .stars');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var running = false, raf = 0, t0 = 0;

  function size() {
    var r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round((w * h) / 6500);
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.5 + Math.random() * 1.3,
        a: 0.35 + Math.random() * 0.6,
        p: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.03,    // per frame at ~30 fps (same drift speed as before)
        vy: -0.016 - Math.random() * 0.024
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduce ? 1 : 0.7 + 0.3 * Math.sin(t * 0.001 * s.s + s.p);
      // keep the middle (where the emblem and headline sit) quieter
      var dx = (s.x - w / 2) / (w / 2), dy = (s.y - h * 0.42) / (h / 2);
      var fade = Math.min(1, 0.25 + Math.sqrt(dx * dx + dy * dy) * 1.1);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(240, 220, 160,' + (s.a * tw * fade).toFixed(3) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduce) {
        s.x += s.vx; s.y += s.vy;
        if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        if (s.x < -2) s.x = w + 2; else if (s.x > w + 2) s.x = -2;
      }
    }
  }

  // about 30 frames a second: looks the same, half the work on phones
  var last = 0;
  function loop(t) { if (t - last >= 33) { draw(t); last = t; } raf = requestAnimationFrame(loop); }
  function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  size(); draw(0);
  if (reduce) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(canvas);
  } else { start(); }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(0); }, 150); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
})();

// Desktop only: topic cards lean toward the mouse (CSS reads --rx/--ry under hover:hover)
if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
}
