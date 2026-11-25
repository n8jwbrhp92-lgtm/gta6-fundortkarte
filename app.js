/* GTA 6 Fundortkarte – bewusst ohne Build-Schritt. Inhalte stehen in data.json. */
const map = L.map("map", {
  crs: L.CRS.Simple, minZoom: -1.5, maxZoom: 3, zoomSnap: 0.25,
  zoomControl: true, attributionControl: false
});
const bounds = [[0, 0], [1000, 1600]];
L.imageOverlay("karte.svg", bounds).addTo(map);
map.fitBounds(bounds);

let entries = [];
let markers = [];
const favoritesKey = "gta6-favoriten-v1";
const favorites = new Set(JSON.parse(localStorage.getItem(favoritesKey) || "[]"));
const $ = id => document.getElementById(id);

function saveFavorites() {
  localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
}
function isFavorite(id) { return favorites.has(id); }
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  saveFavorites();
  render();
  const selected = entries.find(e => e.id === id);
  if (selected) showDetails(selected);
}
function markerIcon(entry) {
  const symbol = entry.category === "auto" ? "🚗" : "💰";
  const cls = entry.category === "auto" ? "marker-car" : "marker-money";
  return L.divIcon({ className: "", html: `<div class="marker-dot ${cls}">${symbol}</div>`, iconSize:[30,30], iconAnchor:[15,15] });
}
function matches(entry) {
  const q = $("searchInput").value.trim().toLocaleLowerCase("de");
  if (entry.category === "auto" && !$("carsToggle").checked) return false;
  if (entry.category === "geld" && !$("moneyToggle").checked) return false;
  if ($("favoritesToggle").checked && !isFavorite(entry.id)) return false;
  const haystack = [entry.name, entry.type, entry.spawnOrt, entry.beschreibung, entry.art, entry.eigenschaften, entry.besonderheiten].flat().join(" ").toLocaleLowerCase("de");
  return !q || haystack.includes(q);
}
function statusText(entry) {
  return entry.status === "bestaetigt" ? "Bestätigt" : "Beispiel / Platzhalter";
}
function render() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  const shown = entries.filter(matches);
  shown.forEach(entry => {
    const marker = L.marker([entry.position.y, entry.position.x], {icon:markerIcon(entry)}).addTo(map);
    marker.on("click", () => showDetails(entry));
    markers.push(marker);
  });
  $("resultCount").textContent = `${shown.length} von ${entries.length} Einträgen`;
  $("entryList").innerHTML = "";
  if (!shown.length) {
    $("entryList").innerHTML = '<p class="map-caption">Keine passenden Einträge gefunden.</p>';
    return;
  }
  shown.forEach(entry => {
    const button = document.createElement("button");
    button.className = "entry";
    const icon = entry.category === "auto" ? "🚗" : "💰";
    const summary = entry.category === "auto" ? (entry.type || "Fahrzeug") + " · " + (entry.spawnOrt || "Ort offen") : (entry.art || "Geldquelle") + " · " + (entry.ver	dienst || "Verdienst offen");
    button.innerHTML = `<span class="entry-icon">${icon}</span><span class="entry-main"><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(summary)}</small><span class="status ${entry.status === "bestaetigt" ? "confirmed" : ""}">${statusText(entry)}</span></span><span class="favorite-btn ${isFavorite(entry.id) ? "active" : ""}">${isFavorite(entry.id) ? "★" : "☆"}</span>`;
    button.addEventListener("click", () => showDetails(entry));
    $("entryList").appendChild(button);
  });
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function showDetails(entry) {
  const panel = $("detailPanel");
  const car = entry.category === "auto";
  const fields = car ? [
    ["Fahrzeugtyp", entry.type], ["Spawn-Ort", entry.spawnOrt],
    ["Eigenschaften", entry.eigenschaften], ["Besonderheiten", entry.besonderheiten],
    ["Weitere Infos", entry.sonstigeInfos]
  ] : [
    ["Art", entry.art], ["Ort", entry.ort], ["Geschätzter Verdienst", entry.verdienst],
    ["Schwierigkeit", entry.schwierigkeit], ["Weitere Infos", entry.sonstigeInfos]
  ];
  $("detailContent").innerHTML = `
    <h3>${escapeHtml(entry.name)}</h3>
    <span class="status ${entry.status === "bestaetigt" ? "confirmed" : ""}">${statusText(entry)}</span>
    <p>${escapeHtml(entry.beschreibung || "")}</p>
    <dl>${fields.filter(x => x[1]).map(([k,v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(Array.isArray(v) ? v.join(", ") : v)}</dd>`).join("")}</dl>
    <button class="favorite-action" id="detailFavorite">${isFavorite(entry.id) ? "★ Aus Favoriten entfernen" : "☆ Zu Favoriten hinzufügen"}</button>`;
  $("detailFavorite").addEventListener("click", () => toggleFavorite(entry.id));
  panel.hidden = false;
}
$("closeDetail").addEventListener("click", () => $("detailPanel").hidden = true);
["searchInput","carsToggle","moneyToggle","favoritesToggle"].forEach(id => $(id).addEventListener(id === "searchInput" ? "input" : "change", render));
$("themeBtn").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const dark = document.documentElement.classList.contains("dark");
  localStorage.setItem("gta6-dark", dark ? "1" : "0");
  $("themeBtn").textContent = dark ? "☀" : "☾";
});
if (localStorage.getItem("gta6-dark") === "1") {
  document.documentElement.classList.add("dark"); $("themeBtn").textContent = "☀";
}

async function loadData() {
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("data.json konnte nicht geladen werden");
    const data = await response.json();
    entries = data.eintraege || [];
    render();
  } catch (error) {
    $("entryList").textContent = "Die Datendatei data.json konnte nicht geladen werden. Bitte Seite neu laden.";
    console.error(error);
  }
}
loadData();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(console.warn));
}
