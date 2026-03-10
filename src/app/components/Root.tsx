import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Calendar, Users, DollarSign, Home, Plus, Edit } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../context/AuthContext';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const firstName = user?.name.split(' ')[0] || 'Usuário';

  // Check if we're on an appointment detail page
  const isAppointmentDetailPage = /^\/appointments\/[^\/]+$/.test(location.pathname);
  
  // Check if we're on edit page
  const isEditPage = location.pathname.includes('/edit');
  
  // Hide FAB on new-appointment page and edit page
  const shouldShowFAB = !location.pathname.startsWith('/new-appointment') && !isEditPage;
  
  // Get appointment ID from URL
  const appointmentId = isAppointmentDetailPage ? location.pathname.split('/')[2] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex-1"></div>
          <h1 className="text-white font-semibold text-lg">
            Olá, {firstName}
          </h1>
          <div className="flex-1 flex justify-end">
            <ProfileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Floating Action Button - iOS Style */}
      {shouldShowFAB && !isAppointmentDetailPage && (
        <button
          onClick={() => navigate('/new-appointment')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center z-20 active:scale-95 transition-transform"
          aria-label="Novo agendamento"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Edit Button for Appointment Detail Page */}
      {isAppointmentDetailPage && (
        <button
          onClick={() => navigate(`/appointments/${appointmentId}/edit`)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center z-20 active:scale-95 transition-transform"
          aria-label="Editar agendamento"
        >
          <Edit className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-4 gap-1">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Início</span>
          </Link>
          
          <Link
            to="/appointments"
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive('/appointments')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Agenda</span>
          </Link>
          
          <Link
            to="/payments"
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive('/payments')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600'
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Valores</span>
          </Link>
          
          <Link
            to="/clients"
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive('/clients')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Clientes</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}