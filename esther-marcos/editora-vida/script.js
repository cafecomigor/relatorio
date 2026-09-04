(function () {
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    var raw = el.getAttribute('data-target');
    if (raw === null) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = raw.indexOf('.') > -1 ? raw.split('.')[1].length : 0;
    var target = parseFloat(raw.replace(',', '.'));
    var duration = 1300;
    var start = null;

    function locale(n) {
      return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = target * easeOutCubic(progress);
      el.textContent = locale(value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = locale(target) + suffix;
    }
    requestAnimationFrame(step);
  }

  function animateDonut(el) {
    var circles = el.querySelectorAll('.seg');
    var r = parseFloat(circles[0].getAttribute('r'));
    var circumference = 2 * Math.PI * r;
    var offset = 0;
    circles.forEach(function (c) {
      var pct = parseFloat(c.getAttribute('data-pct'));
      var len = (pct / 100) * circumference;
      c.style.strokeDasharray = len.toFixed(2) + ' ' + (circumference - len).toFixed(2);
      c.style.strokeDashoffset = (-offset).toFixed(2);
      offset += len;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var revealEls = document.querySelectorAll('.reveal');
    var countEls = document.querySelectorAll('[data-target]');
    var barFills = document.querySelectorAll('.b-fill');
    var segFills = document.querySelectorAll('.split-bar .seg');
    var donuts = document.querySelectorAll('.donut');

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var t = entry.target;
          t.classList.add('in');
          t.querySelectorAll('[data-target]').forEach(animateCount);
          if (t.matches('[data-target]')) animateCount(t);
          t.querySelectorAll('.b-fill').forEach(function (b) { b.style.width = b.dataset.w; });
          if (t.classList.contains('b-fill')) t.style.width = t.dataset.w;
          t.querySelectorAll('.split-bar .seg').forEach(function (s) { s.style.width = s.dataset.w; });
          t.querySelectorAll('.donut').forEach(animateDonut);
          if (t.classList.contains('donut')) animateDonut(t);
          io.unobserve(t);
        });
      }, { threshold: 0.25 });

      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      countEls.forEach(animateCount);
      barFills.forEach(function (b) { b.style.width = b.dataset.w; });
      segFills.forEach(function (s) { s.style.width = s.dataset.w; });
      donuts.forEach(animateDonut);
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  });
})();
