import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertTriangle, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { useUpgradeSuggestions } from "@/hooks/plans/useUpgradeSuggestions";
import { Skeleton } from "../ui/skeleton";

export function UpgradeSuggestions() {
  const { data: suggestions, isLoading, isError } = useUpgradeSuggestions();

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Sugestões de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !suggestions || suggestions.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Sugestões de IA</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Nenhuma sugestão disponível no momento. O sistema de IA está analisando os dados para gerar recomendações.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const iconMap: Record<string, any> = {
    opportunity: TrendingUp,
    risk: AlertTriangle,
    potential: Zap,
  };

  const colorMap: Record<string, string> = {
    opportunity: "text-green-500",
    risk: "text-yellow-500",
    potential: "text-blue-500",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sugestões de IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion: any, index: number) => {
          const Icon = iconMap[suggestion.type] || TrendingUp;
          const color = colorMap[suggestion.type] || "text-green-500";
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  </div>
                  <Badge variant="outline">IA</Badge>
                </div>
                <CardDescription>{suggestion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  {suggestion.action}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
