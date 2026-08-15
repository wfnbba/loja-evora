import re
import sys

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix product images lists (adding .url where missing)
# We look for variables like ig0, p1b, etc. inside brackets [ ]
def fix_image_list(match):
    items = match.group(1).split(',')
    fixed_items = []
    for item in items:
        item = item.strip()
        if not item: continue
        # If it doesn't have .url and is a variable name (like ig0, p1b)
        if re.match(r'^[a-zA-Z][a-zA-Z0-9]*$', item):
            fixed_items.append(f"{item}.url")
        else:
            fixed_items.append(item)
    return f"images: [{', '.join(fixed_items)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', fix_image_list, content)

# 2. Fix review images (adding .url where missing)
# Pattern: image: p1b
def fix_review_image(match):
    var_name = match.group(1)
    return f"image: {var_name}.url"

# Only if it's a variable name without .url
content = re.sub(r'image:\s*([a-zA-Z][a-zA-Z0-9]*)(?!\.url)', fix_review_image, content)

# 3. Specific fixes for edge cases discovered
# Some items were already correct but might have been double-dotted by previous generic regex if not careful
# but my regexes above (?!.url) and strict variable name matching should be safe.

# 4. Correcting IDs or structure if needed (based on previous breaks)
# The user said images disappeared. Most likely because p1b (an imported object) was passed instead of p1b.url (a string).

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
