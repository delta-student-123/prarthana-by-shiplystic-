with open('temples/jagannath-puri.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'prasad' in line.lower() and 'maha' in line.lower():
        print(f"Line {i+1}: {repr(line)}")
