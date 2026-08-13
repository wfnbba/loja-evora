import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold tracking-tight">Évora</h1>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary">Início</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Coleções</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Contato</a>
          </nav>
          <Button variant="ghost">Carrinho (0)</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 rounded-2xl bg-secondary p-12 text-center">
          <h2 className="text-4xl font-bold">Nova Coleção</h2>
          <p className="mt-4 text-muted-foreground">Descubra a elegância da Évora.</p>
        </section>

        <section>
          <h3 className="mb-6 text-2xl font-bold">Produtos em Destaque</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="mb-4 aspect-square rounded-lg bg-muted" />
                  <h4 className="font-semibold">Produto {i}</h4>
                  <p className="text-sm text-muted-foreground">R$ 199,90</p>
                  <Button className="mt-4 w-full">Ver Detalhes</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 Évora. Todos os direitos reservados.
      </footer>
    </div>
  );
}
