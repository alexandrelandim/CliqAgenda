import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DollarSign, Calendar, TrendingUp, ArrowLeft, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { mockAppointments } from '../data/mockData';

export default function Payments() {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);

  // Pagamentos Pendentes: concluídos mas não pagos
  const pendingPayments = mockAppointments.filter(
    apt => apt.status === 'concluido' && !apt.paid
  );
  const totalPending = pendingPayments.reduce((sum, apt) => sum + apt.value, 0);

  // Pagamentos Futuros: agendamentos ainda não realizados
  const futurePayments = mockAppointments.filter(
    apt => apt.status === 'agendado'
  );
  const totalFuture = futurePayments.reduce((sum, apt) => sum + apt.value, 0);

  // Pagamentos Recebidos: já pagos
  const receivedPayments = mockAppointments.filter(
    apt => apt.paid === true
  );
  const totalReceived = receivedPayments.reduce((sum, apt) => sum + apt.value, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
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

      <div>
        <h2 className="text-xl">Pagamentos</h2>
        <p className="text-gray-600 text-sm mt-1">
          Gerencie seus recebimentos
        </p>
      </div>

      {/* Botão Gráfico */}
      <Button
        onClick={() => navigate('/payments/chart')}
        className="w-full bg-purple-600 hover:bg-purple-700"
        size="lg"
      >
        <BarChart3 className="w-5 h-5 mr-2" />
        Ver Gráfico de Pagamentos
      </Button>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Pagamentos Pendentes */}
        <button
          onClick={() => navigate('/payments/pending')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <DollarSign className="w-5 h-5" />
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">
                {hideValues ? '••••' : `R$ ${totalPending.toFixed(2)}`}
              </div>
              <p className="text-xs text-red-600 mt-0.5">
                {hideValues ? '••••' : pendingPayments.length} serviço(s) concluído(s)
              </p>
            </CardContent>
          </Card>
        </button>

        {/* Pagamentos Futuros */}
        <button
          onClick={() => navigate('/payments/future')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                <Calendar className="w-5 h-5" />
                Pagamentos Futuros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {hideValues ? '••••' : `R$ ${totalFuture.toFixed(2)}`}
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                {hideValues ? '••••' : futurePayments.length} agendamento(s)
              </p>
            </CardContent>
          </Card>
        </button>

        {/* Pagamentos Recebidos */}
        <button
          onClick={() => navigate('/payments/received')}
          className="text-left active:scale-95 transition-transform"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                Pagamentos Recebidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">
                {hideValues ? '••••' : `R$ ${totalReceived.toFixed(2)}`}
              </div>
              <p className="text-xs text-green-600 mt-0.5">
                {hideValues ? '••••' : receivedPayments.length} pagamento(s)
              </p>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}