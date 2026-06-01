begin;

-- ============================================================================
-- Align MLM plan rules with production business requirements
-- ============================================================================

-- Afiliado:
-- - 20% for the seller
-- - 18% for the sponsor
-- - total 38% on link-based store sales
update public.plans
set
  price = 0,
  activation_fee = 0,
  is_affiliate = true,
  is_active = true,
  max_generations = 1,
  direct_bonus_percentage = 20,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'commission',
    jsonb_build_object(
      'mode', 'direct_plus_sponsor',
      'direct', 20,
      'sponsor', 18,
      'generations', '[]'::jsonb,
      'extraDirects', '[]'::jsonb
    )
  ),
  updated_at = now()
where slug = 'afiliado';

-- Avanço:
-- - 38% direct commission on link-based store sales
-- - generation bonuses: 5% / 3% / 2%
update public.plans
set
  price = 997,
  activation_fee = 0,
  is_affiliate = false,
  is_active = true,
  max_generations = 3,
  direct_bonus_percentage = 38,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'commission',
    jsonb_build_object(
      'mode', 'mlm',
      'direct', 38,
      'sponsor', 0,
      'generations', jsonb_build_array(
        jsonb_build_object('generation', 1, 'percentage', 5),
        jsonb_build_object('generation', 2, 'percentage', 3),
        jsonb_build_object('generation', 3, 'percentage', 2)
      ),
      'extraDirects', '[]'::jsonb
    )
  ),
  updated_at = now()
where slug = 'avanco';

-- Excelência:
-- - 38% direct commission on link-based store sales
-- - generation bonuses: 5% / 3% / 2%
-- - extra bonuses: +2% with 4 to 7 active directs, +4% with 8+ active directs
update public.plans
set
  price = 3980,
  activation_fee = 0,
  is_affiliate = false,
  is_active = true,
  max_generations = 3,
  direct_bonus_percentage = 38,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'commission',
    jsonb_build_object(
      'mode', 'mlm',
      'direct', 38,
      'sponsor', 0,
      'generations', jsonb_build_array(
        jsonb_build_object('generation', 1, 'percentage', 5),
        jsonb_build_object('generation', 2, 'percentage', 3),
        jsonb_build_object('generation', 3, 'percentage', 2)
      ),
      'extraDirects', jsonb_build_array(
        jsonb_build_object('minDirects', 4, 'percentage', 2),
        jsonb_build_object('minDirects', 8, 'percentage', 4)
      )
    )
  ),
  updated_at = now()
where slug = 'excelencia';

-- Remove existing plan bonus rows for these plans before reinserting canonical rules.
delete from public.plan_bonuses
where plan_id in (
  select id
  from public.plans
  where slug in ('afiliado', 'avanco', 'excelencia')
);

-- Avanço generation bonuses.
insert into public.plan_bonuses (plan_id, generation, bonus_percentage, required_directs, bonus_type, created_at)
select p.id, x.generation, x.bonus_percentage, 0, 'generation', now()
from public.plans p
join (
  values
    (1, 5.00),
    (2, 3.00),
    (3, 2.00)
) as x(generation, bonus_percentage) on true
where p.slug = 'avanco';

-- Excelência generation bonuses.
insert into public.plan_bonuses (plan_id, generation, bonus_percentage, required_directs, bonus_type, created_at)
select p.id, x.generation, x.bonus_percentage, 0, 'generation', now()
from public.plans p
join (
  values
    (1, 5.00),
    (2, 3.00),
    (3, 2.00)
) as x(generation, bonus_percentage) on true
where p.slug = 'excelencia';

-- Excelência extra direct bonuses.
insert into public.plan_bonuses (plan_id, generation, bonus_percentage, required_directs, bonus_type, created_at)
select p.id, 0, x.bonus_percentage, x.required_directs, 'direct_bonus', now()
from public.plans p
join (
  values
    (2.00, 4),
    (4.00, 8)
) as x(bonus_percentage, required_directs) on true
where p.slug = 'excelencia';

commit;
