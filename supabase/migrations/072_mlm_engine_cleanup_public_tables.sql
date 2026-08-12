-- Migration: Cleanup de tabelas legadas do schema public
-- Migra dados de plan_bonuses e customer_plans para mlm.bonus_regras e mlm.planos_distribuidores
-- ATENÇÃO: Execute apenas após confirmar que nenhum código referencia essas tabelas

BEGIN;

-- Migrar dados de plan_bonuses para mlm.bonus_regras (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plan_bonuses') THEN
    -- Insert any data from plan_bonuses that isn't already in bonus_regras
    INSERT INTO mlm.bonus_regras (nome, tipo, geracao, porcentagem, configuracoes, is_active, plan_id)
    SELECT
      COALESCE(pb.bonus_name, 'Bonus ' || pb.generation),
      CASE
        WHEN pb.bonus_type = 'generation' THEN 'geracao'
        WHEN pb.bonus_type = 'direct_bonus' THEN 'lideranca'
        ELSE 'direto'
      END,
      pb.generation,
      pb.bonus_percentage,
      jsonb_build_object('plano', LOWER(COALESCE(p.slug, p.name, 'avanco'))),
      true,
      pb.plan_id
    FROM public.plan_bonuses pb
    LEFT JOIN public.plans p ON p.id = pb.plan_id
    WHERE NOT EXISTS (
      SELECT 1 FROM mlm.bonus_regras br
      WHERE br.plan_id = pb.plan_id
        AND br.geracao = pb.generation
        AND br.porcentagem = pb.bonus_percentage
    );

    RAISE NOTICE 'Dados de plan_bonuses migrados para mlm.bonus_regras';
  END IF;
END $$;

-- Drop tables if they exist
DROP TABLE IF EXISTS public.plan_bonuses CASCADE;
DROP TABLE IF EXISTS public.customer_plans CASCADE;

-- Verify no references remain
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_depend
    WHERE refobjid = 'public.plan_bonuses'::regclass
    OR refobjid = 'public.customer_plans'::regclass
  ) THEN
    RAISE WARNING 'Algumas referências a plan_bonuses ou customer_plans ainda existem';
  END IF;
END $$;

COMMIT;
