import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface InviteFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function InviteFilters({ search, setSearch, statusFilter, setStatusFilter }: InviteFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar por nome do convidado..." 
          className="pl-9 bg-background/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36 bg-card/60 border-border text-xs h-9">
          <SelectValue placeholder="Filtrar Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all font-sans">Todos os Enlaces</SelectItem>
          <SelectItem value="pending">Pendente (Ativo)</SelectItem>
          <SelectItem value="accepted">Aceito / Ativado</SelectItem>
          <SelectItem value="expired">Expirado</SelectItem>
          <SelectItem value="revoked">Revogado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
