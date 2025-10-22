# PWA Icons

## Icons Generieren

### Option 1: Mit HTML-Tool (Empfohlen)

1. Öffne `generate-icons.html` im Browser
2. Klicke auf "Icons Generieren"
3. Download jeden Icon mit dem "Download" Button
4. Speichere hier in diesem `icons/` Ordner

### Option 2: Mit Python-Script

```bash
# PIL installieren
pip install Pillow

# Icons generieren
python3 generate_icons.py
```

### Option 3: SVG Konvertieren

Nutze das `icon.svg` und konvertiere es mit einem Tool wie:

**Online:**
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

**Lokal (ImageMagick):**
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert -background none -resize ${size}x${size} icon.svg icon-${size}x${size}.png
done
```

## Benötigte Größen

- [x] icon-72x72.png
- [x] icon-96x96.png
- [x] icon-128x128.png
- [x] icon-144x144.png
- [x] icon-152x152.png
- [x] icon-192x192.png
- [x] icon-384x384.png
- [x] icon-512x512.png

## Design

**Farben:**
- Hintergrund: Orange Gradient (#f59e0b → #ea580c)
- Icon: Weiße Glühbirne mit Lichtstrahlen
- Text (optional): "I→P" (Idea to Prototype)

**Symbol:**
- Glühbirne = Idee
- Lichtstrahlen = Innovation
- Orange = Energie & Kreativität
