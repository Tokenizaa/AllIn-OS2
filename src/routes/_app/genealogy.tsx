import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { useState } from "react";
import { ChevronRight, ChevronDown, Users } from "lucide-react";

export const Route = createFileRoute("/_app/genealogy")({ component: GenealogyPage });

interface TreeNode {
  id: string;
  name: string;
  qualification?: string;
  status?: string;
  children?: TreeNode[];
}

function GenealogyPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Dados de exemplo - em produção, isso viria do Supabase
  const treeData: TreeNode = {
    id: "root",
    name: "Você",
    qualification: "Black",
    status: "active",
    children: [
      {
        id: "1",
        name: "João Silva",
        qualification: "Diamante",
        status: "active",
        children: [
          { id: "1-1", name: "Maria Santos", qualification: "Ouro", status: "active" },
          { id: "1-2", name: "Pedro Costa", qualification: "Prata", status: "active" },
        ],
      },
      {
        id: "2",
        name: "Ana Oliveira",
        qualification: "Ouro",
        status: "active",
        children: [
          { id: "2-1", name: "Carlos Lima", qualification: "Prata", status: "active" },
          { id: "2-2", name: "Julia Ferreira", qualification: "Bronze", status: "pending" },
        ],
      },
      {
        id: "3",
        name: "Roberto Alves",
        qualification: "Prata",
        status: "active",
        children: [],
      },
    ],
  };

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
      <div className="rounded-xl border border-border bg-card/40 p-6">
        <div className="space-y-1">
          {renderNode(treeData)}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card/40 p-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Nota:</span> Esta é uma visualização básica da genealogia. 
          Em produção, os dados serão carregados do Supabase com a estrutura completa da rede.
        </p>
      </div>
    </div>
  );
}
