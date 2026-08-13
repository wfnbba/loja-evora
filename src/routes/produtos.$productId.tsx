import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/produtos/$productId")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error("Produto não encontrado");
    return { product };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a3f35] pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-white">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 aspect-[3/4] overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-[#4a3f35]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-[0.2em] uppercase">{product.name}</h1>
              <p className="text-2xl font-light">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium tracking-widest uppercase">Tamanho</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 w-12 flex items-center justify-center border transition-all ${
                      selectedSize === size
                        ? "bg-[#4a3f35] text-white border-[#4a3f35]"
                        : "border-[#e5e1da] hover:border-[#4a3f35]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full bg-[#4a3f35] text-white py-8 rounded-none tracking-[0.2em] uppercase hover:bg-[#4a3f35]/90 transition-all">
              <ShoppingBag className="w-5 h-5 mr-3" />
              Adicionar ao Carrinho
            </Button>

            <div className="pt-8 border-t border-[#e5e1da] space-y-4">
              <p className="text-sm font-medium tracking-widest uppercase">Descrição</p>
              <p className="font-light leading-relaxed text-[#8a7d6e]">{product.description}</p>
            </div>

            {/* Reviews */}
            <div className="pt-8 border-t border-[#e5e1da] space-y-6">
              <p className="text-sm font-medium tracking-widest uppercase">Feedback das Clientes</p>
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-medium tracking-widest uppercase">{review.user}</span>
                      </div>
                      <p className="text-sm font-light italic text-[#8a7d6e]">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-light italic text-[#8a7d6e]">Ainda não há avaliações para este produto.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
