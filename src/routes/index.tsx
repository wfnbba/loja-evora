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
      { title: "Loja Évora | Moda feminina elegante" },
      { name: "description", content: "Conheça a coleção Loja Évora: alfaiataria, vestidos e peças femininas que unem elegância, presença e acabamento impecável." },
      { property: "og:title", content: "Loja Évora | Moda feminina elegante" },
      { property: "og:description", content: "Descubra vestidos, alfaiataria e peças femininas da coleção Évora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="">
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
              <div key={product.id} className="group cursor-pointer">
                <Card className="cursor-pointer border-none bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <Link to="/produtos/$productId" params={{ productId: product.id }} className="relative mb-4 block aspect-[3/4] overflow-hidden bg-muted md:mb-6">
                      <OptimizedImage
                        src={product.images[0] || ""}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={400}
                        height={533}
                      />
                    </Link>
                    <div className="space-y-1 text-center">
                      <h2 className="text-xs font-bold uppercase tracking-widest md:text-sm line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                        {product.name}
                      </h2>
                      <div className="mt-2">
                        <Link 
                          to="/produtos/$productId" 
                          params={{ productId: product.id }}
                          className="w-full rounded-none border border-foreground/20 text-xs uppercase tracking-widest py-3 flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">

                        <div className="flex text-foreground">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`size-3 md:size-3.5 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] md:text-xs uppercase tracking-widest text-muted-foreground font-medium">
                          {product.salesCount >= 100 
                            ? `+${Math.floor(product.salesCount / 100) * 100} vendas` 
                            : "Novo"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm md:text-base tracking-widest mt-1">
                        <p className="font-bold text-foreground">
                          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>

                        {product.originalPrice && (
                          <p className="text-xs md:text-sm text-muted-foreground/50 line-through">
                            R$ {product.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#4a3f35] text-[#fdfbf7]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] rounded-full bg-[#fdfbf7]/5 blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-[120%] w-[120%] rounded-full bg-[#fdfbf7]/5 blur-3xl" />
          </div>

          <div className="container relative mx-auto px-4 py-20 md:py-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-6 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-[#fdfbf7]/60">
                A Essência Évora
              </span>
              <h2 className="mb-8 text-3xl font-light uppercase tracking-[0.2em] md:text-4xl lg:text-5xl">
                Alfaiataria que Impõe Presença
              </h2>
              <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-[#fdfbf7]/80 md:text-lg">
                A Loja Évora nasceu para mulheres que vestem confiança. Cada peça é pensada como um investimento: 
                cortes que valorizam silhueta, tecidos premium que duram além das estações e um acabamento 
                impecável que transforma o básico em extraordinário.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="group border border-[#fdfbf7]/10 bg-[#fdfbf7]/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-[#fdfbf7]/10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-[#fdfbf7]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#fdfbf7]">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em]">Corte Impecável</h3>
                <p className="text-sm font-light leading-relaxed text-[#fdfbf7]/70">
                  Modelagem que valoriza cada corpo, com ajustes pensados para um caimento sofisticado e confortável.
                </p>
              </div>

              <div className="group border border-[#fdfbf7]/10 bg-[#fdfbf7]/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-[#fdfbf7]/10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-[#fdfbf7]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#fdfbf7]">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em]">Tecidos Premium</h3>
                <p className="text-sm font-light leading-relaxed text-[#fdfbf7]/70">
                  Seleção de materiais de alta gramatura e toque luxuoso, feitos para durar e impressionar.
                </p>
              </div>

              <div className="group border border-[#fdfbf7]/10 bg-[#fdfbf7]/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-[#fdfbf7]/10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-[#fdfbf7]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#fdfbf7]">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em]">Experiência Évora</h3>
                <p className="text-sm font-light leading-relaxed text-[#fdfbf7]/70">
                  Embalagem cuidadosa, primeira troca gratuita por tamanho e atendimento que acompanha você em cada etapa.
                </p>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center gap-6 border-t border-[#fdfbf7]/10 pt-12 md:flex-row md:gap-12">
              <div className="text-center">
                <p className="text-3xl font-light tracking-[0.1em] md:text-4xl">+10k</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#fdfbf7]/60">Clientes Satisfeitas</p>
              </div>
              <div className="hidden h-10 w-px bg-[#fdfbf7]/20 md:block" />
              <div className="text-center">
                <p className="text-3xl font-light tracking-[0.1em] md:text-4xl">4.9</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#fdfbf7]/60">Avaliação Média</p>
              </div>
              <div className="hidden h-10 w-px bg-[#fdfbf7]/20 md:block" />
              <div className="text-center">
                <p className="text-3xl font-light tracking-[0.1em] md:text-4xl">Frete</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#fdfbf7]/60">Grátis em Todas as Compras</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}




