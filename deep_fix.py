import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reset all messy image property values to their base variable names
def reset_image_prop(match):
    prefix = match.group(1)
    val = match.group(2).strip()
    # If it has dots, take the first part
    clean = val.split('.')[0]
    return f"{prefix}{clean}"

content = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9.]+)', reset_image_prop, content)

# 2. Reset images arrays
def reset_images_array(match):
    items_raw = match.group(1).split(',')
    items = []
    for it in items_raw:
        it = it.strip()
        if not it: continue
        if it.startswith('"') or it.startswith("'"):
            items.append(it)
        else:
            items.append(it.split('.')[0])
    return f"images: [{', '.join(items)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', reset_images_array, content)

# 3. Apply fixes for known variable typos/changes in imports
content = content.replace('saiaRenda.url', 'saiaRendaa.url') # if it existed
content = content.replace('saiaRenda', 'saiaRendaa')
content = content.replace('cintoOffwhit', 'cintoOffwhitee')
content = content.replace('feedbackCalcaOffWhit', 'feedbackCalcaOffWhitee')
content = content.replace('feedbackAlvorad', 'feedbackAlvorada')

# 4. Final pass: ensure variables that ARE JSON assets have .url
# List of patterns that are .json assets
json_patterns = [
    'alvorada', 'auroraCafe', 'auroraMarfim', 'monumentNoir', 
    'satinEspresso', 'saiaChiffon', 'saiaRendaa', 'calcaOffWhite',
    'cintoOffwhitee', 'cintoEspresso', 'conjuntoEspresso',
    'feedback', 'video'
]

def add_url_final(var_name):
    for p in json_patterns:
        if var_name.startswith(p):
            return f"{var_name}.url"
    return var_name

# Fix image: var
def final_prop(match):
    prefix = match.group(1)
    var = match.group(2)
    return f"{prefix}{add_url_final(var)}"

content = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9]*)', final_prop, content)

# Fix images: [var, var]
def final_array(match):
    items_raw = match.group(1).split(',')
    items = []
    for it in items_raw:
        it = it.strip()
        if not it: continue
        if it.startswith('"') or it.startswith("'"):
            items.append(it)
        else:
            items.append(add_url_final(it))
    return f"images: [{', '.join(items)}]"

content = re.sub(r'images:\s*\[([^\]]+)\]', final_array, content)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
