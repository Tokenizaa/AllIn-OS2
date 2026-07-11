import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Shield, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface CustomerProfileCardProps {
  customer: any;
  sponsor: any;
}

export function CustomerProfileCard({ customer, sponsor }: CustomerProfileCardProps) {
  return (
    <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white shadow-md">
          {getCustomerInitials(customer)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate text-white">{getCustomerLabel(customer)}</p>
          <p className="text-xs text-muted-foreground truncate">{customer.id_comprador || customer.usuario}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-xs border-t border-border/60 pt-3">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{customer.user_id || customer.id_comprador || "Sem ID"}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" /> <span>{customer.telefone || "-"}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span>{customer.cidade || "-"}/{customer.estado || "-"}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-3.5 w-3.5 shrink-0" /> <span>CPF {customer.metadata?.cpf || customer.cpf || "-"}</span>
        </p>
      </div>
      
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge variant="outline" className="bg-primary/5 ">{customer.qualification || "Bronze"}</Badge>
        <Badge variant="outline" className="bg-primary/5">{customer.plano_id || customer.plan_id || "Integral"}</Badge>
        <Badge variant="outline" className={cn("capitalize font-semibold", statusStyles[customer.status || "pending"])} >
          {customer.status || "pending"}
        </Badge>
      </div>
      
      {sponsor && (
        <div className="rounded-lg border border-border bg-background/40 p-2.5 text-xs shadow-inner">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Patrocinador</p>
          <Link to="/app/customers/$id" params={{ id: sponsor.id }} className="mt-1 font-semibold hover:text-primary transition-all flex items-center gap-1 text-white">
            {getCustomerLabel(sponsor)} <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </Link>
        </div>
      )}
    </div>
  );
}
