import random
import re

# Nomes brasileiros femininos comuns
FEMALE_NAMES = [
    "Ana Paula", "Maria Eduarda", "Juliana", "Camila", "Fernanda", "Letícia", "Beatriz", "Gabriela",
    "Mariana", "Larissa", "Amanda", "Jéssica", "Bruna", "Vitória", "Luana", "Isabela", "Rafaela",
    "Patrícia", "Renata", "Aline", "Vanessa", "Priscila", "Débora", "Tatiane", "Bianca", "Carolina",
    "Raquel", "Andréia", "Eliane", "Cristiane", "Mônica", "Soraia", "Tânia", "Gisele", "Daniela",
    "Cláudia", "Silvana", "Sandra", "Marta", "Luciana", "Rosana", "Adriana", "Carla", "Fabiana",
    "Gislaine", "Milena", "Paloma", "Sabrina", "Taís", "Verônica", "Viviane", "Alessandra",
    "Cássia", "Daiane", "Edna", "Flávia", "Glória", "Helena", "Iara", "Ivone", "Janaina", "Karine",
    "Lourdes", "Márcia", "Neusa", "Olívia", "Paula", "Regina", "Sueli", "Tereza", "Ursula", "Zilda"
]

# Sobrenomes comuns
SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"]

def generate_name():
    return f"{random.choice(FEMALE_NAMES)} {random.choice(SURNAMES)[0]}."

# Templates de feedbacks realistas LONGOS (focados em uso, tecido, caimento, ocasião)
# NENHUM deles deve ter "amiga pediu link" ou "loja confiável"
LONG_FEEDBACK_TEMPLATES = [
    "O tecido é maravilhoso, tem um toque acetinado que eu não esperava pelo valor. Usei em um casamento à tarde e recebi muitos elogios. O caimento na cintura ficou perfeito, não marca nada e deixa o corpo bem elegante. Com certeza vou usar muito em outras ocasiões especiais.",
    "Fiquei surpresa com a qualidade do acabamento interno, as costuras são muito bem feitas. A cor é exatamente como na foto, um tom muito sofisticado. O tamanho M serviu como uma luva, tenho 1,65m e o comprimento ficou ideal para usar com salto médio. Chegou rápido e bem embalado.",
    "Amei o detalhe do corte, valoriza muito o colo. O pano é encorpado, então não fica transparente, o que era minha maior preocupação. É uma peça versátil que dá pra usar tanto num jantar mais chic quanto num evento de trabalho. Vale cada centavo pela qualidade que entrega.",
    "Gente, que caimento é esse? Parece que foi feito sob medida para mim. O tecido tem um peso bom, o que ajuda na fluidez da saia. A cor é linda e o brilho é na medida certa, nada exagerado. Já lavei uma vez e continuou perfeito, não encolheu nem desbotou nadinha.",
    "Estava procurando algo assim há tempos para o batizado do meu afilhado. A peça é super confortável, não aperta e permite movimento. O design é moderno mas mantém aquele ar clássico que eu adoro. A entrega foi super pontual e veio com um cheirinho maravilhoso na caixa.",
    "O tecido é muito fresco, ótimo para o clima aqui do Brasil. A modelagem é generosa, então o G ficou bem confortável sem parecer largo demais. Adorei a versatilidade, trocando os acessórios dá pra mudar completamente o estilo da roupa. Recomendo pra quem busca elegância sem esforço.",
    "Simplesmente impecável. O forro é de qualidade e vai até o final, o que faz toda a diferença no caimento. A cor pessoalmente consegue ser ainda mais bonita que no site. É aquele tipo de roupa que a gente veste e se sente poderosa na hora. Estou muito satisfeita com a aquisição.",
    "A qualidade superou minhas expectativas. As fotos não fazem justiça à textura do tecido, que é muito macia. O corte é inteligente e disfarça bem as gordurinhas que eu queria esconder. Chegou antes do prazo previsto e o atendimento foi excelente durante todo o processo.",
    "Comprei para usar no meu aniversário e foi a melhor escolha. A peça tem uma presença incrível. O tecido não amassa com facilidade, o que é ótimo para quem passa muito tempo sentada. O acabamento nos ombros e decote é muito delicado e bem finalizado. Nota dez!",
    "O caimento é bem fluido, exatamente como eu queria para um evento na praia. O tecido é leve mas tem substância. A cor combina com tudo e os detalhes da costura mostram que é uma peça de alto padrão. Fiquei muito feliz com o resultado final e com certeza voltarei a comprar.",
    "Sempre tive dificuldade de achar roupas que vestissem bem no busto e na cintura ao mesmo tempo, mas essa peça conseguiu. O elástico é suave e não incomoda. O pano é de primeira linha e a cor é super vibrante, mas elegante. A experiência de compra foi nota mil.",
    "A entrega foi surpreendentemente rápida. Quando abri a caixa, vi que o cuidado com a peça é real. O tecido é muito nobre e o corte valoriza o movimento. Usei num jantar de negócios e me senti muito segura e bem vestida. É um investimento que vale a pena pela durabilidade.",
    "O que mais gostei foi a versatilidade. Com um colete por cima fica super formal, sozinho fica mais leve. O tecido é respirável e não esquenta. A modelagem é perfeita, respeita as curvas sem marcar. O tom de marfim é muito chic e fácil de coordenar com outros acessórios.",
    "A peça é um sonho. O tecido tem um caimento pesado que dá muita elegância ao andar. O acabamento da barra é perfeito. Fiquei com medo do tamanho, mas segui a tabela e deu certinho. É raro achar roupas com essa qualidade de alfaiataria na internet hoje em dia.",
    "Simplesmente maravilhosa a experiência. A roupa é linda, o tecido é de extrema qualidade e o caimento é de outro mundo. Veste super bem e a cor é muito fiel. Recebi em 4 dias úteis no interior de Minas. A loja está de parabéns pelo curadoria das peças.",
    "O tecido é muito macio e a cor é divinal. O corte é moderno e valoriza muito o corpo. É o tipo de peça coringa que toda mulher deveria ter no guarda-roupa. O preço é justo pela qualidade que oferece. Com certeza vou comprar outras cores do mesmo modelo.",
    "Ficou perfeito no corpo. O tecido é encorpado e não marca a celulite, que era meu medo. A cor é elegante e o corte é muito bem pensado. Chegou bem rápido e o suporte da loja foi muito atencioso quando tive dúvida sobre o rastreio. Recomendo muito!",
    "Amei o detalhe das mangas e o decote. O pano é muito confortável e não esquenta. A modelagem é ideal para quem gosta de peças que acompanham o corpo sem apertar. A cor é linda e combina com vários tons de sapato. Foi uma excelente compra, estou apaixonada.",
    "A qualidade da costura é algo que me chamou a atenção logo de cara. Tudo muito limpo e bem finalizado. O tecido tem um brilho discreto que dá um ar de sofisticação. O tamanho P serviu perfeitamente. A entrega foi rápida e o produto veio muito bem protegido.",
    "A peça é incrível, superou o que eu esperava. O tecido é fluido e o caimento é maravilhoso. Usei num evento de gala e foi um sucesso. A cor é muito bonita e o design é exclusivo. Parabéns pela qualidade, é difícil encontrar peças assim atualmente."
]

# Erros ortográficos leves aleatórios
def add_slight_errors(text):
    if random.random() > 0.8: # 20% chance de um erro leve
        errors = [("com certeza", "concerteza"), ("muito", "muiito"), ("maravilhoso", "maravilhozo"), ("elegante", "eleganche"), ("qualidade", "qualidadde"), ("exatamente", "exatamenchi")]
        old, new = random.choice(errors)
        text = text.replace(old, new)
    return text

def get_unique_long_feedback():
    template = random.choice(LONG_FEEDBACK_TEMPLATES)
    # Adicionar variações para garantir unicidade
    prefixos = ["Achei incrível. ", "Simplesmente amei! ", "Experiência ótima. ", "Muito satisfeita. ", "", "", ""]
    sufixos = [" Recomendo.", " Vale a pena.", " Nota 10.", " Nota máxima!", "", "", ""]
    
    text = f"{random.choice(prefixos)}{template}{random.choice(sufixos)}"
    return add_slight_errors(text)

# Feedbacks CURTOS (manter o estilo, mas garantir que não tenham as frases proibidas)
SHORT_FEEDBACK_TEMPLATES = [
    "Ficou lindíssimo, o tamanho serviu certinho em mim.",
    "O tecido é uma delícia na pele, muito macio.",
    "O caimento é surreal de bom, valoriza muito o corpo.",
    "Chegou tudo certinho e a peça é um encanto.",
    "O tamanho serviu perfeitamente, sem apertar.",
    "O luxo em forma de roupa, me senti uma rainha.",
    "Qualidade que surpreende, o acabamento interno é perfeito.",
    "A cor é maravilhosa e o tecido é muito confortável.",
    "Entrega super rápida e produto de altíssima qualidade.",
    "Veste muito bem, estou super satisfeita com a compra.",
    "Peça coringa, combina com tudo no meu armário.",
    "O corte é perfeito, valoriza as curvas sem marcar.",
    "Tecido fresco e leve, ideal para o verão.",
    "Simplesmente perfeito, superou minhas expectativas.",
    "Amei cada detalhe, a costura é impecável.",
    "Caimento fluido e elegante, nota máxima.",
    "O tecido não amassa fácil, o que é ótimo para o dia a dia.",
    "Ficou ótimo no busto, muito confortável.",
    "A cor pessoalmente é ainda mais bonita que no site.",
    "Muito feliz com a compra, a peça é divina."
]

def get_unique_short_feedback():
    return random.choice(SHORT_FEEDBACK_TEMPLATES)

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex robusta para capturar blocos de review
    review_pattern = re.compile(r'\{\s*user:\s*"([^"]+)",\s*comment:\s*"([^"]+)",\s*rating:\s*([\d\.]+)(?:,\s*image:\s*([^ }]+))?\s*\}')
    
    used_comments = set()
    
    def replace_review(match):
        user = match.group(1)
        rating = float(match.group(3))
        image = match.group(4)

        if rating >= 4.0:
            if random.random() > 0.5:
                # Comentário longo
                new_comment = random.choice(LONG_FEEDBACK_TEMPLATES)
                # Adicionar variações para garantir unicidade sem loop infinito
                prefixos = ["Achei incrível. ", "Simplesmente amei! ", "Experiência ótima. ", "Muito satisfeita. ", "Gente, que peça! ", "Uau! ", ""]
                new_comment = f"{random.choice(prefixos)}{new_comment}"
                new_comment = add_slight_errors(new_comment)
            else:
                # Comentário curto
                new_comment = random.choice(SHORT_FEEDBACK_TEMPLATES)
        elif rating == 1.0:
            new_comment = ""
        elif rating == 2.0:
            templates_2 = [
                "O tecido não me agradou muito, achei um pouco áspero.",
                "O tamanho ficou um pouco justo demais no quadril.",
                "A cor é um pouco diferente do que eu esperava pela foto.",
                "Achei o acabamento da barra um pouco simples.",
                "O caimento não ficou legal no meu tipo de corpo."
            ]
            new_comment = random.choice(templates_2)
        else:
            new_comment = random.choice(SHORT_FEEDBACK_TEMPLATES)

        new_user = generate_name()
        
        img_str = f", image: {image}" if image else ""
        return f'{{ user: "{new_user}", comment: "{new_comment}", rating: {rating}{img_str} }}'

    # Processar o conteúdo
    new_content = review_pattern.sub(replace_review, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == "__main__":
    process_file('src/lib/products-data.ts')
    print("Successfully processed src/lib/products-data.ts")


