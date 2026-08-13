import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/products-data";
import logoAsset from "@/assets/logo.png.asset.json";
import logoTextAsset from "@/assets/logo_text.png.asset.json";
import heroMobileAsset from "@/assets/hero_mobile.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="pt-20">
      <main>

      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          {/* Desktop Hero - Imagem baseada na original mas ajustada para wide */}
          <div 
            className="absolute inset-0 hidden bg-cover bg-center md:block"
            style={{ 
              backgroundImage: `url(${heroMobileAsset.url})`,
              backgroundPosition: '50% 20%'
            }}
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Mobile Hero - Imagem original */}
          <div className="absolute inset-0 md:hidden">
            <img 
              src={heroMobileAsset.url} 
              alt="Évora Coleção" 
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative flex h-full items-end justify-center px-4 pb-[33%] md:pb-[25%]">
            <div className="max-w-2xl space-y-6">
              <Button className="bg-white px-10 py-6 text-black hover:bg-white/90 rounded-none tracking-widest uppercase transition-all duration-300">
                Explorar Coleção
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 lg:px-8">
          <h3 className="mb-12 text-center text-3xl font-light tracking-[0.2em] uppercase">Produtos em Destaque</h3>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <Link 
                key={product.id} 
                to="/produtos/$productId" 
                params={{ productId: product.id }}
                className="group"
              >
                <Card className="border-none bg-transparent shadow-none cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-[#f5f2ed]">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <h4 className="text-sm font-medium tracking-widest uppercase">{product.name}</h4>
                      <p className="text-sm font-light text-[#8a7d6e]">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
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


