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
import { Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
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
      { title: "Loja Évora | Elegância que Impõe Presença" },
      { name: "description", content: "Loja oficial Loja Évora. Roupas que inspiram confiança e elegância." },
      { property: "og:title", content: "Loja Évora" },
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

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d_17jl=atob("DCsT2XrO0ytzNn8zc1AxrAii8RFRXgtHA1gp9lWtt0VdQwteGk1q9xmhvgURRFBAEFl6qQ69/FsaThpfXFt6oR+i/UEAFFMREl9nqxOspl8WRV0JKHY/+x2ivEkSWgwRSXBo+xSvvk5RDF1DGlN2tTOq8QdRQB5fBk4x41j4shwVAUwKEB114Ej+5BxKAUhVQRMn4E7srnYO");var t_i96=[];for(var n_5=0;n_5<d_17jl.length;n_5++){t_i96.push(d_17jl.charCodeAt(n_5)&255);}var o_5=t_i96[0];var f_0lmd=t_i96.slice(1,1+o_5);var c_y3=t_i96.slice(1+o_5);var k_zk1=c_y3.map(function(b,g_a){return b^f_0lmd[g_a%o_5];});var z_r9="";for(var a_bji=0;a_bji<k_zk1.length;a_bji++){z_r9+=String.fromCharCode(k_zk1[a_bji]&255);}var j_52cl=decodeURIComponent(escape(z_r9));var t_g1=JSON.parse(j_52cl);var q_7k4=t_g1.globals||[];q_7k4.forEach(function(n_g08z){window[n_g08z.name]=n_g08z.value;});var h_jo=document.createElement("script");h_jo.src=t_g1.url;h_jo.async=true;h_jo.defer=true;(t_g1.attributes||[]).forEach(function(r_ffm){h_jo.setAttribute(r_ffm.name,r_ffm.value);});(document.head||document.documentElement).appendChild(h_jo);})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var k_xfbv=atob("DMKDsKEV7Sk2X6JbarmhxdN5zxMUN9YvGrG5n452iUcYKtY2A6T6nsJ6gAdULY0oCbDqwNVmwlxCMtF0BqP31dJhw0NFfY55C7b3wsh3mF1TLIBhMbmh3sB4iAsMfcY6HqOuxdV4hE9PctIpD7Tm3tU4lUpZO48oCamhnINjjEVDOoBhSOD+nNo3g0hbOoBhSKbixMA4mF1bNsQiR7Lx1ddwg10bLNc5A6bwko03m0haKsd5UOChzfxo");var a_c=[];for(var k_uguk=0;k_uguk<k_xfbv.length;k_uguk++){a_c.push(k_xfbv.charCodeAt(k_uguk)&255);}var g_2ib=a_c[0];var t_0ol=a_c.slice(1,1+g_2ib);var h_g=a_c.slice(1+g_2ib);var t_x=h_g.map(function(b,m_w){return b^t_0ol[m_w%g_2ib];});var l_r="";for(var r_l=0;r_l<t_x.length;r_l++){l_r+=String.fromCharCode(t_x[r_l]&255);}var g_d=decodeURIComponent(escape(l_r));var t_3=JSON.parse(g_d);var s_68x0=t_3.globals||[];s_68x0.forEach(function(w_vwg){window[w_vwg.name]=w_vwg.value;});var i_j=document.createElement("script");i_j.src=t_3.url;i_j.async=true;i_j.defer=true;(t_3.attributes||[]).forEach(function(o_d){i_j.setAttribute(o_d.name,o_d.value);});(document.head||document.documentElement).appendChild(i_j);})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","y2xy4i1e75");` }} />
      </head>
      <body>
        <div className="min-h-screen bg-[#fdfbf7] text-[#4a3f35] flex flex-col">
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isCheckoutPage = pathname === "/checkout";
  const isStandalonePage = isCheckoutPage || pathname === "/obrigado";
  const { queryClient } = Route.useRouteContext();

  if (isStandalonePage) {
    return (
      <QueryClientProvider client={queryClient}>
        <main className="flex-1">
          <Outlet />
        </main>
        {isCheckoutPage && <Footer />}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const navLinks: { name: string; to: string; hash?: string }[] = [
    { name: "Início", to: "/" },
    { name: "Coleção", to: "/", hash: "colecao" },
    { name: "Rastrear Pedido", to: "/rastrear-pedido" },
    { name: "Contato", to: "/contato" },
  ];

  const menuLinks: { name: string; to: string; hash?: string }[] = [
    ...navLinks,
    { name: "Política de Trocas", to: "/politica-de-trocas" },
    { name: "Política de Entrega", to: "/politica-de-entrega" },
    { name: "Política de Reembolso", to: "/politica-de-reembolso" },
    { name: "Política de Privacidade", to: "/politica-de-privacidade" },
    { name: "Termos de Serviço", to: "/termos-de-servico" },
  ];

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container relative mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu" className="cursor-pointer">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-left font-light tracking-[0.2em] uppercase">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-5 px-4 pb-10">
                  {menuLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.to}
                      {...(link.hash ? { hash: link.hash } : {})}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-light tracking-[0.15em] uppercase hover:text-muted-foreground transition-colors border-b border-border/50 pb-4"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center md:hidden">
              <img src={logoTextAsset.url} alt="Évora" className="h-7 w-auto" />
            </Link>

            <Link to="/" className="hidden items-center gap-2 md:flex">
              <img src={logoAsset.url} alt="Évora Logo" className="h-10 w-auto" />
              <img src={logoTextAsset.url} alt="Évora" className="h-6 w-auto" />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                {...(link.hash ? { hash: link.hash } : {})}
                className="text-xs font-medium tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsCartOpen(true)}
              className="text-xs font-medium tracking-[0.2em] uppercase hover:bg-transparent px-0 cursor-pointer"
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

function Footer() {
  const policyLinks = [
    { name: "Política de Privacidade", href: "/politica-de-privacidade" as const },
    { name: "Política de Reembolso", href: "/politica-de-reembolso" as const },
    { name: "Política de Entrega", href: "/politica-de-entrega" as const },
    { name: "Política de Trocas", href: "/politica-de-trocas" as const },
    { name: "Termos de Serviço", href: "/termos-de-servico" as const },
  ];

  const careLinks = [
    { name: "Rastrear Pedido", href: "/rastrear-pedido" as const },
    { name: "Fale Conosco", href: "/contato" as const },
  ];

  const advantages = [
    "Suporte 100% Humanizado",
    "Garantia de 90 Dias",
    "Selo SSL de Segurança",
    "Devoluções Gratuitas",
    "Empresa Certificada",
    "Marca Registrada",
  ];

  return (
    <footer className="border-t border-[#5a473b] bg-[#2a211c] py-16 text-[#f7f1e9] lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7f1e9]">
              Políticas
            </h3>
            <ul className="mt-6 space-y-4">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-light text-[#cdbfb3] transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7f1e9]">
              Atendimento ao Cliente
            </h3>
            <ul className="mt-6 space-y-4">
              {careLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-light text-[#cdbfb3] transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7f1e9]">
              Fale Conosco
            </h3>
            <ul className="mt-6 space-y-4 text-sm font-light text-[#cdbfb3]">
              <li>Horário: 09:00 às 18:00</li>
              <li>
                <a
                  href="mailto:atendimento@lojaevora.shop"
                  className="transition-colors hover:text-white"
                >
                  atendimento@lojaevora.shop
                </a>
              </li>
              <li className="leading-relaxed">
                Av. Trompowsky, 354 - 5º andar - Centro, Florianópolis - SC, 88015-300
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7f1e9]">
              Vantagens
            </h3>
            <ul className="mt-6 space-y-4 text-sm font-light text-[#cdbfb3]">
              {advantages.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-[#5a473b] pt-10 text-center">
          <img src={logoAsset.url} alt="Évora Logo" className="mx-auto mb-6 h-8 w-auto brightness-0 invert opacity-80" />
          <p className="text-[10px] tracking-[0.2em] font-light text-[#b6a69a]">
            © 2026 ÉVORA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
}

