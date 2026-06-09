import { useState } from "react";

export function useInviteFilters(adminInvites: any[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvites = adminInvites.filter(inv => {
    const matchesSearch = 
      inv.full_name.toLowerCase().includes(search.toLowerCase()) || 
      inv.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredInvites,
  };
}
