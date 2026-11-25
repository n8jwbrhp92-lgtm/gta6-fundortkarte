GTA 6 – FUNDORTKARTE (DEUTSCH)
================================

WICHTIG ZUR DATENLAGE
- Die Einträge in data.json sind ausschließlich Beispieldaten/Platzhalter.
- Es sind keine Fundorte oder Spielwerte als bestätigt gekennzeichnet.
- Es gibt keine Live-Schnittstelle zu GTA 6 oder gtabase.com.
- Informationen müssen manuell recherchiert, geprüft und in data.json eingetragen werden.
- Keine Original-Kartenbilder von Rockstar oder Drittseiten verwenden.

DATEIEN
- index.html: Seitenaufbau
- styles.css: Layout, Farben, mobile Darstellung
- app.js: Karte, Suche, Filter, Favoriten, Details
- data.json: Alle Fahrzeuge und Geldquellen; hier pflegst du Inhalte
- karte.svg: eigene schematische Platzhalter-Karte
- manifest.webmanifest, icon.svg: PWA-Name und App-Symbol
- sw.js: Offline-Grundgerüst und Aktualisierung der Datendatei

DATEN ÄNDERN
1. data.json in einem Texteditor öffnen.
2. Einen vorhandenen Eintrag kopieren und die Werte ändern oder einen neuen Eintrag ergänzen.
3. Jeder Eintrag braucht eine eindeutige id, category ("auto" oder "geld"), name,
   status ("beispiel" oder "bestaetigt") und position mit x/y.
4. x liegt zwischen 0 und 1600, y zwischen 0 und 1000. Die Werte beziehen sich auf
   die schematische Karte. Passe sie visuell an.
5. JSON-Syntax beachten: doppelte Anführungszeichen, Kommas zwischen Feldern,
   kein Komma nach dem letzten Feld.
6. Datei hochladen/committen und die App im Safari neu laden.

FAKTENSTATUS
- status: "beispiel" zeigt einen gelben Platzhalter-Hinweis.
- status: "bestaetigt" zeigt einen grünen Hinweis. Nur verwenden, wenn du den Fund
  selbst anhand zuverlässiger Quellen überprüft hast.

ONLINE STELLEN MIT GITHUB PAGES
1. Auf github.com kostenlos anmelden.
2. Neues öffentliches Repository anlegen, z. B. gta6-fundortkarte.
3. Alle Dateien aus diesem Projekt direkt in das Repository hochladen (nicht nur
   den ZIP-Ordner als ZIP-Datei).
4. In Settings > Pages bei "Build and deployment" die Quelle "Deploy from a branch"
   wählen, Branch "main", Ordner "/ (root)", dann Save.
5. Nach der Veröffentlichung die angezeigte https://...github.io/... Adresse öffnen.

AUF DEM IPHONE INSTALLIEREN
1. Den veröffentlichten Link in Safari öffnen (nicht in einem In-App-Browser).
2. Auf Teilen tippen.
3. "Zum Home-Bildschirm" wählen.
4. Namen bestätigen und "Hinzufügen" tippen.

HINWEISE
- PWA-Installation und Service Worker benötigen HTTPS; GitHub Pages liefert HTTPS.
- Leaflet wird von einem CDN geladen. Für die erste Anzeige ist Internet nötig.
- Die schematische Karte ist kein echter GTA-6-Stadtplan und nicht geografisch korrekt.
- Nach Änderung von data.json die Seite neu laden. Falls alte Daten angezeigt werden,
  Safari einmal vollständig schließen und erneut öffnen.
- Dies ist ein Fan-Projekt und steht in keiner Verbindung zu Rockstar Games.
