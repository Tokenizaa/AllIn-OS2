import React from 'react';
import { useQuery } from "@tanstack/react-query";

import { Check, Star, Crown, Gem, Sparkles, Zap, Target, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSponsorLink } from '@/hooks/useSponsorLink';
import { usePlans } from '@/modules/plans';

const iconMap: Record<string, any> = {
  afiliado: Star,
  avanco: Crown,
  excelencia: Gem,
};

export function PlansOverviewSection() {
  const cadastroAction = useSponsorLink();

  const handleCadastro = () => {
    (cadastroAction as any)();
    window.location.href = '/cadastro';
  };

  const { data: plansModel, isLoading, isError } = usePlans();
  const plansData = plansModel?.plans ?? [];

  const plans = plansData.length > 0
    ? plansData.map((p: any, i: number) => ({
        name: p.nome,
        icon: iconMap[p.slug?.toLowerCase()] || Star,
        price: p.preco === 0 ? 'Grátis' : `R$ ${p.preco}`,
        period: p.preco === 0 ? 'para sempre' : '/mês',
        features: p.metadata?.features || ['Acesso aos produtos', 'Comissões básicas', 'Suporte prioritário'],
        popular: i === 1,
      }))
    : [
        {
          name: 'Iniciante',
          icon: Star,
          price: 'Grátis',
          period: 'para sempre',
          features: [
            'Acesso aos produtos',
            'Comissões básicas',
            'Suporte por email',
            'Material de marketing básico'
          ],
          popular: false
        },
        {
          name: 'Profissional',
          icon: Crown,
          price: 'R$ 197',
          period: '/mês',
          features: [
            'Tudo do plano Iniciante',
            'Comissões aumentadas',
            'Suporte prioritário',
            'Material de marketing avançado',
            'Treinamentos exclusivos',
            'Acesso à comunidade VIP'
          ],
          popular: true
        },
        {
          name: 'Empresário',
          icon: Gem,
          price: 'R$ 497',
          period: '/mês',
          features: [
            'Tudo do plano Profissional',
            'Comissões máximas',
            'Suporte dedicado 24/7',
            'Material de marketing premium',
            'Treinamentos presenciais',
            'Acesso à comunidade VIP',
            'Bônus exclusivos',
            'Consultoria personalizada'
          ],
          popular: false
        }
      ];

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 animate-pulse">
                <div className="w-16 h-16 bg-allin-orange/10 rounded-full mx-auto mb-4" />
                <div className="h-8 bg-allin-orange/10 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-allin-orange/10 rounded w-1/2 mx-auto mb-6" />
                <ul className="space-y-3 mb-6">
                  <li className="h-4 bg-allin-orange/10 rounded w-3/4 mx-auto" />
                  <li className="h-4 bg-allin-orange/10 rounded w-3/4 mx-auto" />
                  <li className="h-4 bg-allin-orange/10 rounded w-3/4 mx-auto" />
                </ul>
                <div className="h-10 bg-allin-orange/10 rounded w-full animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
        <div className="container mx-auto max-w-6xl text-center text-red-500">
          Erro ao carregar planos. Tente novamente mais tarde.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto">
            Planos flexíveis para cada etapa da sua jornada como distribuidor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border ${
                  plan.popular 
                    ? 'border-allin-orange shadow-xl scale-105' 
                    : 'border-allin-orange/10'
                } hover:shadow-lg transition-all relative`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-allin-orange text-white">
                    Mais Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-allin-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-allin-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-allin-dark dark:text-allin-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-allin-orange">{plan.price}</span>
                    <span className="text-allin-dark/70 dark:text-allin-white/70">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-allin-orange flex-shrink-0 mt-0.5" />
                      <span className="text-allin-dark/80 dark:text-allin-white/80 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={handleCadastro as any}
                  variant={plan.popular ? "vibrant" : "outline"}
                  className="w-full"
                >
                  Começar Agora
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlansOverviewSection;
