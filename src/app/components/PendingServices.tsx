import { useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockAppointments, serviceLabels } from '../data/mockData';

export default function PendingServices() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Find appointments with past dates that are not completed
  const pendingServices = mockAppointments
    .filter(apt => apt.date < today && apt.status === 'agendado')
    .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 active:opacity-70 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
          </button>
          <h1 className="text-xl font-semibold">Serviços Pendentes</h1>
          <p className="text-sm text-gray-600 mt-1">
            Agendamentos passados não finalizados
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {pendingServices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-600">Nenhum serviço pendente</p>
              <p className="text-xs text-gray-500 mt-1">
                Todos os agendamentos foram finalizados
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Atenção!</p>
                <p className="text-orange-700 text-xs mt-1">
                  Estes serviços já passaram da data agendada mas ainda não foram marcados como concluídos.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {pendingServices.map(apt => {
                const aptDate = parseISO(apt.date);
                return (
                  <Card 
                    key={apt.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                    onClick={() => navigate(`/appointments/${apt.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{apt.clientName}</h3>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {apt.customService || serviceLabels[apt.service]}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Não concluído
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mt-3">
                        <div className="flex justify-between">
                          <span>Data:</span>
                          <span className="font-medium">
                            {format(aptDate, "d 'de' MMM", { locale: ptBR })} às {apt.time}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Valor:</span>
                          <span className="font-bold text-purple-600">
                            R$ {apt.value.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
