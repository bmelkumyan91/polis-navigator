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