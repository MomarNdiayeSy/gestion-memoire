import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/stores/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, token, checkAuth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, token, checkAuth]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
        <span className="text-sm text-gray-500">Chargement...</span>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-6 flex items-center justify-between">
        
        {/* Logo + Titre */}
        <div className="flex items-center space-x-3">
          {/* Logo ISI */}
          <img
            src="/logo-isi.jpg"  // placé dans le dossier public
            alt="Logo ISI"
            className="h-10 w-10 object-contain rounded-full border border-gray-200 shadow-sm"
          />

          {/* Titre dynamique selon le rôle */}
          <h2 className="text-lg font-medium text-gray-800">
            {user?.role === 'ADMIN'
              ? 'Administration'
              : user?.role === 'ENCADREUR'
              ? 'Espace Encadreur'
              : 'Espace Étudiant'}
          </h2>
        </div>

        {/* Notifications + Menu utilisateur */}
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {`${user.nom} ${user.prenom}`}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[10px]">
                    {`${user.nom} ${user.prenom}`}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.nom} {user?.prenom}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
