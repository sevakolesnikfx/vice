// Gym plans, libido score + insights, KPI board. Ports of gym.dart, libido.dart, kpi.dart.
'use strict';

// Dart's num.round(): halves away from zero.
const dround = v => Math.sign(v) * Math.round(Math.abs(v));
function fmt(v, dp = 0) {
  if (dp === 0) return String(dround(v) || 0);
  const s = v.toFixed(dp);
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function parseNum(s) {
  const t = String(s).trim().replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t)) return null;
  return Number(t);
}
/** "23:40" -> "11:40 PM" */
function ampm(hm) {
  if (!hm || hm.length < 4 || !hm.includes(':')) return hm;
  const h = parseInt(hm.substring(0, 2), 10) || 0;
  const m = hm.length >= 5 ? hm.substring(3, 5) : '00';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

// ---------- gym ----------
// 4 full-body sessions, each under 40 minutes. Any order, any day.
const E = (tag, name, sets, setCount, rest, tip = '') => ({ tag, name, sets, setCount, rest, tip });
const gymRules = [
  'Any order, any day. Every session is full body.',
  'Warm up 4 min (bike or rower), then 1-2 light sets of the first lift.',
  'Superset: do A1, then straight into A2, then rest. Repeat for all sets.',
  'Every set ends 0-2 reps short of failure. Last set of each exercise: to failure (not on squats or deadlifts).',
  'Hit the top of the rep range on every set? Add weight next time.',
  'Rest times are strict. Use a timer.',
  'The finisher is not optional.',
];
const gymPlans = [
  { id: 'fb1', name: 'Full Body 1', emoji: '🏋️', focus: 'Heavy squat + bench', minutes: 38, exercises: [
    E('A1', 'Back squat', '3 × 6-8', 3, '', 'Hack squat or leg press until your squat form is solid'),
    E('A2', 'Chest-supported row', '3 × 8-10', 3, '90 s after the pair'),
    E('B1', 'Barbell bench press', '3 × 6-8', 3, '', 'Machine chest press if no spotter'),
    E('B2', 'Lying leg curl', '3 × 10-12', 3, '75 s after the pair'),
    E('C1', 'Dumbbell lateral raise', '2 × 12-15', 2, ''),
    E('C2', 'Hanging knee raise', '2 × 10-15', 2, '60 s'),
  ], finisher: 'Bike or rower: 6 rounds of 20 s all-out / 40 s easy (6 min)' },
  { id: 'fb2', name: 'Full Body 2', emoji: '💥', focus: 'Heavy deadlift + pull-ups', minutes: 39, exercises: [
    E('A1', 'Trap-bar or conventional deadlift', '3 × 5', 3, '', 'Stop 1-2 reps short. Form first'),
    E('A2', 'Seated dumbbell shoulder press', '3 × 8-10', 3, '2 min after the pair'),
    E('B1', 'Pull-up (assisted if needed)', '3 × 6-10', 3, '', 'Assisted machine or band until you get 6 clean reps'),
    E('B2', 'Bulgarian split squat', '2 × 8-10 each leg', 2, '75 s after the pair'),
    E('C1', 'Incline dumbbell press', '2 × 10-12', 2, ''),
    E('C2', 'Dumbbell curl', '2 × 12-15', 2, '60 s'),
    E('D1', 'Dead bug', '2 × 10', 2, '30 s'),
  ], finisher: 'Rower: 4 × 250 m flat out, 45 s rest. Write the times down and beat them next time' },
  { id: 'fb3', name: 'Full Body 3', emoji: '🔥', focus: 'Leg press + incline press + RDL', minutes: 37, exercises: [
    E('A1', 'Leg press', '3 × 10-12', 3, ''),
    E('A2', 'Lat pulldown', '3 × 10-12', 3, '90 s after the pair'),
    E('B1', 'Incline dumbbell bench press', '3 × 8-10', 3, ''),
    E('B2', 'Romanian deadlift', '3 × 8-10', 3, '90 s after the pair'),
    E('C1', 'Cable face pull', '2 × 15', 2, ''),
    E('C2', 'Standing calf raise', '2 × 12-15', 2, '45 s'),
    E('D1', 'Cable crunch', '2 × 12-15', 2, '45 s'),
  ], finisher: 'Incline treadmill or sled: 5 rounds of 30 s hard / 30 s easy (5 min)' },
  { id: 'fb4', name: 'Full Body 4', emoji: '⚡', focus: 'Hip thrust + rows + dips', minutes: 38, exercises: [
    E('A1', 'Hip thrust', '3 × 8-10', 3, ''),
    E('A2', 'Seated cable row', '3 × 8-10', 3, '90 s after the pair'),
    E('B1', 'Goblet or hack squat', '3 × 10-12', 3, ''),
    E('B2', 'Dips (assisted) or machine chest press', '3 × 8-12', 3, '75 s after the pair'),
    E('C1', 'Dumbbell walking lunge', '2 × 10 each leg', 2, ''),
    E('C2', 'Overhead cable triceps extension', '2 × 10-12', 2, '60 s'),
    E('D1', 'Plank', '2 × 45 s', 2, '30 s'),
  ], finisher: 'Kettlebell swings: EMOM 6 min, 15 swings at the top of every minute' },
];

// ---------- libido ----------
/** 0-100 from morning erection and erection quality, half each. */
function libidoScore(d) {
  let got = 0, max = 0;
  if (d.morningWood != null) { got += d.morningWood ? 50 : 0; max += 50; }
  if (d.erection != null) { got += d.erection / 2 * 50; max += 50; }
  if (max === 0) return null;
  return dround(got / max * 100);
}
function avgScore(s, end, n) {
  const v = [];
  for (let i = 0; i < n; i++) { const d = s.peek(addDays(end, -i)); const sc = d ? libidoScore(d) : null; if (sc != null) v.push(sc); }
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
function morningRate(s, end, n) {
  let yes = 0, all = 0;
  for (let i = 0; i < n; i++) { const d = s.peek(addDays(end, -i)); if (d?.morningWood == null) continue; all++; if (d.morningWood) yes++; }
  return all === 0 ? null : yes / all;
}
const MIN_DAYS = 3;
function libidoInsights(s) {
  const keys = Object.keys(s.days).sort();
  const compare = (emoji, label, test) => {
    const yes = [], no = [];
    for (const k of keys) {
      const d = s.days[k]; const sc = libidoScore(d);
      if (sc == null) continue;
      const y = s.peek(addDays(parseDayKey(k), -1));
      const r = test(d, y);
      if (r == null) continue;
      (r ? yes : no).push(sc);
    }
    const avg = l => l.reduce((a, b) => a + b, 0) / l.length;
    if (yes.length < MIN_DAYS || no.length < MIN_DAYS) {
      const need = Math.max(0, MIN_DAYS - yes.length) + Math.max(0, MIN_DAYS - no.length);
      return { emoji, label, detail: `needs ~${need} more logged days`, diff: null };
    }
    const diff = avg(yes) - avg(no);
    return { emoji, label, detail: `${diff >= 0 ? '+' : ''}${fmt(diff)} pts (${yes.length} vs ${no.length} days)`, diff };
  };
  return [
    compare('😴', 'Slept 7h+ last night', (d) => d.sleepHours == null ? null : d.sleepHours >= 7),
    compare('💤', 'Napped yesterday', (d, y) => y == null ? null : y.naps.length > 0),
    compare('🍺', 'Drank alcohol yesterday', (d, y) => y == null ? null : y.drinks.length > 0),
    compare('📺', 'Watched porn yesterday', (d, y) => y ? y.porn : null),
    compare('✋', 'Masturbated yesterday', (d, y) => y ? y.mb : null),
    compare('🏋️', 'Gym yesterday', (d, y) => y == null ? null : y.sessions.length > 0),
    compare('⭐', 'Ate 3+ libido food groups yesterday', (d, y) => y == null ? null : y.libidoGroupsHit.size >= 3),
    compare('⚡', '300 mg+ caffeine yesterday', (d, y) => y == null ? null : y.caffeineMg >= 300),
  ];
}

// ---------- KPI board ----------
// green = on target, amber = slipping, red = off track, none = not enough data.
const _hi = (v, g, a) => v >= g ? 'green' : (v >= a ? 'amber' : 'red');
const _lo = (v, g, a) => v <= g ? 'green' : (v <= a ? 'amber' : 'red');
const _avg = v => v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
const K = (group, emoji, label, value, goal, rag) => ({ group, emoji, label, value, goal, rag });

function computeKpis(s, now) {
  const today = dateOnly(now);
  const week = []; for (let i = 0; i < 7; i++) week.push(s.peek(addDays(today, -i)));
  const days = week.filter(Boolean);
  const ws = weekStart(today);
  const daysIntoWeek = daysBetween(ws, today) + 1;
  const out = [];

  // body
  const weights = s.weights();
  {
    const recent = weights.filter(e => !(e[0] < addDays(today, -6))).map(e => e[1]);
    const prior = weights.filter(e => e[0] < addDays(today, -6) && !(e[0] < addDays(today, -13))).map(e => e[1]);
    let rate = null;
    if (recent.length && prior.length) rate = _avg(prior) - _avg(recent);
    else if (weights.length >= 2) {
      const span = daysBetween(weights[0][0], weights[weights.length - 1][0]);
      if (span >= 5) rate = (weights[0][1] - weights[weights.length - 1][1]) / span * 7;
    }
    out.push(K('Body', '⚖️', 'Weight loss pace',
      rate == null ? '-' : `${rate >= 0 ? '-' : '+'}${fmt(Math.abs(rate), 1)} kg/wk`, '0.5-1.2 kg/wk',
      rate == null ? 'none' : (rate >= 0.5 && rate <= 1.2) ? 'green'
        : ((rate >= 0.2 && rate < 0.5) || (rate > 1.2 && rate <= 1.6)) ? 'amber' : 'red'));
    const cur = s.latestWeight();
    out.push(K('Body', '🎯', 'To goal',
      cur == null ? '-' : (cur <= s.goalWeight ? 'reached 🎉' : `${fmt(cur - s.goalWeight, 1)} kg left`),
      `${fmt(s.goalWeight, 1)} kg`, 'none'));
  }

  // food
  const fed = days.filter(d => d.food.length);
  if (!fed.length) {
    out.push(K('Food', '🔥', `Days under ${fmt(s.kcalTarget)} kcal`, '-', 'every day', 'none'));
    out.push(K('Food', '🥩', 'Protein (avg)', '-', `${fmt(s.proteinTarget)} g`, 'none'));
    out.push(K('Food', '🫒', 'Fat (avg)', '-', `≥ ${fmt(s.fatMin)} g`, 'none'));
    out.push(K('Food', '⭐', 'Libido food groups (avg)', '-', '3+ a day', 'none'));
  } else {
    const under = fed.filter(d => d.kcal <= s.kcalTarget).length;
    out.push(K('Food', '🔥', `Days under ${fmt(s.kcalTarget)} kcal`, `${under} / ${fed.length}`, 'every day', _hi(under / fed.length, 0.85, 0.7)));
    const p = _avg(fed.map(d => d.protein));
    out.push(K('Food', '🥩', 'Protein (avg)', `${fmt(p)} g`, `${fmt(s.proteinTarget)} g`, _hi(p / s.proteinTarget, 0.9, 0.75)));
    const f = _avg(fed.map(d => d.fat));
    out.push(K('Food', '🫒', 'Fat (avg)', `${fmt(f)} g`, `≥ ${fmt(s.fatMin)} g`, _hi(f, s.fatMin, s.fatMin - 10)));
    const g = _avg(fed.map(d => d.libidoGroupsHit.size));
    out.push(K('Food', '⭐', 'Libido food groups (avg)', `${fmt(g, 1)} / 4`, '3+ a day', _hi(g, 3, 2)));
  }
  {
    let cheats = 0;
    for (let i = 0; i < daysIntoWeek; i++) if (s.peek(addDays(ws, i))?.food.some(f => f.cheat)) cheats++;
    out.push(K('Food', '🍕', 'Cheat meals this week', `${cheats}`, 'max 1', cheats <= 1 ? 'green' : 'red'));
  }

  // training & recovery
  {
    const done = s.sessionsInWeek(today);
    const expected = s.gymPerWeek * (daysIntoWeek - 1) / 7;
    const behind = expected - done;
    const daysLeft = 7 - daysIntoWeek + 1;
    const needed = s.gymPerWeek - done;
    let r;
    if (done >= s.gymPerWeek || behind <= 0.5) r = 'green';
    else if (needed > daysLeft) r = 'red';
    else r = behind <= 1.5 ? 'amber' : 'red';
    out.push(K('Training', '🏋️', 'Gym this week', `${done} / ${s.gymPerWeek}`, needed <= 0 ? 'done' : `${needed} left, ${daysLeft} days to go`, r));
  }
  {
    let naps = 0, power = 0;
    for (let i = 0; i < daysIntoWeek; i++) { const d = s.peek(addDays(ws, i)); naps += d?.napHours ?? 0; power += d?.powerNaps.length ?? 0; }
    out.push(K('Training', '💤', 'Long naps this week', power === 0 ? `${naps} h` : `${naps} h (+${power} power)`,
      'none (35-min power naps are fine)', naps === 0 ? 'green' : (naps <= 2 ? 'amber' : 'red')));
  }
  {
    const a = _avg(days.filter(d => d.sleepHours != null).map(d => d.sleepHours));
    out.push(K('Training', '😴', 'Sleep (7-day avg)', a == null ? '-' : `${fmt(a, 1)} h`, '7 h+', a == null ? 'none' : _hi(a, 7, 6)));
  }

  // libido
  {
    const a = avgScore(s, today, 7);
    out.push(K('Libido', '❤️', 'Libido score (7-day)', a == null ? '-' : `${fmt(a)} / 100`, '70+', a == null ? 'none' : _hi(a, 70, 45)));
    const m = morningRate(s, today, 7);
    out.push(K('Libido', '🌅', 'Morning erections', m == null ? '-' : `${fmt(m * 100)}%`, '70%+ of mornings', m == null ? 'none' : _hi(m, 0.7, 0.4)));
    const checked = days.filter(d => d.porn != null);
    const free = checked.filter(d => d.porn === false).length;
    out.push(K('Libido', '📺', 'Porn-free days', checked.length ? `${free} / ${checked.length}` : '-', 'most days',
      checked.length ? _hi(free / checked.length, 0.8, 0.5) : 'none'));
  }

  // habits
  {
    const u = s.unitsInWeek(today);
    out.push(K('Habits', '🍺', 'Alcohol this week', `${fmt(u, 1)} units`, `≤ ${fmt(s.unitsPerWeek)} units`, _lo(u, s.unitsPerWeek / 2, s.unitsPerWeek)));
  }
  {
    const c = _avg(days.filter(d => d.caffeine.length || d.food.length).map(d => d.caffeineMg));
    out.push(K('Habits', '⚡', 'Caffeine (avg/day)', c == null ? '-' : `${fmt(c)} mg`, '≤ 400 mg', c == null ? 'none' : _lo(c, 400, 500)));
  }
  {
    const now7 = _avg(days.map(d => d.pouches.length));
    const prev = []; for (let i = 0; i < 7; i++) { const d = s.peek(addDays(addDays(today, -7), -i)); if (d) prev.push(d); }
    const prev7 = _avg(prev.map(d => d.pouches.length));
    let r = 'none';
    if (now7 != null && prev7 != null) {
      if (prev7 === 0) r = now7 === 0 ? 'green' : 'red';
      else r = now7 <= prev7 ? 'green' : (now7 <= prev7 * 1.2 ? 'amber' : 'red');
    }
    out.push(K('Habits', '🟦', 'Velo pouches (avg/day)', now7 == null ? '-' : fmt(now7, 1),
      prev7 == null ? 'no more than last week' : `≤ ${fmt(prev7, 1)} (last week)`, r));
  }
  {
    const last = s.lastReta(today);
    const since = last == null ? null : daysBetween(last, today);
    out.push(K('Habits', '💉', 'Reta on schedule', since == null ? '-' : (since === 0 ? 'today' : `${since} days ago`), 'every 7 days',
      since == null ? 'none' : (since <= 7 ? 'green' : (since === 8 ? 'amber' : 'red'))));
  }
  {
    const logged = days.filter(d => Object.keys(d.supps).length || d.food.length);
    const full = logged.filter(d => supplements.every(x => x in d.supps)).length;
    out.push(K('Habits', '💊', 'All supplements taken', logged.length ? `${full} / ${logged.length} days` : '-', 'every day',
      logged.length ? _hi(full / logged.length, 0.85, 0.6) : 'none'));
  }
  return out;
}
