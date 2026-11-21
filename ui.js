// Vice UI: Today, Progress, Log, Setup. Port of today.dart, progress.dart, log.dart, setup.dart, main.dart.
'use strict';

const ICONS = {
today: `<path d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/>`,
today_o: `<path d='M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7z'/>`,
chart: `<path d='m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z'/>`,
receipt: `<path d='M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z'/><path d='M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z'/>`,
receipt_o: `<path d='M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6c-.55 0-1-.45-1-1v-1h10v2zm4-1c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z'/><path d='M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z'/>`,
tune: `<path d='M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z'/>`,
cl: `<path d='M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z'/>`,
cr: `<path d='M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/>`,
heart: `<path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'/>`,
bed: `<path d='M9.27 4.49c-1.63 7.54 3.75 12.41 7.66 13.8A7.993 7.993 0 0 1 12 20c-4.41 0-8-3.59-8-8 0-3.45 2.2-6.4 5.27-7.51m2.72-2.48C6.4 2.01 2 6.54 2 12c0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-12.09-8.43-8.32-14.97h-.35z'/>`,
check_c: `<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z'/>`,
vacc: `<path d='M11 5.5H8V4h.5c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1s.45 1 1 1H6v1.5H3c-.55 0-1 .45-1 1s.45 1 1 1V15c0 1.1.9 2 2 2h1v4l2 1.5V17h1c1.1 0 2-.9 2-2V7.5c.55 0 1-.45 1-1s-.45-1-1-1zM9 9H7.25c-.41 0-.75.34-.75.75s.34.75.75.75H9V12H7.25c-.41 0-.75.34-.75.75s.34.75.75.75H9V15H5V7.5h4V9zm10.5 1.5V10c.55 0 1-.45 1-1s-.45-1-1-1h-5c-.55 0-1 .45-1 1s.45 1 1 1v.5c0 .5-1.5 1.16-1.5 3V20c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-6.5c0-1.84-1.5-2.5-1.5-3zm-3 0V10h1v.5c0 1.6 1.5 2 1.5 3v.5h-4v-.5c0-1 1.5-1.4 1.5-3zm2.5 5V17h-4v-1.5h4zM15 20v-1.5h4V20h-4z'/>`,
med: `<path d='M10.5 15H8v-3h2.5V9.5h3V12H16v3h-2.5v2.5h-3V15zM19 8v11c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2zm-2 0H7v11h10V8zm1-5H6v2h12V3z'/>`,
food: `<path d='M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z'/>`,
addc: `<path d='M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/>`,
gym: `<path d='M20.57 14.86 22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z'/>`,
scale: `<path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-1 3.5h-1v-1h1v1zm1.5 0h-1v-1h1v1zm1.5 0h-1v-1h1v1z'/>`,
edit: `<path d='m14.06 9.02.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z'/>`,
less: `<path d='m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'/>`,
alarm: `<path d='m22 5.72-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39 6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a9 9 0 0 0 0-18zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z'/>`,
search: `<path d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/>`,
note: `<path d='M3 10h11v2H3v-2zm0-2h11V6H3v2zm0 8h7v-2H3v2zm15.01-3.13.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12zm-.71.71-5.3 5.3V21h2.12l5.3-5.3-2.12-2.12z'/>`,
check: `<path d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/>`,
flag: `<path d='m12.36 6 .4 2H18v6h-3.36l-.4-2H7V6h5.36M14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6L14 4z'/>`,
bookmark: `<path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z'/>`,
save: `<path d='M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z'/>`,
copy: `<path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/>`,
paste: `<path d='M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z'/>`,
del: `<path d='M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z'/>`,
moon: `<path d='M14 4c.34 0 .68.02 1.01.07C13.1 6.23 12 9.05 12 12s1.1 5.77 3.01 7.93c-.33.05-.67.07-1.01.07-4.41 0-8-3.59-8-8s3.59-8 8-8m0-2C8.48 2 4 6.48 4 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35-2.99-1.73-5-4.95-5-8.65s2.01-6.92 5-8.65A9.973 9.973 0 0 0 14 2z'/>`,
sun: `<path d='m6.76 4.84-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495 1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115 1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96 1.41 1.41 1.79-1.8-1.41-1.41z'/>`,
star: `<path d='m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z'/>`,
add: `<path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/>`
};
const ic = (n, cls = '') => `<svg class='ic ${cls}' viewBox='0 0 24 24' aria-hidden='true'>${ICONS[n] || ''}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const buzz = (ms = 15) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) {} };

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYNAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function niceDate(d) {
  const diff = daysBetween(dateOnly(new Date()), d);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return `${WEEKDAYS[dartWeekday(d) - 1]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
const hm = h => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}h ${pad(m % 60)}m`; };

const store = new Store();
const ui = {
  tab: 0,
  today: { date: dateOnly(new Date()), pinned: false, editSleep: false },
  log: { date: dateOnly(new Date()), pinned: false },
  hideInstall: false,
};

// ---------- toast / undo ----------
let toastTimer = null;
function toast(msg, ms = 2000) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('over', !!document.querySelector('.sheet'));
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}
function undone(what) { buzz(30); toast(`↩ ${what} undone`); }

// ---------- overlays ----------
const layers = [];
function openLayer(kind, html, { onClose, tall } = {}) {
  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  const box = document.createElement('div');
  box.className = kind;
  if (tall) box.style.height = tall;
  box.innerHTML = html;
  document.body.append(scrim, box);
  const layer = { scrim, box, onClose, closed: false };
  layers.push(layer);
  scrim.addEventListener('click', () => closeLayer(layer));
  requestAnimationFrame(() => { scrim.classList.add('show'); box.classList.add('show'); });
  return layer;
}
function closeLayer(layer, value) {
  if (!layer || layer.closed) return;
  layer.closed = true;
  layers.splice(layers.indexOf(layer), 1);
  layer.scrim.classList.remove('show'); layer.box.classList.remove('show');
  setTimeout(() => { layer.scrim.remove(); layer.box.remove(); }, 250);
  if (document.activeElement && layer.box.contains(document.activeElement)) document.activeElement.blur();
  layer.onClose && layer.onClose(value);
}
/** Dialog with buttons. actions: [{label, kind:'text'|'filled', value, run(box) -> value | undefined(keep open)}] */
function dialog({ title, body = '', actions }) {
  return new Promise(resolve => {
    const html = `${title ? `<div class='dt'>${esc(title)}</div>` : ''}<div class='db'>${body}</div>
      <div class='da'>${actions.map((a, i) => `<button class='${a.kind === 'filled' ? 'filled' : 'txtbtn'}' data-dact='${i}'>${esc(a.label)}</button>`).join('')}</div>`;
    const layer = openLayer('dialog', html, { onClose: v => resolve(v ?? null) });
    layer.box.querySelectorAll('[data-dact]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const a = actions[+b.dataset.dact];
      const v = a.run ? a.run(layer.box) : a.value;
      if (v !== undefined) closeLayer(layer, v);
    }));
    layer.box.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const last = layer.box.querySelector('.da .filled'); last && last.click(); }
    }));
    const first = layer.box.querySelector('input[autofocus],textarea[autofocus]');
    if (first) { first.focus(); try { first.select(); } catch (_) {} }
    layer.box.addEventListener('click', e => e.stopPropagation());
  });
}
function askNumber(title, initial, suffix = '') {
  return dialog({
    title,
    body: `<label class='field suffix'><input id='num' type='text' inputmode='decimal' autocomplete='off' autofocus value='${initial == null ? '' : esc(fmt(initial, 1))}'>${suffix ? `<span style='margin:0'>${esc(suffix)}</span>` : ''}</label>`,
    actions: [
      { label: 'Cancel', value: null },
      { label: 'Save', kind: 'filled', run: b => parseNum($('#num', b).value) },
    ],
  });
}
const confirmBox = (title, body) => dialog({
  title, body: esc(body),
  actions: [{ label: 'Cancel', value: false }, { label: 'Yes', kind: 'filled', value: true }],
}).then(v => v === true);

// ---------- small builders ----------
function meter(label, value, fraction, overIsBad = true) {
  const f = isFinite(fraction) ? fraction : 0;
  const over = f > 1 && overIsBad;
  return `<div class='meter'><div class='l'>${esc(label)}</div><div class='v'>${esc(value)}</div>
    <div class='bar'><i class='${over ? 'over' : ''}' style='width:${Math.max(0, Math.min(1, f)) * 100}%'></i></div></div>`;
}
function section({ title, icon, trailing, add, body }) {
  return `<div class='card sec'><div class='sec-h'>${ic(icon)}<span class='t'>${esc(title)}</span><span class='sp'></span>
    ${trailing != null ? `<span class='tr'>${esc(trailing)}</span>` : ''}
    ${add ? `<button class='iconbtn' data-a='${add}'>${ic('addc')}</button>` : ''}</div>${body}</div>`;
}
const emptyLine = t => `<div class='muted' style='padding:0 8px 6px 0'>${esc(t)}</div>`;
function tile({ label, count = 0, a, lp, data = '', bad = false, sub }) {
  const on = count > 0;
  return `<div class='tile tap ${on ? (bad ? 'bad' : 'on') : ''}' data-a='${a}' data-lp='${lp}' ${data}>
    <div class='a'>${esc(label)}</div><div class='b'>${esc(sub ?? (on ? '×' + count : 'tap in'))}</div></div>`;
}
function tapCard(title, total, tiles) {
  return `<div class='card tapcard'><div class='hd'><span class='t'>${title}</span><span class='tot'>${esc(total)}</span></div><div class='tiles'>${tiles}</div></div>`;
}

// ================= TODAY =================
function renderToday() {
  const T = ui.today, s = store;
  const now = dateOnly(new Date());
  if (!T.pinned && !sameDate(T.date, now)) T.date = now;
  const date = T.date;
  const day = s.peek(date) || new DayLog();
  const isToday = sameDate(date, now);
  const dueMeds = s.meds.filter(m => medDueOn(m, date) || m.id in day.medsTaken);
  const asNeeded = s.meds.filter(m => m.frequency === 'as needed' && !(m.id in day.medsTaken));
  const gym = s.sessionsInWeek(date);
  const units = s.unitsInWeek(date);
  const h = [];

  if (!ui.hideInstall && isIOS() && !isStandalone()) {
    h.push(`<div class='install'><b>Install Vice:</b> tap the Share button ${shareGlyph()} at the bottom of Safari, then <b>Add to Home Screen</b>. Open Vice from the new icon from then on. Your data lives in that app.
      <div style='text-align:right'><button class='txtbtn' data-a='hideInstall'>Got it</button></div></div>`);
  }

  // date bar
  h.push(`<div class='datebar'><button class='iconbtn' data-a='tShift' data-n='-1'>${ic('cl')}</button>
    <div class='mid'><div class='kicker'>VICE</div><div class='title-l'>${esc(niceDate(date))}</div>
    <input type='date' id='tdate' min='2025-01-01' max='${dayKey(now)}' value='${dayKey(date)}'></div>
    <button class='iconbtn' data-a='tShift' data-n='1' ${isToday ? 'disabled' : ''}>${ic('cr')}</button></div>`);

  // summary
  const kLeft = day.kcal > s.kcalTarget ? `${fmt(day.kcal - s.kcalTarget)} kcal over the max` : `${fmt(s.kcalTarget - day.kcal)} kcal left today`;
  h.push(`<div class='card meters'>
    <div class='row'>${meter(`Calories (max ${fmt(s.kcalTarget)})`, `${fmt(day.kcal)} / ${fmt(s.kcalTarget)}`, day.kcal / s.kcalTarget)}
      ${meter('Protein', `${fmt(day.protein)} / ${fmt(s.proteinTarget)} g`, day.protein / s.proteinTarget, false)}</div>
    <div class='row'>${meter(`Fat (min ${fmt(s.fatMin)} g)`, `${fmt(day.fat)} g`, s.fatMin === 0 ? 1 : day.fat / s.fatMin, false)}
      ${meter('Libido foods today', `${day.libidoGroupsHit.size} / ${libidoGroups.length} groups`, day.libidoGroupsHit.size / libidoGroups.length, false)}</div>
    <div class='row'>${meter('Gym this week', `${gym} / ${s.gymPerWeek}`, gym / s.gymPerWeek, false)}
      ${meter('Alcohol this week', `${fmt(units, 1)} / ${fmt(s.unitsPerWeek)} units`, s.unitsPerWeek === 0 ? (units > 0 ? 2 : 0) : units / s.unitsPerWeek)}</div>
    <div class='small' style='margin-top:4px;color:${day.kcal > s.kcalTarget ? 'var(--orange)' : 'var(--onSV)'}'>${kLeft}</div></div>`);

  // supplements
  h.push(`<div class='card' style='padding:10px'><div class='tiles'>${supplements.map(n => {
    const on = n in day.supps;
    return `<div class='tile tap ${on ? 'on' : ''}' data-a='supp' data-lp='suppUndo' data-name='${esc(n)}'>
      <div class='a'>${esc(n)}</div><div class='b' style='${on ? 'font-weight:400' : ''}'>${on ? '✓ ' + ampm(day.supps[n]) : 'tap in'}</div></div>`;
  }).join('')}</div></div>`);

  // libido
  {
    const score = libidoScore(day);
    const avg7 = avgScore(s, date, 7), prev7 = avgScore(s, addDays(date, -7), 7), rate = morningRate(s, date, 7);
    let trend = '';
    if (avg7 != null && prev7 != null) {
      const d = avg7 - prev7;
      trend = Math.abs(d) < 3 ? ' · steady' : (d > 0 ? ` · ↑ ${fmt(d)} vs last week` : ` · ↓ ${fmt(-d)} vs last week`);
    }
    const pill = (text, v) => `<button class='pill flex tap ${day.erection === v ? 'pri' : ''}' data-a='erection' data-lp='erectionUndo' data-v='${v}'>${text}</button>`;
    h.push(section({
      title: 'Libido', icon: 'heart', trailing: score == null ? 'score -' : `score ${score}/100`,
      body: yesNo('🌅 Morning erection?', day.morningWood, 'mwood', true) +
        `<div class='ln'><div style='flex:2'>💪 Erections today</div>${pill('Weak', 0)}${pill('OK', 1)}${pill('Strong', 2)}</div>
        <div class='small muted' style='padding:0 8px 4px 0'>${avg7 == null ? 'Log both each day. Insights unlock in Progress after a couple of weeks.'
          : `7-day avg ${fmt(avg7)}/100${trend}${rate == null ? '' : ` · morning erections ${fmt(rate * 100)}%`}`}</div>`,
    }));
  }

  // sleep
  {
    const since = s.sleepingSince;
    let sub;
    if (since) { const m = Math.floor((Date.now() - since) / 60000); sub = `asleep since ${ampm(hmOf(since))} · ${Math.floor(m / 60)}h ${pad(m % 60)}m`; }
    else if (day.bed != null && day.wake != null) sub = `last night: ${ampm(day.bed)} to ${ampm(day.wake)}`;
    else sub = 'tap when you get into bed';
    let body = `<div class='sleepbtn tap ${since ? 'asleep' : ''}' data-a='sleep' data-lp='sleepUndo'>
        <div class='em'>${since ? '☀️' : '🌙'}</div>
        <div class='grow'><div class='t'>${since ? "I'm awake" : 'Going to sleep'}</div><div class='s'>${esc(sub)}</div></div>
        <div class='h'>hold to<br>undo</div></div>
      <div style='text-align:right;padding-right:4px'><button class='txtbtn' data-a='editSleep'>${ic(T.editSleep ? 'less' : 'edit', 's16')}${T.editSleep ? 'Done' : 'Forgot to tap? Fix times'}</button></div>
      <div style='padding:0 8px 10px 0'><button class='filled big tap' data-a='nap' data-lp='napUndo'>${ic('alarm', 's18')}${day.powerNaps.length ? `Nap mode · 35 min  (${day.powerNaps.length} today)` : 'Nap mode · 35 min'}</button></div>
      <div class='row' style='padding:0 4px 8px 0'><div class='grow'><div>💤 Naps today</div>
        <div class='small' style='color:${day.napHours ? 'var(--orange)' : 'var(--onSV)'}'>${day.napHours === 0 ? 'tap once per hour napped' : `${day.napHours} h · last logged ${ampm(day.naps[day.naps.length - 1])}`}</div></div>
        <div style='width:120px;display:flex'>${tile({ label: day.napHours === 0 ? '+1 h' : `${day.napHours} h`, count: day.napHours, a: 'napHour', lp: 'napHourUndo', bad: true, sub: day.napHours === 0 ? 'per hour' : 'hold to undo' })}</div></div>`;
    if (T.editSleep) {
      body += `<div class='row' style='gap:8px;padding:0 8px 8px 0'>
        <button class='outlined grow tap' data-a='pickBed' data-lp='bedUndo'>${ic('moon', 's18')}${day.bed == null ? 'Bedtime' : 'Bed ' + ampm(day.bed)}</button>
        <button class='outlined grow tap' data-a='pickWake' data-lp='wakeUndo'>${ic('sun', 's18')}${day.wake == null ? 'Woke up' : 'Woke ' + ampm(day.wake)}</button></div>`;
    }
    h.push(section({ title: 'Sleep (last night)', icon: 'bed', trailing: day.sleepHours == null ? null : hm(day.sleepHours), body }));
  }

  // daily check
  h.push(section({
    title: 'Daily check', icon: 'check_c',
    body: counter('📺 Porn', day.pornTimes, 'porn') + counter('✋ Masturbated', day.mbTimes, 'mb') +
      `<div class='xs muted' style='padding:0 8px 4px 0'>Tap + each time. Long-press + to undo. "None" marks a clean day.</div>`,
  }));

  // reta
  {
    const last = s.lastReta(date);
    const since = last == null ? null : daysBetween(last, date);
    const doneToday = day.reta != null;
    const due = !doneToday && (since == null || since >= 7);
    let sub;
    if (doneToday) sub = `Done${isToday ? ' today' : ''} at ${ampm(day.reta)} · next due ${niceDate(addDays(date, 7))}`;
    else if (since == null) sub = 'Weekly · no shot logged yet';
    else if (due) sub = `Due today · last shot ${since === 7 ? 'a week ago' : since + ' days ago'}`;
    else { const left = 7 - since; sub = `Next due ${niceDate(addDays(date, left))} (in ${left} day${left === 1 ? '' : 's'})`; }
    const btn = doneToday ? `<button class='txtbtn tap' data-a='retaUndo' data-lp='retaUndoLp'>Undo</button>`
      : due ? `<button class='filled tap' data-a='reta'>Tap in</button>` : `<button class='outlined tap' data-a='reta'>Tap in</button>`;
    h.push(`<div class='card'><div class='lt' style='padding:10px 10px 10px 14px'><span style='color:${due ? 'var(--orange)' : 'var(--primary)'}'>${ic('vacc')}</span>
      <div class='grow'><div class='w600' style='font-size:16px'>${retaName} · weekly</div><div class='st'>${esc(sub)}</div></div>${btn}</div></div>`);
  }

  // pills (only if added in Setup)
  if (dueMeds.length || asNeeded.length) {
    let body = dueMeds.map(m => {
      const taken = day.medsTaken[m.id];
      const sub = [m.dose || null, taken != null ? 'taken ' + ampm(taken) : null].filter(Boolean).join(' · ');
      return `<div class='lt tap' data-a='medToggle' data-id='${esc(m.id)}'><div class='check ${taken != null ? 'on' : ''}' style='padding:0 4px'><div class='bx'>${taken != null ? ic('check', 's16') : ''}</div></div>
        <div class='grow'><div class='tt'>${esc(m.name)}</div>${sub ? `<div class='st'>${esc(sub)}</div>` : ''}</div></div>`;
    }).join('');
    if (asNeeded.length) body += `<div class='cchips' style='padding-bottom:6px'>${asNeeded.map(m => `<button class='cchip tap' data-a='medAdd' data-id='${esc(m.id)}'>+ ${esc(m.name)}</button>`).join('')}</div>`;
    h.push(section({
      title: 'Pills', icon: 'med', body,
      trailing: dueMeds.length ? `${dueMeds.filter(m => m.id in day.medsTaken).length}/${dueMeds.length}` : null,
    }));
  }

  // caffeine
  h.push(tapCard('⚡ Caffeine', `${fmt(day.caffeineMg)} mg today`, caffeinePresets.map((p, i) => tile({
    label: SHORT[p.name] || p.name, count: day.caffeine.filter(c => c.name === p.name).length, a: 'caf', lp: 'cafUndo', data: `data-i="${i}"`,
  })).join('')));

  // velo
  {
    let n7 = 0, d7 = 0;
    for (let i = 1; i <= 7; i++) { const d = s.peek(addDays(date, -i)); if (!d) continue; d7++; n7 += d.pouches.length; }
    const weekAvg = d7 === 0 ? null : n7 / d7;
    const n = day.pouches.length, over = weekAvg != null && n > weekAvg;
    h.push(`<div class='card velo'><div class='badge'><b>VELO</b><div class='dots'>${[0, 1, 2, 3, 4, 5].map(i => `<i class='${i < 3 ? 'f' : ''}'></i>`).join('')}</div></div>
      <div class='grow' style='margin:0 8px 0 12px'><div class='w700 ell' style='font-size:15px'>Crispy Peppermint</div>
        <div class='small muted ell'>${n === 0 ? 'None yet today' : `${fmt(n * nicotineMg)} mg nicotine · last ${ampm(day.pouches[n - 1])}`}</div>
        ${weekAvg != null ? `<div class='small' style='color:${over ? 'var(--orange)' : 'var(--onSV)'}'>usual: ${fmt(weekAvg, 1)}/day</div>` : ''}</div>
      <div style='text-align:center'><div class='btn tap ${over ? 'over' : ''}' data-a='velo' data-lp='veloUndo'><div class='n'>${n === 0 ? '+' : n}</div><div class='u'>${n === 0 ? 'tap in' : 'today'}</div></div>
      <div class='muted' style='font-size:9px;margin-top:4px'>hold to undo</div></div></div>`);
  }

  // food
  {
    const used = s.cheatDayInWeek(date);
    let body = `<div class='small muted' style='padding-bottom:6px'>${used == null ? '🍕 Cheat meal: still available this week' : '🍕 Cheat meal used ' + niceDate(used)}</div>`;
    if (!day.food.length) body += emptyLine('Nothing logged yet. ★ foods are libido picks.');
    body += day.food.map(f => `<div class='fitem' data-swipe='food' data-id='${esc(f.id)}'><div class='bgdel'>${ic('del')}</div>
      <div class='fg tap' data-a='foodQty' data-lp='foodLess' data-id='${esc(f.id)}'><div class='e'>${foodEmoji(f.name)}</div>
      <div class='grow'><div class='tt'>${esc(f.group != null ? f.name + ' ★' : f.name)}</div>
      <div class='st'>${fmt(f.qty, 1)} × ${esc(f.unit)} · P ${fmt(fTot(f, 'protein'))} · F ${fmt(fTot(f, 'fat'))} g</div></div>
      <div style='font-size:14px'>${fmt(fTot(f, 'kcal'))} kcal</div></div></div>`).join('');
    h.push(section({ title: 'Food', icon: 'food', trailing: `${fmt(day.foodKcal)} kcal · C ${fmt(day.carbs)} g`, add: 'foodPicker', body }));
  }

  // gym
  {
    const last = s.lastPlanId(date);
    const idx = last == null ? 0 : (gymPlans.findIndex(p => p.id === last) + 1) % gymPlans.length;
    const next = gymPlans[idx];
    let body = gymPlans.map((p, i) => {
      const done = day.sessions.some(x => x.planId === p.id);
      return `${i ? `<div class='divider full'></div>` : ''}<div class='plan tap' data-a='planOpen' data-id='${p.id}'><div class='e'>${p.emoji}</div>
        <div class='grow'><div class='row'><span class='w700 ell' style='font-size:15px'>${p.name}</span>${p.id === next.id && !done ? `<span class='nextb'>NEXT</span>` : ''}</div>
        <div class='small muted'>${p.minutes} min · tap to see the plan</div></div>
        ${done ? `<button class='tonal tap' data-a='planTap' data-lp='planTap' data-id='${p.id}'>${ic('check', 's18')}Done</button>`
          : `<button class='filled tap' data-a='planTap' data-id='${p.id}'>Tap in</button>`}</div>`;
    }).join('');
    body += day.sessions.filter(x => x.planId == null).map(x => `<div class='lt'><div class='grow tt'>${esc(x.type)}</div><div>${x.minutes} min</div></div>`).join('');
    h.push(section({ title: 'Gym', icon: 'gym', trailing: `${gym}/${s.gymPerWeek} this week`, body }));
  }

  // alcohol
  h.push(tapCard('🍺 Alcohol', `${fmt(day.units, 1)} units today`, drinkPresets.map((p, i) => tile({
    label: SHORT[p.name] || p.name, count: day.drinks.filter(x => x.name === p.name).length, a: 'drink', lp: 'drinkUndo', data: `data-i="${i}"`,
  })).join('')));

  // weight
  h.push(section({
    title: 'Weight', icon: 'scale',
    body: `<div class='lt tap' data-a='weight' data-lp='weightUndo'><div class='grow'><div class='tt'>${day.weight == null ? 'Not logged' : fmt(day.weight, 1) + ' kg'}</div>
      <div class='st'>Weigh in the morning, after the toilet, before food.</div></div><span class='muted'>${ic('edit')}</span></div>`,
  }));
  return h.join('');
}

function yesNo(label, value, key, goodIsYes) {
  const btn = (text, v) => {
    const on = value === v;
    return `<button class='pill w58 tap ${on ? (v === goodIsYes ? 'good' : 'warn') : ''}' data-a='yn' data-lp='ynUndo' data-k='${key}' data-v='${v}' data-label='${esc(label)}'>${text}</button>`;
  };
  return `<div class='ln'><div class='grow'>${esc(label)}</div>${btn('No', false)}${btn('Yes', true)}</div>`;
}
function counter(label, times, key) {
  const n = times?.length ?? 0, none = times != null && times.length === 0;
  const sub = times == null ? 'not logged' : none ? 'none today' : `${n}× today · last ${ampm(times[n - 1])}`;
  const col = none ? 'var(--greenSolid)' : n > 0 ? 'var(--orange)' : 'var(--onSV)';
  return `<div class='ln'><div class='grow'><div>${esc(label)}</div><div class='small' style='color:${col}'>${esc(sub)}</div></div>
    <button class='cbox tap ${none ? 'good' : ''}' data-a='cntNone' data-lp='cntNoneUndo' data-k='${key}' data-label='${esc(label)}'>None</button>
    <button class='cbox plus tap ${n > 0 ? 'warn' : ''}' data-a='cntPlus' data-lp='cntPlusUndo' data-k='${key}' data-label='${esc(label)}'>${n > 0 ? '+&nbsp; ' + n : '+'}</button></div>`;
}

// ---------- Today actions ----------
const A = {}, LP = {};
const tday = () => store.day(ui.today.date);
const save = () => store.save();

A.hideInstall = () => { ui.hideInstall = true; try { localStorage.setItem('vice_hide_install', '1'); } catch (_) {} render(); };
A.tShift = ds => {
  const today = dateOnly(new Date());
  const next = addDays(ui.today.date, +ds.n);
  if (isAfter(next, today)) return;
  ui.today.date = next; ui.today.pinned = !sameDate(next, today); render();
};
A.supp = ds => { const d = tday(); if (ds.name in d.supps) delete d.supps[ds.name]; else d.supps[ds.name] = nowHm(); save(); };
LP.suppUndo = ds => { const d = tday(); if (ds.name in d.supps) { delete d.supps[ds.name]; save(); undone(ds.name); } };
A.erection = ds => { const d = tday(), v = +ds.v; d.erection = d.erection === v ? null : v; save(); };
LP.erectionUndo = () => { const d = tday(); if (d.erection == null) return; d.erection = null; save(); undone('Erections'); };
A.yn = ds => {
  const d = tday(), v = ds.v === 'true';
  if (ds.k === 'mwood') d.morningWood = d.morningWood === v ? null : v;
  save();
};
LP.ynUndo = ds => { const d = tday(); if (ds.k === 'mwood') { if (d.morningWood == null) return; d.morningWood = null; } save(); undone(ds.label); };
const cntKey = k => k === 'porn' ? 'pornTimes' : 'mbTimes';
A.cntNone = ds => { const d = tday(), k = cntKey(ds.k); d[k] = (d[k] != null && d[k].length === 0) ? null : []; save(); };
LP.cntNoneUndo = ds => { const d = tday(), k = cntKey(ds.k); if (d[k] == null) return; d[k] = null; save(); undone(ds.label); };
A.cntPlus = ds => { const d = tday(), k = cntKey(ds.k); d[k] = [...(d[k] || []), nowHm()]; save(); };
LP.cntPlusUndo = ds => {
  const d = tday(), k = cntKey(ds.k); const l = d[k];
  if (!l || !l.length) return;
  const n = l.slice(0, -1); d[k] = n.length ? n : null; save(); undone('One ' + ds.label);
};
A.reta = () => { tday().reta = nowHm(); save(); };
A.retaUndo = () => { tday().reta = null; save(); };
LP.retaUndoLp = () => { tday().reta = null; save(); undone('Reta'); };
A.medToggle = ds => { const d = tday(); if (ds.id in d.medsTaken) delete d.medsTaken[ds.id]; else d.medsTaken[ds.id] = nowHm(); save(); };
A.medAdd = ds => { tday().medsTaken[ds.id] = nowHm(); save(); };
A.caf = ds => { const p = caffeinePresets[+ds.i]; tday().caffeine.push({ id: newId(), name: p.name, mg: p.mg, kcal: p.kcal, time: nowHm() }); save(); };
LP.cafUndo = ds => {
  const p = caffeinePresets[+ds.i], l = tday().caffeine;
  let i = -1; l.forEach((c, j) => { if (c.name === p.name) i = j; });
  if (i >= 0) { l.splice(i, 1); save(); undone('1 × ' + (SHORT[p.name] || p.name)); }
};
A.velo = () => { buzz(10); tday().pouches.push(nowHm()); save(); };
LP.veloUndo = () => { const l = tday().pouches; if (!l.length) return; l.pop(); save(); undone('Velo pouch'); };
A.drink = ds => { const p = drinkPresets[+ds.i]; tday().drinks.push({ id: newId(), name: p.name, units: p.units, kcal: p.kcal }); save(); };
LP.drinkUndo = ds => {
  const p = drinkPresets[+ds.i], l = tday().drinks;
  let i = -1; l.forEach((x, j) => { if (x.name === p.name) i = j; });
  if (i >= 0) { l.splice(i, 1); save(); undone('1 × ' + (SHORT[p.name] || p.name)); }
};
A.napHour = () => { tday().naps.push(nowHm()); save(); };
LP.napHourUndo = () => { const l = tday().naps; if (l.length) { l.pop(); save(); undone('1 h nap'); } };
A.nap = () => {
  const end = new Date(Date.now() + POWER_NAP_MIN * 60000);
  tday().powerNaps.push(nowHm()); save();
  toast(`⏰ Wake at ${ampm(hmOf(end))}. Start a 35 min timer in Clock, then phone down, eyes shut.`, 6000);
};
LP.napUndo = () => { const l = tday().powerNaps; if (!l.length) return; l.pop(); save(); undone('Power nap'); };
A.editSleep = () => { ui.today.editSleep = !ui.today.editSleep; render(); };
A.pickBed = () => pickTime('Went to bed', tday().bed ?? '23:00', v => { tday().bed = v; });
A.pickWake = () => pickTime('Woke up', tday().wake ?? '07:00', v => { tday().wake = v; });
LP.bedUndo = () => { if (tday().bed == null) return; tday().bed = null; save(); undone('Bedtime'); };
LP.wakeUndo = () => { if (tday().wake == null) return; tday().wake = null; save(); undone('Wake time'); };
LP.sleepUndo = () => {
  const day = store.peek(ui.today.date);
  if (store.sleepingSince) { store.cancelSleep(); undone('Sleep tracking'); }
  else if (day && (day.bed != null || day.wake != null)) { day.bed = null; day.wake = null; save(); undone("Last night's sleep"); }
};
A.sleep = async () => {
  const s = store;
  if (!s.sleepingSince) { buzz(30); s.startSleep(); toast('🌙 Sleep tracking on. Tap again when you wake up.'); return; }
  const r = s.previewWake();
  let asNap = false;
  if (r.minutes < 10) { s.cancelSleep(); toast('Under 10 min, not logged'); return; }
  if (r.minutes > 16 * 60 || r.replaces) {
    const hrs = hm(r.minutes / 60);
    const acts = [{ label: 'Keep tracking', value: null }];
    if (r.replaces) acts.push({ label: `Nap (+${Math.min(12, Math.max(1, Math.round(r.minutes / 60)))} h)`, value: 'nap' });
    acts.push({ label: r.replaces ? 'Replace' : 'Log it', kind: 'filled', value: 'night' });
    const choice = await dialog({
      title: `Slept ${hrs}?`,
      body: esc(r.replaces ? 'This morning already has a sleep logged. Is this a nap, or should it replace that?'
        : 'That is a long one. Forgot to tap when you woke? You can fix the times after.'),
      actions: acts,
    });
    if (choice == null) return;
    asNap = choice === 'nap';
    if (choice === 'night' && r.minutes > 16 * 60) ui.today.editSleep = true;
  }
  buzz(30);
  s.wakeUp({ asNap });
  toast(asNap ? '💤 Logged as nap' : `☀️ Slept ${hm(r.minutes / 60)} (${ampm(hmOf(r.start))} to ${ampm(hmOf(r.end))})`);
};
A.weight = async () => {
  const day = store.peek(ui.today.date);
  const w = await askNumber('Weight', day?.weight ?? store.latestWeight(), 'kg');
  if (w == null) return;
  if (w <= 20 || w >= 400) { toast('That does not look like a weight in kg'); return; }
  tday().weight = w; save();
};
LP.weightUndo = () => { if (tday().weight == null) return; tday().weight = null; save(); undone('Weight'); };
A.foodQty = async ds => {
  const f = tday().food.find(e => e.id === ds.id); if (!f) return;
  const q = await askNumber(`How many? (${f.unit})`, f.qty);
  if (q != null && q > 0) { f.qty = q; save(); }
};
LP.foodLess = ds => {
  const d = tday(), f = d.food.find(e => e.id === ds.id); if (!f) return;
  if (f.qty > 1) f.qty -= 1; else d.food = d.food.filter(e => e.id !== f.id);
  save(); undone('1 × ' + f.name);
};
function deleteFood(id) { const d = tday(); d.food = d.food.filter(e => e.id !== id); save(); }
A.planTap = ds => logPlan(gymPlans.find(p => p.id === ds.id), true);
LP.planTap = A.planTap;
function logPlan(p, toggle) {
  const d = tday();
  const ex = d.sessions.filter(x => x.planId === p.id);
  if (ex.length && !toggle) return;
  if (ex.length) { d.sessions.splice(d.sessions.lastIndexOf(ex[ex.length - 1]), 1); toast(`${p.name} removed`); }
  else { d.sessions.push({ id: newId(), type: p.name, minutes: p.minutes, notes: '', planId: p.id }); toast(`${p.emoji} ${p.name} logged`); }
  save();
}

// ---------- time picker sheet ----------
function pickTime(title, initial, set) {
  let h = parseInt(initial.substring(0, 2), 10), minute = parseInt(initial.substring(3, 5), 10);
  let pm = h >= 12, hour12 = h % 12 === 0 ? 12 : h % 12;
  const value = () => `${pad((hour12 % 12) + (pm ? 12 : 0))}:${pad(minute)}`;
  const layer = openLayer('sheet', '');
  const draw = () => {
    layer.box.innerHTML = `<div class='grab'></div><div class='sb ampm' style='padding:16px 16px calc(16px + var(--safeB))'>
      <div style='font-size:16px;font-weight:500'>${esc(title)}</div>
      <div style='font-size:28px;font-weight:700;margin:4px 0 12px'>${ampm(value())}</div>
      <div class='grid'>${Array.from({ length: 12 }, (_, i) => `<button class='c ${hour12 === i + 1 ? 'on' : ''}' data-h='${i + 1}'>${i + 1}</button>`).join('')}</div>
      <div class='row' style='gap:6px;margin-top:10px'>${[0, 15, 30, 45].map(m => `<button class='c grow ${minute === m ? 'on' : ''}' data-m='${m}'>:${pad(m)}</button>`).join('')}</div>
      <div class='row' style='gap:6px;margin-top:10px'><button class='c grow ${!pm ? 'on' : ''}' data-p='0'>AM</button><button class='c grow ${pm ? 'on' : ''}' data-p='1'>PM</button></div>
      <button class='filled big' style='margin-top:14px' data-save>Save</button></div>`;
  };
  draw();
  layer.box.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.h) hour12 = +b.dataset.h;
    else if (b.dataset.m) minute = +b.dataset.m;
    else if (b.dataset.p) pm = b.dataset.p === '1';
    else if ('save' in b.dataset) { set(value()); save(); closeLayer(layer); return; }
    draw();
  });
}

// ---------- gym plan sheet ----------
A.planOpen = ds => {
  const p = gymPlans.find(x => x.id === ds.id);
  const ex = p.exercises.map(e => `<div class='row' style='align-items:flex-start;padding:8px 0;gap:10px'>
      <div style='width:34px;padding:3px 0;border-radius:6px;background:rgba(255,179,176,.15);text-align:center;font-weight:800;flex:none'>${e.tag}</div>
      <div class='grow'><div class='w600' style='font-size:15px'>${esc(e.name)}</div>
      <div class='muted'>${esc([e.sets, e.rest ? 'rest ' + e.rest : null].filter(Boolean).join(' · '))}</div>
      ${e.tip ? `<div class='small' style='font-style:italic;color:var(--primary)'>${esc(e.tip)}</div>` : ''}</div></div><div class='divider full'></div>`).join('');
  const layer = openLayer('sheet', `<div class='grab'></div><div class='sb' style='padding:16px 16px 8px'>
      <div style='font-size:24px;font-weight:800'>${p.emoji} ${esc(p.name)}</div><div class='muted'>${esc(p.focus)} · ~${p.minutes} min</div>
      <div style='height:12px'></div>${ex}
      <div style='margin-top:12px;padding:12px;border-radius:10px;background:rgba(255,171,64,.15);font-weight:600'>🔥 Finisher: ${esc(p.finisher)}</div>
      <div class='w700' style='margin-top:16px'>Rules</div>${gymRules.map(r => `<div style='font-size:13px;margin-top:4px'>• ${esc(r)}</div>`).join('')}</div>
    <div class='sf'><button class='filled big' data-done>${ic('check', 's18')}Done: tap in ${esc(p.name)}</button></div>`, { tall: '88%' });
  layer.box.querySelector('[data-done]').addEventListener('click', () => { logPlan(p, false); closeLayer(layer); });
};

// ---------- food picker ----------
A.foodPicker = () => {
  const date = ui.today.date;
  const st = { query: '', category: 'Libido', added: new Map(), cheatConfirmed: false };
  const all = () => [...store.myFoods, ...builtInFoods];
  const layer = openLayer('sheet', `<div class='grab'></div>
    <label class='search'>${ic('search')}<input id='fq' type='search' placeholder='Search foods' autocomplete='off' autocorrect='off' enterkeyhint='search'></label>
    <div id='ftabs'></div><div style='height:6px;flex:none'></div><div class='sb' id='flist'></div>
    <div class='sf'><button class='outlined w100' data-custom>${ic('note', 's18')}Custom food</button></div>`, { tall: '85%' });
  const box = layer.box;
  const list = () => {
    const a = all(), q = st.query.toLowerCase();
    if (q) return a.filter(f => f.name.toLowerCase().includes(q));
    if (st.category === 'General') return a.filter(f => generalSections.includes(f.category));
    if (st.category === 'Cheat meal') return a.filter(f => f.category === 'Cheat');
    if (st.category === 'Filipino') return a.filter(f => f.category.startsWith(filipinoPrefix));
    return a.filter(f => f.category === st.category);
  };
  let current = [];
  const drawTabs = () => {
    $('#ftabs', box).innerHTML = st.query ? '' : `<div class='ftabs'>${foodTabs.map(c => `<button class='ftab ${st.category === c ? 'on' : ''}' data-cat='${esc(c)}'>
      <div class='e'>${categoryEmoji[c] || ''}</div><div class='l'>${c === 'Cheat meal' ? 'Cheat' : esc(c)}</div></button>`).join('')}</div>`;
  };
  const drawList = (keepScroll) => {
    const el = $('#flist', box), top = el.scrollTop;
    const items = list();
    current = items;
    if (!items.length) {
      el.innerHTML = `<div style='padding:24px;text-align:center'>${st.category === 'My foods' && !st.query ? 'No saved foods yet. Use "Custom food" below and tick "save".' : 'No match. Use "Custom food" below.'}</div>`;
      return;
    }
    const rows = [];
    const q = st.query, c = st.category;
    if (!q && c === 'Libido') for (const g of libidoGroups) { const it = items.filter(f => f.group === g); if (it.length) rows.push(`${groupEmoji[g]}  ${g}`, ...it); }
    else if (!q && c === 'General') for (const g of generalSections) { const it = items.filter(f => f.category === g); if (it.length) rows.push(`${categoryEmoji[g]}  ${g}`, ...it); }
    else if (!q && c === 'Filipino') for (const g of filipinoSections) { const it = items.filter(f => f.category === filipinoPrefix + g); if (it.length) rows.push(`${filipinoEmoji[g]}  ${g}`, ...it); }
    else if (!q && c === 'Cheat meal') {
      const used = store.cheatDayInWeek(date);
      rows.push(used == null ? '🍕  1 cheat meal a week · aim ~500 kcal · available' : `🍕  Already used this week (${niceDate(used)})`, ...items);
    } else rows.push(...items);
    el.innerHTML = rows.map((r, i) => {
      if (typeof r === 'string') return `<div class='grphdr ${i === 0 ? 'first' : ''}'>${esc(r)}</div>`;
      const n = st.added.get(r.name)?.qty ?? 0;
      const nextIsItem = i + 1 < rows.length && typeof rows[i + 1] !== 'string';
      return `<div class='frow tap' data-fi='${items.indexOf(r)}'><div class='em'>${foodEmoji(r.name)}${r.group ? ic('star') : ''}</div>
        <div class='grow'><div class='nm'>${esc(r.name)}</div><div class='small muted'>per ${esc(r.unit)}</div>
        <div><span class='tag s'>${fmt(r.kcal)} kcal</span><span class='tag'>P ${fmt(r.protein, 1)}g</span><span class='tag'>C ${fmt(r.carbs, 1)}g</span><span class='tag'>F ${fmt(r.fat, 1)}g</span></div>
        ${r.why ? `<div class='why'>★ ${esc(r.why)}</div>` : ''}</div>
        ${n > 0 ? `<div class='cnt'>×${fmt(n)}</div>` : `<div style='margin-top:10px' class='muted'>${ic('addc')}</div>`}</div>
        ${nextIsItem ? `<div class='divider' style='margin:0 16px 0 72px'></div>` : ''}`;
    }).join('');
    if (keepScroll) el.scrollTop = top;
  };
  const pick = async p => {
    const cheat = p.category === 'Cheat';
    if (cheat && !st.cheatConfirmed) {
      const used = store.cheatDayInWeek(date);
      if (used != null && !sameDate(used, date)) {
        const ok = await confirmBox('Cheat meal already used', `You had your cheat meal on ${niceDate(used)}. Log another one anyway?`);
        if (!ok) return;
      }
      st.cheatConfirmed = true;
    }
    const ex = st.added.get(p.name);
    if (ex) ex.qty += 1;
    else {
      const e = { id: newId(), name: p.name, unit: p.unit, qty: 1, kcal: p.kcal, protein: p.protein, carbs: p.carbs, fat: p.fat, group: p.group, cheat };
      store.day(date).food.push(e); st.added.set(p.name, e);
    }
    save(); drawList(true);
    const q = st.added.get(p.name).qty;
    toast(`${foodEmoji(p.name)} ${fmt(q, 1)} × ${p.name} · ${fmt(p.kcal * q)} kcal`);
  };
  const unpick = p => {
    const e = st.added.get(p.name); if (!e) return;
    buzz(30);
    if (e.qty > 1) e.qty -= 1;
    else { const d = store.day(date); d.food = d.food.filter(x => x.id !== e.id); st.added.delete(p.name); }
    save(); drawList(true);
  };
  box._lp = el => { const r = el.closest('[data-fi]'); if (r) unpick(current[+r.dataset.fi]); };
  drawTabs(); drawList();
  $('#fq', box).addEventListener('input', e => { st.query = e.target.value; drawTabs(); drawList(); });
  box.addEventListener('click', e => {
    if (lpSuppressClick) return;
    const t = e.target.closest('[data-cat]'); if (t) { st.category = t.dataset.cat; drawTabs(); drawList(); $('#flist', box).scrollTop = 0; return; }
    const r = e.target.closest('[data-fi]'); if (r) { pick(current[+r.dataset.fi]); return; }
    if (e.target.closest('[data-custom]')) customFood(date).then(added => { if (added) closeLayer(layer); });
  });
};

function customFood(date) {
  let saveIt = date == null;
  const f = (id, label, num = true) => `<label class='field'><span>${label}</span><input id='${id}' type='text' ${num ? `inputmode="decimal"` : `autocapitalize="sentences"`} autocomplete='off' ${id === 'cfName' ? 'autofocus' : ''} ${id === 'cfQty' ? `value="1"` : ''}></label>`;
  const p = dialog({
    title: date == null ? 'New saved food' : 'Custom food',
    body: f('cfName', 'Name', false) + f('cfKcal', 'Calories (per serving)') + f('cfP', 'Protein g (per serving)') + f('cfF', 'Fat g (per serving)') +
      f('cfC', 'Carbs g (optional)') + (date != null ? f('cfQty', 'Servings') +
      `<div class='check tap' id='cfSave'><div class='bx'></div><div>Save to My foods</div></div>` : ''),
    actions: [
      { label: 'Cancel', value: false },
      {
        label: 'Add', kind: 'filled', run: b => {
          const n = $('#cfName', b).value.trim(), k = parseNum($('#cfKcal', b).value);
          if (!n || k == null || k < 0) { toast('Name and calories are needed'); return undefined; }
          const p = parseNum($('#cfP', b).value) ?? 0, fa = parseNum($('#cfF', b).value) ?? 0, c = parseNum($('#cfC', b).value) ?? 0;
          const q = date != null ? (parseNum($('#cfQty', b).value) ?? 1) : 1;
          if (p < 0 || fa < 0 || c < 0 || q <= 0) { toast('Numbers have to be positive'); return undefined; }
          if (date != null) saveIt = $('#cfSave', b).classList.contains('on');
          if (saveIt) store.myFoods.push({ category: 'My foods', name: n, unit: 'serving', kcal: k, protein: p, carbs: c, fat: fa, group: null, why: null });
          if (date != null) store.day(date).food.push({ id: newId(), name: n, unit: 'serving', qty: q, kcal: k, protein: p, carbs: c, fat: fa, group: null, cheat: false });
          save(); return true;
        },
      },
    ],
  });
  const box = layers[layers.length - 1].box;
  const cb = $('#cfSave', box);
  if (cb) cb.addEventListener('click', () => { cb.classList.toggle('on'); cb.querySelector('.bx').innerHTML = cb.classList.contains('on') ? ic('check', 's16') : ''; });
  return p.then(v => v === true);
}

// ================= PROGRESS =================
const RAG = { green: '#30A46C', amber: '#F5A524', red: '#E5484D', none: '#6B6B73' };
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function chartSvg(points, goal, { fixedLo, fixedHi, height }) {
  const W = Math.max(200, Math.min(window.innerWidth, 600) - 24 - 28), H = height;
  const padL = 34, padB = 18, padT = 6;
  const w = W - padL, h = H - padB - padT;
  const vals = points.map(p => p[1]);
  let lo = Math.min(Math.min(...vals), goal ?? Infinity) - 1, hi = Math.max(...vals) + 1;
  if (hi - lo < 4) hi = lo + 4;
  if (fixedLo != null) lo = fixedLo;
  if (fixedHi != null) hi = fixedHi;
  const t0 = +points[0][0], t1 = Math.max(+points[points.length - 1][0], t0 + 1);
  const X = d => padL + (+d - t0) / (t1 - t0) * w, Y = v => padT + (hi - v) / (hi - lo) * h;
  let s = `<svg class='chart' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'>`;
  for (let i = 0; i <= 3; i++) {
    const v = lo + (hi - lo) * i / 3, y = Y(v);
    s += `<line x1='${padL}' x2='${W}' y1='${y}' y2='${y}' stroke='rgba(215,193,192,.2)'/><text x='0' y='${y + 3.5}'>${v.toFixed(0)}</text>`;
  }
  if (goal != null) s += `<line x1='${padL}' x2='${W}' y1='${Y(goal)}' y2='${Y(goal)}' stroke='rgba(105,240,174,.6)' stroke-dasharray='4 4'/>`;
  s += `<polyline fill='none' stroke='var(--primary)' stroke-width='2.5' stroke-linejoin='round' points='${points.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')}'/>`;
  s += points.map(p => `<circle cx='${X(p[0])}' cy='${Y(p[1])}' r='3' fill='var(--primary)'/>`).join('');
  return s + '</svg>';
}

function renderProgress() {
  const s = store;
  const ws = s.weights();
  const libs = [];
  for (const k of Object.keys(s.days)) { const sc = libidoScore(s.days[k]); if (sc != null) libs.push([parseDayKey(k), sc]); }
  libs.sort((a, b) => a[0] - b[0]);
  const cutoff = new Date(Date.now() - 60 * 864e5);
  const recent = libs.filter(e => e[0] > cutoff);
  const current = ws.length ? ws[ws.length - 1][1] : null;
  const lost = current == null ? 0 : s.startWeight - current;
  const total = s.startWeight - s.goalWeight;
  const today = dateOnly(new Date());

  // weekly rows, last 6 weeks
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const start = addDays(weekStart(today), -7 * w);
    let kcal = 0, prot = 0, logged = 0, gym = 0, units = 0, porn = 0, mb = 0, checked = 0, pouches = 0, pornX = 0, mbX = 0, naps = 0, power = 0, caf = 0;
    const lib = [], sleeps = [], wts = [];
    for (let i = 0; i < 7; i++) {
      const d = s.peek(addDays(start, i)); if (!d) continue;
      gym += d.sessions.length; units += d.units;
      if (d.weight != null) wts.push(d.weight);
      const sc = libidoScore(d); if (sc != null) lib.push(sc);
      if (d.porn != null || d.mb != null) checked++;
      if (d.porn === true) porn++;
      if (d.mb === true) mb++;
      pornX += d.pornTimes?.length ?? 0; mbX += d.mbTimes?.length ?? 0;
      naps += d.napHours; power += d.powerNaps.length; pouches += d.pouches.length; caf += d.caffeineMg;
      if (d.sleepHours != null) sleeps.push(d.sleepHours);
      if (d.food.length) { logged++; kcal += d.kcal; prot += d.protein; }
    }
    const avg = l => l.reduce((a, b) => a + b, 0) / l.length;
    const avgW = wts.length ? avg(wts) : null;
    const sub = [
      naps > 0 ? `naps ${naps}h` : null, power > 0 ? `${power} power naps` : null,
      sleeps.length ? `sleep ${fmt(avg(sleeps), 1)}h` : null, lib.length ? `libido ${fmt(avg(lib))}/100` : null,
      checked > 0 ? `porn ${pornX}× (${porn} d), M ${mbX}× (${mb} d)` : null, `Gym ${gym}/${s.gymPerWeek}`,
      logged > 0 ? `avg ${fmt(kcal / logged)} kcal, ${fmt(prot / logged)} g protein` : null, `${fmt(units, 1)} units`,
      caf > 0 ? `caffeine ${fmt(caf / 7)} mg/day` : null, pouches > 0 ? `${pouches} pouches` : null,
    ].filter(Boolean).join(' · ');
    weeks.push(`<div class='lt pad'><div class='grow'><div class='tt'>${w === 0 ? 'This week' : 'Week of ' + niceDate(start)}</div><div class='st'>${esc(sub)}</div></div>
      <div>${avgW == null ? '–' : fmt(avgW, 1) + ' kg'}</div></div>`);
  }

  // KPI board
  const kpis = computeKpis(s, new Date());
  const n = r => kpis.filter(k => k.rag === r).length;
  const reds = kpis.filter(k => k.rag === 'red');
  const groups = [...new Set(kpis.map(k => k.group))];
  const chip = (r, label) => `<div class='chip' style='background:${rgba(RAG[r], .18)};color:${RAG[r]}'>${n(r)} ${label}</div>`;
  let kb = `<div class='chips'>${chip('green', 'on track')}${chip('amber', 'slipping')}${chip('red', 'off track')}</div>`;
  if (reds.length) kb += `<div class='card' style='background:${rgba(RAG.red, .12)};padding:12px'><div class='w800' style='color:${RAG.red}'>🚨 Fix these first</div>
    ${reds.map(k => `<div style='font-size:13px;margin-top:3px'>${k.emoji} ${esc(k.label)}: ${esc(k.value)} (goal ${esc(k.goal)})</div>`).join('')}</div>`;
  for (const g of groups) {
    kb += `<div class='kgrp'>${g.toUpperCase()}</div><div class='kgrid'>${kpis.filter(k => k.group === g).map(k => {
      const c = RAG[k.rag];
      return `<div class='kpi' style='background:${k.rag === 'none' ? 'var(--sc)' : rgba(c, .14)};border-color:${rgba(c, k.rag === 'none' ? .3 : .8)}'>
        <div class='row' style='gap:6px'><span style='font-size:16px'>${k.emoji}</span><span class='l grow'>${esc(k.label)}</span><span class='dot' style='background:${c}'></span></div>
        <div class='v'>${esc(k.value)}</div><div class='g'>goal ${esc(k.goal)}</div></div>`;
    }).join('')}</div>`;
  }
  kb += `<div style='height:8px'></div>`;

  // insights
  const ins = libidoInsights(s);
  const ready = ins.filter(i => i.diff != null).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const waiting = ins.filter(i => i.diff == null);
  const insHtml = `<div class='card' style='padding:14px'><div style='font-size:16px;font-weight:600'>What moves your libido</div>
    <div class='small muted' style='margin-top:4px'>Your score on days with vs without each thing. Your own data, so it is a pattern, not proof.</div><div style='height:10px'></div>
    ${ready.map(i => { const c = i.diff >= 0 ? '#4CAF50' : '#FFAB40'; return `<div class='ins'><span style='font-size:20px'>${i.emoji}</span><span class='grow'>${esc(i.label)}</span>
      <span class='delta' style='background:${rgba(c, .2)};color:${c}'>${i.diff >= 0 ? '+' : ''}${fmt(i.diff)} pts</span></div>`; }).join('')}
    ${waiting.length ? `${ready.length ? `<div class='divider full' style='margin:8px 0'></div>` : ''}${waiting.map(i => `<div class='small muted' style='padding:3px 0'>${i.emoji}  ${esc(i.label)}: ${esc(i.detail)}</div>`).join('')}` : ''}</div>`;

  return `<div class='h-page'>Progress</div>${kb}
    <div class='card' style='padding:14px'><div class='stat3'>
      <div><div class='l'>Start</div><div class='v'>${fmt(s.startWeight, 1)} kg</div></div>
      <div><div class='l'>Now</div><div class='v'>${current == null ? '–' : fmt(current, 1) + ' kg'}</div></div>
      <div><div class='l'>Goal</div><div class='v'>${fmt(s.goalWeight, 1)} kg</div></div></div>
      <div style='height:12px'></div>${meter('Lost so far', `${fmt(lost, 1)} of ${fmt(total, 1)} kg`, total <= 0 ? 0 : lost / total, false)}
      <div style='height:16px'></div><div style='height:180px;display:flex;align-items:center;justify-content:center'>${ws.length < 2 ? `<span class='small'>Log your weight on 2+ days to see the trend.</span>` : chartSvg(ws, s.goalWeight, { height: 180 })}</div></div>
    <div class='card' style='padding:14px'><div style='font-size:16px;font-weight:600'>Libido score (last 60 days)</div><div style='height:12px'></div>
      <div style='height:150px;display:flex;align-items:center;justify-content:center'>${recent.length < 2 ? `<span class='small' style='text-align:center'>Log libido on the Today screen for 2+ days to see the trend.</span>` : chartSvg(recent, null, { fixedLo: 0, fixedHi: 100, height: 150 })}</div></div>
    ${insHtml}<div class='card'>${weeks.join('')}</div>`;
}

// ================= LOG =================
function eventsFor(s, d) {
  const out = [];
  const E = (time, emoji, title, detail) => out.push({ time, emoji, title, detail });
  for (const f of d.food) E(d.stampTime(f.id), foodEmoji(f.name), `${f.name}${f.group != null ? ' ★' : ''}${f.cheat ? ' (cheat)' : ''}`,
    `${fmt(f.qty, 1)} × ${f.unit} · ${fmt(fTot(f, 'kcal'))} kcal · P ${fmt(fTot(f, 'protein'))} g`);
  for (const c of d.caffeine) E(c.time, '⚡', c.name, `${fmt(c.mg)} mg caffeine · ${fmt(c.kcal)} kcal`);
  for (const t of d.pouches) E(t, '🟦', 'Velo pouch', `${fmt(nicotineMg)} mg nicotine`);
  for (const x of d.drinks) E(d.stampTime(x.id), x.name.includes('Smirnoff') ? '🥃' : '🍺', x.name, `${fmt(x.units, 1)} units · ${fmt(x.kcal)} kcal`);
  for (const x of d.sessions) E(d.stampTime(x.id), '🏋️', 'Gym: ' + x.type, `${x.minutes} min`);
  for (const [name, time] of Object.entries(d.supps)) E(time, '💊', name, 'taken');
  if (d.reta != null) E(d.reta, '💉', retaName, 'weekly shot');
  for (const [id, time] of Object.entries(d.medsTaken)) { const m = s.meds.find(m => m.id === id); E(time, '💊', m ? m.name : 'Pill', m ? m.dose : ''); }
  if (d.bed != null) E(d.bed, '🌙', 'Went to bed', 'last night');
  if (d.wake != null) { const h = d.sleepHours; E(d.wake, '☀️', 'Woke up', h == null ? '' : `slept ${fmt(h, 1)} h`); }
  if (d.weight != null) E(d.stampTime('weight'), '⚖️', 'Weight', `${fmt(d.weight, 1)} kg`);
  if (d.morningWood != null) E(d.stampTime('morningWood'), '🌅', 'Morning erection', d.morningWood ? 'Yes' : 'No');
  if (d.erection != null) E(d.stampTime('erection'), '💪', 'Erections', ['Weak', 'OK', 'Strong'][d.erection] ?? '');
  const counted = (times, emoji, title) => {
    if (times == null) return;
    if (!times.length) { E(null, emoji, title, 'none today'); return; }
    times.forEach((t, i) => E(t === '' ? null : t, emoji, title, `#${i + 1} today`));
  };
  for (const t of d.powerNaps) E(t, '⏰', 'Power nap', `${POWER_NAP_MIN} min, alarm set`);
  if (d.naps.length) E(d.naps[0], '💤', 'Nap', `${d.napHours} h total today`);
  counted(d.pornTimes, '📺', 'Watched porn');
  counted(d.mbTimes, '✋', 'Masturbated');
  // bedtime belongs to the previous evening: put it first
  const key = e => {
    if (e.title === 'Went to bed') return -1;
    const t = e.time;
    if (t == null || t.length < 5) return 99999;
    const h = parseInt(t.substring(0, 2), 10), m = parseInt(t.substring(3, 5), 10);
    return isNaN(h) || isNaN(m) ? 99999 : h * 60 + m;
  };
  return out.map((e, i) => [e, i]).sort((a, b) => key(a[0]) - key(b[0]) || a[1] - b[1]).map(x => x[0]);
}
function renderLog() {
  const L = ui.log, s = store, now = dateOnly(new Date());
  if (!L.pinned && !sameDate(L.date, now)) L.date = now;
  const d = s.peek(L.date) || new DayLog();
  const ev = eventsFor(s, d);
  const isToday = sameDate(L.date, now);
  const stat = (l, v) => `<div><div class='v'>${v}</div><div class='l'>${l}</div></div>`;
  return `<div class='datebar'><button class='iconbtn' data-a='lShift' data-n='-1'>${ic('cl')}</button>
    <div class='mid'><div class='kicker'>LOG</div><div class='title-l'>${esc(niceDate(L.date))}</div></div>
    <button class='iconbtn' data-a='lShift' data-n='1' ${isToday ? 'disabled' : ''}>${ic('cr')}</button></div>
    <div class='card lstats'>${stat('kcal', fmt(d.kcal))}${stat('protein g', fmt(d.protein))}${stat('fat g', fmt(d.fat))}${stat('caffeine mg', fmt(d.caffeineMg))}${stat('units', fmt(d.units, 1))}${stat('pouches', d.pouches.length)}</div>
    <div class='card'>${!ev.length ? `<div style='padding:24px;text-align:center'>Nothing logged on this day.</div>`
      : ev.map((e, i) => `<div class='lev'><div class='tm'>${e.time == null ? '-' : ampm(e.time)}</div><div class='grow'><div style='font-size:16px'>${e.emoji}  ${esc(e.title)}</div>
        ${e.detail ? `<div class='small muted'>${esc(e.detail)}</div>` : ''}</div></div>${i < ev.length - 1 ? `<div class='divider full' style='margin:0 16px'></div>` : ''}`).join('')}</div>`;
}
A.lShift = ds => {
  const L = ui.log, n = +ds.n;
  if (n > 0 && sameDate(L.date, dateOnly(new Date()))) return;
  L.date = addDays(L.date, n); L.pinned = !sameDate(L.date, dateOnly(new Date())); render();
};

// ================= SETUP =================
const NUMS = {
  kcal: ['Daily calorie max', 'kcalTarget', 'kcal', 0, 800], prot: ['Daily protein', 'proteinTarget', 'g', 0, 20],
  fat: ['Daily fat minimum', 'fatMin', 'g', 0, 0], gym: ['Gym sessions per week', 'gymPerWeek', '', 0, 1],
  alc: ['Alcohol limit per week', 'unitsPerWeek', 'units', 0, 0], start: ['Start weight', 'startWeight', 'kg', 1, 30],
  goal: ['Goal weight', 'goalWeight', 'kg', 1, 30],
};
function renderSetup() {
  const s = store;
  const numTile = k => { const [label, f, suf, dp] = NUMS[k]; return `<div class='lt tap' data-a='setNum' data-k='${k}'><div class='grow tt'>${label}</div><div style='font-size:14px;font-weight:500'>${fmt(s[f], dp)} ${suf}</div></div>`; };
  const meds = s.meds.length ? s.meds.map(m => `<div class='lt tap' data-a='medEdit' data-id='${esc(m.id)}'><span class='muted'>${ic(m.kind === 'injection' ? 'vacc' : 'med')}</span>
      <div class='grow'><div class='tt'>${esc(m.name)}</div><div class='st'>${esc([m.dose || null, m.frequency === 'weekly' ? 'every ' + DAYNAMES[m.weekday - 1] : m.frequency].filter(Boolean).join(' · '))}</div></div></div>`).join('')
    : emptyLine('Reta 3 mg is built in on the Today screen. Add pills here only if you take any.');
  const foods = s.myFoods.length ? s.myFoods.map((f, i) => `<div class='lt'><div class='grow'><div class='tt'>${esc(f.name)}</div><div class='st'>${fmt(f.kcal)} kcal · ${fmt(f.protein, 1)} g protein</div></div>
      <button class='iconbtn' data-a='myFoodDel' data-i='${i}'>${ic('del')}</button></div>`).join('')
    : emptyLine('Foods you eat often that are not in the built-in list.');
  return `<div class='h-page'>Setup</div>
    ${section({ title: 'Targets', icon: 'flag', body: Object.keys(NUMS).map(numTile).join('') })}
    ${section({ title: 'Other pills (optional)', icon: 'med', add: 'medNew', body: meds })}
    ${section({ title: 'My foods', icon: 'bookmark', add: 'myFoodNew', body: foods })}
    ${section({ title: 'Backup', icon: 'save', body: `
      <div class='lt tap' data-a='backupCopy'><span class='muted'>${ic('copy')}</span><div class='grow'><div class='tt'>Copy backup</div><div class='st'>Copies all your data. Paste it into a note or email to yourself.</div></div></div>
      <div class='lt tap' data-a='backupRestore'><span class='muted'>${ic('paste')}</span><div class='grow'><div class='tt'>Restore from clipboard</div><div class='st'>Replaces everything in the app with the copied backup.</div></div></div>` })}
    <div class='small muted' style='padding:16px'>Calories for presets are typical estimates. Everything stays on this phone.</div>`;
}
A.setNum = async ds => {
  const [label, f, suf, , min] = NUMS[ds.k];
  const v = await askNumber(label, store[f], suf);
  if (v == null) return;
  if (v < min || (min > 0 && v === 0)) { toast(`Has to be at least ${fmt(min)}`); return; }
  store[f] = ds.k === 'gym' ? Math.min(14, Math.max(1, dround(v))) : v;
  save();
};
A.myFoodNew = () => customFood(null);
A.myFoodDel = async ds => {
  const f = store.myFoods[+ds.i];
  if (await confirmBox('Delete food?', f.name)) { store.myFoods.splice(+ds.i, 1); save(); }
};
A.medNew = () => medDialog(null);
A.medEdit = ds => medDialog(store.meds.find(m => m.id === ds.id));
function medDialog(med) {
  const st = { kind: med?.kind ?? 'pill', frequency: med?.frequency ?? 'daily', weekday: med?.weekday ?? dartWeekday(new Date()) };
  const editing = !!med;
  const acts = [];
  if (editing) acts.push({ label: 'Delete', run: () => { confirmBox('Delete?', med.name).then(ok => { if (ok) { store.meds = store.meds.filter(m => m.id !== med.id); save(); closeLayer(layers[layers.length - 1]); } }); return undefined; } });
  acts.push({ label: 'Cancel', value: null });
  acts.push({
    label: 'Save', kind: 'filled', run: b => {
      const n = $('#mName', b).value.trim();
      if (!n) { toast('Give it a name'); return undefined; }
      const m = med || { id: newId(), name: n };
      Object.assign(m, { name: n, dose: $('#mDose', b).value.trim(), kind: st.kind, frequency: st.frequency, weekday: st.weekday });
      if (!editing) store.meds.push(m);
      save(); return true;
    },
  });
  const p = dialog({
    title: editing ? 'Edit' : 'Add injection or pill',
    body: `<div class='seg' id='mKind'></div>
      <label class='field'><span>Name</span><input id='mName' type='text' autocapitalize='sentences' autocomplete='off' value='${esc(med?.name ?? '')}'></label>
      <label class='field'><span>Dose (optional)</span><input id='mDose' type='text' autocomplete='off' value='${esc(med?.dose ?? '')}'></label>
      <div style='margin:12px 0 6px;color:var(--onSurface)'>How often</div><div class='cchips' id='mFreq'></div><div class='cchips' id='mDay' style='margin-top:8px'></div>`,
    actions: acts,
  });
  const box = layers[layers.length - 1].box;
  const draw = () => {
    $('#mKind', box).innerHTML = [['pill', 'Pill'], ['injection', 'Injection']].map(([v, l]) => `<button data-kind='${v}' class='${st.kind === v ? 'on' : ''}'>${l}</button>`).join('');
    $('#mFreq', box).innerHTML = ['daily', 'weekly', 'as needed'].map(f => `<button class='cchip ${st.frequency === f ? 'on' : ''}' data-freq='${f}'>${f}</button>`).join('');
    $('#mDay', box).innerHTML = st.frequency !== 'weekly' ? '' : DAYNAMES.map((d, i) => `<button class='cchip ${st.weekday === i + 1 ? 'on' : ''}' data-wd='${i + 1}'>${d.substring(0, 3)}</button>`).join('');
  };
  draw();
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.kind) st.kind = b.dataset.kind; else if (b.dataset.freq) st.frequency = b.dataset.freq; else if (b.dataset.wd) st.weekday = +b.dataset.wd; else return;
    draw();
  });
  return p;
}
A.backupCopy = async () => {
  const text = store.exportJson();
  try { await navigator.clipboard.writeText(text); toast('Backup copied'); }
  catch (_) {
    await dialog({
      title: 'Copy backup', body: `<div style='margin-bottom:8px'>Select all of this text and copy it.</div><label class='field'><textarea id='bk' readonly>${esc(text)}</textarea></label>`,
      actions: [{ label: 'Done', kind: 'filled', value: true }],
    });
  }
};
A.backupRestore = async () => {
  let text = null;
  try { text = await navigator.clipboard.readText(); } catch (_) { text = null; }
  if (text == null) {
    text = await dialog({
      title: 'Restore backup', body: `<div style='margin-bottom:8px'>Paste the backup text here.</div><label class='field'><textarea id='rk' autofocus placeholder='Tap and hold, then Paste'></textarea></label>`,
      actions: [{ label: 'Cancel', value: null }, { label: 'Next', kind: 'filled', run: b => $('#rk', b).value }],
    });
    if (text == null) return;
  }
  if (!await confirmBox('Restore backup?', 'This replaces all current data.')) return;
  try { store.importJson(text || ''); toast('Restored'); }
  catch (_) { toast('Clipboard does not contain a Vice backup'); }
};

// ================= shell =================
const PAGES = [renderToday, renderProgress, renderLog, renderSetup];
function render() {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('p' + i);
    el.classList.toggle('on', i === ui.tab);
    if (i === ui.tab) {
      const top = el.scrollTop;
      el.innerHTML = PAGES[i]();
      el.scrollTop = top;
    }
  }
  document.querySelectorAll('.nav button').forEach((b, i) => {
    b.classList.toggle('on', i === ui.tab);
    const n = ['today', 'chart', 'receipt', 'tune'][i];
    const o = { today: 'today_o', receipt: 'receipt_o' }[n];
    b.querySelector('.ind').innerHTML = ic(i === ui.tab || !o ? n : o);
  });
  const di = document.getElementById('tdate');
  if (di) di.onchange = () => {
    const d = parseDayKey(di.value); if (!d) return;
    const today = dateOnly(new Date());
    ui.today.date = isAfter(d, today) ? today : d; ui.today.pinned = !sameDate(ui.today.date, today); render();
  };
}
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const shareGlyph = () => `<svg viewBox='0 0 24 24' style='width:16px;height:16px;vertical-align:-3px;fill:none;stroke:currentColor;stroke-width:2'><path d='M12 3v12M8 7l4-4 4 4M6 11v9h12v-9'/></svg>`;

// ---------- input: tap, long-press, swipe ----------
let lpTimer = null, lpSuppressClick = false, lpEl = null, lpStart = null;
function lpTarget(t) { return t.closest('[data-lp]') || t.closest('[data-fi]'); }
document.addEventListener('pointerdown', e => {
  lpSuppressClick = false;
  const el = lpTarget(e.target);
  if (!el) return;
  lpEl = el; lpStart = [e.clientX, e.clientY];
  clearTimeout(lpTimer);
  lpTimer = setTimeout(() => {
    lpTimer = null; lpSuppressClick = true;
    el.classList.remove('pressing');
    if (el.dataset.fi != null) { const sheet = el.closest('.sheet'); sheet && sheet._lp && sheet._lp(el); return; }
    const f = LP[el.dataset.lp]; if (f) f(el.dataset, el);
  }, 500);
  el.classList.add('pressing');
}, { passive: true });
const lpCancel = () => { clearTimeout(lpTimer); lpTimer = null; if (lpEl) lpEl.classList.remove('pressing'); };
document.addEventListener('pointermove', e => { if (lpTimer && lpStart && Math.hypot(e.clientX - lpStart[0], e.clientY - lpStart[1]) > 10) lpCancel(); }, { passive: true });
document.addEventListener('pointerup', lpCancel, { passive: true });
document.addEventListener('pointercancel', lpCancel, { passive: true });
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('touchstart', () => {}, { passive: true }); // enables :active on iOS
document.addEventListener('click', e => {
  if (lpSuppressClick) { e.preventDefault(); e.stopPropagation(); lpSuppressClick = false; return; }
  const el = e.target.closest('[data-a]');
  if (!el) return;
  if (el.hasAttribute('disabled')) return;
  const f = A[el.dataset.a];
  if (f) { e.stopPropagation(); f(el.dataset, el); }
}, true);
// swipe left on a food row to delete (like Android's swipe-to-dismiss)
(() => {
  let sw = null;
  document.addEventListener('touchstart', e => {
    const it = e.target.closest('[data-swipe]'); if (!it || e.touches.length !== 1) { sw = null; return; }
    sw = { it, fg: it.querySelector('.fg'), x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, active: false };
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!sw) return;
    const dx = e.touches[0].clientX - sw.x, dy = e.touches[0].clientY - sw.y;
    if (!sw.active) { if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5 && dx < 0) { sw.active = true; lpCancel(); } else if (Math.abs(dy) > 10) { sw = null; return; } else return; }
    sw.dx = Math.min(0, dx); sw.fg.style.transition = 'none'; sw.fg.style.transform = `translateX(${sw.dx}px)`;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', () => {
    if (!sw) return;
    const { it, fg, dx, active } = sw; sw = null;
    if (!active) return;
    lpSuppressClick = true; setTimeout(() => { lpSuppressClick = false; }, 350);
    fg.style.transition = '';
    if (-dx > it.offsetWidth * 0.4) { fg.style.transform = `translateX(-${it.offsetWidth}px)`; setTimeout(() => deleteFood(it.dataset.id), 180); }
    else fg.style.transform = '';
  });
})();

// ---------- boot ----------
function boot() {
  try { ui.hideInstall = localStorage.getItem('vice_hide_install') === '1'; } catch (_) {}
  store.load();
  store.listeners.push(render);
  // iOS Safari only sends taps to plain boxes when an ancestor listens for clicks.
  for (const el of document.querySelectorAll('.page,.nav')) el.addEventListener('click', () => {});
  document.querySelectorAll('.nav button').forEach((b, i) => b.addEventListener('click', () => {
    if (ui.tab === i) return;
    ui.tab = i; render();
  }));
  render();
  if (store.loadFailed) toast("Couldn't read your saved data. A copy was kept safe; message me before logging more.", 8000);
  // Left open overnight? Roll over to the new day. Also keeps the sleep timer fresh.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  setInterval(() => { if (!document.hidden && !layers.length && ui.tab === 0) render(); }, 60000);
  window.addEventListener('resize', () => { if (ui.tab === 1) render(); });
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (_) {}
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
boot();
