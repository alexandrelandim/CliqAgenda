import { useNavigate } from 'react-router';
import { Calendar, DollarSign, Users, Clock, Eye, EyeOff, Bell, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockAppointments, mockNotifications } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Dashboard() {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Mock data - hoje tem 2 agendamentos (count for display)
  const todayAppointmentsCount = 2;
  const upcomingAppointments = mockAppointments.filter(
    apt => apt.date > today && apt.status === 'agendado'
  );
  const pendingPayments = mockAppointments.filter(
    apt => apt.status === 'concluido' && !apt.paid
  );
  const totalOwed = pendingPayments.reduce((sum, apt) => sum + apt.value, 0);
  
  // Serviços não concluídos (agendamentos passados)
  const pendingServices = mockAppointments.filter(
    apt => apt.date < today && apt.status === 'agendado'
  );

  // Contar notificações não lidas
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const formatValue = (value: string | number) => {
    return hideValues ? '••••' : value;
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-gray-600 text-sm">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
        <button
          onClick={() => setHideValues(!hideValues)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
        >
          {hideValues ? (
            <EyeOff className="w-5 h-5 text-gray-600" />
          ) : (
            <Eye className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <button
          onClick={() => navigate('/today')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs flex items-center gap-2 text-purple-700">
                <Calendar className="w-4 h-4" />
                Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2.5">
              <div className="text-2xl font-bold text-purple-700">{formatValue(todayAppointmentsCount)}</div>
              <p className="text-xs text-purple-600 mt-0">agendamentos</p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/next-appointments')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                Próximos
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2.5">
              <div className="text-2xl font-bold text-blue-700">{formatValue(upcomingAppointments.length)}</div>
              <p className="text-xs text-blue-600 mt-0">agendados</p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/payments')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs flex items-center gap-2 text-green-700">
                <DollarSign className="w-4 h-4" />
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2.5">
              <div className="text-xl font-bold text-green-700 whitespace-nowrap">
                {hideValues ? '••••' : `R$ ${Math.floor(totalOwed).toLocaleString('pt-BR')}`}
              </div>
              <p className="text-xs text-green-600 mt-0">
                {formatValue(pendingPayments.length)} pendentes
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/pending-services')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs flex items-center gap-2 text-orange-700">
                <Users className="w-4 h-4" />
                Não Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2.5">
              <div className="text-2xl font-bold text-orange-700">
                {formatValue(pendingServices.length)}
              </div>
              <p className="text-xs text-orange-600 mt-0">serviços</p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Avisos/Notificações */}
      <button
        onClick={() => navigate('/notifications')}
        className="text-left active:scale-95 transition-transform mb-2.5"
      >
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-1.5 pt-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Bell className="w-5 h-5" />
              Avisos e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-700">
                  {unreadCount}
                </div>
                <p className="text-xs text-orange-600 mt-0">
                  {unreadCount === 1 ? 'nova mensagem' : 'novas mensagens'}
                </p>
              </div>
              <span className="text-xs text-orange-600 font-medium">
                Ver todas →
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      {/* Banner Promocional Plano Pró */}
      <button
        onClick={() => navigate('/pricing')}
        className="text-left active:scale-95 transition-transform flex-1 min-h-0"
      >
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-800 hover:shadow-lg transition-shadow overflow-hidden h-full">
          <div className="relative h-full min-h-[120px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1586898633445-fc34716255b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzczMTU4NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Upgrade Pró"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-bold text-base">Upgrade para o Plano Pró!</span>
              </div>
              <p className="text-white text-xs opacity-90">
                Agendamentos ilimitados + Gráficos e Relatórios
              </p>
              <p className="text-yellow-300 text-xs font-semibold mt-0.5">
                🔥 Apenas R$ 19,90/mês para os 100 primeiros!
              </p>
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
}