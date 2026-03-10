import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface MonthData {
  monthYear: string;
  total: number;
  count: number;
  appointments: typeof mockAppointments;
}

export default function PaymentsPending() {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [pixKey, setPixKey] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null);

  // Agrupar pagamentos pendentes por mês
  const pendingAppointments = mockAppointments.filter(
    apt => apt.status === 'concluido' && !apt.paid
  );

  const monthlyData: MonthData[] = [];
  pendingAppointments.forEach(apt => {
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
    return dateB.getTime() - dateA.getTime();
  });

  const handleMarkAsPaid = (appointmentId: string) => {
    toast.success('Pagamento confirmado!');
    if (selectedMonth) {
      const updatedAppointments = selectedMonth.appointments.filter(
        apt => apt.id !== appointmentId
      );
      if (updatedAppointments.length === 0) {
        setSelectedMonth(null);
      } else {
        setSelectedMonth({
          ...selectedMonth,
          appointments: updatedAppointments,
          total: updatedAppointments.reduce((sum, apt) => sum + apt.value, 0),
          count: updatedAppointments.length,
        });
      }
    }
  };

  const generatePaymentReminderMessage = () => {
    if (!selectedAppointment) return '';

    const dateStr = format(new Date(selectedAppointment.date + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR });
    const serviceName = selectedAppointment.customService || serviceLabels[selectedAppointment.service];

    return `Olá ${selectedAppointment.clientName}! 😊\n\nTudo bem? Espero que tenha gostado do serviço!\n\nEstou passando aqui para lembrar do pagamento pendente:\n\n• ${dateStr} - ${serviceName} - R$ ${selectedAppointment.value.toFixed(2)}\n\n💰 Valor: R$ ${selectedAppointment.value.toFixed(2)}\n\n${pixKey ? `Você pode fazer o pagamento via Pix:\n🔑 Chave Pix: ${pixKey}\n\n` : ''}Qualquer dúvida, estou à disposição! 🙏`;
  };

  const copyReminderMessage = () => {
    const message = generatePaymentReminderMessage();
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada!');
    setShowPaymentDialog(false);
  };

  const openWhatsAppReminder = () => {
    if (!selectedAppointment) return;
    const message = generatePaymentReminderMessage();
    const phoneNumber = selectedAppointment.phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowPaymentDialog(false);
  };

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
        <h2 className="text-xl">Pagamentos Pendentes</h2>
        <p className="text-gray-600 text-sm mt-1">
          Serviços concluídos aguardando pagamento
        </p>
      </div>

      {/* Lista mensal */}
      <div className="space-y-3">
        {monthlyData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Nenhum pagamento pendente</p>
            </CardContent>
          </Card>
        ) : (
          monthlyData.map((month, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMonth(month)}
              className="w-full text-left active:scale-95 transition-transform"
            >
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm capitalize">{month.monthYear}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {hideValues ? '••••' : month.count} serviço(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-red-700">
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
      <Dialog open={!!selectedMonth && !showPaymentDialog} onOpenChange={() => setSelectedMonth(null)}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)]">
          {selectedMonth && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base capitalize">{selectedMonth.monthYear}</DialogTitle>
                <DialogDescription className="sr-only">
                  Detalhes dos pagamentos pendentes do mês
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedMonth.appointments.map(apt => (
                  <Card key={apt.id} className="bg-red-50 border-red-100">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{apt.clientName}</div>
                          <div className="text-xs text-gray-600">
                            {format(new Date(apt.date), "d 'de' MMMM", { locale: ptBR })}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {apt.customService || serviceLabels[apt.service]}
                          </div>
                        </div>
                        <div className="font-bold text-red-600">
                          {hideValues ? '••••' : `R$ ${apt.value.toFixed(2)}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsPaid(apt.id);
                          }}
                        >
                          Marcar como Pago
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs flex-1 bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                            setShowPaymentDialog(true);
                          }}
                        >
                          Cobrar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Total do mês:</span>
                  <span className="text-lg font-bold text-red-700">
                    {hideValues ? '••••' : `R$ ${selectedMonth.total.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de cobrança */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-[90vw] w-full mx-4">
          <DialogHeader>
            <DialogTitle className="text-base">Lembrete de Pagamento</DialogTitle>
            <DialogDescription className="sr-only">
              Envie um lembrete de pagamento para o cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label htmlFor="pixKey" className="text-sm">Chave Pix (opcional)</Label>
              <Input
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="seu@email.com, CPF ou telefone"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm">Prévia da mensagem:</Label>
              <Textarea
                value={generatePaymentReminderMessage()}
                readOnly
                rows={10}
                className="mt-1.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={copyReminderMessage}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={openWhatsAppReminder}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
