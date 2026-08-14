import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo.png.asset.json";
import logoTextAsset from "@/assets/logo_text.png.asset.json";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-light text-[#4a3f35] tracking-[0.2em]">404</h1>
        <h2 className="mt-4 text-xl font-light text-[#4a3f35] uppercase tracking-widest">Página não encontrada</h2>
        <p className="mt-4 text-sm font-light text-[#8a7d6e] tracking-wide">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[#4a3f35] text-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-[#4a3f35]/90"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-light tracking-[0.2em] text-[#4a3f35] uppercase">
          Algo deu errado
        </h1>
        <p className="mt-4 text-sm font-light text-[#8a7d6e] tracking-wide">
          Não conseguimos carregar esta página. Tente atualizar ou volte para o início.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-[#4a3f35] text-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-[#4a3f35]/90"
          >
            Tentar novamente
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-[#4a3f35] text-[#4a3f35] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-[#4a3f35] hover:text-white"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Évora | Elegância que Impõe Presença" },
      { name: "description", content: "Loja oficial Évora. Roupas que inspiram confiança e elegância." },
      { property: "og:title", content: "Évora" },
      { property: "og:description", content: "Elegância que Impõe Presença" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-[#fdfbf7] text-[#4a3f35]">
          <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoAsset.url} alt="Évora Logo" className="h-10 w-auto" />
                <img src={logoTextAsset.url} alt="Évora" className="hidden h-6 w-auto md:block" />
              </Link>
              <nav className="hidden items-center gap-8 md:flex">
                <Link to="/" className="text-sm font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors">Início</Link>
                <a href="#" className="text-sm font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors">Coleções</a>
                <a href="#" className="text-sm font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors">Sobre</a>
              </nav>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-sm font-medium tracking-[0.2em] uppercase hover:bg-transparent px-0">Carrinho (0)</Button>
              </div>
            </div>
          </header>
          {children}
          <footer className="border-t border-border/50 bg-background py-20">
            <div className="container mx-auto px-4 text-center lg:px-8">
              <img src={logoAsset.url} alt="Évora Logo" className="mx-auto mb-8 h-8 w-auto opacity-50" />
              <nav className="mb-8 flex justify-center gap-8">
                <a href="#" className="text-[10px] font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors">Termos</a>
                <a href="#" className="text-[10px] font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors">Privacidade</a>
              </nav>
              <p className="text-[10px] tracking-[0.2em] font-light text-muted-foreground">
                © 2026 ÉVORA. TODOS OS DIREITOS RESERVADOS.
              </p>
            </div>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
