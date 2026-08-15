import json
import random

# Brazilian female names
names = [
    "Adriana", "Alessandra", "Aline", "Amanda", "Ana", "Beatriz", "Bianca", "Bruna", "Camila", "Carla", 
    "Carolina", "Cássia", "Cláudia", "Cristiane", "Daniela", "Débora", "Eduarda", "Elaine", "Eliana", 
    "Elisângela", "Fabiana", "Fernanda", "Flávia", "Franciele", "Gabriela", "Gisele", "Gláucia", 
    "Graziele", "Heloísa", "Isabela", "Isadora", "Ivone", "Janaína", "Jaqueline", "Jéssica", "Joana", 
    "Julia", "Juliana", "Karina", "Larissa", "Laura", "Letícia", "Lívia", "Lorena", "Luciana", "Ludmila",
    "Manuela", "Marcela", "Márcia", "Maria", "Mariana", "Marina", "Marta", "Michele", "Milena", "Mônica",
    "Natália", "Nicole", "Paloma", "Patrícia", "Paula", "Priscila", "Rafaela", "Raquel", "Regiane", 
    "Renata", "Roberta", "Sabrina", "Sandra", "Sara", "Sheila", "Silvana", "Simone", "Sônia", "Stefany",
    "Talita", "Tatiana", "Thais", "Vanessa", "Viviane", "Zilda", "Yara", "Ursula", "Tereza", "Sueli",
    "Rosana", "Regina", "Quitéria", "Patrícia", "Otávia", "Nair", "Margarida", "Lourdes", "Kátia", "Jussara"
]
surnames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Rocha"]

def get_random_name():
    return f"{random.choice(names)} {random.choice(surnames)[0]}."

# Unique templates
templates_5 = [
    "Simplesmente maravilhosa a peça, o tecido é super premium!",
    "Chegou muito rápido e vestiu como uma luva, amei a cor.",
    "A qualidade é surpreendente, vale cada centavo investido.",
    "Me senti muito elegante com esse look, o caimento é perfeito.",
    "Com certeza vou comprar mais vezes, a loja está de parabéns.",
    "O tecido tem um toque incrível, muito macio e confortável.",
    "Estava com medo de não servir, mas as medidas são certinhas.",
    "A cor é ainda mais bonita pessoalmente, muito vibrante.",
    "Ótimo custo benefício, a peça parece ser muito mais cara.",
    "Recomendo de olhos fechados, atendimento e produto excelentes.",
    "Perfeito para qualquer ocasião, já usei e recebi muitos elogios.",
    "O detalhe do acabamento faz toda a diferença, impecável.",
    "Finalmente achei uma loja que entrega o que promete no anúncio.",
    "Amei cada detalhe, desde a embalagem até a própria roupa.",
    "O caimento é surreal de bom, valoriza muito o corpo.",
    "Chegou antes do prazo e muito bem embalado, nota 10.",
    "Melhor compra que fiz no ano, estou apaixonada por essa peça.",
    "Tecido de alta qualidade, não fica transparente e é bem firme.",
    "A modelagem é excelente, ficou exatamente como eu queria.",
    "Estou encantada com a delicadeza dessa roupa, muito linda.",
    "Surpreendida positivamente com a rapidez da entrega e qualidade.",
    "O tecido é maravilhoso e a cor é super fiel à foto do site.",
    "Gente, comprem sem medo, a peça é um espetáculo!",
    "Um luxo só! Me senti maravilhosa com esse vestido.",
    "Acabamento de primeira, nota-se que é um produto premium.",
    "Junta elegância e conforto em uma só peça, amei!",
    "Já quero outras cores desse mesmo modelo, é perfeito.",
    "O frete foi grátis e chegou super rápido no interior de SP.",
    "A peça é divina, o tecido flui muito bem no corpo.",
    "Valeu muito a pena, a qualidade é de loja de shopping caro.",
    "O atendimento foi ótimo quando precisei tirar uma dúvida.",
    "Maravilhoso, virou minha peça favorita do guarda-roupa.",
    "Tudo perfeito, a entrega foi rápida e o produto é lindo.",
    "Qualidade impecável, o tecido é bem grosso e não marca nada.",
    "Simplesmente perfeito, superou todas as minhas expectativas.",
    "Ficou lindíssimo, o tamanho P serviu certinho em mim.",
    "Amei o brinde que veio junto, muito atenciosos!",
    "A cor é deslumbrante, chama a atenção por onde passa.",
    "Roupa de boneca, muito bem feita e delicada.",
    "Tô chocada com a qualidade, juro! Muito bom mesmo.",
    "A peça é pesada, dá pra ver que o tecido é de qualidade.",
    "O caimento no busto ficou ótimo, muito confortável.",
    "Excelente compra, o preço está muito justo pela qualidade.",
    "Muito satisfeita com a minha aquisição, voltarei a comprar.",
    "Linda demais a peça, as fotos não fazem justiça à beleza.",
    "O movimento do tecido é lindo, super fluido.",
    "Ganharam uma cliente fiel, amei a experiência de compra.",
    "Tudo nota mil, desde o site até a entrega final.",
    "Amei, amei, amei! A cor marrom é a coisa mais linda.",
    "Elegância pura, ótima para eventos mais formais.",
    "O tecido não amassa fácil, o que é ótimo para o dia a dia.",
    "A modelagem valoriza muito a cintura, adorei.",
    "Chegou tudo certinho e a peça é um encanto.",
    "Não tiro mais do corpo, é confortável e estilosa.",
    "Qualidade que surpreende, o acabamento interno é perfeito.",
    "Comprei para um casamento e foi um sucesso total.",
    "O envio foi imediato, recebi em 3 dias aqui no RJ.",
    "Adorei o caimento, não precisei fazer nenhum ajuste.",
    "A cor é muito chique, passa uma imagem bem sofisticada.",
    "Peça essencial, combina com tudo e é muito versátil.",
    "O caimento ficou perfeito no meu corpo, estou muito feliz.",
    "Entrega relâmpago e produto de altíssima qualidade.",
    "Superou minhas expectativas em todos os sentidos.",
    "O design é moderno e elegante ao mesmo tempo.",
    "Tecido super leve e fresco, ideal para o verão.",
    "Estou impressionada com os detalhes dessa peça.",
    "O tamanho GG serviu perfeitamente, sem apertar.",
    "Cor maravilhosa, exatamente como nas fotos.",
    "Vou indicar para todas as minhas amigas!",
    "A qualidade do linho é excelente, recomendo muito.",
    "Simplesmente apaixonada por cada detalhe dessa roupa.",
    "O atendimento da loja é nota 10, muito prestativos.",
    "Peça muito bem acabada, sem nenhum fio solto.",
    "A modelagem é impecável, valoriza as curvas.",
    "Chegou bem antes do esperado, muito satisfeita.",
    "O tecido é uma delícia na pele, muito macio.",
    "Uma das melhores compras que já fiz pela internet.",
    "O luxo em forma de roupa, me senti uma rainha.",
    "Cor vibrante e tecido resistente, amei demais.",
    "Ficou perfeito, nem precisei de bainha ou ajustes.",
    "O caimento é fluido e elegante, nota máxima.",
    "Muito feliz com a compra, o site é super seguro.",
    "Amei a versatilidade da peça, dá pra usar em várias ocasiões.",
    "O tecido tem um brilho discreto e muito sofisticado.",
    "Tudo impecável, desde a escolha no site até o recebimento.",
    "Qualidade premium de verdade, vale o investimento.",
    "Roupa super confortável e ao mesmo tempo muito estilosa.",
    "Amei o mimo que veio na embalagem, muito obrigada!",
    "A peça veste super bem, fiquei muito satisfeita.",
    "O envio foi super rápido, parabéns à equipe.",
    "Tecido encorpado e de excelente qualidade.",
    "A cor é linda demais, pessoalmente é ainda melhor.",
    "Caimento de alta costura, estou maravilhada.",
    "Indico muito, a loja é extremamente profissional.",
    "Peça clássica e atemporal, um ótimo investimento.",
    "O acabamento interno é tão bom quanto o externo.",
    "Simplesmente a peça mais linda que tenho agora.",
    "Amei o corte, valorizou muito o meu biotipo.",
    "Experiência de compra maravilhosa, tudo perfeito."
]

templates_4 = [
    "Gostei bastante, só achei que a cor era um pouco mais clara.",
    "Muito bonita a peça, só a entrega que demorou um pouquinho mais.",
    "O tecido é bom, mas esperava que fosse um pouco mais grosso.",
    "Ficou um pouco largo na cintura, mas nada que um ajuste não resolva.",
    "A qualidade é boa, condizente com o valor pago.",
    "Gostei do modelo, veste bem, mas o acabamento poderia ser melhor.",
    "A peça é linda, só achei o zíper um pouco chatinho de fechar.",
    "Bonito e confortável, compraria novamente em outra cor.",
    "Veste bem, mas o tecido amassa um pouco mais do que eu gostaria.",
    "Boa compra, atendeu às minhas necessidades para o trabalho.",
    "O caimento é ok, mas o tamanho M ficou um pouco justo.",
    "A cor é bonita, mas pessoalmente parece um tom diferente.",
    "Gostei, chegou dentro do prazo e em boas condições.",
    "Pelo preço está ótimo, é uma peça bem honesta.",
    "Muito chique, só as mangas que ficaram um pouco compridas.",
    "O produto é bom, mas a caixa chegou um pouco amassada.",
    "Veste super bem, só o tecido que é um pouco quente.",
    "Achei o comprimento um pouco curto, mas o modelo é lindo.",
    "Bom caimento, só recomendo pegar um tamanho maior se tiver quadril largo.",
    "Bonito, mas o tecido é um pouco transparente se esticar muito.",
    "Gostei, mas achei as fotos do site um pouco diferentes do real.",
    "Boa qualidade, porém o botão veio um pouco frouxo.",
    "A peça é ótima para o dia a dia, bem prática.",
    "Veste bem, mas o caimento no ombro ficou um pouco estranho.",
    "Achei a cor um pouco desbotada em comparação ao anúncio.",
    "Bom produto, mas o frete para minha região foi caro.",
    "Gostei do modelo, mas o forro é um pouco curto.",
    "Qualidade satisfatória pelo preço promocional.",
    "Bonito, mas tive que trocar o tamanho e demorou um pouco.",
    "A peça é estilosa, mas o tecido não estica nada."
]

templates_3 = [
    "Achei mediano, esperava um pouco mais pela foto do site.",
    "O tecido é ok, mas o corte não valorizou muito meu corpo.",
    "A entrega foi demorada e o atendimento não foi dos melhores.",
    "A peça é bonita, mas o material não parece ser muito durável.",
    "Ficou um pouco estranho no busto, vou precisar levar na costureira.",
    "Cor diferente da foto, pessoalmente é bem mais escuro.",
    "É uma peça básica, nada de extraordinário pelo preço.",
    "O tamanho não bateu com a tabela, ficou bem apertado.",
    "Achei o acabamento um pouco grosseiro em algumas costuras.",
    "Valeu pelo custo, mas a qualidade deixa a desejar em alguns pontos.",
    "Esperava mais da marca, o tecido é bem simples.",
    "O caimento ficou estranho, não vestiu bem como na modelo.",
    "Entrega atrasou e a embalagem veio rasgada.",
    "A cor é bonita, mas soltou tinta na primeira lavagem.",
    "Achei caro pela qualidade que recebi.",
    "O tamanho G parece um M, ficou muito justo.",
    "Veste bem, mas o tecido é um pouco transparente.",
    "Achei o modelo legal, mas o tecido pinica um pouco.",
    "Não é ruim, mas também não é excelente.",
    "Poderia ser melhor, o zíper parece ser frágil."
]

templates_2 = [
    "Não gostei muito do caimento, ficou bem diferente do que imaginei.",
    "O tecido é muito fino e amassa só de olhar, não curti.",
    "A entrega atrasou demais e não tive suporte da loja.",
    "Tamanho totalmente errado, muito menor do que o padrão.",
    "A cor veio errada, pedi uma e recebi outra totalmente diferente.",
    "Achei a qualidade bem inferior ao que as fotos mostram.",
    "O acabamento é ruim, veio com algumas linhas soltas.",
    "Não recomendo, o custo benefício não vale a pena.",
    "Ficou muito transparente, não dá pra usar sem algo por baixo.",
    "O modelo é bonito, mas a execução deixou muito a desejar.",
    "Tecido de má qualidade, parece roupa descartável.",
    "Muito caro para o que realmente é.",
    "O caimento é horrível, não tem nada a ver com a foto.",
    "Pedi troca e a loja ignorou minhas mensagens.",
    "A peça veio com um pequeno furo no tecido."
]

used_comments = set()

def get_unique_comment(templates):
    available = [t for t in templates if t not in used_comments]
    if not available:
        # Generate variation if all are used
        base = random.choice(templates)
        variations = ["!", ".", "..", " :)", "!!!", " (recomendo)", " (amei)"]
        comment = base + random.choice(variations)
        while comment in used_comments:
            comment += random.choice(["!", "."])
        used_comments.add(comment)
        return comment
    
    comment = random.choice(available)
    # 5% chance of light typo for realism
    if random.random() < 0.05:
        words = comment.split()
        if len(words) > 3:
            idx = random.randint(0, len(words) - 1)
            word = words[idx]
            if len(word) > 3:
                word_list = list(word)
                i = random.randint(0, len(word_list) - 2)
                word_list[i], word_list[i+1] = word_list[i+1], word_list[i]
                words[idx] = "".join(word_list)
                comment = " ".join(words)

    used_comments.add(comment)
    return comment

products_info = [
    {"id": "vestido-aurora-marfim", "feedback_prefix": "feedbackMarfim"},
    {"id": "conjunto-espresso-alfaiataria", "feedback_prefix": "feedbackEspressoAlfaiataria"},
    {"id": "vestido-aurora-cafe", "feedback_prefix": "feedbackAuroraCafe"},
    {"id": "vestido-monument-noir", "feedback_prefix": "feedbackMonumentNoir"},
    {"id": "colete-alvorada", "feedback_prefix": "feedbackAlvoradaa"},
    {"id": "calca-alfaiataria-off-white", "feedback_prefix": "feedbackCalcaOffWhiteeee"},
    {"id": "vestido-satin-espresso", "feedback_prefix": "feedbackEspresso"},
    {"id": "saia-chiffon-monument", "feedback_prefix": "feedbackChiffon"},
    {"id": "saia-renda-preta", "feedback_prefix": "p"}, 
    {"id": "saia-rose-acetinada", "feedback_prefix": "p"},
    {"id": "vestido-luxo-noite", "feedback_prefix": "p"},
    {"id": "conjunto-marinho-bege", "feedback_prefix": "p"},
    {"id": "vestido-monument-marfim", "feedback_prefix": "feedbackMarfim"},
    {"id": "conjunto-alfaiataria-preto", "feedback_prefix": "feedbackEspressoAlfaiataria"},
    {"id": "saia-renda-branca", "feedback_prefix": "p"}
]

generated_data = {}

for product in products_info:
    reviews = []
    num_reviews = random.randint(30, 50) # Enough for realism without bloated JS
    
    # 1-star: max 2
    n1 = random.randint(0, 1)
    for _ in range(n1):
        reviews.append({"user": get_random_name(), "comment": "", "rating": 1.0})
        
    # 2-star: max 3
    n2 = random.randint(0, 2)
    for _ in range(n2):
        reviews.append({"user": get_random_name(), "comment": get_unique_comment(templates_2), "rating": 2.0})
        
    # 3-star: max 8
    n3 = random.randint(2, 5)
    for _ in range(n3):
        reviews.append({"user": get_random_name(), "comment": get_unique_comment(templates_3), "rating": 3.0})
        
    # 4-star: max 12
    n4 = random.randint(5, 10)
    for _ in range(n4):
        reviews.append({"user": get_random_name(), "comment": get_unique_comment(templates_4), "rating": 4.0})
        
    # 5-star: rest
    n5 = num_reviews - n1 - n2 - n3 - n4
    for i in range(n5):
        review = {"user": get_random_name(), "comment": get_unique_comment(templates_5), "rating": 5.0}
        if i < 10: # Ensure first 10 have images
            prefix = product["feedback_prefix"]
            if prefix == "p":
                v = random.choice(["b", "c", "d"])
                p = random.choice([1, 2, 3, 4, 5, 6, 7, 8])
                review["image"] = f"p{p}{v}"
            else:
                idx = (i % 10) + 1
                review["image"] = f"{prefix}{idx}.url"
        reviews.append(review)
    
    # Sort: Images first, then higher ratings
    reviews.sort(key=lambda x: (1 if "image" in x else 0, x["rating"]), reverse=True)
    generated_data[product["id"]] = reviews

with open('unique_feedbacks.json', 'w', encoding='utf-8') as f:
    json.dump(generated_data, f, ensure_ascii=False, indent=2)
