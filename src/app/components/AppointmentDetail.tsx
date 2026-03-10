import { useNavigate, useParams } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, User, Phone, FileText, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { toast } from 'sonner';

export default function AppointmentDetail() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  // Find the appointment (in production, this would fetch from API/database)
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);

  if (!appointment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/appointments')}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
          </button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Agendamento não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generateConfirmationMessage = () => {
    const dateFormatted = format(new Date(appointment.date + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR });
    const serviceName = appointment.customService || serviceLabels[appointment.service];

    return `Olá ${appointment.clientName}! 😊\n\nSeu agendamento está confirmado:\n\n📅 Data: ${dateFormatted}\n⏰ Horário: ${appointment.time}\n💇 Serviço: ${serviceName}\n📍 Endereço: ${appointment.address}\n💰 Valor: R$ ${appointment.value.toFixed(2)}\n\nAguardo você! Qualquer dúvida, é só chamar.`;
  };

  const copyMessage = () => {
    const message = generateConfirmationMessage();
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada!');
  };

  const openWhatsApp = () => {
    const message = generateConfirmationMessage();
    const phoneNumber = appointment.phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleMarkAsCompleted = () => {
    toast.success('Agendamento marcado como concluído!');
    navigate('/appointments');
  };

  const handleMarkAsPaid = () => {
    toast.success('Pagamento confirmado!');
    navigate('/appointments');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/appointments')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl font-semibold">Detalhes do Agendamento</h1>
        {appointment.status === 'concluido' && (
          <Badge
            variant="secondary"
            className="text-xs mt-2"
          >
            Concluído
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Client Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{appointment.clientName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone */}
        <Card>
          <CardContent className="p-4">
            <a
              href={`tel:${appointment.phone}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{appointment.phone}</p>
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {format(new Date(appointment.date + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{appointment.time}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{appointment.duration} min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💇</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {appointment.customService || serviceLabels[appointment.service]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardContent className="p-4">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(appointment.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{appointment.address}</p>
                <p className="text-xs text-gray-500 mt-0.5">Toque para abrir no mapa</p>
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Value */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">
                  R$ {appointment.value.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {appointment.notes && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Observações</p>
                  <p className="text-sm">{appointment.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Status for Completed */}
        {appointment.status === 'concluido' && (
          <Card className={appointment.paid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {appointment.paid ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Pagamento Confirmado</p>
                      <p className="text-xs text-green-700 mt-0.5">Este agendamento já foi pago</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Pagamento Pendente</p>
                      <p className="text-xs text-red-700 mt-0.5">Aguardando confirmação de pagamento</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {appointment.status === 'agendado' && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={copyMessage}
                className="h-12"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Mensagem
              </Button>
              <Button
                onClick={openWhatsApp}
                className="h-12 bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            <Button
              className="w-full h-12"
              onClick={handleMarkAsCompleted}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar como Concluído
            </Button>
          </div>
        )}

        {appointment.status === 'concluido' && !appointment.paid && (
          <div className="pt-2">
            <Button
              className="w-full h-12"
              onClick={handleMarkAsPaid}
            >
              Confirmar Pagamento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}