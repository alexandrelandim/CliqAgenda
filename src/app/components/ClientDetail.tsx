import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, Phone, FileText, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { mockClients, mockAppointments, serviceLabels } from '../data/mockData';
import { Appointment } from '../types';
import { toast } from 'sonner';

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const client = mockClients.find(c => c.id === clientId);
  const clientAppointments = mockAppointments.filter(apt => apt.clientId === clientId);
  
  const allAppointments = [...clientAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const unpaidAppointments = clientAppointments.filter(
    apt => apt.status === 'concluido' && !apt.paid
  );
  
  const totalOwed = unpaidAppointments.reduce((sum, apt) => sum + apt.value, 0);

  if (!client) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
          </button>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-gray-600 text-sm">
            Cliente não encontrado
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleOpenAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setNotes(apt.notes || '');
  };

  const handleSaveNotes = () => {
    toast.success('Observações salvas com sucesso!');
    setSelectedAppointment(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      toast.success('Foto anexada com sucesso!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
      </div>

      {/* Client Header */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <h2 className="text-xl mb-2">{client.name}</h2>
            <div className="space-y-1">
              {client.phones.map((phone, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phone}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-xs text-gray-600">Total de Atendimentos</div>
              <div className="text-2xl font-bold text-purple-600">
                {clientAppointments.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Saldo Devedor</div>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalOwed.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="text-xs">
            Todos ({allAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="text-xs">
            Não Pagos ({unpaidAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {allAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600 text-sm">
                Nenhum atendimento registrado
              </CardContent>
            </Card>
          ) : (
            allAppointments.map(apt => (
              <Card
                key={apt.id}
                className="hover:shadow-md transition-shadow"
                onClick={() => handleOpenAppointment(apt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {apt.customService || serviceLabels[apt.service]}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(apt.date + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}{' '}
                        • {apt.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600 text-sm">
                        R$ {apt.value.toFixed(2)}
                      </div>
                      <Badge
                        variant={apt.paid ? 'default' : 'destructive'}
                        className="mt-1 text-xs"
                      >
                        {apt.paid ? 'Pago' : 'Não Pago'}
                      </Badge>
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {apt.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unpaid" className="space-y-3 mt-4">
          {unpaidAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600 text-sm">
                Nenhum pagamento pendente
              </CardContent>
            </Card>
          ) : (
            unpaidAppointments.map(apt => (
              <Card
                key={apt.id}
                className="hover:shadow-md transition-shadow"
                onClick={() => handleOpenAppointment(apt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {apt.customService || serviceLabels[apt.service]}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(apt.date + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}{' '}
                        • {apt.time}
                      </div>
                    </div>
                    <div className="font-bold text-red-600 text-sm">
                      R$ {apt.value.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Detail Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-[90vw] w-full mx-4">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Detalhes do Atendimento</DialogTitle>
                <DialogDescription className="text-sm">
                  Informações detalhadas sobre o atendimento realizado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-600">Serviço</span>
                    <div className="font-medium">
                      {selectedAppointment.customService ||
                        serviceLabels[selectedAppointment.service]}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-600">Data e Horário</span>
                    <div className="font-medium">
                      {format(
                        new Date(selectedAppointment.date + 'T00:00:00'),
                        "d 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}{' '}
                      às {selectedAppointment.time}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-600">Endereço</span>
                    <div className="font-medium">{selectedAppointment.address}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-gray-600">Valor</span>
                    <div className="font-bold text-purple-600">
                      R$ {selectedAppointment.value.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Status do Pagamento</span>
                    <Badge variant={selectedAppointment.paid ? 'default' : 'destructive'} className="text-xs">
                      {selectedAppointment.paid ? 'Pago' : 'Não Pago'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Esmalte vermelho escuro, alongamento de 2cm..."
                    rows={4}
                    className="mt-1.5 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use este campo para registrar detalhes como cores, técnicas utilizadas, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="photo" className="text-sm">Foto do Serviço</Label>
                  <div className="mt-1.5">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer text-sm"
                    />
                  </div>
                  {photoFile && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                      <ImageIcon className="w-4 h-4" />
                      {photoFile.name}
                    </div>
                  )}
                  {selectedAppointment.photoUrl && !photoFile && (
                    <div className="mt-2 text-xs text-gray-600">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      Foto anexada
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {!selectedAppointment.paid && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast.success('Pagamento confirmado!');
                        setSelectedAppointment(null);
                      }}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pago
                    </Button>
                  )}
                  <Button
                    className={!selectedAppointment.paid ? '' : 'col-span-2'}
                    onClick={handleSaveNotes}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}