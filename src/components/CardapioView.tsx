import { useApp } from "@/contexts/AppContext";
import { MEALS } from "@/lib/data";
import { getCardapioStrings } from "@/lib/store";

export default function CardapioView() {
  const { cardapio } = useApp();
  const cardStrings = getCardapioStrings(cardapio);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-black text-secondary">🍽️ Cardápio Sugerido</div>
        <div className="text-[13px] text-muted-foreground mt-1">Meta: 1.600–1.800 kcal/dia · Hidratação: 1.500–2.000ml/dia</div>
      </div>

      <div className="bg-card rounded-2xl p-4 border border-border" style={{ background: "hsl(140 40% 95%)", borderColor: "hsla(var(--primary-light) / 0.3)" }}>
        <p className="text-[13px] text-primary">💡 Oferecer água/coco/soro a cada 2h. Consistência pastosa homogênea.</p>
      </div>

      {MEALS.map((m) => (
        <div key={m.key} className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">{m.label} ({m.hora})</div>
          {(cardStrings[m.key] || []).map((op, i) => (
            <div key={i} className="p-2 px-3 rounded-lg bg-background text-[13px] mb-1.5 border border-border">
              <strong className="text-primary">Opção {i + 1}:</strong> {op}
            </div>
          ))}
        </div>
      ))}

      <div className="bg-card rounded-2xl p-4 border border-border" style={{ borderLeft: "4px solid hsl(var(--warning))" }}>
        <div className="text-sm font-extrabold text-warning mb-3">⚠️ Orientações Importantes</div>
        {[
          "Consistência pastosa homogênea, sem grumos, cascas ou pedaços",
          "Líquidos espessados conforme orientação fonoaudiológica",
          "Temperatura morna — evitar quente ou gelado demais",
          "Não oferecer pudim — risco de aspiração",
          "Lanches leves (9h e 15h) para preservar apetite nas refeições principais",
          "Manter ambiente calmo, sem TV ou barulho durante as refeições",
          "Oferecer líquidos proativamente a cada 1–2h — idosos com Alzheimer não sentem sede",
        ].map((t, i) => (
          <div key={i} className="py-2 border-b border-border last:border-b-0 text-[13px] leading-relaxed">✔ {t}</div>
        ))}
      </div>
    </div>
  );
}
