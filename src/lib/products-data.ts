
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

export const products: Product[] = [
  {
    id: "1",
    name: "Vestido Évora Atemporal",
    price: 489.00,
    description: "Um clássico da coleção Évora, unindo elegância e sofisticação em cada detalhe. Confeccionado em tecido premium com caimento impecável.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/766662212_17950938909234828_3169058943588389230_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=TaCNs90wOtQQ7kNvwFC3WeZ&_nc_oc=Adopy0T-5POZQpRz9raQzjToAG9ZGR8ZsRGZY2Y4fwO56N9mDUFfzAvvSn--WjnRU3LvG-HH100BvvZMQK6x8UZI&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQFhACjnZG1CU1JeNDD32QNrHGb11H9RtgCe3SnM5rHhtA&oe=6A8373F7",
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/767640649_17950937553234828_1584403068769699203_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=mLkMUIUmV_AQ7kNvwGaIy8I&_nc_oc=AdqrQXTqpBuD4luYTm3lsxWa_6TEoORmuyr068of9DGV5ltL8fnzSMwIrFM93CzvYhizw5x1OFvGRGkXAyuWbfC5&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQEQ3-q_o2iUDfdNTaz874JNVmRbgfosdVv6fnrl44hr7A&oe=6A837D4A"
    ],
    sizes: ["P", "M", "G", "GG"],
    reviews: [
      { user: "Mariana S.", comment: "Simplesmente maravilhoso! O caimento é perfeito.", rating: 5 },
      { user: "Clara M.", comment: "Tecido de muita qualidade, superou minhas expectativas.", rating: 5 }
    ]
  },
  {
    id: "2",
    name: "Vestido Évora Noir",
    price: 529.00,
    description: "Para momentos que exigem presença. O vestido Noir é a definição de elegância moderna.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/767300783_17950936956234828_3047966980393859808_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=SAmXbftP29EQ7kNvwEVt3c3&_nc_oc=Adq8dxR1WD69ap2MgcVaSqGU6lpVlFIJhsZE0p05CfyH8kPmjqB3HbPBYUIQDOVo45r9VeN-PJp5NSgILmqwQ3UV&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQEYGMTZnF3Z60JwZuvzm0r53VY0R3AtAn2i262jERv0HQ&oe=6A836DE8",
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/763692380_17950571232234828_743778118792386107_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=VMTL42KQwy0Q7kNvwFcM8zX&_nc_oc=AdqPKsS-C4f2qfzfa01e1ByxBQJ8VZiso4bkzkqJPXwlZvImYR6JHVH1CxEdO4CWFA92vEsXTc_rTZhqoVyhltoG&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQEW0Ve0OengfX-GseXlIpNNeREeIyUQ-3KZa3rVbFRjIw&oe=6A838869"
    ],
    sizes: ["P", "M", "G"],
    reviews: [
      { user: "Beatriz L.", comment: "Fiquei encantada com os detalhes. Entrega rápida!", rating: 5 }
    ]
  },
  {
    id: "3",
    name: "Vestido Évora Garden",
    price: 459.00,
    description: "Leveza e frescor em uma peça pensada para a mulher contemporânea.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/765351376_17950570815234828_4832261516069488329_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=IIdfrXl5GZwQ7kNvwE8z4q5&_nc_oc=Adr7qjrAZGhL_IME-aPty6GYrszrE2JKZwgBYiCXYFYUm5EpVpW9U4JFV2qPjtth21rl-3lAXktnRBX83Kb88AVt&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQGFaTwP_w3_QKmlieRNuHa6fF_Y6B568rOo6HlsUoIKww&oe=6A837144"
    ],
    sizes: ["P", "M", "G", "GG"],
    reviews: [
      { user: "Juliana F.", comment: "Amei o modelo! Veste super bem.", rating: 4 }
    ]
  },
  {
    id: "4",
    name: "Vestido Évora Minimal",
    price: 399.00,
    description: "Menos é mais. O corte minimalista valoriza a silhueta com extrema sofisticação.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/766007924_17950570662234828_2789359552823189651_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=JithFittr2UQ7kNvwEwEk6y&_nc_oc=AdqS5lNuW_GQyJgBqbHeGyrvGI5JurQ7K_gSCtPnQdVY1K-iyEjzYg1mJnqN6y3QqeO5QFtrJNsmyLnWV6d_JBu3&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQE2cBMhT-zYQ3fBBA4nGyNC2-hO_R8tVXANDNa-fyUMtg&oe=6A8388F4"
    ],
    sizes: ["P", "M", "G"],
    reviews: [
      { user: "Heloísa R.", comment: "Perfeito para o dia a dia elegante.", rating: 5 }
    ]
  },
  {
    id: "5",
    name: "Vestido Évora Silk",
    price: 599.00,
    description: "O toque do seda em uma modelagem que exala luxo.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/673891804_17934164703234828_8968355217588724437_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=UD4x-Wqek1MQ7kNvwEYA_ni&_nc_oc=AdoodllTTADv4rKwKX3AHFRKJOkVGFdatx7tYqdOqgYo9sADQQhbaccOtQGrCte1NT23guP7W-6dGQHZVEkqzJR8&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQEIUVx4Uma-O2IM3huj3n_PjAasBTudE8BTVmLfXtpbNA&oe=6A83620B"
    ],
    sizes: ["M", "G"],
    reviews: []
  },
  {
    id: "6",
    name: "Vestido Évora Azure",
    price: 479.00,
    description: "Um tom vibrante para iluminar sua presença em qualquer evento.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/673110192_17934164505234828_5241330742907289999_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=xWkvC4Y_TgwQ7kNvwFkpHZl&_nc_oc=Adp2dUZu1bdbkghlfkWK79fg8mK3LlD7MPTb4KYUa0xtTILmwCLPnDro4bo8h-Y87rwB8dtMmHDlYXINDBbQW-31&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQHYQqLD2gnHlRvVuXkmEmiJeH2W7oJpYBDs5_pdKMaSaA&oe=6A83704F"
    ],
    sizes: ["P", "M"],
    reviews: [
      { user: "Fernanda G.", comment: "A cor é ainda mais linda pessoalmente!", rating: 5 }
    ]
  },
  {
    id: "7",
    name: "Vestido Évora Sunset",
    price: 429.00,
    description: "Ideal para fins de tarde sofisticados. Fluidez e conforto.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/764952792_17950567458234828_535134773863926064_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=8opnLO42YmkQ7kNvwF3hzSj&_nc_oc=AdqR3NggQzf0FYX3DoGzcDjGuO27wvfvU2N5sBGA87lhDa2mJLUD6aBiWJeTWEfPkI7si5jKBgl8Abtf_R8QMQEM&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQHMhjGZOPCs-SMb5Uykhhd841RVgq8s07C8c3joekKHzg&oe=6A83658F"
    ],
    sizes: ["P", "M", "G", "GG"],
    reviews: []
  },
  {
    id: "8",
    name: "Vestido Évora Classique",
    price: 519.00,
    description: "Atemporalidade e classe definem esta peça essencial no closet.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/764475985_17950566807234828_513055164744047950_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=4KbzgwoedaMQ7kNvwFrvfN7&_nc_oc=AdqXzDR-Z8UB02oyCfH9PEmEoxj3JYlQXMWCJjuW3EFD5DRCzp7HqijYGivZaOQLAVRy424oPSbvFb_kCHx-yUtY&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQFvQ6M6UupL5cTiggxpTF192gyR3-jWb-14lU-yUynsAA&oe=6A838DE5"
    ],
    sizes: ["G", "GG"],
    reviews: [
      { user: "Amanda C.", comment: "Corte impecável.", rating: 5 }
    ]
  },
  {
    id: "9",
    name: "Vestido Évora Royale",
    price: 649.00,
    description: "Digno de realeza. Acabamento manual e tecidos nobres.",
    images: [
      "https://scontent-bru2-1.cdninstagram.com/v/t51.82787-15/767560232_17950566207234828_6362718011266231642_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=U-QIAdgrjuoQ7kNvwFzErd9&_nc_oc=AdoAoGAQ5t2jM19xuwryPvX1Y_8bhoYbmv_O-kviMYPpWPObplE5L-PFg5hA0-64tCncsArxLfXK2LuJo2r12QyA&_nc_zt=23&_nc_ht=scontent-bru2-1.cdninstagram.com&_nc_gid=Gbobsxo1j_qW7qYMnnOqxg&_nc_ss=7960f&oh=00_AQHZuCbx9Fp6-UPg0DjK4h8ZvKnqzryyJRPxydwwYLlQzg&oe=6A83635A"
    ],
    sizes: ["M", "G"],
    reviews: []
  }
];
