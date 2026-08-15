import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix potential double .url.url or weirdness from previous script
content = content.replace('.url.url', '.url')
content = content.replace('.urle.url', '.url')
content = content.replace('cintoOffwhit.url', 'cintoOffwhite.url')

# Ensure variables used as images always have .url (if missing)
# This handles cases like image: p1b (where p1b is an import)
content = re.sub(r'image:\s*([a-zA-Z][a-zA-Z0-9]*)(?!\.url)', r'image: \1.url', content)

# But wait, p1b is an image/jpeg import, not a .json asset with .url (according to L1-27)
# Let's check L1-27 again.
# L7: import p1b from "@/assets/products/p1-b.jpg";
# L34: import alvorada1 from "@/assets/products/alvorada-v3-1.png.asset.json";
# Standard images (.jpg) DON'T have .url.
# Optimized images (.asset.json) DO have .url.

def smart_fix(match):
    prefix = match.group(1)
    var_name = match.group(2)
    # List of variables that ARE asset.json (need .url)
    json_assets = [
        'alvorada', 'auroraCafe', 'auroraMarfim', 'monumentNoir', 
        'satinEspresso', 'saiaChiffon', 'saiaRenda', 'calcaOffWhite',
        'cintoOffwhite', 'cintoEspresso', 'conjuntoEspresso',
        'feedbackAuroraCafe', 'feedbackMonumentNoir', 'feedbackAlvorada',
        'feedbackCalcaOffWhite', 'videoAuroraCafe', 'videoCalcaOffWhite'
    ]
    
    needs_url = False
    for ja in json_assets:
        if var_name.startswith(ja):
            needs_url = True
            break
            
    if needs_url:
        return f"{prefix}{var_name}.url"
    else:
        return f"{prefix}{var_name}"

# Fix product images lists
def fix_list(match):
    items = match.group(1).split(',')
    fixed = []
    for item in items:
        item = item.strip()
        if not item: continue
        # If it's already a string or already has .url, keep it
        if item.startswith('"') or item.startswith("'") or '.url' in item:
            fixed.append(item)
            continue
        # Check if it needs .url
        fixed.append(smart_fix(('', item))[1])
    return f"images: [{', '.join(fixed)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', fix_list, content)

# Fix individual image properties
content = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9]*)(?!\.url)', smart_fix, content)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
