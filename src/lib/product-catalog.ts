import auroraMarfim1 from "@/assets/products/aurora-marfim-1.png.asset.json";
import auroraCafe1 from "@/assets/products/aurora-cafe-v2-1.png.asset.json";
import monumentNoir1 from "@/assets/products/monument-noir-v2-1.png.asset.json";
import alvorada1 from "@/assets/products/alvorada-v3-1.png.asset.json";
import satinEspresso1 from "@/assets/products/satin-espresso-1.png.asset.json";
import saiaChiffon1 from "@/assets/products/saia-chiffon-1.png.asset.json";
import saiaRenda1 from "@/assets/products/saia-renda-1.png.asset.json";
import conjuntoEspresso1 from "@/assets/products/conjunto-espresso-alfaiataria-1.png.asset.json";
import conjuntoRose1 from "@/assets/products/ig-0.jpg";
import auroraRose1 from "@/assets/products/ig-1.jpg";
import calcaOffWhite1 from "@/assets/products/calca-alfaiataria-off-white-1.png.asset.json";
import { PRODUCT_PRICES } from "@/lib/product-pricing";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  salesCount: number;
  rating: number;
}

export const productCatalog: ProductSummary[] = [
  {
    id: "vestido-aurora-marfim",
    name: "Vestido Évora Aurora Marfim",
    price: PRODUCT_PRICES["vestido-aurora-marfim"],
    originalPrice: 179,
    image: auroraMarfim1.url,
    salesCount: 3421,
    rating: 4.8,
  },
  {
    id: "vestido-aurora-cafe",
    name: "Vestido Évora Aurora Café",
    price: PRODUCT_PRICES["vestido-aurora-cafe"],
    originalPrice: 179,
    image: auroraCafe1.url,
    salesCount: 2154,
    rating: 4.8,
  },
  {
    id: "vestido-monument-noir",
    name: "Vestido Évora Monument Noir",
    price: PRODUCT_PRICES["vestido-monument-noir"],
    originalPrice: 189,
    image: monumentNoir1.url,
    salesCount: 1587,
    rating: 4.8,
  },
  {
    id: "colete-alvorada",
    name: "Colete Évora Alvorada",
    price: PRODUCT_PRICES["colete-alvorada"],
    originalPrice: 89,
    image: alvorada1.url,
    salesCount: 4231,
    rating: 4.8,
  },
  {
    id: "vestido-satin-espresso",
    name: "Vestido Évora Satin Espresso",
    price: PRODUCT_PRICES["vestido-satin-espresso"],
    originalPrice: 429,
    image: satinEspresso1.url,
    salesCount: 2845,
    rating: 4.8,
  },
  {
    id: "saia-chiffon-fluida",
    name: "Saia Évora Chiffon Fluida",
    price: PRODUCT_PRICES["saia-chiffon-fluida"],
    originalPrice: 159,
    image: saiaChiffon1.url,
    salesCount: 5124,
    rating: 4.8,
  },
  {
    id: "saia-renda-romantique",
    name: "Saia Évora Renda Romantique",
    price: PRODUCT_PRICES["saia-renda-romantique"],
    originalPrice: 169,
    image: saiaRenda1.url,
    salesCount: 1243,
    rating: 4.81,
  },
  {
    id: "conjunto-espresso-alfaiataria",
    name: "Conjunto Évora Espresso Alfaiataria",
    price: PRODUCT_PRICES["conjunto-espresso-alfaiataria"],
    originalPrice: 349,
    image: conjuntoEspresso1.url,
    salesCount: 6842,
    rating: 4.8,
  },
  {
    id: "conjunto-rose",
    name: "Conjunto Évora Rosé",
    price: PRODUCT_PRICES["conjunto-rose"],
    originalPrice: 179,
    image: conjuntoRose1,
    salesCount: 843,
    rating: 4.81,
  },
  {
    id: "vestido-aurora-rose",
    name: "Blusa Évora Aurora Rosé",
    price: PRODUCT_PRICES["vestido-aurora-rose"],
    originalPrice: 119,
    image: auroraRose1,
    salesCount: 652,
    rating: 4.8,
  },
  {
    id: "calca-alfaiataria-off-white",
    name: "Calça Évora Alfaiataria Off-White",
    price: PRODUCT_PRICES["calca-alfaiataria-off-white"],
    originalPrice: 189,
    image: calcaOffWhite1.url,
    salesCount: 1842,
    rating: 4.8,
  },
];
