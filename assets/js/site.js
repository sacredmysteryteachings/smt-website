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
