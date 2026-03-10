import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Settings, FileText, Shield, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { UserAvatar } from './UserAvatar';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout, updateUserPhoto } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Create object URL for preview
    const photoUrl = URL.createObjectURL(file);
    updateUserPhoto(photoUrl);
    toast.success('Foto atualizada com sucesso!');
  };

  return (
    <>
      <button
        onClick={() => setShowMenu(true)}
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        aria-label="Menu do perfil"
      >
        <UserAvatar 
          name={user?.name} 
          photoUrl={user?.photoUrl}
          size="sm" 
          className="!w-8 !h-8 !text-xs border-2 border-white"
        />
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
                <div className="relative">
                  <UserAvatar 
                    name={user?.name} 
                    photoUrl={user?.photoUrl}
                    size="xl" 
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="ring-2 ring-purple-600"
                  />
                  <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1.5 shadow-lg">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
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
                  navigate('/onboarding?edit=true');
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Serviços
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-gray-600"
                onClick={() => {
                  setShowMenu(false);
                  navigate('/privacy');
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacidade
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-gray-600"
                onClick={() => {
                  setShowMenu(false);
                  navigate('/terms');
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Termos de Uso
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