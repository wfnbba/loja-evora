import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
for line in lines:
    # 1. Image property
    if 'image:' in line and not line.strip().startswith('//'):
        # Reset any mess to the base variable name
        line = re.sub(r'(image:\s*)([a-zA-Z][a-zA-Z0-9.]+)', r'\1\2', line)
        parts = re.split(r'(image:\s*)', line)
        if len(parts) > 2:
            var_part = parts[2].split(',')[0].split('}')[0].strip()
            clean_var = var_part.split('.')[0]
            # Handle specific typos/mappings
            if clean_var == 'cintoOffwhiteee': clean_var = 'cintoOffwhiteeee'
            if clean_var == 'feedbackCalcaOffWhiteee': clean_var = 'feedbackCalcaOffWhitee'
            if clean_var == 'saiaRendaa' and 'saia-renda-romantique' not in "".join(lines[lines.index(line)-20:lines.index(line)]):
                 # if we are not in saia-renda-romantique product, maybe it's just saiaRendaaa? 
                 # Actually saiaRendaaa is the import name for saia-renda product images.
                 pass
            
            # Decide if it needs .url
            needs_url = False
            for p in ['alvorada', 'aurora', 'monument', 'satin', 'saia', 'calca', 'cinto', 'feedback', 'video', 'conjunto']:
                if clean_var.startswith(p):
                    needs_url = True
                    break
            
            replacement = f"{clean_var}.url" if needs_url else clean_var
            line = line.replace(var_part, replacement)
    
    # 2. Images array
    if 'images:' in line and '[' in line and ']' in line:
        start = line.find('[')
        end = line.find(']')
        arr_str = line[start+1:end]
        items = arr_str.split(',')
        new_items = []
        for it in items:
            it = it.strip()
            if not it: continue
            if it.startswith('"') or it.startswith("'"):
                new_items.append(it)
                continue
            clean = it.split('.')[0]
            # Asset logic
            needs_url = False
            for p in ['alvorada', 'aurora', 'monument', 'satin', 'saia', 'calca', 'cinto', 'feedback', 'video', 'conjunto']:
                if clean.startswith(p):
                    needs_url = True
                    break
            new_items.append(f"{clean}.url" if needs_url else clean)
        line = line[:start+1] + ", ".join(new_items) + line[end:]

    output.append(line)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.writelines(output)
