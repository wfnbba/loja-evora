import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. First, strip ALL occurrences of ".url" and anything concatenated after it inside image property or image arrays
# This will reset the messy ".urle.url1.url" etc. back to the variable names.
def reset_vars(match):
    prefix = match.group(1)
    messy_path = match.group(2)
    # Extract the clean variable name (the part before the first dot)
    clean_var = messy_path.split('.')[0]
    return f"{prefix}{clean_var}"

# Handle image: messy.url...
content = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9.]+)', reset_vars, content)
# Handle images: [messy.url, messy.url]
def reset_list(match):
    items = match.group(1).split(',')
    fixed = []
    for item in items:
        item = item.strip()
        if not item: continue
        if item.startswith('"') or item.startswith("'"):
            fixed.append(item)
            continue
        clean_var = item.split('.')[0]
        fixed.append(clean_var)
    return f"images: [{', '.join(fixed)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', reset_list, content)

# 2. Fix typos in variable names
content = content.replace('cintoOffwhit', 'cintoOffwhite')
content = content.replace('feedbackCalcaOffWhit', 'feedbackCalcaOffWhite')
content = content.replace('saiaRend', 'saiaRenda')

# 3. Now selectively re-add .url ONLY to the optimized assets (.json imports)
json_assets = [
    'alvorada', 'auroraCafe', 'auroraMarfim', 'monumentNoir', 
    'satinEspresso', 'saiaChiffon', 'saiaRenda', 'calcaOffWhite',
    'cintoOffwhite', 'cintoEspresso', 'conjuntoEspresso',
    'feedbackAuroraCafe', 'feedbackMonumentNoir', 'feedbackAlvorada',
    'feedbackCalcaOffWhite', 'videoAuroraCafe', 'videoCalcaOffWhite'
]

def add_url(match):
    prefix = match.group(1)
    var_name = match.group(2)
    needs_url = False
    for ja in json_assets:
        if var_name.startswith(ja):
            needs_url = True
            break
    if needs_url:
        return f"{prefix}{var_name}.url"
    else:
        return f"{prefix}{var_name}"

content = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9]*)', add_url, content)

def add_url_list(match):
    items = match.group(1).split(',')
    fixed = []
    for item in items:
        item = item.strip()
        if not item: continue
        if item.startswith('"') or item.startswith("'"):
            fixed.append(item)
            continue
        needs_url = False
        for ja in json_assets:
            if item.startswith(ja):
                needs_url = True
                break
        if needs_url:
            fixed.append(f"{item}.url")
        else:
            fixed.append(item)
    return f"images: [{', '.join(fixed)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', add_url_list, content)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
