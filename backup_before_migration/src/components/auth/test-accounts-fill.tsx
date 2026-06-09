import { Crown, Eye, EyeOff, Headphones, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTestLoginAccounts, type TestLoginAccount } from "@/modules/auth/test-login";
import { UserRole } from "@/shared/types/roles";

interface TestAccountsFillProps {
  onFillFields: (email: string, password: string) => void;
  disabled?: boolean;
}

export function TestAccountsFill({ onFillFields, disabled }: TestAccountsFillProps) {
  const handleFillAccount = (account: TestLoginAccount) => {
    onFillFields(account.email, account.password);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 text-center mb-3">Contas de teste (apenas preencher campos):</p>
      <div className="grid gap-2">
        {getTestLoginAccounts().map((account) => {
          const icon =
            account.role === UserRole.ADMIN_MASTER || account.role === UserRole.GESTAO_ADMIN ? <Crown className="h-4 w-4 text-amber-400" /> :
            account.role === UserRole.FINANCEIRO ? <Wallet className="h-4 w-4 text-sky-400" /> :
            account.role === UserRole.SUPORTE ? <Headphones className="h-4 w-4 text-cyan-400" /> :
            <Users className="h-4 w-4 text-fuchsia-400" />;

          return (
            <Button
              key={account.email}
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => handleFillAccount(account)}
              className="h-auto min-h-12 justify-start gap-3 rounded-xl border-slate-700/50 bg-slate-800/30 px-4 py-3 text-left text-white hover:bg-slate-700/50 hover:text-white transition-all"
            >
              {icon}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{account.label}</span>
                <span className="truncate text-[11px] text-slate-400">{account.email}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
