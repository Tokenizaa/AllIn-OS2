import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Package, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/modules/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteGuard } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/cliente")({
  component: ClientePageSecure,
});

function ClientePageSecure() {
  return (
    <RouteGuard allowedRoles={[UserRole.CLIENTE_FINAL, UserRole.DISTRIBUIDOR, UserRole.AFILIADO, UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE, UserRole.LOGISTICA, UserRole.MARKETING, UserRole.ANALYTICS, UserRole.AUDITOR, UserRole.OPERADOR]}>
      <ClientePage />
    </RouteGuard>
  );
}

function ClientePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("pedidos");

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel do Cliente</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Button
              variant={activeTab === "pedidos" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("pedidos")}
            >
              <Package className="h-4 w-4 mr-2" />
              Meus Pedidos
            </Button>
            <Button
              variant={activeTab === "carrinho" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("carrinho")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrinho
            </Button>
            <Button
              variant={activeTab === "favoritos" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("favoritos")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
            <Button
              variant={activeTab === "configuracoes" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("configuracoes")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </aside>

          {/* Main Content */}
          <main>
            {activeTab === "pedidos" && (
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "carrinho" && (
              <Card>
                <CardHeader>
                  <CardTitle>Carrinho de Compras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Seu carrinho está vazio.</p>
                  <Button className="mt-4" onClick={() => window.location.href = "/loja"}>
                    Ir para a Loja
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "favoritos" && (
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhum produto favorito.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "configuracoes" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome</label>
                      <p className="text-muted-foreground">{user?.name || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{user?.email || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
