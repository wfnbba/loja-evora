import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useCartStore } from "@/store/cart-store";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, RefreshCw, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { products as localProducts } from "@/lib/products-data";


export const Route = createFileRoute("/produtos/$productId")({
  loader: async ({ params }) => {
    const product = localProducts.find(p => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return {
        meta: [
          { title: "Produto não encontrado | Loja Évora" },
        ]
      };
    }
    const title = `${product.name} | Loja Évora`;
    const description = product.description;
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
  const loaderData = Route.useLoaderData();
  const product = loaderData.product;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "Única");
  const [added, setAdded] = useState(false);
  const [giftAdded, setGiftAdded] = useState(true); // Brinde é automático
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 10;
  
  const totalReviews = product.reviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const currentReviews = product.reviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);
  
  const addItem = useCartStore((state) => state.addItem);

  const addToCart = async () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Adicione um tamanho primeiro", {
        className: "bg-red-50 text-red-600 border-red-100",
      });
      return;
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Adicione uma cor primeiro", {
        className: "bg-red-50 text-red-600 border-red-100",
      });
      return;
    }
    
    // Adicionar item principal
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || "",
      size: selectedSize || "Único",
      color: selectedColor,
      quantity: 1
    });

    // Adicionar brinde se disponível
    if (product.includedGift) {
      addItem({
        id: `${product.id}-brinde`,
        name: product.includedGift.name,
        price: 0,
        originalPrice: 49.90,
        image: product.includedGift.image || product.images[0] || "",
        size: "Único",
        color: product.includedGift.color,
        quantity: 1
      });
    }
    
    setAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`);
    window.dispatchEvent(new CustomEvent('open-cart'));
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background pb-12 pt-20 md:pb-20 md:pt-24 text-foreground">
      <div className="container mx-auto px-0 md:px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-20">

          <section aria-label="Galeria do produto" className="relative space-y-4 md:sticky md:top-24">
            {/* Carrossel Principal */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted md:rounded-sm group cursor-pointer" onClick={() => setSelectedImage((current) => current < product.images.length - 1 ? current + 1 : 0)}>
              <div 
                className="flex h-full w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
              >
                {product.images.map((image, index) => (
                  <div key={index} className="h-full w-full flex-shrink-0">
                    <OptimizedImage 
                      src={image} 
                      alt={`${product.name} - imagem ${index + 1}`} 
                      className="h-full w-full object-cover" 
                      width={600} 
                      height={800} 
                      priority={index === 0} 
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={() => setSelectedImage((current) => current > 0 ? current - 1 : product.images.length - 1)} 
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full size-12 opacity-80 hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm border-none md:flex hidden"
              >
                <ChevronLeft className="size-6 text-foreground" />
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={() => setSelectedImage((current) => current < product.images.length - 1 ? current + 1 : 0)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full size-12 opacity-80 hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm border-none md:flex hidden"
              >
                <ChevronRight className="size-6 text-foreground" />
              </Button>

              {/* Indicadores Mobile */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
                {product.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "size-1.5 rounded-full transition-all duration-300",
                      selectedImage === index ? "w-4 bg-foreground" : "bg-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0 snap-x">
              {product.images.map((image, index) => (
                <button 
                  key={index} 
                  type="button" 
                  onClick={() => setSelectedImage(index)} 
                  className={cn(
                    "relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-muted md:w-24 border transition-all snap-start", 
                    selectedImage === index ? "border-foreground ring-1 ring-foreground opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                  )}
                >
                  <OptimizedImage src={image} alt={`${product.name} miniatura ${index + 1}`} className="h-full w-full object-cover" width={96} height={128} />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6 md:space-y-8 px-4 md:px-0">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-widest">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <div className="flex" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`size-3.5 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm">{product.rating.toFixed(1)}/5</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-xs md:text-sm">{product.salesCount} vendas</span>
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-light">
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    R$ {product.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
            
            {product.sizes.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest">Tamanho</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <Button key={size} type="button" variant={selectedSize === size ? "default" : "outline"} onClick={() => { setSelectedSize(size); setAdded(false); }} className="size-14 rounded-none p-0 text-sm font-bold">{size}</Button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 border border-green-600/20 bg-green-600/5 p-4 transition-all hover:bg-green-600/10">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-700">
                    <RefreshCw className="size-5 animate-spin-slow" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-green-700">Troca Garantida</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-green-600/90 leading-tight">
                      Primeira troca é gratuita em caso de tamanho errado.
                    </p>
                  </div>
                </div>
              </div>

            )}

            {product.colors && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest">Cor: {selectedColor}</p>

                <div className="flex flex-wrap gap-4">
                  {product.colors.length > 0 ? (
                    product.colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "group relative flex size-10 items-center justify-center rounded-full border transition-all duration-300",
                          selectedColor === color.name 
                            ? "border-foreground p-1 ring-1 ring-foreground ring-offset-2" 
                            : "border-border p-0.5 hover:border-foreground/50"
                        )}
                        title={color.name}
                      >
                        <span 
                          className="h-full w-full rounded-full shadow-inner"
                          style={{ backgroundColor: color.value }}
                        />
                        {selectedColor === color.name && (
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {color.name}
                          </span>
                        )}

                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      className="group relative flex size-10 items-center justify-center rounded-full border border-foreground p-1 ring-1 ring-foreground ring-offset-2 cursor-default"
                    >
                      <span 
                        className="h-full w-full rounded-full shadow-inner"
                        style={{ backgroundColor: product.colors[0]?.value || "#000" }}
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            {product.includedGift && (
              <div className="mt-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brinde Exclusivo Ganho</p>
                <div className="group relative flex items-center justify-between border-2 border-dashed border-[#4a3f35]/30 p-5 bg-[#4a3f35]/5 transition-all hover:bg-[#4a3f35]/10 overflow-hidden cursor-default">
                  {/* Badge de Destaque */}
                  <div className="absolute -right-8 -top-8 size-20 rotate-45 bg-[#4a3f35] flex items-end justify-center pb-2">
                    <span className="text-[10px] font-bold text-[#fdfbf7] uppercase tracking-tighter">GRÁTIS</span>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    {/* Seletor Visual de Cor para o Brinde */}
                    <div className="relative flex size-14 items-center justify-center rounded-full border-2 border-foreground p-1 ring-1 ring-foreground ring-offset-2 shadow-lg bg-white">
                      <span 
                        className="h-full w-full rounded-full shadow-inner"
                        style={{ backgroundColor: product.includedGift.colorValue || "#3d2b1f" }}
                        title={product.includedGift.color}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#4a3f35] leading-tight">{product.includedGift.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#4a3f35]/70">Cor: {product.includedGift.color}</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#4a3f35]/70">Tam: Único</span>
                      </div>
                    </div>
                  </div>


                  <div className="flex flex-col items-end gap-1 pr-4">
                    <span className="text-xs text-[#4a3f35]/40 line-through decoration-1 tracking-widest">R$ 49,90</span>
                    <span className="text-sm font-black text-green-700 uppercase tracking-widest">GRÁTIS</span>

                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button 
                onClick={addToCart} 
                className={cn(
                  "w-full rounded-none py-10 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 utmify",
                  (!selectedSize || (product.colors && product.colors.length > 0 && !selectedColor)) 
                    ? "bg-[#4a3f35]/40 hover:bg-[#4a3f35]/50" 
                    : "bg-[#4a3f35] hover:bg-[#4a3f35]/90"
                )}
              >
                <ShoppingBag className="mr-3 size-6" />
                {added ? "ADICIONADO AO CARRINHO" : "ADICIONAR AO CARRINHO"}
              </Button>
            </div>

            
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-widest">Descrição</h2>
              <div className="space-y-6">
                <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground">{product.description}</p>

                
                {product.video && (
                  <div className="mt-8 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Vídeo do Produto</h2>

                    <VideoPlayer src={product.video} poster={product.images[0]} />
                  </div>
                )}
              </div>
            </div>

            <div id="feedbacks" className="space-y-12 border-t border-border pt-12">
              <div className="space-y-8">
                <h2 className="text-sm font-bold uppercase tracking-widest">Avaliações</h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-center justify-center space-y-2 border-r border-border/50 pr-8 text-center">
                    <span className="text-5xl font-light">{product.rating.toFixed(1)}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">{product.reviews.length.toLocaleString("pt-BR")} avaliações</span>
                  </div>

                  <div className="col-span-1 space-y-2 lg:col-span-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.ratingBreakdown[star as keyof typeof product.ratingBreakdown] || 0;
                      const totalForPercentage = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0) || 1;
                      const percentage = (count / totalForPercentage) * 100;
                      return (
                        <div key={star} className="flex items-center gap-4">
                          <span className="w-5 text-sm font-bold">{star}</span>
                          <Star className="size-4 fill-current" />
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="w-12 text-right text-xs tabular-nums text-muted-foreground font-medium">{count.toLocaleString("pt-BR")}</span>
                        </div>

                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {currentReviews.map((review, idx) => (
                  <article key={idx} className="flex flex-col gap-4 border-b border-border/50 pb-8 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={index} className={`size-4 ${index < review.rating ? "fill-current text-[#4a3f35]" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{review.user}</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground">{review.comment}</p>
                    )}

                    {review.image && (
                      <div className="relative mt-2 aspect-square w-40 overflow-hidden bg-muted">
                        <OptimizedImage
                          src={review.image}
                          alt={`Avaliação de ${review.user}`}
                          className="h-full w-full object-cover"
                          width={128}
                          height={128}
                        />
                      </div>
                    )}
                  </article>
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReviewPage(p => Math.max(1, p - 1));
                        document.getElementById('feedbacks')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={reviewPage === 1}
                      className="rounded-none border-[#4a3f35]/20 text-[#4a3f35] hover:bg-[#4a3f35]/5"
                    >
                      Anterior
                    </Button>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Página {reviewPage} de {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReviewPage(p => Math.min(totalPages, p + 1));
                        document.getElementById('feedbacks')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={reviewPage === totalPages}
                      className="rounded-none border-[#4a3f35]/20 text-[#4a3f35] hover:bg-[#4a3f35]/5"
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-32 space-y-16 px-4 md:px-0">
          <div className="space-y-6 text-center">

            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.3em]">Explore nossa coleção</h2>
            <div className="mx-auto h-px w-20 bg-foreground/10" />
            <Link to="/" className="inline-block text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4">
              Voltar para a loja
            </Link>
          </div>
        </section>
        <section className="mt-32 space-y-16 px-4 md:px-0">
          <div className="space-y-6 text-center">
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.3em]">Você também pode gostar</h2>
            <div className="mx-auto h-px w-20 bg-foreground/10" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {localProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map(p => (
                <Link key={p.id} to="/produtos/$productId" params={{ productId: p.id }} className="group space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <OptimizedImage 
                      src={p.images[0] || ""} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      width={300} 
                      height={400} 
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-light tracking-widest">
                      R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function VideoPlayer({ src, poster }: { src: string; poster?: string | undefined }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-lg bg-black shadow-xl lg:mx-0 group cursor-pointer" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        className="h-full w-full object-cover"
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        Seu navegador não suporta a tag de vídeo.
      </video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-black/30">
          <div className="flex size-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
            <Play className="ml-1 size-8 fill-current" />
          </div>
        </div>
      )}

      <div className={`absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isPlaying ? 'block' : 'hidden'}`} />
    </div>
  );
}
