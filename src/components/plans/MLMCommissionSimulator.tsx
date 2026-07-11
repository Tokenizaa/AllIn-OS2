import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calculator, TrendingUp, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MlmEngineService } from "@/services/mlm-engine";

export function MLMCommissionSimulator() {
  const [sellerId, setSellerId] = useState("");
  const [orderAmount, setOrderAmount] = useState(1000);

  const { data: commission, refetch: simulationRefetch, isFetching } = useQuery({
    queryKey: ["mlm-simulation", sellerId, orderAmount],
    queryFn: async () => MlmEngineService.commissions.calculateCommission(sellerId, orderAmount),
    enabled: false,
  });

  const handleSimulate = () => {
    if (sellerId) {
      void simulationRefetch();
    }
  };

  const mlmTotal = commission?.generations?.reduce((sum, g) => sum + g.amount, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calculator className="h-5 w-5" />
          <CardTitle>Simulador de Comissões MLM</CardTitle>
        </div>
        <CardDescription>
          Simule a distribuição de comissões para uma venda hipotética
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seller-id">ID do Vendedor</Label>
            <Input
              id="seller-id"
              placeholder="UUID do vendedor"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-amount">Valor do Pedido (R$)</Label>
            <Input
              id="order-amount"
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleSimulate} className="w-full" disabled={isFetching}>
          {isFetching ? "Calculando..." : "Simular Comissão"}
        </Button>

        {commission && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plano Atual</span>
              <span className="font-semibold">N/A</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500 mb-2" />
                <span className="text-2xl font-bold">
                  R$ {commission.direct?.toLocaleString("pt-BR") || "0"}
                </span>
                <span className="text-xs text-muted-foreground">Comissão Direta</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">
                  R$ {mlmTotal?.toLocaleString("pt-BR") || "0"}
                </span>
                <span className="text-xs text-muted-foreground">MLM</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Users className="h-5 w-5 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">
                  R$ {commission.leadership?.toLocaleString("pt-BR") || "0"}
                </span>
                <span className="text-xs text-muted-foreground">Bônus Extras</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <span className="font-semibold">Total da Comissão</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                R$ {commission.total?.toLocaleString("pt-BR") || "0"}
              </span>
            </div>

            {commission.generations && commission.generations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Distribuição por Geração</h4>
                <div className="space-y-2">
                  {commission.generations.map((comm: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="text-sm">Geração {comm.generation}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {comm.percentage}%
                        </span>
                        <span className="font-semibold">
                          R$ {comm.amount.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}