import { useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle, Copy, ExternalLink, Edit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { Appointment } from '../types';
import { toast } from 'sonner';

export default function Appointments() {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editedValue, setEditedValue] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const scheduledAppointments = mockAppointments.filter(apt => apt.status === 'agendado');
  const completedAppointments = mockAppointments.filter(apt => apt.status === 'concluido');

  const handleOpenDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditedValue(appointment.value.toString());
  };

  const handleMarkAsCompleted = () => {
    if (selectedAppointment) {
      toast.success('Agendamento marcado como concluído!');
      setSelectedAppointment(null);
    }
  };

  const handleMarkAsPaid = () => {
    if (selectedAppointment) {
      toast.success('Pagamento confirmado!');
      setSelectedAppointment(null);
    }
  };

  const generateConfirmationMessage = (apt: Appointment) => {
    const dateFormatted = format(new Date(apt.date + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR });
    const serviceName = apt.customService || serviceLabels[apt.service];

    return `Olá ${apt.clientName}! 😊\n\nSeu agendamento está confirmado:\n\n📅 Data: ${dateFormatted}\n⏰ Horário: ${apt.time}\n💇 Serviço: ${serviceName}\n📍 Endereço: ${apt.address}\n💰 Valor: R$ ${apt.value.toFixed(2)}\n\nAguardo você! Qualquer dúvida, é só chamar.`;
  };

  const copyMessage = (apt: Appointment) => {
    const message = generateConfirmationMessage(apt);
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada!');
  };

  const openWhatsApp = (apt: Appointment) => {
    const message = generateConfirmationMessage(apt);
    const phoneNumber = apt.phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const renderAppointmentCard = (apt: Appointment) => (
    <Card key={apt.id} className="hover:shadow-md transition-shadow" onClick={() => handleOpenDialog(apt)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-sm">{apt.clientName}</h3>
            <p className="text-xs text-gray-600">{apt.phone}</p>
          </div>
          <Badge 
            variant={apt.status === 'agendado' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {apt.status === 'agendado' ? 'Agendado' : 'Concluído'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs">
              {format(new Date(apt.date + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR })} • {apt.time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-xs">
              {apt.customService || serviceLabels[apt.service]}
            </span>
            <span className="font-bold text-purple-600">
              R$ {apt.value.toFixed(2)}
            </span>
          </div>
        </div>

        {apt.status === 'concluido' && (
          <div className="mt-3 pt-3 border-t">
            <Badge variant={apt.paid ? 'default' : 'destructive'} className="text-xs">
              {apt.paid ? '✓ Pago' : 'Pagamento Pendente'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
        <h2 className="text-xl">Agendamentos</h2>
      </div>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheduled" className="text-xs">
            Agendados ({scheduledAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Concluídos ({completedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-3 mt-4">
          {scheduledAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600 text-sm">
                Nenhum agendamento encontrado
              </CardContent>
            </Card>
          ) : (
            scheduledAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600 text-sm">
                Nenhum agendamento concluído
              </CardContent>
            </Card>
          ) : (
            completedAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-[90vw] w-full mx-4">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Detalhes do Agendamento</DialogTitle>
                <DialogDescription className="text-sm">Veja e edite os detalhes do agendamento.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-600">Cliente</span>
                    <div className="font-medium">{selectedAppointment.clientName}</div>
                    <div className="text-xs text-gray-600">{selectedAppointment.phone}</div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-600">Data e Horário</span>
                    <div className="font-medium">
                      {format(new Date(selectedAppointment.date + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}{' '}
                      às {selectedAppointment.time}
                    </div>
                    <div className="text-xs text-gray-600">
                      Duração: {selectedAppointment.duration} minutos
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-600">Endereço</span>
                    <div className="font-medium">{selectedAppointment.address}</div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-600">Serviço</span>
                    <div className="font-medium">
                      {selectedAppointment.customService ||
                        serviceLabels[selectedAppointment.service]}
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <span className="text-xs text-gray-600">Observações</span>
                      <div className="font-medium">{selectedAppointment.notes}</div>
                    </div>
                  )}
                </div>

                {selectedAppointment.status === 'agendado' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyMessage(selectedAppointment)}
                      >
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openWhatsApp(selectedAppointment)}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-2" />
                        WhatsApp
                      </Button>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleMarkAsCompleted}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Concluído
                    </Button>
                  </>
                )}

                {selectedAppointment.status === 'concluido' && (
                  <>
                    <div>
                      <Label htmlFor="editValue" className="text-sm">Valor do Serviço</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          id="editValue"
                          type="number"
                          step="0.01"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <Button variant="outline" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {!selectedAppointment.paid && (
                      <Button
                        className="w-full"
                        onClick={handleMarkAsPaid}
                      >
                        Marcar como Pago
                      </Button>
                    )}

                    {selectedAppointment.paid && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="font-medium text-green-800 text-sm">Pagamento Confirmado</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}