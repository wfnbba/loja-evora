import { createFileRoute, notFound } from "@tanstack/react-router";
import { useShopifyCartStore } from "@/store/shopify-cart-store";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { storefrontApiRequest, GET_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

export const Route = createFileRoute("/produtos/$productId")({
  loader: async ({ params }) => {
    const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, {
      first: 1,
      query: `handle:${params.productId}`
    });
    
    const product = data?.data?.products?.edges[0];
    if (!product) throw notFound();
    return { product: product as ShopifyProduct };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product?.node;
    const title = product ? `${product.title} | Évora` : "Produto | Évora";
    return {
      meta: [
        { title },
        { property: "og:title", content: title },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: shopifyProduct } = Route.useLoaderData();
  const product = shopifyProduct.node;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.options.find(o => o.name.toLowerCase() === 'cor')?.values[0] || "");
  const [added, setAdded] = useState(false);
  
  const addItem = useShopifyCartStore((state) => state.addItem);
  const isLoadingCart = useShopifyCartStore((state) => state.isLoading);
  const setIsCartOpen = useShopifyCartStore((state) => state.setIsOpen);

  const [currentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"relevance">("relevance");
  
  const mockReviews = [
    { user: "Mariana S.", rating: 5, comment: "Vestido maravilhoso! O tecido é de uma qualidade absurda, cai super bem no corpo." },
    { user: "Beatriz L.", rating: 5, comment: "Comprei para um evento e recebi muitos elogios." },
    { user: "Fernanda M.", rating: 4, comment: "Muito bonito, chegou rápido." },
    { user: "Camila R.", rating: 5, comment: "Simplesmente apaixonada." },
    { user: "Juliana A.", rating: 5, comment: "O melhor investimento que fiz esse mês." }
  ];

  const totalReviews = 157;
  const ratingBreakdown = { 5: 120, 4: 25, 3: 8, 2: 3, 1: 1 };
  const currentReviews = mockReviews;

  const addToCart = async () => {
    const sizeOption = product.options.find(o => o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size');
    if (sizeOption && !selectedSize) {
      toast.error("Por favor, selecione um tamanho");
      return;
    }
    
    const variant = product.variants.edges.find(({ node: v }: any) => {
      const sizeMatch = !selectedSize || v.selectedOptions.some((o: any) => 
        (o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size') && o.value === selectedSize
      );
      const colorMatch = !selectedColor || v.selectedOptions.some((o: any) => 
        o.name.toLowerCase() === 'cor' && o.value === selectedColor
      );
      return sizeMatch && colorMatch;
    })?.node || product.variants.edges[0]?.node;

    if (!variant) {
      toast.error("Variante não encontrada");
      return;
    }
    
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    });
    
    setAdded(true);
    toast.success(`${product.title} adicionado ao carrinho`);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.images.edges.map(e => e.node.url);
  const sizeOption = product.options.find(o => o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size');
  const colorOption = product.options.find(o => o.name.toLowerCase() === 'cor');

  return (
    <main className="min-h-screen bg-background pb-20 pt-24 text-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <section aria-label="Galeria do produto" className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <OptimizedImage src={images[selectedImage] || ""} alt={product.title} className="h-full w-full object-cover" width={600} height={800} priority />
              <Button variant="secondary" size="icon" onClick={() => setSelectedImage((current) => current > 0 ? current - 1 : images.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => setSelectedImage((current) => current < images.length - 1 ? current + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button key={image} type="button" onClick={() => setSelectedImage(index)} className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-foreground" : "border-transparent"}`}>
                  <OptimizedImage src={image} alt="" className="h-full w-full object-cover" width={150} height={200} />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h1 className="text-3xl font-light uppercase tracking-[0.2em]">{product.title}</h1>
            <p className="text-2xl font-light">
              {product.priceRange.minVariantPrice.currencyCode} {parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            
            {sizeOption && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Tamanho</p>
                <div className="flex flex-wrap gap-3">
                  {sizeOption.values.map((size) => (
                    <Button key={size} type="button" variant={selectedSize === size ? "default" : "outline"} onClick={() => setSelectedSize(size)} className="size-12 rounded-none p-0">{size}</Button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={addToCart} disabled={!selectedSize || isLoadingCart} className="w-full rounded-none py-8 uppercase tracking-[0.2em]">
              {isLoadingCart ? <Loader2 className="animate-spin" /> : "ADICIONAR AO CARRINHO"}
            </Button>
            
            <p className="font-light text-muted-foreground">{product.description}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
