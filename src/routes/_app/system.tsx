import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/widgets/page-header";
import { BonusConfiguration } from "@/components/payments/admin/bonus-configuration";
import { FinancialDashboard } from "@/components/payments/admin/financial-dashboard";
import { GatewayManagement } from "@/components/payments/admin/gateway-management";
import { InvitesManagement } from "@/components/system/invites-management";
import { UserManagement } from "@/components/system/user-management";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/_app/system")({ component: SystemPage });

type AuditLogRow = {
  id: string;
  actor?: string | null;
  action?: string | null;
  entity?: string | null;
  created_at?: string | null;
};

function SystemPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [mlmStats, setMlmStats] = useState({ totalBonus: 0, totalWithdrawals: 0, activePlans: 0, networkSize: 0 });

  useEffect(() => {
    (async () => {
      const [{ data: auditData }, { data: bonusWallets }, { data: withdrawals }, { data: customerPlans }, { data: network }] = await Promise.all([
        supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("bonus_wallets").select("total_earned"),
        supabase.from("withdrawals").select("valor").eq("status", "approved"),
        supabase.from("customer_plans").select("id").eq("status", "active"),
        supabase.from("network_relationships").select("customer_id"),
      ]);

      setAuditLogs((auditData as AuditLogRow[]) || []);

      const totalBonus = (bonusWallets || []).reduce((sum: number, w: any) => sum + Number(w.total_earned || 0), 0);
      const totalWithdrawals = (withdrawals || []).reduce((sum: number, w: any) => sum + Number(w.valor || 0), 0);
      const activePlans = (customerPlans || []).length;
      const networkSize = (network || []).length;

      setMlmStats({ totalBonus, totalWithdrawals, activePlans, networkSize });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Admin & Auditoria"
        subtitle="Gestao de usuarios, convites, integracoes e controles financeiros."
      />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 rounded-xl border border-border bg-card/60 p-1">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="bonus">Bonus</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <InvitesManagement />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "Bônus Total MLM", value: `R$ ${mlmStats.totalBonus.toLocaleString()}`, hint: "Total acumulado" },
              { title: "Saques Aprovados", value: `R$ ${mlmStats.totalWithdrawals.toLocaleString()}`, hint: "Processados" },
              { title: "Rede Ativa", value: `${mlmStats.networkSize} membros`, hint: `${mlmStats.activePlans} planos ativos` },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className="mt-1 text-xl font-semibold">{card.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{card.hint}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card/40">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Audit log</h3>
              <Badge variant="outline" className="text-[10px]">
                {auditLogs.length} registros
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Quem</th>
                  <th className="px-4 py-2.5 text-left">Acao</th>
                  <th className="px-4 py-2.5 text-left">Entidade</th>
                  <th className="px-4 py-2.5 text-left">Quando</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-accent/30">
                      <td className="px-4 py-3 font-mono text-xs">{log.actor || "-"}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs">{log.action || "-"}</code>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{log.entity || "-"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {log.created_at ? new Date(log.created_at).toLocaleString("pt-BR") : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Nenhum registro de auditoria encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="gateways">
          <GatewayManagement />
        </TabsContent>

        <TabsContent value="bonus">
          <BonusConfiguration />
        </TabsContent>

        <TabsContent value="financeiro">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
