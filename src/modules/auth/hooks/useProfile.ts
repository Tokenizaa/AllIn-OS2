import { useAuth } from "./useAuth";
import { UserRole } from "@/shared/types/roles";

/**
 * Hook to access profile-related utilities
 * Provides methods to access user and distributor profile data
 */
export const useProfile = () => {
  const { user, distributorProfile, updateProfile, updateDistributorProfile } = useAuth();

  const isDistributor = (): boolean => {
    return user?.role === UserRole.DISTRIBUIDOR;
  };

  const hasDistributorProfile = (): boolean => {
    return !!distributorProfile;
  };

  const getProfileCompletion = (): number => {
    if (!user) return 0;
    
    let completed = 0;
    const total = 5; // name, email, phone, cpf, avatar

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;
    if (user.cpf) completed++;
    if (user.avatar) completed++;

    return Math.round((completed / total) * 100);
  };

  const getDistributorStatus = (): string => {
    if (!distributorProfile) return "none";
    return distributorProfile.status;
  };

  const getWalletBalance = (): number => {
    if (!distributorProfile) return 0;
    return distributorProfile.wallet_balance;
  };

  const getBonusBalance = (): number => {
    if (!distributorProfile) return 0;
    return distributorProfile.bonus_balance;
  };

  const getQualification = (): string => {
    if (!distributorProfile) return "N/A";
    return distributorProfile.qualification;
  };

  return {
    user,
    distributorProfile,
    isDistributor,
    hasDistributorProfile,
    getProfileCompletion,
    getDistributorStatus,
    getWalletBalance,
    getBonusBalance,
    getQualification,
    updateProfile,
    updateDistributorProfile
  };
};
