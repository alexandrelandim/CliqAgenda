import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={() => setShowMenu(true)}
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        aria-label="Menu do perfil"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="max-w-[90vw] w-full mx-4">
          <DialogHeader>
            <DialogTitle className="text-base text-center">Meu Perfil</DialogTitle>
            <DialogDescription className="sr-only">
              Visualize e gerencie suas informações de perfil
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span>📱 {user?.phone}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setShowMenu(false);
                  navigate('/onboarding');
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Serviços
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}