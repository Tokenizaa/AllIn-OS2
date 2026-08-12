-- Migration: Reativar qualificação automática
-- Função que recalcula qualificação de todos os distribuidores

CREATE OR REPLACE FUNCTION mlm.recalcular_qualificacao()
RETURNS TABLE (
  distribuidor_id UUID,
  nivel_anterior TEXT,
  nivel_novo TEXT,
  pontos_acumulados INTEGER,
  mudou BOOLEAN
) AS $$
DECLARE
  reg RECORD;
  nivel_atual TEXT;
  novo_nivel TEXT;
  pontos INTEGER;
BEGIN
  FOR reg IN
    SELECT d.id AS dist_id, COALESCE(ps.saldo_acumulado, 0) AS pts
    FROM mlm.distribuidores d
    LEFT JOIN mlm.pontos_saldo ps ON ps.distribuidor_id = d.id
    WHERE d.ativo = true
  LOOP
    pontos := reg.pts;

    -- Get current level
    SELECT qh.nivel_novo INTO nivel_atual
    FROM mlm.qualificacoes_historico qh
    WHERE qh.distribuidor_id = reg.dist_id
    ORDER BY qh.data_mudanca DESC
    LIMIT 1;

    IF nivel_atual IS NULL THEN
      nivel_atual := 'inativo';
    END IF;

    -- Determine new level based on points
    SELECT q.codigo INTO novo_nivel
    FROM mlm.qualificacoes q
    WHERE q.pontos_minimos <= pontos
    ORDER BY q.pontos_minimos DESC
    LIMIT 1;

    IF novo_nivel IS NULL THEN
      novo_nivel := 'inativo';
    END IF;

    -- If level changed, insert history
    IF novo_nivel != nivel_atual THEN
      INSERT INTO mlm.qualificacoes_historico (
        distribuidor_id,
        nivel_anterior,
        nivel_novo,
        data_mudanca,
        pontos_acumulados
      ) VALUES (
        reg.dist_id,
        nivel_atual,
        novo_nivel,
        NOW(),
        pontos
      );

      -- Update distributor level
      UPDATE mlm.distribuidores
      SET nivel = novo_nivel
      WHERE id = reg.dist_id;

      distribuidor_id := reg.dist_id;
      nivel_anterior := nivel_atual;
      nivel_novo := novo_nivel;
      pontos_acumulados := pontos;
      mudou := true;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mlm.recalcular_qualificacao IS 'Recalcula qualificação de todos os distribuidores ativos baseado nos pontos acumulados';
