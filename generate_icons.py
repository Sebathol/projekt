#!/usr/bin/env python3
"""
Icon Generator für Von der Idee zum Prototyp PWA
Generiert alle benötigten Icons in verschiedenen Größen
"""

from PIL import Image, ImageDraw
import os

# Icon-Größen für PWA
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Farben (Orange Gradient)
COLOR_START = (245, 158, 11)   # #f59e0b
COLOR_END = (234, 88, 12)       # #ea580c
WHITE = (255, 255, 255)

def create_gradient(size):
    """Erstelle einen orange Gradient-Hintergrund"""
    image = Image.new('RGB', (size, size), COLOR_START)
    draw = ImageDraw.Draw(image)

    # Vertikaler Gradient
    for y in range(size):
        ratio = y / size
        r = int(COLOR_START[0] + (COLOR_END[0] - COLOR_START[0]) * ratio)
        g = int(COLOR_START[1] + (COLOR_END[1] - COLOR_START[1]) * ratio)
        b = int(COLOR_START[2] + (COLOR_END[2] - COLOR_START[2]) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    return image, draw

def draw_lightbulb(draw, size):
    """Zeichne eine Glühbirne als Icon"""
    center_x = size // 2
    center_y = int(size * 0.4)
    radius = int(size * 0.2)

    # Glühbirne (Kreis)
    bbox = [
        center_x - radius,
        center_y - radius,
        center_x + radius,
        center_y + radius
    ]
    draw.ellipse(bbox, fill=WHITE)

    # Lichtstrahlen
    ray_length = int(size * 0.1)
    line_width = max(2, int(size * 0.02))

    for i in range(8):
        import math
        angle = (math.pi * 2 / 8) * i
        start_x = center_x + int(math.cos(angle) * (radius + size * 0.05))
        start_y = center_y + int(math.sin(angle) * (radius + size * 0.05))
        end_x = center_x + int(math.cos(angle) * (radius + size * 0.05 + ray_length))
        end_y = center_y + int(math.sin(angle) * (radius + size * 0.05 + ray_length))

        draw.line([(start_x, start_y), (end_x, end_y)], fill=WHITE, width=line_width)

    # Sockel
    base_width = int(size * 0.15)
    base_height = int(size * 0.15)
    base_y = center_y + radius

    base_bbox = [
        center_x - base_width // 2,
        base_y,
        center_x + base_width // 2,
        base_y + base_height
    ]
    draw.rectangle(base_bbox, fill=WHITE)

    # Gewinde-Linien
    thread_count = 3
    thread_spacing = base_height // (thread_count + 1)
    thread_width = max(1, int(size * 0.015))

    for i in range(1, thread_count + 1):
        y = base_y + thread_spacing * i
        draw.line([
            (center_x - base_width // 2, y),
            (center_x + base_width // 2, y)
        ], fill=COLOR_START, width=thread_width)

def generate_icon(size, output_dir='icons'):
    """Generiere ein Icon in der gegebenen Größe"""
    # Erstelle Gradient-Hintergrund
    image, draw = create_gradient(size)

    # Zeichne Glühbirne
    draw_lightbulb(draw, size)

    # Speichere Icon
    os.makedirs(output_dir, exist_ok=True)
    filename = f'icon-{size}x{size}.png'
    filepath = os.path.join(output_dir, filename)

    image.save(filepath, 'PNG', optimize=True)
    print(f'✓ Erstellt: {filepath}')

    return filepath

def main():
    """Generiere alle Icons"""
    print('🎨 Generiere PWA Icons...\n')

    for size in SIZES:
        generate_icon(size)

    print(f'\n✅ Alle {len(SIZES)} Icons erfolgreich generiert!')
    print(f'📁 Gespeichert in: ./icons/')

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print('❌ Fehler: PIL (Pillow) nicht installiert.')
        print('Installiere mit: pip install Pillow')
    except Exception as e:
        print(f'❌ Fehler: {e}')
