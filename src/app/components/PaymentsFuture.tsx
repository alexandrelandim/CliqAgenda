import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthData {
  monthYear: string;
  total: number;
  count: number;
  appointments: typeof mockAppointments;
}

export default function PaymentsFuture() {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);

  // Agrupar agendamentos futuros por mês
  const futureAppointments = mockAppointments.filter(
    apt => apt.status === 'agendado'
  );

  const monthlyData: MonthData[] = [];
  futureAppointments.forEach(apt => {
    const monthYear = format(new Date(apt.date), 'MMMM yyyy', { locale: ptBR });
    const existing = monthlyData.find(m => m.monthYear === monthYear);
    
    if (existing) {
      existing.total += apt.value;
      existing.count += 1;
      existing.appointments.push(apt);
    } else {
      monthlyData.push({
        monthYear,
        total: apt.value,
        count: 1,
        appointments: [apt],
      });
    }
  });

  // Ordenar por data (mais recente primeiro)
  monthlyData.sort((a, b) => {
    const dateA = new Date(a.appointments[0].date);
    const dateB = new Date(b.appointments[0].date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/payments')}
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
        <h2 className="text-xl">Pagamentos Futuros</h2>
        <p className="text-gray-600 text-sm mt-1">
          Agendamentos ainda não realizados
        </p>
      </div>

      {/* Lista mensal */}
      <div className="space-y-3">
        {monthlyData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Nenhum agendamento futuro</p>
            </CardContent>
          </Card>
        ) : (
          monthlyData.map((month, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMonth(month)}
              className="w-full text-left active:scale-95 transition-transform"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm capitalize">{month.monthYear}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {hideValues ? '••••' : month.count} agendamento(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-blue-700">
                          {hideValues ? '••••' : `R$ ${month.total.toFixed(2)}`}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))
        )}
      </div>

      {/* Dialog de detalhes do mês */}
      <Dialog open={!!selectedMonth} onOpenChange={() => setSelectedMonth(null)}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)]">
          {selectedMonth && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base capitalize">{selectedMonth.monthYear}</DialogTitle>
                <DialogDescription className="sr-only">
                  Detalhes dos agendamentos futuros do mês
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedMonth.appointments.map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => navigate(`/appointments/${apt.id}`)}
                    className="w-full text-left"
                  >
                    <Card className="bg-blue-50 border-blue-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{apt.clientName}</div>
                            <div className="text-xs text-gray-600">
                              {format(new Date(apt.date), "d 'de' MMMM", { locale: ptBR })} • {apt.time}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {apt.customService || serviceLabels[apt.service]}
                            </div>
                          </div>
                          <div className="font-bold text-blue-600">
                            {hideValues ? '••••' : `R$ ${apt.value.toFixed(2)}`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Total do mês:</span>
                  <span className="text-lg font-bold text-blue-700">
                    {hideValues ? '••••' : `R$ ${selectedMonth.total.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
