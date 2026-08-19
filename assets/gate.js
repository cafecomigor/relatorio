(function () {
  function toHex(buffer) {
    return Array.prototype.map
      .call(new Uint8Array(buffer), function (b) { return ("00" + b.toString(16)).slice(-2); })
      .join("");
  }

  function sha256Hex(text) {
    var enc = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", enc).then(toHex);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hash = window.GATE_HASH;
    var content = document.getElementById("report-content");
    var overlay = document.getElementById("gate-overlay");
    var input = document.getElementById("gate-input");
    var form = document.getElementById("gate-form");
    var error = document.getElementById("gate-error");
    if (!hash || !content || !overlay) return;

    var storageKey = "gate_ok_" + location.pathname;

    function unlock() {
      overlay.style.display = "none";
      content.style.display = "";
      try { localStorage.setItem(storageKey, "1"); } catch (e) {}
    }

    try {
      if (localStorage.getItem(storageKey) === "1") { unlock(); return; }
    } catch (e) {}

    overlay.style.display = "flex";
    if (input) input.focus();

    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var code = (input.value || "").trim();
        sha256Hex(code).then(function (h) {
          if (h === hash) {
            unlock();
          } else {
            error.style.display = "block";
            input.value = "";
            input.focus();
          }
        });
      });
    }
  });
})();
