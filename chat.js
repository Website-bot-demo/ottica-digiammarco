/* Assistente virtuale — fumetto in basso a destra. Configurazione tramite attributi data-* sul tag <script>. */
(function () {
  var script = document.currentScript;
  var ENDPOINT = script && script.getAttribute('data-endpoint');
  if (!ENDPOINT) return;
  function opt(k, d) { var v = script.getAttribute('data-' + k); return v == null || v === '' ? d : v; }
  var NAME = opt('name', 'Assistente'), PHONE = opt('phone', ''), SITE = opt('site', location.hostname.replace(/^www\./, ''));
  var C = opt('color', '#1d2a5c'), A = opt('accent', '#d4a017'), FONT = opt('font', 'system-ui,-apple-system,"Segoe UI",Arial,sans-serif');
  var LOGO = opt('logo', ''), INITIALS = opt('initials', NAME.charAt(0));
  var CHIPS = opt('chips', 'Che orari fate?|Dove siete?').split('|');
  var NOTE = opt('note', 'Assistente automatico: le risposte possono contenere errori.');
  var FAIL = 'Al momento non riesco a rispondere.' + (PHONE ? ' Chiamaci al ' + PHONE + '.' : '');

  var css = '' +
    '.gc-btn{position:fixed;right:18px;bottom:18px;z-index:60;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;background:'+C+';color:#fff;box-shadow:0 10px 26px rgba(20,27,51,.35);display:grid;place-items:center;transition:transform .2s}' +
    '.gc-btn:hover{transform:scale(1.06)}' +
    '.gc-btn svg{width:28px;height:28px}' +
    '.gc-badge{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:'+A+';border:2px solid #fff}' +
    '.gc-panel{position:fixed;right:18px;bottom:88px;z-index:61;width:min(370px,calc(100vw - 24px));height:min(540px,calc(100vh - 120px));background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(20,27,51,.3);display:none;flex-direction:column;overflow:hidden;font-family:'+FONT+';color:#141b33}' +
    '.gc-panel.open{display:flex}' +
    '.gc-head{background:'+C+';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}' +
    '.gc-head img,.gc-av{width:38px;height:38px;border-radius:50%;background:#fff;object-fit:contain;padding:3px;flex:none}.gc-av{display:grid;place-items:center;padding:0;color:'+C+';font-weight:700;font-size:15px}' +
    '.gc-head b{display:block;font-size:15px}.gc-head small{opacity:.8;font-size:12px}' +
    '.gc-x{margin-left:auto;background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 6px}' +
    '.gc-body{flex:1;overflow-y:auto;padding:14px;background:#f3f5fa;display:flex;flex-direction:column;gap:8px}' +
    '.gc-m{max-width:85%;padding:10px 12px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}' +
    '.gc-m.bot{background:#fff;border:1px solid #e1e5ef;align-self:flex-start;border-bottom-left-radius:4px}' +
    '.gc-m.me{background:'+C+';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '.gc-m.typing{color:#59627a;font-style:italic}' +
    '.gc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}' +
    '.gc-chip{border:1px solid '+C+';color:'+C+';background:#fff;border-radius:999px;padding:6px 11px;font-size:13px;cursor:pointer}' +
    '.gc-foot{border-top:1px solid #e1e5ef;padding:10px;display:flex;gap:8px;background:#fff}' +
    '.gc-foot input{flex:1;border:1px solid #c9cfdd;border-radius:999px;padding:10px 14px;font-size:16px;outline:none}' +
    '.gc-foot input:focus{border-color:'+C+'}' +
    '.gc-send{border:0;border-radius:50%;width:42px;height:42px;background:'+C+';color:#fff;cursor:pointer;display:grid;place-items:center}' +
    '.gc-send:disabled{opacity:.5}' +
    '.gc-note{font-size:11px;color:#59627a;text-align:center;padding:0 10px 8px;background:#fff}' +
    '@media (max-width:'+opt('mobile-max','760')+'px){.gc-btn{bottom:84px;right:14px}.gc-panel{right:12px;bottom:150px;height:min(520px,calc(100vh - 170px))}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.className = 'gc-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Apri l’assistente virtuale');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/></svg><span class="gc-badge"></span>';

  var panel = document.createElement('div');
  panel.className = 'gc-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistente virtuale');
  panel.innerHTML =
    '<div class="gc-head">' + (LOGO ? '<img src="' + LOGO + '" alt="">' : '<span class="gc-av" aria-hidden="true"></span>') + '<div><b class="gc-name"></b><small>Assistente virtuale</small></div><button class="gc-x" type="button" aria-label="Chiudi">×</button></div>' +
    '<div class="gc-body" aria-live="polite"></div>' +
    '<form class="gc-foot"><input type="text" maxlength="500" placeholder="Scrivi una domanda…" aria-label="Scrivi una domanda" autocomplete="off"><button class="gc-send" type="submit" aria-label="Invia"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
    '<div class="gc-note"></div>';

  panel.querySelector('.gc-name').textContent = NAME;
  panel.querySelector('.gc-note').textContent = NOTE;
  var av = panel.querySelector('.gc-av'); if (av) av.textContent = INITIALS;
  document.body.appendChild(btn); document.body.appendChild(panel);

  var bodyEl = panel.querySelector('.gc-body');
  var form = panel.querySelector('form');
  var input = form.querySelector('input');
  var send = form.querySelector('.gc-send');
  var history = [];
  var started = false;

  function add(text, who, cls) {
    var d = document.createElement('div');
    d.className = 'gc-m ' + who + (cls ? ' ' + cls : '');
    d.textContent = text;
    bodyEl.appendChild(d); bodyEl.scrollTop = bodyEl.scrollHeight;
    return d;
  }
  function chips(list) {
    var w = document.createElement('div'); w.className = 'gc-chips';
    list.forEach(function (q) {
      var c = document.createElement('button'); c.type = 'button'; c.className = 'gc-chip'; c.textContent = q;
      c.onclick = function () { w.remove(); ask(q); };
      w.appendChild(c);
    });
    bodyEl.appendChild(w);
  }
  function open() {
    panel.classList.add('open'); btn.querySelector('.gc-badge').style.display = 'none';
    if (!started) {
      started = true;
      add(opt('welcome', 'Ciao! Sono l\u2019assistente virtuale di ' + NAME + '. Come posso aiutarti?'), 'bot');
      chips(CHIPS);
    }
    setTimeout(function () { input.focus(); }, 50);
  }
  function ask(text) {
    text = (text || '').trim(); if (!text) return;
    add(text, 'me');
    history.push({ role: 'user', content: text });
    input.value = ''; send.disabled = true;
    var t = add('Sto scrivendo…', 'bot', 'typing');
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ site: SITE, messages: history.slice(-8) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var reply = (d && d.reply) || FAIL;
        t.remove(); add(reply, 'bot'); history.push({ role: 'assistant', content: reply });
      })
      .catch(function () { t.remove(); add(FAIL, 'bot'); })
      .then(function () { send.disabled = false; input.focus(); });
  }

  btn.addEventListener('click', function () { panel.classList.contains('open') ? panel.classList.remove('open') : open(); });
  panel.querySelector('.gc-x').addEventListener('click', function () { panel.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) { panel.classList.remove('open'); btn.focus(); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
})();
