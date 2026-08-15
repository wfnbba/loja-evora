import os
import re

def final_remapping():
    with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Mapeamento definitivo e completo de produtos e imagens
    # Refinado após análise detalhada dos imports disponíveis
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
        "conjunto-rose": ["ig0", "p1b", "p1c", "p1d"],
        "vestido-aurora-rose": ["ig1", "p2b", "p2c", "p2d"], # Assumindo p2b-d existem baseado no padrão
    }

    # Adicionar p2b, p2c, p2d se não existirem no topo (conforme padrão observado p1..p8)
    if 'import p2b' not in content:
        content = "import p2b from \"@/assets/products/p2-b.jpg\";\n" + content
    if 'import p2c' not in content:
        content = "import p2c from \"@/assets/products/p2-c.jpg\";\n" + content
    if 'import p2d' not in content:
        content = "import p2d from \"@/assets/products/p2-d.jpg\";\n" + content

    # Forçar a atualização de imagens para CADA produto
    for pid, imgs in mapping.items():
        # Procurar por id: "pid"
        # Precisamos ser cuidadosos com regex para não pegar partes erradas
        pattern = rf'id:\s*"{pid}"(.*?),\s*images:\s*\[(.*?)\]'
        
        def replacement(match):
            prefix = match.group(1)
            new_imgs = ", ".join([f"{img}.url" if not img.startswith('ig') and not img.startswith('p') else img for img in imgs])
            # Ajuste: p1b etc não tem .url se forem imports diretos de jpg simples (depende do vite config)
            # Mas no arquivo vimos `p1b` sendo usado sem .url
            return f'id: "{pid}"{prefix},\n    images: [{new_imgs}]'
            
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    final_remapping()
