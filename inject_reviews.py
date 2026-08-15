import json
import re

with open('unique_feedbacks.json', 'r', encoding='utf-8') as f:
    unique_data = json.load(f)

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For each product, we need to find its 'reviews: [...]' block and replace it.
# We'll search for the product ID, then find the next 'reviews: [' block.

for pid, reviews in unique_data.items():
    # Find the product block by its ID
    # Look for id: "pid"
    pid_pattern = f'id: "{pid}"'
    pid_pos = content.find(pid_pattern)
    if pid_pos == -1:
        # Try single quotes just in case
        pid_pattern = f"id: '{pid}'"
        pid_pos = content.find(pid_pattern)
        
    if pid_pos != -1:
        # Find the next 'reviews: [' after this ID
        reviews_start_marker = 'reviews: ['
        start_idx = content.find(reviews_start_marker, pid_pos)
        
        if start_idx != -1:
            # Find the closing ']' of the reviews array. 
            # This is tricky because of nested objects. We'll count brackets.
            bracket_count = 0
            end_idx = -1
            for i in range(start_idx + len(reviews_start_marker) - 1, len(content)):
                if content[i] == '[':
                    bracket_count += 1
                elif content[i] == ']':
                    bracket_count -= 1
                    if bracket_count == 0:
                        end_idx = i + 1
                        break
            
            if end_idx != -1:
                # Convert reviews list to a formatted JS string
                js_reviews = "reviews: [\n"
                for r in reviews:
                    js_r = f'      {{ user: "{r["user"]}", comment: "{r["comment"]}", rating: {r["rating"]}'
                    if "image" in r:
                        if r["image"].endswith(".url"):
                            js_r += f', image: {r["image"]}'
                        else:
                            js_r += f', image: {r["image"]}'
                    js_r += " },"
                    js_reviews += js_r + "\n"
                js_reviews += "    ]"
                
                # Replace the old reviews block with the new one
                content = content[:start_idx] + js_reviews + content[end_idx:]

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)
