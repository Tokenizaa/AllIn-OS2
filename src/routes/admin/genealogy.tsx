import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Users, Loader2 } from "lucide-react";
import { NetworkService } from "@/services/network";
import { CustomerService } from "@/services/customers";

export const Route = createFileRoute("/admin/genealogy")({
  component: GenealogyPage,
});

interface TreeNode {
  id: string;
  name: string;
  qualification?: string;
  status?: string;
  children?: TreeNode[];
}

function GenealogyPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados reais do banco
  useEffect(() => {
    const loadGenealogyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar relacionamentos de rede
        const relationships = ((await NetworkService.fetchNetworkRelationships(100)) as any) || [];
        const relationshipsArr: any[] = Array.isArray(relationships) ? relationships : ((relationships as any)?.data as any[]) || [];
        
        // Buscar dados dos clientes
        const idCompradores = [...new Set(relationshipsArr.map((r: any) => r.id_comprador))];
        const customers = await Promise.all(
          idCompradores.map((id: any) => CustomerService.fetchCustomerByCompradorId(id))
        );

        // Construir árvore genealógica
        const customerMap = new Map(customers.map((c: any) => [c?.id_comprador, c]));
        
        // Encontrar nó raiz (sem sponsor ou sponsor é null)
        const rootRelationship = relationshipsArr.find((r: any) => !r.sponsor_id_comprador);
        const rootCustomer = rootRelationship ? customerMap.get(rootRelationship.id_comprador) : customers[0];
        
        if (!rootCustomer) {
          setTreeData(null);
          return;
        }

        // Função recursiva para construir árvore
        const buildTree = (idComprador: string, visited = new Set<string>()): TreeNode | null => {
          if (visited.has(idComprador)) return null; // Evitar ciclos
          visited.add(idComprador);

          const customer = customerMap.get(idComprador);
          if (!customer) return null;

          // Buscar filhos diretos (onde este customer é sponsor)
          const children = relationshipsArr
            .filter((r: any) => r.sponsor_id_comprador === idComprador)
            .map((r: any) => buildTree(r.id_comprador, new Set(visited)))
            .filter(Boolean) as TreeNode[];

          return {
            id: customer.id_comprador || customer.id,
            name: customer.nome_completo || customer.name || customer.full_name || "Cliente",
            qualification: customer.qualification || "Bronze",
            status: customer.status || "active",
            children: children.length > 0 ? children : undefined,
          };
        };

        const tree = buildTree(rootCustomer.id_comprador || rootCustomer.id);
        setTreeData(tree);
      } catch (err) {
        console.error("Error loading genealogy data:", err);
        setError("Falha ao carregar dados da genealogia");
      } finally {
        setIsLoading(false);
      }
    };

    loadGenealogyData();
  }, []);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-2 px-3 hover:bg-accent/30 rounded-lg cursor-pointer transition-colors"
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{node.name}</span>
          {node.qualification && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {node.qualification}
            </span>
          )}
          {node.status === "active" ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
              Ativo
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
              Pendente
            </span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="border-l border-border/40 ml-4">
            {node.children?.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Genealogia"
        subtitle="Visualização hierárquica da rede de distribuidores"
      />
      
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card/40 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando dados da genealogia...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-card/40 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      ) : !treeData ? (
        <div className="rounded-xl border border-border bg-card/40 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Nenhum dado de genealogia encontrado</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <div className="space-y-1">
            {renderNode(treeData)}
          </div>
        </div>
      )}
    </div>
  );
}
