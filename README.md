# abfahre.de

Statische Seite ohne Build-Schritt: HTML, CSS und etwas JavaScript.

## Lokal testen

Die Seite muss über einen lokalen Webserver laufen. Direkt per Doppelklick (`file://`) funktioniert sie nicht, weil die Pfade absolut sind (`/css/os.css`).

Einmalig die Abhängigkeiten installieren:

```sh
pnpm install
```

Dann starten:

```sh
pnpm dev
```

Und [http://localhost:8353](http://localhost:8353) im Browser öffnen. Beenden mit `Ctrl+C`.

Ohne Node geht es auch mit Python:

```sh
python3 -m http.server 8353
```

## Hinweise

- Den „Alltag.exe reagiert nicht“-Dialog gibt es nur beim ersten Besuch. Wieder anzeigen über Startmenü → „Alltag beenden“ oder im Browser `localStorage.removeItem("abfahre-alltag")` ausführen.
- YouTube blockiert das Jochen-Video lokal manchmal („Video nicht verfügbar“). Auf abfahre.de läuft es.
- Fakten und Memes kommen von externen APIs, dafür braucht es Internet.
- Handyansicht: in den Browser-Entwicklertools die Gerätesimulation einschalten, unter 720 px Breite wird der Desktop zum Homescreen.

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Desktop mit Fakt und Meme |
| `jochen.html`, `wolle.html` | Unterseiten als Fenster |
| `css/os.css` | Gemeinsames Design |
| `js/os.js` | Icons, Taskleiste, Fenster, Terminal, Sticker |
| `flappyeagle/` | FlappyEagle-Spiel |

## Deploy

Jeder Push deployt automatisch über IONOS Deploy Now (`.github/workflows/deploy-now.yaml`).
