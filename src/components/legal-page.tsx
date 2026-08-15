import type { ReactNode } from "react";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
      <h1 className="text-3xl font-light uppercase tracking-[0.2em] text-[#4a3f35] lg:text-4xl">
        {title}
      </h1>
      <div className="mt-6 h-px w-24 bg-[#4a3f35]/30" />
      {intro ? (
        <p className="mt-8 text-base font-light leading-relaxed text-[#6b5d4d]">{intro}</p>
      ) : null}
      <div className="mt-10 space-y-10 text-base font-light leading-relaxed text-[#6b5d4d]">
        {children}
      </div>
      <div className="mt-16 rounded-sm border border-[#4a3f35]/15 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(74,63,53,0.25)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a3f35]">
          Loja Évora
        </p>
        <p className="mt-3 text-sm font-light text-[#6b5d4d]">
          Av. Trompowsky, 354 - 5º andar - Centro, Florianópolis - SC, 88015-300
        </p>
        <p className="mt-1 text-sm font-light text-[#6b5d4d]">
          Atendimento: atendimento@lojaevora.shop · Horário: 09:00 às 18:00
        </p>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-[#4a3f35]">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
