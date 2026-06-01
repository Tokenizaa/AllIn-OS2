import React, { useCallback } from 'react';

import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth';
import { getPrimaryPathForRole } from '@/modules/auth/navigation';
import { ROLE_DISPLAY_NAMES, isAdministrativeRole } from '@/shared/types/roles';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    await logout();
    navigate({ to: '/' });
  }, [logout, navigate]);

  if (!user) return null;

  const isAdmin = isAdministrativeRole(user.role as any);
  const roleLabel = ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES] || user.role;

  return (
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex flex-col text-right">
        <span className="text-sm font-medium text-allin-dark dark:text-allin-white">
          {user.name || user.email}
        </span>
        <span className="text-xs text-allin-orange">{roleLabel}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: getPrimaryPathForRole(user.role) })}
            className="hidden md:flex text-allin-dark dark:text-allin-white hover:text-allin-orange"
          >
            <Settings className="w-4 h-4 mr-2" />
            Office
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/office/profile' })}
          className="hidden md:flex text-allin-dark dark:text-allin-white hover:text-allin-orange"
        >
          <User className="w-4 h-4 mr-2" />
          Perfil
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-allin-dark dark:text-allin-white hover:text-allin-orange"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default UserMenu;
