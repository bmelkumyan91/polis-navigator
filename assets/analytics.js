/* Аналитика загружается только после выбора посетителя. */
(function () {
  "use strict";
  var consentKey = "financial-site-metrika-consent-v1";
  var counterId = 114145461;
  function getConsent() {
    try { return localStorage.getItem(consentKey); } catch (_) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(consentKey, value); } catch (_) { /* storage unavailable */ }
  }
  function startMetrika() {
    if (window.__financialMetrikaStarted) return;
    window.__financialMetrikaStarted = true;
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
    })(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id="+counterId,"ym");
    ym(counterId,"init",{
      ssr:true, webvisor:false, clickmap:false,
      referrer:document.referrer, url:location.href,
      accurateTrackBounce:true, trackLinks:true
    });
  }
  function removeBanner() {
    var banner=document.getElementById("analytics-consent");
    if(banner) banner.remove();
  }
  function showBanner() {
    if (document.getElementById("analytics-consent")) return;
    var banner=document.createElement("div");
    banner.id="analytics-consent";
    banner.className="analytics-consent";
    banner.setAttribute("role","region");
    banner.setAttribute("aria-label","Настройки аналитики");
    banner.innerHTML='<div><strong>Аналитика посещений</strong><p>Мы предлагаем использовать Яндекс Метрику для оценки посещаемости сайта. Запись действий (Вебвизор) отключена. Можно отказаться: калькуляторы продолжат работать.</p></div><div class="analytics-actions"><button type="button" data-analytics="decline">Не разрешать</button><button type="button" data-analytics="accept">Разрешить аналитику</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-analytics="accept"]').addEventListener("click",function(){
      setConsent("yes"); removeBanner(); startMetrika();
    });
    banner.querySelector('[data-analytics="decline"]').addEventListener("click",function(){
      setConsent("no"); removeBanner();
    });
  }

  /* Click goals for first-party navigation only, not conversions inside Pampadu iframes. */
  var goalByPath = {
    "/banking/": "open_banking",
    "/osago/": "open_osago",
    "/ipoteka/": "open_ipoteka"
  };
  document.addEventListener("click", function(event) {
    if (getConsent() !== "yes" || !window.__financialMetrikaStarted || typeof window.ym !== "function") return;
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;
    var path = url.pathname.replace(/\\/g, "/");
    var prefix = "/polis-navigator";
    if (path.indexOf(prefix + "/") === 0) path = path.slice(prefix.length);
    if (path.endsWith("/index.html")) path = path.slice(0, -10);
    var goal = goalByPath[path];
    if (goal) window.ym(counterId, "reachGoal", goal);
  });
  document.addEventListener("DOMContentLoaded",function(){
    var value=getConsent();
    if(value==="yes") startMetrika();
    else if(value!=="no") showBanner();
    document.querySelectorAll("[data-analytics-settings]").forEach(function(link){
      link.addEventListener("click",function(event){
        event.preventDefault(); showBanner();
      });
    });
  });
})();