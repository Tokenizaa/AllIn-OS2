import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/shared/types/roles";

interface UseDistributorRegistrationProps {
  register: any;
  sponsorSlug: string;
}

export function useDistributorRegistration({ register, sponsorSlug }: UseDistributorRegistrationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [onboardingStep, setOnboardingStep] = useState<"form" | "success">("form");
  const [submittingReg, setSubmittingReg] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !cpf || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmittingReg(true);
    try {
      // Execute simulated register with distributor role
      await register(name, email, UserRole.DISTRIBUIDOR, {
        phone,
        cpf,
        sponsor_id: sponsorSlug,
        password
      });

      toast.success("Conta de distribuidor criada! Prossiga para ativação do plano.");
      setOnboardingStep("success");
    } catch {
      toast.error("Erro ao efetuar seu cadastro.");
    } finally {
      setSubmittingReg(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    cpf,
    setCpf,
    password,
    setPassword,
    selectedPlan,
    setSelectedPlan,
    onboardingStep,
    setOnboardingStep,
    submittingReg,
    handleRegisterSubmit,
  };
}
