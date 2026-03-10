import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockAppointments, serviceIcons, serviceLabels } from '../data/mockData';
import { ServiceType } from '../types';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EditAppointment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  
  // Find the appointment
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeHour, setTimeHour] = useState('09');
  const [timeMinute, setTimeMinute] = useState('00');
  const [durationHours, setDurationHours] = useState('1');
  const [durationMinutes, setDurationMinutes] = useState('00');
  const [address, setAddress] = useState('');
  const [service, setService] = useState<ServiceType | ''>('');
  const [customService, setCustomService] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'agendado' | 'concluido'>('agendado');
  const [paid, setPaid] = useState(false);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  
  // Generate minutes in 15-minute intervals
  const minutes = ['00', '15', '30', '45'];
  
  // Generate duration hours (0-12)
  const durationHoursOptions = Array.from({ length: 13 }, (_, i) => i.toString());

  // Load appointment data
  useEffect(() => {
    if (appointment) {
      setClientName(appointment.clientName);
      setPhone(appointment.phone);
      setSelectedDate(parseISO(appointment.date));
      
      // Parse time
      const [hour, minute] = appointment.time.split(':');
      setTimeHour(hour.padStart(2, '0'));
      setTimeMinute(minute.padStart(2, '0'));
      
      // Parse duration (convert minutes to hours and minutes)
      const totalMinutes = appointment.duration;
      const durationH = Math.floor(totalMinutes / 60);
      const durationM = totalMinutes % 60;
      setDurationHours(durationH.toString());
      setDurationMinutes(durationM.toString().padStart(2, '0'));
      
      setAddress(appointment.address);
      setService(appointment.service);
      setCustomService(appointment.customService || '');
      setValue(appointment.value.toString());
      setNotes(appointment.notes || '');
      setStatus(appointment.status || 'agendado');
      setPaid(appointment.paid || false);
    }
  }, [appointment]);

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

  const handleSubmit = () => {
    // Validation
    if (!selectedDate || !service || !value) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Agendamento atualizado com sucesso!');
    navigate(`/appointments/${appointmentId}`);
  };

  const services: ServiceType[] = [
    'manicure',
    'cabelo',
    'massagem',
    'depilacao',
    'sobrancelha',
    'maquiagem',
    'estetica',
    'barbeiro',
    'cilios',
    'podologia',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(`/appointments/${appointmentId}`)}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
          </button>
        </div>
        
        <h2 className="text-xl mb-3">Editar Agendamento</h2>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Name */}
          <div>
            <Label htmlFor="name" className="text-sm">Nome do Cliente</Label>
            <Input
              id="name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="mt-1.5"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-sm">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98765-4321"
              className="mt-1.5"
              type="tel"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date" className="text-sm">Data</Label>
              <Popover>
                <PopoverTrigger className="w-full">
                  <Input
                    id="date"
                    type="text"
                    value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : ''}
                    placeholder="Selecione a data"
                    className="mt-1.5"
                    readOnly
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-2"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time" className="text-sm">Horário</Label>
              <div className="flex gap-2 mt-1.5">
                <Select value={timeHour} onValueChange={setTimeHour}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{timeHour}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="flex items-center text-lg font-medium">:</span>
                <Select value={timeMinute} onValueChange={setTimeMinute}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{timeMinute}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map(minute => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm">Duração</Label>
            <div className="flex gap-2 mt-1.5">
              <Select value={durationHours} onValueChange={setDurationHours}>
                <SelectTrigger className="w-full">
                  <SelectValue>{durationHours}h</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {durationHoursOptions.map(hour => (
                    <SelectItem key={hour} value={hour}>
                      {hour}h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={durationMinutes} onValueChange={setDurationMinutes}>
                <SelectTrigger className="w-full">
                  <SelectValue>{durationMinutes}min</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {minutes.map(minute => (
                    <SelectItem key={minute} value={minute}>
                      {minute}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-sm">Endereço <span className="text-gray-400">(opcional)</span></Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, complemento"
              className="mt-1.5"
            />
          </div>

          {/* Service */}
          <div>
            <Label className="text-sm mb-3 block">Serviço</Label>
            <div className="grid grid-cols-3 gap-2">
              {services.map(s => (
                <button
                  key={s}
                  onClick={() => setService(s)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    service === s
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 active:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{serviceIcons[s]}</div>
                  <div className="text-xs leading-tight">{serviceLabels[s]}</div>
                </button>
              ))}
              <button
                onClick={() => setService('outro')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  service === 'outro'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{serviceIcons.outro}</div>
                <div className="text-xs leading-tight">{serviceLabels.outro}</div>
              </button>
            </div>
          </div>

          {/* Custom Service Name */}
          {service === 'outro' && (
            <div>
              <Label htmlFor="customService" className="text-sm">Nome do serviço</Label>
              <Input
                id="customService"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Ex: Limpeza de pele"
                className="mt-1.5"
              />
            </div>
          )}

          {/* Value */}
          <div>
            <Label htmlFor="value" className="text-sm">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              className="mt-1.5"
              inputMode="decimal"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm">Observações <span className="text-gray-400">(opcional)</span></Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente queria um corte mais curto"
              className="mt-1.5"
            />
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm mb-3 block">Status</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStatus('agendado')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  status === 'agendado'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="text-sm leading-tight">Agendado</div>
              </button>
              <button
                onClick={() => setStatus('concluido')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  status === 'concluido'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="text-sm leading-tight">Concluído</div>
              </button>
            </div>
          </div>

          {/* Paid */}
          <div>
            <Label className="text-sm mb-3 block">Pagamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaid(false)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  !paid
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="text-sm leading-tight">Pendente</div>
              </button>
              <button
                onClick={() => setPaid(true)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paid
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 active:bg-gray-50'
                }`}
              >
                <div className="text-sm leading-tight">Pago</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base" 
            onClick={handleSubmit}
          >
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}