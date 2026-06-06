interface DistributorPlansProps {
  plans: any[];
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}

export function DistributorPlans({ plans, selectedPlan, setSelectedPlan }: DistributorPlansProps) {
  const selectedPlanData = plans.find((plan) => String(plan.id) === selectedPlan) || plans[0];

  return (
    <section className="space-y-4 rounded-3xl border border-zinc-800 bg-[#090d16]/65 p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-white">Planos ativos</h2>
        <p className="text-xs text-zinc-400">Lista carregada do Supabase.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(String(plan.id))}
            className={`rounded-2xl border p-4 text-left transition-colors ${String(plan.id) === selectedPlan ? "border-emerald-500/40 bg-emerald-500/10" : "border-zinc-800 bg-[#06080d] hover:border-zinc-700"}`}
          >
            <p className="text-sm font-bold text-white">{plan.name}</p>
            <p className="text-xs text-zinc-400">{plan.generations || 0} gerações · {plan.commission_percent || 0}%</p>
          </button>
        ))}
      </div>
      {selectedPlanData && (
        <p className="text-xs text-zinc-400">Plano selecionado: <strong className="text-white">{selectedPlanData.name}</strong></p>
      )}
    </section>
  );
}
