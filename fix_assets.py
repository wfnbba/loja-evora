import os
import json
import re

# Definição dos mapeamentos de produtos e suas imagens extras baseadas no que está no disco
# Puxando do que foi listado no `ls -R` anterior
product_images_map = {
    "vestido-aurora-marfim": ["auroraMarfim1", "auroraMarfim2", "auroraMarfim3", "auroraMarfim4", "auroraMarfim5", "auroraMarfim6", "auroraMarfim7", "auroraMarfim8", "auroraMarfim9", "auroraMarfim10"],
    "colete-alvorada": ["alvorada1", "alvorada2", "alvorada3", "alvorada4", "alvorada5", "alvorada6", "alvorada7", "alvorada8", "alvorada9", "alvorada10"],
    "vestido-aurora-cafe": ["auroraCafe1", "auroraCafe2", "auroraCafe3", "auroraCafe4", "auroraCafe5", "auroraCafe6", "auroraCafe7", "auroraCafe8", "auroraCafe9", "auroraCafe10"],
    "vestido-monument-noir": ["monumentNoir1", "monumentNoir2", "monumentNoir3", "monumentNoir4", "monumentNoir5", "monumentNoir6", "monumentNoir7", "monumentNoir8", "monumentNoir9", "monumentNoir10"],
    "vestido-satin-espresso": ["satinEspresso1", "satinEspresso2", "satinEspresso3", "satinEspresso4", "satinEspresso5", "satinEspresso6", "satinEspresso7"],
    "saia-chiffon-rose": ["saiaChiffon1", "saiaChiffon2", "saiaChiffon3", "saiaChiffon4", "saiaChiffon5", "saiaChiffon6", "saiaChiffon7", "saiaChiffon8", "saiaChiffon9", "saiaChiffon10"],
    "saia-renda-off-white": ["saiaRendaaa1", "saiaRendaaa2", "saiaRendaaa3", "saiaRendaaa4", "saiaRendaaa5", "saiaRendaaa6", "saiaRendaaa7", "saiaRendaaa8", "saiaRendaaa9", "saiaRendaaa10"],
    "calca-off-white": ["calcaOffWhite1", "calcaOffWhite2", "calcaOffWhite3", "calcaOffWhite4", "calcaOffWhite5", "calcaOffWhite7", "calcaOffWhite8", "calcaOffWhite9", "calcaOffWhite10"],
    "conjunto-espresso-alfaiataria": ["conjuntoEspresso1", "conjuntoEspresso2", "conjuntoEspresso3", "conjuntoEspresso4", "conjuntoEspresso5", "conjuntoEspresso6", "conjuntoEspresso7", "conjuntoEspresso8", "conjuntoEspresso9", "conjuntoEspresso10"]
}

# Mapeamento de feedbacks (imagens de unboxing)
feedback_images_map = {
    "vestido-aurora-marfim": ["feedbackMarfim1", "feedbackMarfim2", "feedbackMarfim3", "feedbackMarfim4", "feedbackMarfim5", "feedbackMarfim6", "feedbackMarfim7", "feedbackMarfim8", "feedbackMarfim9", "feedbackMarfim10"],
    "colete-alvorada": ["feedbackAlvoradaa1", "feedbackAlvoradaa2", "feedbackAlvoradaa3", "feedbackAlvoradaa4", "feedbackAlvoradaa5", "feedbackAlvoradaa6", "feedbackAlvoradaa7", "feedbackAlvoradaa8"],
    "vestido-aurora-cafe": ["feedbackAuroraCafe1", "feedbackAuroraCafe2", "feedbackAuroraCafe3", "feedbackAuroraCafe4", "feedbackAuroraCafe5", "feedbackAuroraCafe6", "feedbackAuroraCafe7", "feedbackAuroraCafe8", "feedbackAuroraCafe9"],
    "vestido-monument-noir": ["feedbackMonumentNoir1", "feedbackMonumentNoir2", "feedbackMonumentNoir3", "feedbackMonumentNoir4", "feedbackMonumentNoir5", "feedbackMonumentNoir6", "feedbackMonumentNoir7", "feedbackMonumentNoir8", "feedbackMonumentNoir9"],
    "vestido-satin-espresso": ["feedbackEspresso1", "feedbackEspresso2", "feedbackEspresso3", "feedbackEspresso4", "feedbackEspresso5", "feedbackEspresso6", "feedbackEspresso7", "feedbackEspresso8"],
    "saia-chiffon-rose": ["feedbackChiffon1", "feedbackChiffon2", "feedbackChiffon3", "feedbackChiffon4", "feedbackChiffon5", "feedbackChiffon6", "feedbackChiffon7", "feedbackChiffon8", "feedbackChiffon9"],
    "calca-off-white": ["feedbackCalcaOffWhiteeee1", "feedbackCalcaOffWhiteeee2", "feedbackCalcaOffWhiteeee3", "feedbackCalcaOffWhiteeee4", "feedbackCalcaOffWhiteeee5", "feedbackCalcaOffWhiteeee6", "feedbackCalcaOffWhiteeee7", "feedbackCalcaOffWhiteeee8", "feedbackCalcaOffWhiteeee9"],
    "conjunto-espresso-alfaiataria": ["feedbackEspressoAlfaiataria1", "feedbackEspressoAlfaiataria2", "feedbackEspressoAlfaiataria3", "feedbackEspressoAlfaiataria4", "feedbackEspressoAlfaiataria5", "feedbackEspressoAlfaiataria6", "feedbackEspressoAlfaiataria7", "feedbackEspressoAlfaiataria8", "feedbackEspressoAlfaiataria9", "feedbackEspressoAlfaiataria10"]
}

def fix_products_data():
    with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Corrigir imagens dos produtos
    for product_id, images in product_images_map.items():
        pattern = rf'id:\s*"{product_id}"(.*?),\s*images:\s*\[(.*?)\]'
        
        def replace_images(match):
            prefix = match.group(1)
            new_images_list = ", ".join([f"{img}.url" for img in images])
            return f'id: "{product_id}"{prefix},\n    images: [{new_images_list}]'
        
        content = re.sub(pattern, replace_images, content, flags=re.DOTALL)

    # 2. Corrigir imagens dos feedbacks (reviews)
    product_blocks = re.split(r'(\{ id: "[a-z0-9-]+"\,)', content)
    
    new_content_parts = [product_blocks[0]]
    for i in range(1, len(product_blocks), 2):
        header = product_blocks[i]
        body = product_blocks[i+1]
        
        id_match = re.search(r'id: "([a-z0-9-]+)"', header)
        if id_match:
            pid = id_match.group(1)
            if pid in feedback_images_map:
                f_imgs = feedback_images_map[pid]
                reviews_match = re.search(r'reviews:\s*\[(.*?)\]', body, re.DOTALL)
                if reviews_match:
                    reviews_text = reviews_match.group(1)
                    review_items = re.split(r'(\{[^}]+\})', reviews_text)
                    
                    img_idx = 0
                    new_review_items = []
                    for item in review_items:
                        if item.strip() == ',' or not item.strip():
                            new_review_items.append(item)
                            continue
                            
                        if 'rating: 5.0' in item:
                            if img_idx < len(f_imgs):
                                if 'image:' in item:
                                    new_item = re.sub(r'image: [a-zA-Z0-9_.]+', f'image: {f_imgs[img_idx]}.url', item)
                                else:
                                    new_item = item.replace('rating: 5.0', f'rating: 5.0, image: {f_imgs[img_idx]}.url')
                                new_review_items.append(new_item)
                                img_idx += 1
                            else:
                                new_review_items.append(item)
                        else:
                            new_review_items.append(item)
                    
                    new_reviews_text = "".join(new_review_items)
                    body = body.replace(reviews_text, new_reviews_text)
        
        new_content_parts.append(header)
        new_content_parts.append(body)

    final_content = "".join(new_content_parts)
    
    with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
        f.write(final_content)

if __name__ == "__main__":
    fix_products_data()
