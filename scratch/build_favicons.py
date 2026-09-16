import os
import glob
from PIL import Image

def generate_favicons():
    # Source master
    master_path = 'scratch/fav_circle_badge_v2.png'
    master = Image.open(master_path).convert('RGBA')

    # Target destinations
    dest_dir = 'images/favicon'
    os.makedirs(dest_dir, exist_ok=True)

    sizes = {
        'favicon-512x512.png': 512,
        'favicon-192x192.png': 192,
        'apple-touch-icon.png': 180,
        'favicon-32x32.png': 32,
        'favicon-16x16.png': 16,
    }

    for filename, s in sizes.items():
        out_path = os.path.join(dest_dir, filename)
        resized = master.resize((s, s), Image.LANCZOS)
        resized.save(out_path, format='PNG', optimize=True)
        print(f'Saved {out_path} ({s}x{s})')

    # Save multi-size favicon.ico
    # Multi-resolution ICO: 48, 32, 16
    img48 = master.resize((48, 48), Image.LANCZOS)
    img32 = master.resize((32, 32), Image.LANCZOS)
    img16 = master.resize((16, 16), Image.LANCZOS)

    ico_path_img = os.path.join(dest_dir, 'favicon.ico')
    ico_path_root = 'favicon.ico'

    # Save to images/favicon/favicon.ico
    img32.save(
        ico_path_img,
        format='ICO',
        sizes=[(48, 48), (32, 32), (16, 16)],
        append_images=[img48, img16]
    )
    # Save to root favicon.ico
    img32.save(
        ico_path_root,
        format='ICO',
        sizes=[(48, 48), (32, 32), (16, 16)],
        append_images=[img48, img16]
    )
    print('Saved multi-resolution favicon.ico to root and images/favicon/')

    # Save root favicon.png (32x32)
    img32.save('favicon.png', format='PNG', optimize=True)
    print('Saved root favicon.png')

    # Update cache version ?v=5 across all HTML files
    html_files = glob.glob('**/*.html', recursive=True)
    updated_count = 0
    for hf in html_files:
        if 'node_modules' in hf or '.git' in hf:
            continue
        try:
            with open(hf, 'r', encoding='utf-8') as f:
                content = f.read()
            # Replace old version queries ?v=1, ?v=2, ?v=3, ?v=4 on favicons
            new_content = content
            for old_v in ['?v=1', '?v=2', '?v=3', '?v=4']:
                new_content = new_content.replace(f'.ico{old_v}', '.ico?v=5')
                new_content = new_content.replace(f'32x32.png{old_v}', '32x32.png?v=5')
                new_content = new_content.replace(f'16x16.png{old_v}', '16x16.png?v=5')
                new_content = new_content.replace(f'apple-touch-icon.png{old_v}', 'apple-touch-icon.png?v=5')
                new_content = new_content.replace(f'favicon-512x512.png{old_v}', 'favicon-512x512.png?v=5')
                new_content = new_content.replace(f'favicon-192x192.png{old_v}', 'favicon-192x192.png?v=5')
            
            if new_content != content:
                with open(hf, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_count += 1
        except Exception as e:
            print(f'Error processing {hf}: {e}')

    print(f'Updated favicon cache buster ?v=5 across {updated_count} HTML files.')

if __name__ == '__main__':
    generate_favicons()
