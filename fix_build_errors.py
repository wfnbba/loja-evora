import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix truncated variable names in reviews and image properties
# These usually happen when my regex was too aggressive or when the user's data had slightly different names.

# Map of truncated/wrong names to their correct counterparts (usually the first one available)
replacements = {
    r'feedbackMarfi\.url': 'feedbackMarfim1.url',
    r'feedbackMarfim\.url': 'feedbackMarfim1.url',
    r'feedbackAuroraCaf\.url': 'feedbackAuroraCafe1.url',
    r'feedbackMonumentNoi\.url': 'feedbackMonumentNoir1.url',
    r'feedbackAlvorada\.url': 'feedbackAlvorada1.url',
    r'feedbackEspress\.url': 'feedbackEspresso1.url',
    r'feedbackChiffo\.url': 'feedbackChiffon1.url',
    r'saiaRendaa\.url': 'saiaRendaaa1.url',
    r'saiaRendaaa\.url': 'saiaRendaaa1.url',
    r'cintoEspres\.url': 'cintoEspresso.url',
    r'cintoEspres': 'cintoEspresso',
    r'feedbackEspressoAlfaiatari\.url': 'feedbackEspressoAlfaiataria1.url',
    r'feedbackEspressoAlfaiataria\.url': 'feedbackEspressoAlfaiataria1.url',
}

for old, new in replacements.items():
    content = re.sub(old, new, content)

# 2. Audit the variable names actually imported at the top of the file
# We need to make sure we map to variables that REALLY exist.
# Example: import saiaRendaaa1 from ...
import_matches = re.findall(r'import\s+([a-zA-Z0-9_]+)\s+from', content)
valid_vars = set(import_matches)

def find_best_match(var_name):
    if var_name in valid_vars:
        return var_name
    
    # Try adding a suffix if it's a base name
    for i in range(1, 15):
        if f"{var_name}{i}" in valid_vars:
            return f"{var_name}{i}"
    
    # Try fuzzy matching (simple prefix match)
    for v in valid_vars:
        if v.startswith(var_name):
            return v
    
    return var_name

def fix_references(match):
    prefix = match.group(1)
    var_with_url = match.group(2)
    var_name = var_with_url.split('.')[0]
    
    if var_name not in valid_vars:
        fixed_var = find_best_match(var_name)
        return f"{prefix}{fixed_var}.url"
    
    return f"{prefix}{var_with_url}"

# Apply fuzzy fix to all .url references
content = re.sub(r'(image:\s*|images:\s*\[|,?\s*)([a-zA-Z0-9_]+\.url)', fix_references, content)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
