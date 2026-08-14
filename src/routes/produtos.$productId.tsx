import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { products } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ChevronDown, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/produtos/$productId")({
  loader: ({ params }) => {
    const product = products.find((item) => item.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const title = product ? `${product.name} | Évora` : "Produto | Évora";
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
  const { product } = Route.useLoaderData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [added, setAdded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"relevance" | "rating-high" | "rating-low" | "recent">("relevance");
  const reviewsPerPage = 10;
  
  const addItem = useCartStore((state) => state.addItem);

  const addToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor, selecione um tamanho");
      return;
    }
    
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size: selectedSize,
      quantity: 1
    } as any;
    
    if (selectedColor) {
      newItem.color = selectedColor;
    }
    
    addItem(newItem);
    
    setAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: `Tamanho: ${selectedSize}${selectedColor ? ` | Cor: ${selectedColor}` : ""}`
    });
    
    setTimeout(() => setAdded(false), 2000);
  };

  const sortedReviews = useMemo(() => {
    let result = [...product.reviews];
    
    // Aplicar ordenação
    if (sortOrder === "rating-high") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "rating-low") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === "relevance") {
      result.sort((a, b) => {
        // Prioridade 1: Comentário + Imagem
        if (a.image && a.comment && (!b.image || !b.comment)) return -1;
        if (b.image && b.comment && (!a.image || !a.comment)) return 1;
        
        // Prioridade 2: Apenas comentário
        if (a.comment && !a.image && !b.comment) return -1;
        if (b.comment && !b.image && !a.comment) return 1;
        
        // Prioridade 3: Rating (estrelas)
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

  return (
    <main className="min-h-screen bg-background pb-20 pt-24 text-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <section aria-label="Galeria do produto" className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <img src={product.images[selectedImage]} alt={`${product.name}, foto ${selectedImage + 1}`} className="h-full w-full object-cover" width={768} height={1024} loading="lazy" />
              <Button variant="secondary" size="icon" aria-label="Foto anterior" onClick={() => setSelectedImage((current) => current > 0 ? current - 1 : product.images.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="secondary" size="icon" aria-label="Próxima foto" onClick={() => setSelectedImage((current) => current < product.images.length - 1 ? current + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-none">
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button key={image} type="button" aria-label={`Exibir foto ${index + 1}`} onClick={() => setSelectedImage(index)} className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-foreground" : "border-transparent"}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" width={192} height={256} loading="lazy" />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-light uppercase tracking-[0.2em]">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm font-light">
                <div className="flex items-center gap-1">
                  <div className="flex" aria-label={`${product.rating} de 5 estrelas`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span>{product.rating}/5</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span>{product.salesCount.toLocaleString("pt-BR")} vendidos</span>
              </div>
              <p className="text-2xl font-light">R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em]">Tamanho</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button key={size} type="button" variant={selectedSize === size ? "default" : "outline"} onClick={() => { setSelectedSize(size); setAdded(false); }} className="size-12 rounded-none p-0">{size}</Button>
                ))}
              </div>
              {!selectedSize && <p className="text-xs text-muted-foreground">Selecione um tamanho para adicionar ao carrinho.</p>}
              <p className="flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="size-1 rounded-full bg-green-600/50" />
                Primeira troca é gratuita em caso de tamanho errado.
              </p>
            </div>

            {(product.id === "conjunto-espresso-alfaiataria" || product.id === "calca-alfaiataria-off-white") && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Acessório Incluso</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 items-center border border-foreground bg-foreground px-6 text-sm text-background">
                    CINTO - TAMANHO ÚNICO
                  </div>
                  <div className="text-sm font-light">
                    <span className="mr-2 text-muted-foreground line-through">R$ 89,00</span>
                    <span className="font-medium text-green-600">BRINDE</span>
                  </div>
                </div>
              </div>
            )}


            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Cor: {selectedColor}</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={`Cor ${color.name}`}
                      onClick={() => { setSelectedColor(color.name); setAdded(false); }}
                      className={`size-10 rounded-full border border-border transition-all ${selectedColor === color.name ? "ring-2 ring-foreground ring-offset-2" : "hover:scale-105"}`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            )}

            <Button type="button" onClick={addToCart} disabled={!selectedSize} className="w-full rounded-none py-8 uppercase tracking-[0.2em] cursor-pointer">
              <ShoppingBag className="mr-3 size-5" />{added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
            </Button>
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em]">Descrição</h2>
              <div className="space-y-6">
                <p className="font-light leading-relaxed text-muted-foreground">{product.description}</p>
                
                {product.id === "vestido-aurora-cafe" && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: `
                          <iframe src="https://fast.wistia.net/embed/iframe/wt5hy23zyr?videoFoam=true" title="Wistia video player" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="100%" height="100%"></iframe>
                          <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
                        `
                      }}
                    />
                  </div>
                )}
                
                {(product.id === "conjunto-alfaiataria-off-white" || product.id === "calca-alfaiataria-off-white") && (
                  <div className="wistia-video-container mt-6 aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-muted mx-auto lg:mx-0">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: `
                          <iframe src="https://fast.wistia.net/embed/iframe/z4i9e4fgkn?videoFoam=true" title="Wistia video player" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="100%" height="100%"></iframe>
                          <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
                        `
                      }}
                    />
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
                      size="sm"
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: document.getElementById('feedbacks')?.offsetTop || 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="rounded-none border-border/50 uppercase tracking-widest"
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: document.getElementById('feedbacks')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            className={`size-8 text-[10px] font-medium transition-colors ${currentPage === pageNum ? "bg-foreground text-background" : "hover:bg-muted"}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: document.getElementById('feedbacks')?.offsetTop || 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="rounded-none border-border/50 uppercase tracking-widest"
                    >
                      Próximo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-32 border-t border-border/50 pt-20">
          <h2 className="mb-16 text-center text-2xl font-light uppercase tracking-[0.3em]">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((recommended) => (
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
