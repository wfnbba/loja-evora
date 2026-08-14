import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import heroMobileAsset from "@/assets/hero_mobile.png.asset.json";
import { products as localProducts } from "@/lib/products-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Évora | Moda feminina elegante" },
      { name: "description", content: "Conheça a coleção Évora: alfaiataria, vestidos e peças femininas que unem elegância, presença e acabamento impecável." },
      { property: "og:title", content: "Évora | Moda feminina elegante" },
      { property: "og:description", content: "Descubra vestidos, alfaiataria e peças femininas da coleção Évora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="pt-20">
      <main>
        <section className="relative h-[80vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 hidden bg-cover bg-center md:block"
            style={{ backgroundImage: `url(${heroMobileAsset.url})`, backgroundPosition: "50% 20%" }}
          >
            <div className="absolute inset-0 bg-foreground/10" />
          </div>
          <div className="absolute inset-0 md:hidden">
            <OptimizedImage src={heroMobileAsset.url} alt="Coleção Évora" className="h-full w-full object-cover" width={800} height={1200} priority />
          </div>
          <div className="relative flex h-full items-end justify-center px-4 pb-[30%] md:pb-[25%]">
            <Button asChild className="rounded-none bg-background px-12 py-8 text-sm md:text-base text-foreground uppercase tracking-widest transition-all duration-300 hover:bg-background/90">
              <a href="#colecao">Explorar Coleção</a>
            </Button>
          </div>
        </section>

        <section id="colecao" className="container mx-auto scroll-mt-24 px-4 py-12 md:py-20 lg:px-8">
          <h1 className="mb-10 md:mb-16 text-center text-2xl md:text-3xl font-light uppercase tracking-[0.3em]">Coleção Évora</h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">

            {localProducts.map((product) => (
              <Link key={product.id} to="/produtos/$productId" params={{ productId: product.id }} className="group">
                <Card className="cursor-pointer border-none bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-muted md:mb-6">
                      <OptimizedImage
                        src={product.images[0] || ""}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={400}
                        height={533}
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] md:text-sm line-clamp-1">
                        {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
                      </h2>
                      <div className="mt-4">
                        <Button 
                          asChild
                          variant="outline"
                          className="w-full rounded-none border-foreground/20 text-[10px] uppercase tracking-[0.2em] py-5 hover:bg-foreground hover:text-background transition-all"
                        >
                          <Link to="/produtos/$productId" params={{ productId: product.id }}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="flex text-foreground">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`size-2.5 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {product.salesCount >= 100 
                            ? `+${Math.floor(product.salesCount / 100) * 100} vendas` 
                            : "Novo"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[10px] tracking-widest mt-1">
                        <p className="font-light text-muted-foreground">
                          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[9px] text-muted-foreground/50 line-through">
                            R$ {product.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}



