import os
import re

def ensure_all_images():
    with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Mapeamento robusto baseado no que vimos no sistema de arquivos anteriormente
    mapping = {
        "vestido-aurora-marfim": ["auroraMarfim1", "auroraMarfim2", "auroraMarfim3", "auroraMarfim4", "auroraMarfim5", "auroraMarfim6", "auroraMarfim7", "auroraMarfim8", "auroraMarfim9", "auroraMarfim10"],
        "colete-alvorada": ["alvorada1", "alvorada2", "alvorada3", "alvorada4", "alvorada5", "alvorada6", "alvorada7", "alvorada8", "alvorada9", "alvorada10"],
        "vestido-aurora-cafe": ["auroraCafe1", "auroraCafe2", "auroraCafe3", "auroraCafe4", "auroraCafe5", "auroraCafe6", "auroraCafe7", "auroraCafe8", "auroraCafe9", "auroraCafe10"],
        "vestido-monument-noir": ["monumentNoir1", "monumentNoir2", "monumentNoir3", "monumentNoir4", "monumentNoir5", "monumentNoir6", "monumentNoir7", "monumentNoir8", "monumentNoir9", "monumentNoir10"],
        "vestido-satin-espresso": ["satinEspresso1", "satinEspresso2", "satinEspresso3", "satinEspresso4", "satinEspresso5", "satinEspresso6", "satinEspresso7"],
        "saia-chiffon-rose": ["saiaChiffon1", "saiaChiffon2", "saiaChiffon3", "saiaChiffon4", "saiaChiffon5", "saiaChiffon6", "saiaChiffon7", "saiaChiffon8", "saiaChiffon9", "saiaChiffon10"],
        "saia-renda-off-white": ["saiaRendaaa1", "saiaRendaaa2", "saiaRendaaa3", "saiaRendaaa4", "saiaRendaaa5", "saiaRendaaa6", "saiaRendaaa7", "saiaRendaaa8", "saiaRendaaa9", "saiaRendaaa10"],
        "calca-off-white": ["calcaOffWhite1", "calcaOffWhite2", "calcaOffWhite3", "calcaOffWhite4", "calcaOffWhite5", "calcaOffWhite7", "calcaOffWhite8", "calcaOffWhite9", "calcaOffWhite10"],
        "conjunto-espresso-alfaiataria": ["conjuntoEspresso1", "conjuntoEspresso2", "conjuntoEspresso3", "conjuntoEspresso4", "conjuntoEspresso5", "conjuntoEspresso6", "conjuntoEspresso7", "conjuntoEspresso8", "conjuntoEspresso9", "conjuntoEspresso10"],
        "conjunto-evora-rose": ["ig0", "ig1", "ig2", "ig3", "ig4", "ig5"], # Exemplo de fallback usando ig assets
        "vestido-evora-aurora-rose": ["ig0", "ig1", "ig2", "ig3", "ig4", "ig5"],
    }

    # Iterar sobre cada produto e forçar a lista de imagens
    for pid, imgs in mapping.items():
        # Procurar por id: "pid" seguido de images: [qualquer coisa]
        pattern = rf'(id:\s*"{pid}",.*?images:\s*\[)(.*?)(\])'
        
        def replacement(match):
            prefix = match.group(1)
            # Gerar string de imagens no formato [img1.url, img2.url, ...]
            new_imgs = ", ".join([f"{img}.url" for img in imgs])
            suffix = match.group(3)
            return f"{prefix}{new_imgs}{suffix}"
            
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    ensure_all_images()
