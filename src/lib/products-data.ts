import ig0 from "@/assets/products/ig-0.jpg";
import ig1 from "@/assets/products/ig-1.jpg";
import ig2 from "@/assets/products/ig-2.jpg";
import ig3 from "@/assets/products/ig-3.jpg";
import ig4 from "@/assets/products/ig-4.jpg";
import ig5 from "@/assets/products/ig-5.jpg";
import ig6 from "@/assets/products/ig-6.jpg";
import ig7 from "@/assets/products/ig-7.jpg";
import ig8 from "@/assets/products/ig-8.jpg";
import ig9 from "@/assets/products/ig-9.jpg";
import ig10 from "@/assets/products/ig-10.jpg";
import p1b from "@/assets/products/p1-b.jpg";
import p1c from "@/assets/products/p1-c.jpg";
import p1d from "@/assets/products/p1-d.jpg";
import p2b from "@/assets/products/p2-b.jpg";
import p2c from "@/assets/products/p2-c.jpg";
import p2d from "@/assets/products/p2-d.jpg";
import p3b from "@/assets/products/p3-b.jpg";
import p3c from "@/assets/products/p3-c.jpg";
import p3d from "@/assets/products/p3-d.jpg";
import p4b from "@/assets/products/p4-b.jpg";
import p4c from "@/assets/products/p4-c.jpg";
import p4d from "@/assets/products/p4-d.jpg";
import p5b from "@/assets/products/p5-b.jpg";
import p5c from "@/assets/products/p5-c.jpg";
import p5d from "@/assets/products/p5-d.jpg";
import p6b from "@/assets/products/p6-b.jpg";
import p6c from "@/assets/products/p6-c.jpg";
import p6d from "@/assets/products/p6-d.jpg";
import p7b from "@/assets/products/p7-b.jpg";
import p7c from "@/assets/products/p7-c.jpg";
import p7d from "@/assets/products/p7-d.jpg";
import p8b from "@/assets/products/p8-b.jpg";
import p8c from "@/assets/products/p8-c.jpg";
import p8d from "@/assets/products/p8-d.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  reviews: {
    user: string;
    comment: string;
    rating: number;
    image?: string;
  }[];
}

const sizes = ["P", "M", "G", "GG"];

export const products: Product[] = [
  {
    id: "conjunto-rose",
    name: "Conjunto Évora Rosé",
    price: 489,
    description: "Conjunto de alfaiataria em tom rosé composto por colete acinturado e saia longa fluida. Uma produção delicada, elegante e versátil para ocasiões especiais.",
    images: [ig0, p1b, p1c, p1d],
    sizes,
    reviews: [{ user: "Mariana S.", comment: "O conjunto veste muito bem e a cor é linda pessoalmente.", rating: 5, image: p1b }],
  },
  {
    id: "camisa-laco-orquidea",
    name: "Camisa Évora Orquídea",
    price: 289,
    description: "Camisa acetinada com mangas longas e laço amplo na gola. O brilho suave e o acabamento dos punhos deixam a peça feminina sem perder a sofisticação.",
    images: [ig1, p2b, p2c, p2d],
    sizes,
    reviews: [{ user: "Clara M.", comment: "A camisa é ainda mais bonita ao vivo. O laço fica perfeito.", rating: 5, image: p2b }],
  },
  {
    id: "vestido-aurora-rose",
    name: "Vestido Évora Aurora Rosé",
    price: 459,
    description: "Vestido midi rosé com decote fechado, cintura marcada e saia evasê. Um clássico leve que acompanha do almoço ao evento noturno.",
    images: [ig2, p3b, p3c, p3d],
    sizes,
    reviews: [{ user: "Juliana F.", comment: "Caimento impecável e comprimento elegante. Usei e recebi muitos elogios.", rating: 5, image: p3b }],
  },
  {
    id: "vestido-aurora-marfim",
    name: "Vestido Évora Aurora Marfim",
    price: 459,
    description: "A versão marfim do vestido Aurora traz linhas limpas, cintura definida e movimento suave. Atemporal e fácil de combinar.",
    images: [ig3, p4b, p4c, p4d],
    sizes,
    reviews: [{ user: "Heloísa R.", comment: "Elegante sem esforço e o tecido não marca. Gostei muito.", rating: 5, image: p4b }],
  },
  {
    id: "vestido-signature-duo",
    name: "Vestido Évora Signature Duo",
    price: 529,
    description: "Vestido midi disponível em marfim e café, com mangas curtas estruturadas e recorte preciso na cintura. Feito para uma presença marcante.",
    images: [ig4, p4b, p5b, p5c],
    sizes,
    reviews: [{ user: "Amanda C.", comment: "A modelagem valoriza muito o corpo e o acabamento é caprichado.", rating: 5, image: p5b }],
  },
  {
    id: "vestido-aurora-cafe",
    name: "Vestido Évora Aurora Café",
    price: 479,
    description: "Vestido midi em tom café, com cintura marcada e saia ampla. A tonalidade profunda atualiza uma silhueta clássica.",
    images: [ig5, p5b, p5c, p5d],
    sizes,
    reviews: [{ user: "Beatriz L.", comment: "A cor é sofisticada e o corte ficou certinho no corpo.", rating: 5, image: p5b }],
  },
  {
    id: "colete-lumiere",
    name: "Colete Évora Lumière",
    price: 329,
    description: "Colete de alfaiataria marfim com decote em V, cintura desenhada e botões dourados. Funciona sozinho ou em sobreposição.",
    images: [ig6, p6b, p6c, p6d],
    sizes,
    reviews: [{ user: "Fernanda G.", comment: "Estrutura linda e botões muito bem acabados. Ficou perfeito com saia.", rating: 5, image: p6b }],
  },
  {
    id: "calca-fluida-nuvem",
    name: "Calça Évora Nuvem",
    price: 349,
    description: "Calça pantalona marfim de cintura alta com amarração delicada. O tecido leve cria movimento e alonga a silhueta.",
    images: [ig7, p7b, p7c, p7d],
    sizes,
    reviews: [{ user: "Patrícia A.", comment: "Confortável e muito elegante. O ajuste na cintura ajuda bastante.", rating: 5, image: p7b }],
  },
  {
    id: "vestido-monument-noir",
    name: "Vestido Évora Monument Noir",
    price: 649,
    description: "Vestido longo de construção assimétrica em preto e marfim. O volume escultural no ombro transforma a peça em protagonista.",
    images: [ig8, p8b, p8c, p8d],
    sizes,
    reviews: [{ user: "Isabela N.", comment: "Diferente de tudo que eu tinha. A modelagem chama atenção na medida.", rating: 5, image: p8b }],
  },
  {
    id: "vestido-monument-marfim",
    name: "Vestido Évora Monument Marfim",
    price: 629,
    description: "Vestido coluna marfim com pala assimétrica preta e recortes que definem a cintura. Uma leitura gráfica e contemporânea da elegância.",
    images: [ig9, p8c, p8b, ig8],
    sizes,
    reviews: [{ user: "Larissa V.", comment: "Peça muito especial. A parte assimétrica fica linda nas fotos.", rating: 5, image: ig8 }],
  },
  {
    id: "colete-alvorada",
    name: "Colete Évora Alvorada",
    price: 319,
    description: "Colete marfim com fechamento frontal deslocado e barra levemente assimétrica. Alfaiataria moderna para composições claras ou contrastantes.",
    images: [ig10, p6d, p6c, p6b],
    sizes,
    reviews: [{ user: "Renata P.", comment: "O recorte é muito bonito e deixa qualquer look mais arrumado.", rating: 5, image: ig10 }],
  },
  {
    id: "colete-rose",
    name: "Colete Évora Rosé",
    price: 299,
    description: "Colete rosé acinturado com fechamento frontal delicado. Pode ser usado com a saia coordenada ou separado em produções urbanas.",
    images: [ig0, p1c, p1d, p1b],
    sizes,
    reviews: [{ user: "Camila T.", comment: "Comprei para usar separado e combinou com várias peças que já tinha.", rating: 4, image: p1c }],
  },
  {
    id: "saia-rose",
    name: "Saia Évora Rosé",
    price: 329,
    description: "Saia longa rosé com cintura alta e caimento fluido. A linha vertical alonga e garante movimento elegante ao caminhar.",
    images: [p1d, ig0, p1b, p1c],
    sizes,
    reviews: [{ user: "Natalia B.", comment: "Comprimento ótimo e tecido com peso bonito. Valeu a compra.", rating: 5, image: p1d }],
  },
  {
    id: "calca-fluida-cafe",
    name: "Calça Évora Café",
    price: 349,
    description: "Pantalona café de cintura alta com amarração frontal. Une conforto, textura leve e uma cor neutra de presença.",
    images: [p7d, ig7, p7c, p7b],
    sizes,
    reviews: [{ user: "Paula D.", comment: "A cor café é linda e o tecido tem bastante movimento.", rating: 5, image: p7d }],
  },
  {
    id: "saia-plisse-noir",
    name: "Saia Évora Plissé Noir",
    price: 359,
    description: "Saia midi preta plissada, de cintura alta e volume controlado. Uma base versátil para combinar com alfaiataria ou peças acetinadas.",
    images: [ig10, p7d, p6b, ig8],
    sizes,
    reviews: [{ user: "Sofia M.", comment: "O plissado é bem feito e ela não arma demais. Muito versátil.", rating: 5, image: ig10 }],
  },
];
