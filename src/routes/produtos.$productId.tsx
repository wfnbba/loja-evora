import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useShopifyCartStore } from "@/store/shopify-cart-store";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ChevronDown, Filter, RefreshCw, Truck, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
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
  
  const setIsCartOpen = (open: boolean) => {
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const addToCart = async () => {
    const sizeOption = product.options.find(o => o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size');
    if (sizeOption && !selectedSize) {
      toast.error("Por favor, selecione um tamanho");
      return;
    }
    
    // Encontrar a variante correta baseada nas opções selecionadas
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

  const sortedReviews = useMemo(() => {
    let result = [...product.reviews];
    
    if (sortOrder === "rating-high") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "rating-low") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === "relevance") {
      if (product.id === "calca-alfaiataria-off-white") {
        return result;
      }
      
      result.sort((a, b) => {
        if (a.image && a.comment && (!b.image || !b.comment)) return -1;
        if (b.image && b.comment && (!a.image || !a.comment)) return 1;
        if (a.comment && !a.image && !b.comment) return -1;
        if (b.comment && !b.image && !a.comment) return 1;
        return b.rating - a.rating;
      });
    }
    
    return result;
  }, [product.reviews, sortOrder]);

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const currentReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalReviews = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0);

  const recommendedProducts = useMemo(() => {
    return products.filter((p) => p.id !== product.id).slice(0, 4);
  }, [product.id]);

  return (
    <main className="min-h-screen bg-background pb-20 pt-24 text-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <section aria-label="Galeria do produto" className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <OptimizedImage src={images[selectedImage] || ""} alt={`${product.title}, foto ${selectedImage + 1}`} className="h-full w-full object-cover" width={600} height={800} priority />
              <Button variant="secondary" size="icon" aria-label="Foto anterior" onClick={() => setSelectedImage((current) => current > 0 ? current - 1 : images.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="secondary" size="icon" aria-label="Próxima foto" onClick={() => setSelectedImage((current) => current < images.length - 1 ? current + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button key={image} type="button" aria-label={`Exibir foto ${index + 1}`} onClick={() => setSelectedImage(index)} className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-foreground" : "border-transparent"}`}>
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
                      <Star
                        key={i}
                        className="size-3 fill-current"
                      />
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
                    <Button
                      key={color}
                      type="button"
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => { setSelectedColor(color); setAdded(false); }}
                      className="rounded-none px-4 py-2 text-[10px] uppercase tracking-widest"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button 
                id="add-to-cart-button"
                type="button" 
                onClick={addToCart} 
                disabled={!selectedSize || isLoadingCart} 
                className="w-full rounded-none py-8 uppercase tracking-[0.2em] cursor-pointer"
              >
                {isLoadingCart ? (
                  <Loader2 className="mr-3 size-5 animate-spin" />
                ) : (
                  <ShoppingBag className="mr-3 size-5" />
                )}
                {added ? "ADICIONADO AO CARRINHO" : "ADICIONAR AO CARRINHO"}
              </Button>
              
              {/* Botão Fixo Mobile-First */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 p-4 backdrop-blur-md border-t border-border/50 md:hidden animate-in fade-in slide-in-from-bottom-full duration-500">
                <Button 
                  onClick={addToCart} 
                  disabled={!selectedSize || isLoadingCart}
                  className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-bold shadow-2xl"
                >
                  {isLoadingCart ? (
                    <Loader2 className="mr-3 size-5 animate-spin" />
                  ) : (
                    <ShoppingBag className="mr-3 size-5" />
                  )}
                  {added ? "ADICIONADO" : "COMPRAR AGORA"}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em]">Descrição</h2>
              <div className="space-y-6">
                <p className="font-light leading-relaxed text-muted-foreground">{product.description}</p>
                
                {product.handle === "vestido-aurora-cafe" && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <style>
                      {`
                        wistia-player[media-id='wt5hy23zyr']:not(:defined) { 
                          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/wt5hy23zyr/swatch'); 
                          display: block; 
                          filter: blur(5px); 
                          padding-top:177.78%; 
                        }
                      `}
                    </style>
                    <wistia-player media-id="wt5hy23zyr" aspect="0.5625"></wistia-player>
                  </div>
                )}
                
                {product.handle === "calca-alfaiataria-off-white" && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <style>
                      {`
                        wistia-player[media-id='z4i9e4fgkn']:not(:defined) { 
                          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/z4i9e4fgkn/swatch'); 
                          display: block; 
                          filter: blur(5px); 
                          padding-top:177.78%; 
                        }
                      `}
                    </style>
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
                    <span className="text-5xl font-light">{product.rating.toFixed(1)}</span>
                    <div className="flex" aria-label={`${product.rating} de 5 estrelas`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{totalReviews.toLocaleString("pt-BR")} avaliações</span>
                  </div>
                  
                  <div className="col-span-1 space-y-2 lg:col-span-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.ratingBreakdown[star as keyof typeof product.ratingBreakdown] || 0;
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
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

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.2em]">Página {currentPage} de {totalPages}</h3>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground outline-none transition-colors hover:text-foreground">
                        Ordenar por: {
                          sortOrder === "relevance" ? "Relevância" :
                          sortOrder === "rating-high" ? "Melhores Notas" :
                          sortOrder === "rating-low" ? "Menores Notas" : "Mais Recentes"
                        }
                        <ChevronDown className="size-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-border/50 bg-background text-[10px] uppercase tracking-widest">
                        <DropdownMenuItem onClick={() => setSortOrder("relevance")} className="cursor-pointer focus:bg-muted focus:text-foreground">
                          Relevância
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder("rating-high")} className="cursor-pointer focus:bg-muted focus:text-foreground">
                          Melhores Notas
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder("rating-low")} className="cursor-pointer focus:bg-muted focus:text-foreground">
                          Menores Notas
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-10">
                  {currentReviews.map((review, idx) => (
                    <article key={`${review.user}-${idx}`} className="group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex" aria-label={`${review.rating} de 5 estrelas`}>
                              {Array.from({ length: 5 }, (_, index) => (
                                <Star key={index} className={`size-3 ${index < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                              ))}
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{review.user}</span>
                          </div>
                          {review.comment && (
                            <p className="text-sm font-light leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                              {review.comment}
                            </p>
                          )}
                        </div>
                        {review.image && (
                          <div className="relative size-24 shrink-0 overflow-hidden bg-muted md:size-32">
                            <img src={review.image} alt={`Foto enviada por ${review.user}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" width={128} height={128} loading="lazy" />
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-12">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="rounded-none border-border/50"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-[10px] uppercase tracking-widest">{currentPage} / {totalPages}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="rounded-none border-border/50"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-32 space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-light uppercase tracking-[0.3em]">Você também pode gostar</h2>
            <div className="mx-auto h-px w-20 bg-foreground/10" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
            {recommendedProducts.map((recommended) => (
              <Link key={recommended.id} to="/produtos/$productId" params={{ productId: recommended.id }} className="group">
                <Card className="cursor-pointer border-none bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-muted md:mb-6">
                      <img
                        src={recommended.images[0]}
                        alt={recommended.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={768}
                        height={1024}
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="text-xs font-medium uppercase tracking-[0.2em] md:text-sm">{recommended.name}</h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="flex text-foreground" aria-label={`${recommended.rating} de 5 estrelas`}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`size-2.5 ${i < Math.floor(recommended.rating) ? "fill-current" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{recommended.salesCount.toLocaleString("pt-BR")} vendidos</span>
                      </div>
                      <p className="text-sm font-light tracking-widest text-muted-foreground">R$ {recommended.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
