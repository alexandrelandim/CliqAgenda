import { Link, useNavigate } from 'react-router';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockAppointments } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const navigate = useNavigate();
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

  return (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600 text-sm">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/today')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-purple-700">
                <Calendar className="w-4 h-4" />
                Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{todayAppointmentsCount}</div>
              <p className="text-xs text-purple-600 mt-0.5">agendamentos</p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/next-appointments')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                Próximos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{upcomingAppointments.length}</div>
              <p className="text-xs text-blue-600 mt-0.5">agendados</p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/payments')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-green-700">
                <DollarSign className="w-4 h-4" />
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                R$ {totalOwed.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 mt-0.5">
                {pendingPayments.length} pendentes
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/pending-services')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-orange-700">
                <Users className="w-4 h-4" />
                Não Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">
                {pendingServices.length}
              </div>
              <p className="text-xs text-orange-600 mt-0.5">serviços</p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pagamentos Pendentes</CardTitle>
              <Link
                to="/payments"
                className="text-xs text-purple-600 font-medium"
              >
                Ver todos →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingPayments.slice(0, 3).map(apt => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div>
                  <div className="font-medium text-sm">{apt.clientName}</div>
                  <div className="text-xs text-gray-600">
                    {format(new Date(apt.date), "d 'de' MMMM", { locale: ptBR })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">
                    R$ {apt.value.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}