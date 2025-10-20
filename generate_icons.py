#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

def create_icon(size, filename):
    # Erstelle Bild mit Transparenz
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Gradient-Hintergrund simulieren (einfache Version mit zwei Farben)
    # Von #667eea zu #764ba2
    for y in range(size):
        # Interpoliere zwischen den Farben
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Abgerundete Ecken
    radius = int(size * 0.2)
    corner_size = radius * 2

    # Erstelle Maske für abgerundete Ecken
    mask = Image.new('L', (size, size), 255)
    mask_draw = ImageDraw.Draw(mask)

    # Zeichne abgerundetes Rechteck
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)

    # Wende Maske an
    img.putalpha(mask)

    # Zeichne Sonne
    sun_radius = int(size * 0.12)
    sun_center = (size // 2, int(size * 0.35))
    sun_color = (255, 215, 0, 230)
    draw.ellipse([
        sun_center[0] - sun_radius,
        sun_center[1] - sun_radius,
        sun_center[0] + sun_radius,
        sun_center[1] + sun_radius
    ], fill=sun_color)

    # Zeichne Wolke (drei überlappende Ellipsen)
    cloud_y = int(size * 0.58)
    cloud_size = int(size * 0.14)
    cloud_color = (255, 255, 255, 240)

    # Linke Ellipse
    draw.ellipse([
        int(size * 0.39) - cloud_size,
        cloud_y - int(cloud_size * 0.7),
        int(size * 0.39) + cloud_size,
        cloud_y + int(cloud_size * 0.7)
    ], fill=cloud_color)

    # Mittlere Ellipse (größer)
    draw.ellipse([
        int(size * 0.49) - int(cloud_size * 1.15),
        cloud_y - int(size * 0.04) - int(cloud_size * 0.85),
        int(size * 0.49) + int(cloud_size * 1.15),
        cloud_y - int(size * 0.04) + int(cloud_size * 0.85)
    ], fill=cloud_color)

    # Rechte Ellipse
    draw.ellipse([
        int(size * 0.59) - cloud_size,
        cloud_y - int(cloud_size * 0.7),
        int(size * 0.59) + cloud_size,
        cloud_y + int(cloud_size * 0.7)
    ], fill=cloud_color)

    # Zeichne Text "°C"
    try:
        # Versuche eine Schriftart zu laden
        font_size = int(size * 0.2)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
            except:
                font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()

    text = "°C"
    # Berechne Textposition (zentriert)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (size - text_width) // 2
    text_y = int(size * 0.82) - text_height // 2

    draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)

    # Speichere Bild
    img.save(filename, 'PNG')
    print(f'Icon erstellt: {filename}')

if __name__ == '__main__':
    create_icon(192, 'icon-192.png')
    create_icon(512, 'icon-512.png')
    print('Alle Icons erfolgreich erstellt!')
