import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Get all imported variables
imports = set(re.findall(r'import\s+([a-zA-Z0-9_]+)\s+from', content))

# Get all references to .url
refs = re.findall(r'([a-zA-Z0-9_]+)\.url', content)

missing = []
for ref in refs:
    if ref not in imports:
        missing.append(ref)

if missing:
    print(f"Found {len(set(missing))} missing imports:")
    for m in sorted(set(missing))[:20]:
        print(f"  - {m}")
else:
    print("All .url references have corresponding imports!")

