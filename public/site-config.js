/* New'Gen Dental: tracking slots.
   Paste the IDs between the quotes and redeploy. Empty means nothing loads.
   Add a cookie notice before switching these on (see README go-live checklist). */
window.NGD_CONFIG = {
  ga4: "",        // e.g. "G-XXXXXXXXXX"
  metaPixel: ""   // e.g. "123456789012345"
};

(function () {
  var c = window.NGD_CONFIG || {};
  if (c.ga4) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(c.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", c.ga4);
  }
  if (c.metaPixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", c.metaPixel);
    window.fbq("track", "PageView");
  }
  /* Count phone clicks and enquiries as conversions once tracking is on. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    if (window.gtag) window.gtag("event", "phone_click", { link_url: a.href });
    if (window.fbq) window.fbq("track", "Contact");
  });
})();
