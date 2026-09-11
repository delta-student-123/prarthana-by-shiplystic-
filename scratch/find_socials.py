import re

with open(r'C:\Users\Dell\.gemini\antigravity-ide\brain\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\.system_generated\steps\680\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

for match in re.findall(r'href=[\'"][^\'"]*(?:facebook|instagram|youtube|linkedin)[^\'"]*[\'"]', text, re.IGNORECASE):
    print(match)
