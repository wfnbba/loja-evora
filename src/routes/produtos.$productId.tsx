import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useShopifyCartStore } from "@/store/shopify-cart-store";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, RefreshCw, Loader2 } from "lucide-react";
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
    const description = product?.description ?? "Conheça a coleção de moda feminina Évora.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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

  const mockReviews = [
    { user: "Mariana S.", rating: 5, comment: "Vestido maravilhoso! O tecido é de uma qualidade absurda, cai super bem no corpo. Évora realmente surpreendeu." },
    { user: "Beatriz L.", rating: 5, comment: "Comprei para um evento e recebi muitos elogios. O caimento é perfeito e a cor é idêntica à foto." },
    { user: "Fernanda M.", rating: 4, comment: "Muito bonito, chegou rápido. Só achei um pouco longo, mas nada que um ajuste não resolva." },
    { user: "Camila R.", rating: 5, comment: "Simplesmente apaixonada. A experiência de unboxing é premium, dá pra sentir o cuidado da marca." },
    { user: "Juliana A.", rating: 5, comment: "O melhor investimento que fiz esse mês. É elegante e muito confortável ao mesmo tempo." }
  ];

  const totalReviews = 157;
  const ratingBreakdown = { 5: 120, 4: 25, 3: 8, 2: 3, 1: 1 };

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
            <div className="space-y-2">
              <h1 className="text-3xl font-light uppercase tracking-[0.2em]">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm font-light">
                <div className="flex items-center gap-1">
                  <div className="flex" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3 fill-current" />
                    ))}
                  </div>
                  <span>5/5</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span>Novo na Évora</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-light">
                  {product.priceRange.minVariantPrice.currencyCode} {parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            {sizeOption && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Tamanho</p>
                <div className="flex flex-wrap gap-3">
                  {sizeOption.values.map((size) => (
                    <Button key={size} type="button" variant={selectedSize === size ? "default" : "outline"} onClick={() => { setSelectedSize(size); setAdded(false); }} className="size-12 rounded-none p-0">{size}</Button>
                  ))}
                </div>
                {!selectedSize && <p className="text-xs text-muted-foreground">Selecione um tamanho para adicionar ao carrinho.</p>}
                <div className="mt-4 flex items-center gap-3 border border-green-600/20 bg-green-600/5 p-4 transition-all hover:bg-green-600/10">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-600/10 text-green-700">
                    <RefreshCw className="size-4 animate-spin-slow" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Troca Garantida</p>
                    <p className="text-[9px] font-light uppercase tracking-[0.15em] text-green-600/90">
                      Primeira troca é gratuita em caso de tamanho errado.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {colorOption && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Cor: {selectedColor}</p>
                <div className="flex flex-wrap gap-3">
                  {colorOption.values.map((color) => (
                    <Button key={color} type="button" variant={selectedColor === color ? "default" : "outline"} onClick={() => setSelectedColor(color)} className="rounded-none px-4 py-2 text-[10px] uppercase tracking-widest">
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button onClick={addToCart} disabled={!selectedSize || isLoadingCart} className="w-full rounded-none py-8 uppercase tracking-[0.2em]">
                {isLoadingCart ? <Loader2 className="mr-3 size-5 animate-spin" /> : <ShoppingBag className="mr-3 size-5" />}
                {added ? "ADICIONADO AO CARRINHO" : "ADICIONAR AO CARRINHO"}
              </Button>
            </div>
            
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em]">Descrição</h2>
              <div className="space-y-6">
                <p className="font-light leading-relaxed text-muted-foreground">{product.description}</p>
                
                {product.handle === "vestido-aurora-cafe" && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <wistia-player media-id="wt5hy23zyr" aspect="0.5625"></wistia-player>
                  </div>
                )}
                
                {product.handle === "calca-alfaiataria-off-white" && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <wistia-player media-id="z4i9e4fgkn" aspect="0.5625"></wistia-player>
                  </div>
                )}
              </div>
            </div>

            <div id="feedbacks" className="space-y-12 border-t border-border pt-12">
              <div className="space-y-8">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em]">Avaliações</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-center justify-center space-y-2 border-r border-border/50 pr-8 text-center">
                    <span className="text-5xl font-light">4.9</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-4 ${i < 4 ? "fill-current" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{totalReviews.toLocaleString("pt-BR")} avaliações</span>
                  </div>
                  <div className="col-span-1 space-y-2 lg:col-span-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
                      const percentage = (count / totalReviews) * 100;
                      return (
                        <div key={star} className="flex items-center gap-4">
                          <span className="w-4 text-xs font-light">{star}</span>
                          <Star className="size-3 fill-current" />
                          <Progress value={percentage} className="h-1 flex-1" />
                          <span className="w-12 text-right text-[10px] tabular-nums text-muted-foreground">{count.toLocaleString("pt-BR")}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {mockReviews.map((review, idx) => (
                  <article key={idx} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={index} className={`size-3 ${index < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{review.user}</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-muted-foreground">{review.comment}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-32 space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-light uppercase tracking-[0.3em]">Explore nossa coleção</h2>
            <div className="mx-auto h-px w-20 bg-foreground/10" />
            <Link to="/" className="inline-block text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4">
              Voltar para a loja
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
