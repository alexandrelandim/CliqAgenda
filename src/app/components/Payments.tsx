import { useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, ChevronRight, Copy, ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { Payment, Appointment } from '../types';
import { toast } from 'sonner';

export default function Payments() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [pixKey, setPixKey] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Group unpaid appointments by client
  const pendingPayments: Payment[] = [];
  const unpaidAppointments = mockAppointments.filter(
    apt => apt.status === 'concluido' && !apt.paid
  );

  unpaidAppointments.forEach(apt => {
    const existing = pendingPayments.find(p => p.clientId === apt.clientId);
    if (existing) {
      existing.appointments.push(apt);
      existing.totalOwed += apt.value;
    } else {
      pendingPayments.push({
        clientId: apt.clientId,
        clientName: apt.clientName,
        phone: apt.phone,
        totalOwed: apt.value,
        appointments: [apt],
      });
    }
  });

  // Sort by total owed (highest first)
  pendingPayments.sort((a, b) => b.totalOwed - a.totalOwed);

  const handleOpenDetail = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleMarkAsPaid = (appointmentId: string) => {
    toast.success('Pagamento confirmado!');
    // In a real app, update the appointment's paid status
    if (selectedPayment) {
      const updatedAppointments = selectedPayment.appointments.filter(
        apt => apt.id !== appointmentId
      );
      if (updatedAppointments.length === 0) {
        setSelectedPayment(null);
      } else {
        setSelectedPayment({
          ...selectedPayment,
          appointments: updatedAppointments,
          totalOwed: updatedAppointments.reduce((sum, apt) => sum + apt.value, 0),
        });
      }
    }
  };

  const generatePaymentReminderMessage = () => {
    if (!selectedPayment) return '';

    const appointmentsList = selectedPayment.appointments
      .map(apt => {
        const dateStr = format(new Date(apt.date + 'T00:00:00'), "d 'de' MMM", { locale: ptBR });
        const serviceName = apt.customService || serviceLabels[apt.service];
        return `• ${dateStr} - ${serviceName} - R$ ${apt.value.toFixed(2)}`;
      })
      .join('\n');

    const totalDays = Math.floor(
      (new Date().getTime() - new Date(selectedPayment.appointments[0].date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return `Olá ${selectedPayment.clientName}! 😊\n\nTudo bem? Espero que esteja gostando dos nossos serviços!\n\nEstou passando aqui para lembrar que temos alguns pagamentos em aberto:\n\n${appointmentsList}\n\n💰 Total: R$ ${selectedPayment.totalOwed.toFixed(2)}\n\n${pixKey ? `Você pode fazer o pagamento via Pix:\n🔑 Chave Pix: ${pixKey}\n\n` : ''}Qualquer dúvida, estou à disposição! 🙏`;
  };

  const copyReminderMessage = () => {
    const message = generatePaymentReminderMessage();
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada!');
    setShowPaymentDialog(false);
  };

  const openWhatsAppReminder = () => {
    if (!selectedPayment) return;
    const message = generatePaymentReminderMessage();
    const phoneNumber = selectedPayment.phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowPaymentDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl">Pagamentos Pendentes</h2>
        <p className="text-gray-600 text-sm mt-1">
          Total a receber: R${' '}
          {pendingPayments.reduce((sum, p) => sum + p.totalOwed, 0).toFixed(2)}
        </p>
      </div>

      <div className="space-y-3">
        {pendingPayments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium mb-1">Tudo em dia! 🎉</h3>
              <p className="text-gray-600 text-sm">Não há pagamentos pendentes</p>
            </CardContent>
          </Card>
        ) : (
          pendingPayments.map(payment => {
            const oldestDate = payment.appointments.reduce((oldest, apt) => {
              return apt.date < oldest ? apt.date : oldest;
            }, payment.appointments[0].date);

            const daysSince = Math.floor(
              (new Date().getTime() - new Date(oldestDate).getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card
                key={payment.clientId}
                className="hover:shadow-md transition-shadow"
                onClick={() => handleOpenDetail(payment)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{payment.clientName}</h3>
                      <p className="text-xs text-gray-600">
                        {payment.appointments.length} serviço(s) • Há {daysSince} dias
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-red-600">
                          R$ {payment.totalOwed.toFixed(2)}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment && !showPaymentDialog} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)]">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Detalhes do Pagamento</DialogTitle>
                <DialogDescription className="sr-only">
                  Visualize os serviços pendentes de pagamento
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">{selectedPayment.clientName}</div>
                  <div className="text-sm text-gray-600">{selectedPayment.phone}</div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Serviços pendentes:</Label>
                  <div className="mt-2 space-y-2">
                    {selectedPayment.appointments.map(apt => (
                      <div
                        key={apt.id}
                        className="flex items-start justify-between p-3 bg-red-50 rounded-lg border border-red-100 gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">
                            {apt.customService || serviceLabels[apt.service]}
                          </div>
                          <div className="text-xs text-gray-600">
                            {format(new Date(apt.date + 'T00:00:00'), "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="font-bold text-red-600 text-sm">
                            R$ {apt.value.toFixed(2)}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsPaid(apt.id);
                            }}
                          >
                            Pago
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Total a receber:</span>
                    <span className="text-lg font-bold text-purple-600">
                      R$ {selectedPayment.totalOwed.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setShowPaymentDialog(true)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Enviar Lembrete de Pagamento
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Reminder Dialog */}
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