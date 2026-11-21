// Vice data layer: models, presets and storage. Port of lib/data.dart (2.16.0).
// Everything is saved on the phone as one JSON blob (same format as Android,
// so "Copy backup" / "Restore from clipboard" works between the two).
'use strict';

const pad = (n, l = 2) => String(n).padStart(l, '0');
const dayKey = d => `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dateOnly = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dartWeekday = d => ((d.getDay() + 6) % 7) + 1; // Mon=1..Sun=7
const weekStart = d => addDays(d, -(dartWeekday(d) - 1));
const daysBetween = (a, b) =>
  Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
const sameDate = (a, b) => a.getTime() === b.getTime();
const isAfter = (a, b) => a.getTime() > b.getTime();
let _idc = 0;
const newId = () => (Date.now() * 1000 + (_idc++ % 1000)).toString(36);
const hmOf = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const nowHm = () => hmOf(new Date());

/** "yyyy-MM-dd" -> local date (null if junk). */
function parseDayKey(k) {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(k));
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return isNaN(d) ? null : d;
}
/** Dart toIso8601String() of a local DateTime, and back. */
function toIsoLocal(d) {
  return `${dayKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}
function parseIso(s) {
  const m = /^(\d{4})-(\d\d)-(\d\d)[T ](\d\d):(\d\d)(?::(\d\d)(?:[.,](\d+))?)?\s*(Z|[+-]\d\d:?\d\d)?$/i.exec(String(s).trim());
  if (!m) return null;
  const ms = m[7] ? Math.floor(Number('0.' + m[7]) * 1000) : 0;
  const parts = [+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0), ms];
  if (!m[8]) return new Date(...parts);
  let t = Date.UTC(...parts);
  if (m[8].toUpperCase() !== 'Z') {
    const sign = m[8][0] === '-' ? -1 : 1;
    const hh = +m[8].slice(1, 3), mm = +m[8].slice(-2);
    t -= sign * (hh * 60 + mm) * 60000;
  }
  return new Date(t);
}

// Strict number read, like Dart's `(v as num?)?.toDouble() ?? 0`.
function _d(v) {
  if (v === null || v === undefined) return 0;
  if (typeof v !== 'number' || !isFinite(v)) throw new Error('Not a number');
  return v;
}
function _int(v) { return v === null || v === undefined ? null : Math.trunc(_d(v)); }
function _str(v, def) {
  if (v === null || v === undefined) return def;
  if (typeof v !== 'string') throw new Error('Not text');
  return v;
}
function _obj(v) {
  if (v === null || v === undefined) return {};
  if (typeof v !== 'object' || Array.isArray(v)) throw new Error('Not a map');
  return v;
}
function _arr(v) {
  if (v === null || v === undefined) return [];
  if (!Array.isArray(v)) throw new Error('Not a list');
  return v;
}
function _strMap(v) {
  const o = _obj(v), out = {};
  for (const k of Object.keys(o)) out[k] = _str(o[k], '');
  return out;
}
/** How Dart prints a value with '$v' (doubles always carry a decimal). */
function dartStr(v, isDouble) {
  if (typeof v === 'number' && isDouble && Number.isInteger(v)) return v + '.0';
  return String(v);
}

// ---------- presets ----------
const gZinc = 'Zinc', gOmega = 'Omega-3 + vit D', gFats = 'Nuts + olive oil', gFlav = 'Berries, citrus, greens';
const libidoGroups = [gZinc, gOmega, gFats, gFlav];
const groupEmoji = { [gZinc]: '🦪', [gOmega]: '🐟', [gFats]: '🥜', [gFlav]: '🫐' };
const foodTabs = ['Libido', 'Sushi', 'Filipino', 'General', 'Cheat meal'];
const filipinoPrefix = 'Filipino · ';
const filipinoSections = ['Mains', 'Soups', 'Grill & fried', 'Silog & breakfast', 'Noodles & sides', 'Sweets'];
const filipinoEmoji = { 'Mains': '🍛', 'Soups': '🍲', 'Grill & fried': '🔥', 'Silog & breakfast': '🍳', 'Noodles & sides': '🍜', 'Sweets': '🍮' };
const generalSections = ['My foods', 'Protein', 'Carbs', 'Fruit & veg', 'Dairy', 'Snacks'];
const categoryEmoji = {
  'Libido': '⭐', 'Sushi': '🍣', 'Filipino': '🇵🇭', 'General': '🍽️', 'Cheat meal': '🍕', 'Protein': '🍗',
  'Carbs': '🍚', 'Fruit & veg': '🥦', 'Dairy': '🥛', 'Snacks': '🍫', 'My foods': '📌',
};
const PRESETS = {foods: [
[`Libido`, `Oysters`, `6 medium`, 60.0, 7.0, 3.5, 1.5, `Zinc`, `Richest zinc source by far. Zinc: low zinc lowers testosterone`],
[`Libido`, `Lean steak (sirloin), cooked`, `150g`, 300.0, 45.0, 0.0, 13.0, `Zinc`, `Zinc: low zinc lowers testosterone`],
[`Libido`, `Lean beef mince 5%, cooked`, `100g`, 175.0, 27.0, 0.0, 7.0, `Zinc`, `Zinc: low zinc lowers testosterone`],
[`Libido`, `Pumpkin seeds`, `30g`, 170.0, 9.0, 3.0, 14.0, `Zinc`, `Zinc + magnesium`],
[`Libido`, `Salmon fillet, cooked`, `100g`, 206.0, 22.0, 0.0, 13.0, `Omega-3 + vit D`, `Omega-3 + vitamin D: low vit D linked to low T`],
[`Libido`, `Sardines in olive oil, drained`, `tin 90g`, 190.0, 22.0, 0.0, 11.0, `Omega-3 + vit D`, `Omega-3 + vitamin D: low vit D linked to low T`],
[`Libido`, `Mackerel fillet`, `100g`, 260.0, 19.0, 0.0, 20.0, `Omega-3 + vit D`, `Omega-3 + vitamin D: low vit D linked to low T`],
[`Libido`, `Egg (whole)`, `large egg`, 78.0, 6.3, 0.6, 5.3, `Omega-3 + vit D`, `Vitamin D + cholesterol (raw material for T). Eat the yolk`],
[`Libido`, `Mixed nuts (walnut/almond/hazelnut)`, `30g`, 190.0, 5.0, 4.0, 18.0, `Nuts + olive oil`, `60 g/day nuts improved desire + orgasm in a 14-week trial`],
[`Libido`, `Walnuts`, `30g`, 196.0, 4.6, 4.0, 19.5, `Nuts + olive oil`, `60 g/day nuts improved desire + orgasm in a 14-week trial`],
[`Libido`, `Almonds`, `30g`, 174.0, 6.3, 2.6, 15.0, `Nuts + olive oil`, `60 g/day nuts improved desire + orgasm in a 14-week trial`],
[`Libido`, `Pistachios, shelled`, `30g`, 170.0, 6.0, 8.0, 14.0, `Nuts + olive oil`, `Nuts, small trial on erectile function`],
[`Libido`, `Extra virgin olive oil`, `tbsp`, 120.0, 0.0, 0.0, 13.5, `Nuts + olive oil`, `Healthy fat: very low-fat diets cut T 10-15%`],
[`Libido`, `Avocado`, `half`, 120.0, 1.5, 6.0, 11.0, `Nuts + olive oil`, `Healthy fat: very low-fat diets cut T 10-15%`],
[`Libido`, `Blueberries`, `100g`, 57.0, 0.7, 14.0, 0.3, `Berries, citrus, greens`, `Flavonoids: linked to lower ED risk (blood flow)`],
[`Libido`, `Strawberries`, `100g`, 32.0, 0.7, 7.7, 0.3, `Berries, citrus, greens`, `Flavonoids: linked to lower ED risk (blood flow)`],
[`Libido`, `Orange`, `medium`, 62.0, 1.2, 15.0, 0.2, `Berries, citrus, greens`, `Flavonoids: linked to lower ED risk (blood flow)`],
[`Libido`, `Dark chocolate 85%`, `20g`, 120.0, 2.5, 4.0, 10.0, `Berries, citrus, greens`, `Cocoa flavanols, blood flow`],
[`Libido`, `Beetroot, cooked`, `100g`, 44.0, 1.7, 10.0, 0.2, `Berries, citrus, greens`, `Nitrates: help nitric oxide + blood flow`],
[`Libido`, `Spinach / rocket`, `80g`, 20.0, 2.2, 1.5, 0.4, `Berries, citrus, greens`, `Nitrates: help nitric oxide + blood flow`],
[`Sushi`, `Salmon nigiri`, `piece`, 65.0, 4.0, 9.0, 1.5, null, null],
[`Sushi`, `Tuna nigiri`, `piece`, 50.0, 5.0, 8.0, 0.3, null, null],
[`Sushi`, `Prawn (ebi) nigiri`, `piece`, 45.0, 4.0, 8.0, 0.2, null, null],
[`Sushi`, `Eel (unagi) nigiri`, `piece`, 75.0, 4.0, 10.0, 2.5, null, null],
[`Sushi`, `Salmon sashimi`, `slice`, 35.0, 3.5, 0.0, 2.2, `Omega-3 + vit D`, `Omega-3 + vitamin D: low vit D linked to low T`],
[`Sushi`, `Tuna sashimi`, `slice`, 20.0, 4.5, 0.0, 0.2, null, null],
[`Sushi`, `California roll`, `piece`, 33.0, 1.0, 5.0, 1.0, null, null],
[`Sushi`, `Salmon avocado roll`, `piece`, 40.0, 1.8, 5.0, 1.5, null, null],
[`Sushi`, `Spicy tuna roll`, `piece`, 38.0, 2.0, 4.5, 1.3, null, null],
[`Sushi`, `Philadelphia roll`, `piece`, 45.0, 1.8, 5.0, 2.0, null, null],
[`Sushi`, `Prawn tempura / dragon roll`, `piece`, 60.0, 2.0, 7.0, 2.5, null, null],
[`Sushi`, `Salmon maki (thin roll)`, `piece`, 28.0, 1.3, 4.5, 0.5, null, null],
[`Sushi`, `Cucumber maki`, `piece`, 22.0, 0.4, 4.8, 0.1, null, null],
[`Sushi`, `Salmon hand roll (temaki)`, `roll`, 200.0, 9.0, 25.0, 6.0, null, null],
[`Sushi`, `Inari (tofu pocket)`, `piece`, 100.0, 2.5, 16.0, 3.0, null, null],
[`Sushi`, `Edamame`, `bowl 100g`, 120.0, 11.0, 9.0, 5.0, null, null],
[`Sushi`, `Miso soup`, `bowl`, 40.0, 3.0, 4.0, 1.5, null, null],
[`Sushi`, `Gyoza`, `piece`, 45.0, 2.0, 5.0, 2.0, null, null],
[`Sushi`, `Soy sauce`, `tbsp`, 10.0, 1.0, 1.0, 0.0, null, null],
[`Protein`, `Chicken breast, cooked`, `100g`, 165.0, 31.0, 0.0, 3.6, null, null],
[`Protein`, `Chicken thigh, skinless, cooked`, `100g`, 180.0, 25.0, 0.0, 8.5, null, null],
[`Protein`, `Turkey mince 2%, cooked`, `100g`, 150.0, 30.0, 0.0, 3.0, null, null],
[`Protein`, `Tuna, tinned in water, drained`, `tin 110g`, 120.0, 27.0, 0.0, 1.0, null, null],
[`Protein`, `Prawns, cooked`, `100g`, 70.0, 15.0, 0.0, 1.0, null, null],
[`Protein`, `Cod / white fish, cooked`, `100g`, 105.0, 23.0, 0.0, 1.0, null, null],
[`Protein`, `Egg whites`, `100g`, 52.0, 11.0, 0.7, 0.2, null, null],
[`Protein`, `Back bacon, grilled`, `rasher`, 65.0, 7.0, 0.0, 4.0, null, null],
[`Protein`, `Pork sausage, grilled`, `sausage`, 130.0, 7.0, 5.0, 9.5, null, null],
[`Protein`, `Tofu, firm`, `100g`, 120.0, 13.0, 2.0, 7.0, null, null],
[`Protein`, `Whey protein shake (water)`, `scoop 30g`, 120.0, 24.0, 3.0, 1.5, null, null],
[`Protein`, `Protein bar (typical)`, `bar 60g`, 210.0, 20.0, 20.0, 7.0, null, null],
[`Protein`, `Beef jerky`, `30g`, 80.0, 14.0, 3.0, 1.0, null, null],
[`Dairy`, `Greek yogurt 0%`, `170g pot`, 100.0, 17.0, 6.0, 0.5, null, null],
[`Dairy`, `Greek yogurt, full fat`, `170g pot`, 160.0, 10.0, 6.0, 10.0, null, null],
[`Dairy`, `Skyr`, `150g pot`, 95.0, 16.0, 6.0, 0.3, null, null],
[`Dairy`, `Cottage cheese, low fat`, `100g`, 72.0, 12.0, 3.0, 1.5, null, null],
[`Dairy`, `Cheddar`, `30g`, 125.0, 7.5, 0.0, 10.5, null, null],
[`Dairy`, `Milk, semi-skimmed`, `250ml`, 125.0, 8.5, 12.0, 4.5, null, null],
[`Dairy`, `Butter`, `10g`, 74.0, 0.1, 0.0, 8.2, null, null],
[`Carbs`, `White / basmati rice, cooked`, `100g`, 130.0, 2.7, 28.0, 0.3, null, null],
[`Carbs`, `Microwave rice pouch`, `250g pouch`, 370.0, 8.0, 76.0, 3.5, null, null],
[`Carbs`, `Pasta, cooked`, `100g`, 158.0, 5.8, 31.0, 0.9, null, null],
[`Carbs`, `Egg noodles, cooked`, `100g`, 140.0, 4.5, 26.0, 2.0, null, null],
[`Carbs`, `Potato, boiled`, `100g`, 87.0, 1.9, 20.0, 0.1, null, null],
[`Carbs`, `Sweet potato, baked`, `100g`, 90.0, 2.0, 21.0, 0.2, null, null],
[`Carbs`, `Oven chips`, `100g`, 180.0, 3.0, 28.0, 6.0, null, null],
[`Carbs`, `Oats`, `40g`, 150.0, 5.0, 26.0, 2.8, null, null],
[`Carbs`, `Bread, wholemeal`, `slice`, 95.0, 4.0, 16.0, 1.2, null, null],
[`Carbs`, `Tortilla wrap, large`, `wrap`, 190.0, 5.0, 32.0, 4.0, null, null],
[`Carbs`, `Bagel, plain`, `bagel`, 250.0, 9.0, 48.0, 1.5, null, null],
[`Carbs`, `Granola`, `45g`, 200.0, 4.5, 28.0, 7.5, null, null],
[`Fruit & veg`, `Banana`, `medium`, 105.0, 1.3, 27.0, 0.4, null, null],
[`Fruit & veg`, `Apple`, `medium`, 95.0, 0.5, 25.0, 0.3, `Berries, citrus, greens`, `Flavonoids: linked to lower ED risk (blood flow)`],
[`Fruit & veg`, `Grapes`, `80g`, 55.0, 0.5, 14.0, 0.1, `Berries, citrus, greens`, `Flavonoids: linked to lower ED risk (blood flow)`],
[`Fruit & veg`, `Broccoli`, `80g`, 27.0, 2.8, 2.2, 0.5, null, null],
[`Fruit & veg`, `Mixed veg / salad`, `100g`, 35.0, 2.0, 6.0, 0.3, null, null],
[`Fruit & veg`, `Carrots`, `80g`, 30.0, 0.5, 6.0, 0.2, null, null],
[`Fruit & veg`, `Peppers`, `80g`, 25.0, 0.8, 5.0, 0.2, null, null],
[`Cheat`, `Big Mac (McDonald's)`, `burger`, 508.0, 26.0, 43.0, 25.0, null, null],
[`Cheat`, `Double Cheeseburger (McDonald's)`, `burger`, 438.0, 26.0, 33.0, 22.0, null, null],
[`Cheat`, `Cheeseburger (McDonald's)`, `burger`, 298.0, 16.0, 31.0, 12.0, null, null],
[`Cheat`, `6 Chicken McNuggets (McDonald's)`, `box of 6`, 261.0, 15.0, 16.0, 13.0, null, null],
[`Cheat`, `Large fries (McDonald's)`, `large`, 444.0, 5.5, 55.0, 21.5, null, null],
[`Cheat`, `KFC Zinger Burger`, `burger`, 450.0, 26.4, 43.8, 18.8, null, null],
[`Cheat`, `Domino's Pepperoni Passion, medium classic`, `slice`, 218.0, 9.0, 20.7, 10.7, null, null],
[`Cheat`, `Homemade beef burger in brioche bun`, `burger`, 500.0, 30.0, 35.0, 26.0, null, null],
[`Cheat`, `Ice cream`, `2 scoops`, 270.0, 4.0, 30.0, 15.0, null, null],
[`Snacks`, `Peanut butter`, `tbsp 15g`, 94.0, 3.8, 1.9, 7.5, null, null],
[`Snacks`, `Hummus`, `30g`, 90.0, 2.2, 3.5, 7.5, null, null],
[`Snacks`, `Crisps`, `bag 25g`, 130.0, 1.5, 13.0, 8.0, null, null],
[`Snacks`, `Milk chocolate`, `20g`, 107.0, 1.5, 11.5, 6.0, null, null],
[`Snacks`, `Mayonnaise`, `tbsp`, 100.0, 0.1, 0.2, 11.0, null, null],
[`Snacks`, `Ketchup`, `tbsp`, 15.0, 0.2, 3.5, 0.0, null, null],
[`Filipino · Mains`, `Chicken adobo`, `serving 200g`, 380.0, 32.0, 5.0, 25.0, null, null],
[`Filipino · Mains`, `Pork adobo`, `serving 200g`, 520.0, 30.0, 6.0, 41.0, null, null],
[`Filipino · Mains`, `Beef caldereta`, `serving 250g`, 450.0, 32.0, 15.0, 29.0, null, null],
[`Filipino · Mains`, `Kare-kare`, `serving 250g`, 550.0, 30.0, 15.0, 42.0, null, null],
[`Filipino · Mains`, `Pork menudo`, `serving 250g`, 380.0, 22.0, 18.0, 24.0, null, null],
[`Filipino · Mains`, `Bistek tagalog`, `serving 200g`, 350.0, 32.0, 8.0, 21.0, null, null],
[`Filipino · Mains`, `Bicol express`, `serving 200g`, 520.0, 20.0, 8.0, 46.0, null, null],
[`Filipino · Mains`, `Dinuguan`, `serving 200g`, 350.0, 25.0, 6.0, 25.0, null, null],
[`Filipino · Mains`, `Kinilaw (fish ceviche)`, `serving 150g`, 180.0, 28.0, 6.0, 4.0, null, null],
[`Filipino · Mains`, `Laing`, `serving 150g`, 300.0, 6.0, 10.0, 27.0, null, null],
[`Filipino · Mains`, `Pinakbet`, `serving 200g`, 200.0, 10.0, 15.0, 11.0, null, null],
[`Filipino · Mains`, `Chop suey`, `serving 200g`, 180.0, 12.0, 15.0, 8.0, null, null],
[`Filipino · Mains`, `Tortang talong (aubergine omelette)`, `piece`, 220.0, 10.0, 8.0, 16.0, null, null],
[`Filipino · Soups`, `Sinigang na baboy (pork)`, `bowl`, 330.0, 25.0, 12.0, 20.0, null, null],
[`Filipino · Soups`, `Sinigang na hipon (prawn)`, `bowl`, 200.0, 24.0, 12.0, 5.0, null, null],
[`Filipino · Soups`, `Tinola (chicken ginger soup)`, `bowl`, 250.0, 28.0, 8.0, 11.0, null, null],
[`Filipino · Soups`, `Bulalo (beef shank soup)`, `bowl`, 450.0, 35.0, 10.0, 30.0, null, null],
[`Filipino · Soups`, `Arroz caldo`, `bowl`, 350.0, 20.0, 45.0, 9.0, null, null],
[`Filipino · Grill & fried`, `Chicken inasal`, `leg quarter`, 420.0, 38.0, 4.0, 27.0, null, null],
[`Filipino · Grill & fried`, `Chicken BBQ skewer`, `stick`, 140.0, 15.0, 6.0, 6.0, null, null],
[`Filipino · Grill & fried`, `Pork BBQ skewer`, `stick`, 170.0, 12.0, 8.0, 10.0, null, null],
[`Filipino · Grill & fried`, `Grilled bangus (milkfish)`, `half fish`, 380.0, 40.0, 0.0, 24.0, null, null],
[`Filipino · Grill & fried`, `Daing na bangus (fried milkfish)`, `half fish`, 450.0, 38.0, 2.0, 32.0, null, null],
[`Filipino · Grill & fried`, `Lechon (roast pork)`, `100g`, 400.0, 22.0, 0.0, 34.0, null, null],
[`Filipino · Grill & fried`, `Lechon kawali`, `100g`, 480.0, 20.0, 0.0, 44.0, null, null],
[`Filipino · Grill & fried`, `Pork sisig`, `serving 150g`, 450.0, 22.0, 6.0, 37.0, null, null],
[`Filipino · Grill & fried`, `Fried chicken (Filipino style)`, `piece`, 320.0, 22.0, 12.0, 20.0, null, null],
[`Filipino · Grill & fried`, `Chicharon`, `bag 30g`, 160.0, 18.0, 0.0, 9.0, null, null],
[`Filipino · Silog & breakfast`, `Tapsilog (beef tapa, rice, egg)`, `plate`, 750.0, 40.0, 75.0, 30.0, null, null],
[`Filipino · Silog & breakfast`, `Longsilog (longganisa, rice, egg)`, `plate`, 800.0, 28.0, 80.0, 40.0, null, null],
[`Filipino · Silog & breakfast`, `Tocilog (tocino, rice, egg)`, `plate`, 780.0, 30.0, 95.0, 30.0, null, null],
[`Filipino · Silog & breakfast`, `Beef tapa`, `100g`, 280.0, 25.0, 8.0, 16.0, null, null],
[`Filipino · Silog & breakfast`, `Longganisa`, `link`, 150.0, 7.0, 5.0, 11.0, null, null],
[`Filipino · Silog & breakfast`, `Tocino`, `100g`, 330.0, 18.0, 25.0, 18.0, null, null],
[`Filipino · Silog & breakfast`, `Garlic rice (sinangag)`, `cup`, 280.0, 5.0, 48.0, 7.0, null, null],
[`Filipino · Silog & breakfast`, `Fried egg`, `egg`, 90.0, 6.0, 0.4, 7.0, null, null],
[`Filipino · Silog & breakfast`, `Pandesal`, `roll`, 120.0, 3.5, 22.0, 2.0, null, null],
[`Filipino · Silog & breakfast`, `Champorado`, `bowl`, 350.0, 7.0, 65.0, 7.0, null, null],
[`Filipino · Noodles & sides`, `Lumpia shanghai`, `piece`, 55.0, 2.5, 4.0, 3.3, null, null],
[`Filipino · Noodles & sides`, `Lumpiang sariwa (fresh)`, `roll`, 220.0, 7.0, 30.0, 8.0, null, null],
[`Filipino · Noodles & sides`, `Pancit canton`, `plate 250g`, 430.0, 18.0, 55.0, 15.0, null, null],
[`Filipino · Noodles & sides`, `Pancit bihon`, `plate 250g`, 380.0, 16.0, 55.0, 10.0, null, null],
[`Filipino · Noodles & sides`, `Pancit palabok`, `plate 250g`, 450.0, 18.0, 60.0, 15.0, null, null],
[`Filipino · Noodles & sides`, `Filipino spaghetti`, `plate`, 550.0, 18.0, 75.0, 18.0, null, null],
[`Filipino · Noodles & sides`, `White rice`, `cup`, 205.0, 4.0, 45.0, 0.4, null, null],
[`Filipino · Sweets`, `Halo-halo`, `glass`, 400.0, 6.0, 75.0, 9.0, null, null],
[`Filipino · Sweets`, `Leche flan`, `slice`, 220.0, 6.0, 32.0, 7.0, null, null],
[`Filipino · Sweets`, `Turon`, `piece`, 200.0, 1.5, 35.0, 7.0, null, null],
[`Filipino · Sweets`, `Ube halaya`, `serving 80g`, 250.0, 3.0, 45.0, 6.0, null, null],
[`Filipino · Sweets`, `Ensaymada`, `piece`, 350.0, 7.0, 45.0, 16.0, null, null]
],
emojiRules: [
[`silog`, `🍳`],
[`sinigang`, `🍲`],
[`tinola`, `🍲`],
[`bulalo`, `🍲`],
[`dinuguan`, `🍲`],
[`menudo`, `🍲`],
[`arroz caldo`, `🥣`],
[`lumpia`, `🌯`],
[`pancit`, `🍜`],
[`palabok`, `🍜`],
[`halo-halo`, `🍧`],
[`leche flan`, `🍮`],
[`turon`, `🍌`],
[`pandesal`, `🍞`],
[`ensaymada`, `🥐`],
[`champorado`, `🍫`],
[`ube `, `🍠`],
[`lechon`, `🐖`],
[`sisig`, `🍳`],
[`chicharon`, `🥓`],
[`bangus`, `🐟`],
[`kinilaw`, `🐟`],
[`skewer`, `🍢`],
[`kare-kare`, `🥜`],
[`caldereta`, `🥩`],
[`bistek`, `🥩`],
[` tapa`, `🥩`],
[`bicol`, `🌶️`],
[`laing`, `🥬`],
[`pinakbet`, `🥗`],
[`chop suey`, `🥗`],
[`tortang talong`, `🍆`],
[`longganisa`, `🌭`],
[`tocino`, `🥓`],
[`inasal`, `🍗`],
[`spaghetti`, `🍝`],
[`pork`, `🐖`],
[`adobo`, `🍗`],
[`nugget`, `🍗`],
[`fries`, `🍟`],
[`pepperoni`, `🍕`],
[`pizza`, `🍕`],
[`burger`, `🍔`],
[`big mac`, `🍔`],
[`ice cream`, `🍨`],
[`oyster`, `🦪`],
[`steak`, `🥩`],
[`beef`, `🥩`],
[`jerky`, `🥩`],
[`pumpkin`, `🎃`],
[`sashimi`, `🍣`],
[`nigiri`, `🍣`],
[`roll`, `🍙`],
[`maki`, `🍙`],
[`inari`, `🍙`],
[`edamame`, `🫛`],
[`miso`, `🍲`],
[`gyoza`, `🥟`],
[`soy sauce`, `🥢`],
[`salmon`, `🐟`],
[`sardine`, `🐟`],
[`mackerel`, `🐟`],
[`tuna`, `🐟`],
[`cod`, `🐟`],
[`prawn`, `🦐`],
[`egg white`, `🥚`],
[`egg noodle`, `🍜`],
[`egg`, `🥚`],
[`walnut`, `🌰`],
[`almond`, `🌰`],
[`pistachio`, `🥜`],
[`nuts`, `🥜`],
[`peanut`, `🥜`],
[`olive oil`, `🫒`],
[`avocado`, `🥑`],
[`blueberr`, `🫐`],
[`strawberr`, `🍓`],
[`orange`, `🍊`],
[`dark chocolate`, `🍫`],
[`chocolate`, `🍫`],
[`beetroot`, `🫜`],
[`spinach`, `🥬`],
[`salad`, `🥗`],
[`chicken`, `🍗`],
[`turkey`, `🦃`],
[`bacon`, `🥓`],
[`sausage`, `🌭`],
[`tofu`, `🧈`],
[`whey`, `🥤`],
[`protein bar`, `🍫`],
[`yogurt`, `🥣`],
[`skyr`, `🥣`],
[`cottage`, `🧀`],
[`cheddar`, `🧀`],
[`milk`, `🥛`],
[`butter`, `🧈`],
[`rice`, `🍚`],
[`pasta`, `🍝`],
[`noodle`, `🍜`],
[`sweet potato`, `🍠`],
[`chips`, `🍟`],
[`potato`, `🥔`],
[`oats`, `🥣`],
[`granola`, `🥣`],
[`bread`, `🍞`],
[`wrap`, `🌯`],
[`bagel`, `🥯`],
[`banana`, `🍌`],
[`apple`, `🍎`],
[`grape`, `🍇`],
[`broccoli`, `🥦`],
[`carrot`, `🥕`],
[`pepper`, `🫑`],
[`veg`, `🥗`],
[`hummus`, `🫘`],
[`crisps`, `🥔`],
[`mayo`, `🥫`],
[`ketchup`, `🍅`]
]};
const foodPreset = a => ({ category: a[0], name: a[1], unit: a[2], kcal: a[3], protein: a[4], carbs: a[5], fat: a[6], group: a[7] || null, why: a[8] || null });
const builtInFoods = PRESETS.foods.map(foodPreset);
const emojiRules = PRESETS.emojiRules;
function foodEmoji(name) {
  const n = name.toLowerCase();
  for (const r of emojiRules) if (n.includes(r[0])) return r[1];
  return '🍽️';
}
function presetToJson(p) {
  return { category: p.category, name: p.name, unit: p.unit, kcal: p.kcal, protein: p.protein, carbs: p.carbs, fat: p.fat };
}
function presetFromJson(j) {
  return {
    category: _str(j.category, 'My foods'), name: _str(j.name, ''), unit: _str(j.unit, 'serving'),
    kcal: _d(j.kcal), protein: _d(j.protein), carbs: _d(j.carbs), fat: _d(j.fat), group: null, why: null,
  };
}

// Smirnoff Red 37.5%. Small bottle = 35cl.
const drinkPresets = [
  { name: 'Pint of beer', units: 2.3, kcal: 215 },
  { name: 'Half small Smirnoff (17.5cl)', units: 6.6, kcal: 365 },
  { name: 'Small Smirnoff (35cl)', units: 13.1, kcal: 730 },
];
const retaName = 'Reta 3 mg';
const supplements = ['Vit D', 'Creatine', 'D pills'];
// From UK can labels (500ml cans).
const caffeinePresets = [
  { name: 'White Monster (Ultra) 500ml', mg: 150, kcal: 11 },
  { name: 'Viking Berry Monster 500ml', mg: 160, kcal: 174 },
  { name: 'Coffee (mug, splash of milk)', mg: 95, kcal: 20 },
];
const nicotineMg = 10;
const SHORT = {
  'White Monster (Ultra) 500ml': 'White Monster', 'Viking Berry Monster 500ml': 'Viking Berry',
  'Coffee (mug, splash of milk)': 'Coffee', 'Pint of beer': 'Pint',
  'Half small Smirnoff (17.5cl)': '½ Smirnoff', 'Small Smirnoff (35cl)': 'Smirnoff 35cl',
};

// ---------- models ----------
function medDueOn(m, d) {
  if (m.frequency === 'daily') return true;
  if (m.frequency === 'weekly') return dartWeekday(d) === m.weekday;
  return false;
}
function medFromJson(j) {
  return {
    id: _str(j.id, newId()), name: _str(j.name, ''), kind: _str(j.kind, 'pill'), dose: _str(j.dose, ''),
    frequency: _str(j.frequency, 'daily'), weekday: _int(j.weekday) ?? 1,
  };
}
const medToJson = m => ({ id: m.id, name: m.name, kind: m.kind, dose: m.dose, frequency: m.frequency, weekday: m.weekday });

const fTot = (f, k) => f[k] * f.qty;
function foodFromJson(j) {
  return {
    id: _str(j.id, newId()), name: _str(j.name, ''), unit: _str(j.unit, ''), qty: _d(j.qty), kcal: _d(j.kcal),
    protein: _d(j.protein), carbs: _d(j.carbs), fat: _d(j.fat), group: _str(j.group, null), cheat: j.cheat === true,
  };
}
const foodToJson = f => ({ id: f.id, name: f.name, unit: f.unit, qty: f.qty, kcal: f.kcal, protein: f.protein, carbs: f.carbs, fat: f.fat, group: f.group, cheat: f.cheat });
function sessionFromJson(j) {
  return { id: _str(j.id, newId()), type: _str(j.type, ''), minutes: _int(j.minutes) ?? 0, notes: _str(j.notes, ''), planId: _str(j.planId, null) };
}
const sessionToJson = x => ({ id: x.id, type: x.type, minutes: x.minutes, notes: x.notes || '', planId: x.planId ?? null });
const drinkFromJson = j => ({ id: _str(j.id, newId()), name: _str(j.name, ''), units: _d(j.units), kcal: _d(j.kcal) });
const drinkToJson = x => ({ id: x.id, name: x.name, units: x.units, kcal: x.kcal });
const cafFromJson = j => ({ id: _str(j.id, newId()), name: _str(j.name, ''), mg: _d(j.mg), kcal: _d(j.kcal), time: _str(j.time, '') });
const cafToJson = c => ({ id: c.id, name: c.name, mg: c.mg, kcal: c.kcal, time: c.time });

const POWER_NAP_MIN = 35;

class DayLog {
  constructor() {
    this.food = []; this.caffeine = []; this.pouches = []; this.supps = {}; this.stamps = {};
    this.bed = null; this.wake = null; this.sleepQuality = null;
    this.medsTaken = {}; this.sessions = []; this.drinks = [];
    this.weight = null; this.libido = null; this.morningWood = null; this.erection = null; this.reta = null;
    this.pornTimes = null; this.mbTimes = null; this.naps = []; this.powerNaps = [];
  }
  stampTime(key) { const v = this.stamps[key]; return v == null ? null : v.split('|')[0]; }
  autoStamp() {
    const now = nowHm();
    const ids = new Set([...this.food.map(e => e.id), ...this.drinks.map(e => e.id), ...this.sessions.map(e => e.id)]);
    for (const id of ids) if (!(id in this.stamps)) this.stamps[id] = `${now}|`;
    const fields = { weight: [this.weight, true], libido: [this.libido, false], morningWood: [this.morningWood, false], erection: [this.erection, false] };
    for (const k of Object.keys(fields)) {
      const [v, dbl] = fields[k];
      if (v == null) { delete this.stamps[k]; continue; }
      const sv = dartStr(v, dbl);
      const old = this.stamps[k];
      if (old == null || old.split('|').pop() !== sv) this.stamps[k] = `${now}|${sv}`;
    }
    for (const k of Object.keys(this.stamps)) if (!(k in fields) && !ids.has(k)) delete this.stamps[k];
  }
  get sleepHours() {
    if (this.bed == null || this.wake == null) return null;
    const m = t => parseInt(t.substring(0, 2), 10) * 60 + parseInt(t.substring(3, 5), 10);
    let diff = m(this.wake) - m(this.bed);
    if (isNaN(diff) || diff === 0) return null;
    if (diff < 0) diff += 24 * 60;
    return diff / 60;
  }
  get napHours() { return this.naps.length; }
  get porn() { return this.pornTimes == null ? null : this.pornTimes.length > 0; }
  get mb() { return this.mbTimes == null ? null : this.mbTimes.length > 0; }
  get isEmpty() {
    return !this.food.length && !Object.keys(this.medsTaken).length && !this.sessions.length && !this.drinks.length &&
      this.weight == null && this.libido == null && this.morningWood == null && this.erection == null && this.reta == null &&
      this.pornTimes == null && this.mbTimes == null && !this.naps.length && !this.powerNaps.length && !this.caffeine.length &&
      !this.pouches.length && !Object.keys(this.supps).length && this.bed == null && this.wake == null && this.sleepQuality == null;
  }
  get kcal() {
    return this.food.reduce((s, f) => s + fTot(f, 'kcal'), 0) + this.drinks.reduce((s, d) => s + d.kcal, 0) + this.caffeine.reduce((s, c) => s + c.kcal, 0);
  }
  get foodKcal() { return this.food.reduce((s, f) => s + fTot(f, 'kcal'), 0); }
  get caffeineMg() { return this.caffeine.reduce((s, c) => s + c.mg, 0); }
  get protein() { return this.food.reduce((s, f) => s + fTot(f, 'protein'), 0); }
  get fat() { return this.food.reduce((s, f) => s + fTot(f, 'fat'), 0); }
  get carbs() { return this.food.reduce((s, f) => s + fTot(f, 'carbs'), 0); }
  get libidoGroupsHit() { return new Set(this.food.filter(f => f.group != null).map(f => f.group)); }
  get units() { return this.drinks.reduce((s, d) => s + d.units, 0); }
  toJson() {
    return {
      food: this.food.map(foodToJson), medsTaken: this.medsTaken, sessions: this.sessions.map(sessionToJson),
      drinks: this.drinks.map(drinkToJson), weight: this.weight, libido: this.libido, morningWood: this.morningWood,
      erection: this.erection, reta: this.reta, pornTimes: this.pornTimes, mbTimes: this.mbTimes, naps: this.naps,
      powerNaps: this.powerNaps, caffeine: this.caffeine.map(cafToJson), pouches: this.pouches, supps: this.supps,
      bed: this.bed, wake: this.wake, stamps: this.stamps, sleepQuality: this.sleepQuality,
    };
  }
  static fromJson(j) {
    j = _obj(j);
    const d = new DayLog();
    d.food = _arr(j.food).map(e => foodFromJson(_obj(e)));
    d.medsTaken = _strMap(j.medsTaken);
    d.sessions = _arr(j.sessions).map(e => sessionFromJson(_obj(e)));
    d.drinks = _arr(j.drinks).map(e => drinkFromJson(_obj(e)));
    d.weight = j.weight == null ? null : _d(j.weight);
    d.libido = _int(j.libido);
    d.morningWood = typeof j.morningWood === 'boolean' ? j.morningWood : null;
    d.erection = _int(j.erection);
    d.reta = _str(j.reta, null);
    // older versions stored a yes/no; a "yes" becomes one time of unknown hour
    const times = (k, old) => {
      const l = j[k];
      if (Array.isArray(l)) return l.map(e => String(e));
      const b = j[old];
      if (typeof b === 'boolean') return b ? [''] : [];
      return null;
    };
    d.pornTimes = times('pornTimes', 'porn');
    d.mbTimes = times('mbTimes', 'mb');
    d.naps = _arr(j.naps).map(String);
    d.powerNaps = _arr(j.powerNaps).map(String);
    d.caffeine = _arr(j.caffeine).map(e => cafFromJson(_obj(e)));
    d.pouches = _arr(j.pouches).map(String);
    d.supps = _strMap(j.supps);
    d.bed = _str(j.bed, null);
    d.wake = _str(j.wake, null);
    d.stamps = _strMap(j.stamps);
    d.sleepQuality = _int(j.sleepQuality);
    return d;
  }
}

// ---------- store ----------
const STORE_KEY = 'vice_v1';
class Store {
  constructor() {
    this.kcalTarget = 1900; this.proteinTarget = 180; this.fatMin = 60; this.gymPerWeek = 4; this.unitsPerWeek = 14;
    this.startWeight = 100; this.goalWeight = 85; this.meds = []; this.myFoods = []; this.days = {};
    this.sleepingSince = null; this.loadFailed = false; this.listeners = [];
  }
  load() {
    let raw = null;
    try { raw = localStorage.getItem(STORE_KEY); } catch (_) {}
    if (raw == null) return;
    try { this.importJson(raw, false); }
    catch (_) {
      // Never brick the app: keep the unreadable data aside and start empty.
      this.loadFailed = true;
      try { localStorage.setItem(STORE_KEY + '_unreadable', raw); } catch (_) {}
    }
  }
  toJson() {
    const days = {};
    for (const k of Object.keys(this.days)) days[k] = this.days[k].toJson();
    const o = {
      version: 2, kcalTarget: this.kcalTarget, proteinTarget: this.proteinTarget, fatMin: this.fatMin,
      gymPerWeek: this.gymPerWeek, unitsPerWeek: this.unitsPerWeek, startWeight: this.startWeight,
      goalWeight: this.goalWeight, meds: this.meds.map(medToJson), myFoods: this.myFoods.map(presetToJson), days,
    };
    if (this.sleepingSince) o.sleepingSince = toIsoLocal(this.sleepingSince);
    return o;
  }
  exportJson() { return JSON.stringify(this.toJson()); }
  /** Throws if the text is not a Vice backup. */
  importJson(raw, save = true) {
    const j = JSON.parse(raw);
    if (!j || typeof j !== 'object' || Array.isArray(j) || !('days' in j)) throw new Error('Not a Vice backup');
    // Dry run on a scratch store first: a broken backup throws here and
    // leaves your current data untouched.
    new Store()._apply(j);
    this._apply(j);
    if (save) this.save(); else this.notify();
  }
  _apply(j) {
    this.kcalTarget = _d(j.kcalTarget ?? 1900);
    if ((j.version ?? 1) < 2 && this.kcalTarget > 1900) this.kcalTarget = 1900;
    this.proteinTarget = _d(j.proteinTarget ?? 180);
    this.fatMin = _d(j.fatMin ?? 60);
    this.gymPerWeek = _int(j.gymPerWeek) ?? 4;
    this.unitsPerWeek = _d(j.unitsPerWeek ?? 14);
    this.startWeight = _d(j.startWeight ?? 100);
    this.goalWeight = _d(j.goalWeight ?? 85);
    this.meds = _arr(j.meds).map(e => medFromJson(_obj(e)));
    this.myFoods = _arr(j.myFoods).map(e => presetFromJson(_obj(e)));
    const d = {};
    const src = _obj(j.days);
    for (const k of Object.keys(src)) {
      const date = parseDayKey(k);
      if (!date) continue; // skip junk keys
      d[dayKey(date)] = DayLog.fromJson(src[k]);
    }
    this.days = d;
    this.sleepingSince = typeof j.sleepingSince === 'string' ? parseIso(j.sleepingSince) : null;
    if (this.kcalTarget <= 0) this.kcalTarget = 1900;
    if (this.proteinTarget <= 0) this.proteinTarget = 180;
    if (this.fatMin < 0) this.fatMin = 60;
    if (this.gymPerWeek < 1) this.gymPerWeek = 4;
    if (this.unitsPerWeek < 0) this.unitsPerWeek = 14;
  }
  /** Tap 1: start tracking sleep. */
  startSleep(at) { this.sleepingSince = at || new Date(); this.save(); }
  /** Tap 2: what stopping now would record. Null when not tracking. */
  previewWake(at) {
    const start = this.sleepingSince;
    if (!start) return null;
    const end = at || new Date();
    const wakeDay = dateOnly(end);
    const ex = this.days[dayKey(wakeDay)];
    return {
      start, end, wakeDay, replaces: !!ex && (ex.bed != null || ex.wake != null),
      get minutes() { return Math.floor((end - start) / 60000); },
    };
  }
  /** Tap 2: stop and record it as the night's sleep (on the day you woke) or as nap hours. */
  wakeUp({ at, asNap = false } = {}) {
    const r = this.previewWake(at);
    if (!r) return null;
    this.sleepingSince = null;
    if (r.minutes >= 10) {
      const d = this.day(r.wakeDay);
      if (asNap) {
        const h = Math.min(12, Math.max(1, Math.round(r.minutes / 60)));
        for (let i = 0; i < h; i++) d.naps.push(hmOf(r.end));
      } else {
        d.bed = hmOf(r.start);
        d.wake = hmOf(r.end);
      }
    }
    this.save();
    return r;
  }
  cancelSleep() { this.sleepingSince = null; this.save(); }
  save() {
    const today = dayKey(new Date());
    for (const k of Object.keys(this.days)) if (k <= today) this.days[k].autoStamp();
    for (const k of Object.keys(this.days)) if (this.days[k].isEmpty) delete this.days[k];
    try { localStorage.setItem(STORE_KEY, this.exportJson()); }
    catch (e) { this.saveError = true; }
    this.notify();
  }
  notify() { for (const f of this.listeners) f(); }
  day(d) { const k = dayKey(d); return this.days[k] || (this.days[k] = new DayLog()); }
  peek(d) { return this.days[dayKey(d)] || null; }
  sessionsInWeek(d) {
    const s = weekStart(d); let n = 0;
    for (let i = 0; i < 7; i++) n += this.peek(addDays(s, i))?.sessions.length ?? 0;
    return n;
  }
  /** Plan id of the most recent gym session on or before [d], or null. */
  lastPlanId(d) {
    const keys = Object.keys(this.days).filter(k => k <= dayKey(d)).sort();
    for (const k of keys.reverse()) {
      const ss = this.days[k].sessions.filter(x => x.planId != null);
      if (ss.length) return ss[ss.length - 1].planId;
    }
    return null;
  }
  /** First day this week (Mon-Sun) with a cheat meal logged, or null. */
  cheatDayInWeek(d) {
    const st = weekStart(d);
    for (let i = 0; i < 7; i++) {
      const day = addDays(st, i);
      if (this.peek(day)?.food.some(f => f.cheat)) return day;
    }
    return null;
  }
  unitsInWeek(d) {
    const s = weekStart(d); let n = 0;
    for (let i = 0; i < 7; i++) n += this.peek(addDays(s, i))?.units ?? 0;
    return n;
  }
  /** [date, weight] pairs, oldest first. */
  weights() {
    const out = [];
    for (const k of Object.keys(this.days)) { const v = this.days[k]; if (v.weight != null) out.push([parseDayKey(k), v.weight]); }
    out.sort((a, b) => a[0] - b[0]);
    return out;
  }
  /** Most recent day (on or before [before]) with a Reta tap-in. */
  lastReta(before) {
    let best = null;
    for (const k of Object.keys(this.days)) {
      if (this.days[k].reta == null) continue;
      const dt = parseDayKey(k);
      if (before && isAfter(dt, before)) continue;
      if (!best || isAfter(dt, best)) best = dt;
    }
    return best;
  }
  latestWeight() { const w = this.weights(); return w.length ? w[w.length - 1][1] : null; }
}
