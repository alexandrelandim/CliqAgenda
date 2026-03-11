import { useState, useEffect } from 'react';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Check, Copy, ExternalLink, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { copyToClipboard as copyText } from '../utils/clipboard';
import { formatCurrency } from '../utils/currency';
import { mockClients, serviceLabels, serviceIcons } from '../data/mockData';
import { ServiceType } from '../types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type Step = 'name' | 'phone' | 'details' | 'confirmation';

// Number Picker Component (iOS style)
interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

function NumberPicker({ value, onChange, min = 1, max = 100, className = '' }: NumberPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`px-4 py-2 border rounded-lg bg-white text-center font-medium hover:bg-gray-50 transition-colors ${className}`}
        >
          {value}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-0" align="center">
        <div className="max-h-60 overflow-y-auto">
          {numbers.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                onChange(num);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-center transition-colors ${
                num === value
                  ? 'bg-purple-50 text-purple-600 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Segmented Control Component
interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

function SegmentedControl<T extends string>({ value, onChange, options, className = '' }: SegmentedControlProps<T>) {
  return (
    <div className={`flex bg-gray-100 rounded-full p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function NewAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>('name');
  const [searchName, setSearchName] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('');
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

  // Recurrence states
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurrenceInterval, setRecurrenceInterval] = useState('1');
  const [recurrenceWeekDays, setRecurrenceWeekDays] = useState<number[]>([]);
  const [recurrenceMonthDay, setRecurrenceMonthDay] = useState(1);
  const [recurrenceEndType, setRecurrenceEndType] = useState<'never' | 'on' | 'after'>('never');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(undefined);
  const [recurrenceEndCount, setRecurrenceEndCount] = useState('10');

  // Preencher dados se vier de um agendamento anterior
  useEffect(() => {
    const state = location.state as any;
    if (state?.prefillData) {
      const data = state.prefillData;
      
      // Preencher nome e telefone
      setSearchName(data.clientName || '');
      setPhone(data.phone || '');
      
      // Preencher data
      if (data.date) {
        setSelectedDate(new Date(data.date + 'T00:00:00'));
      }
      
      // Preencher horário
      if (data.time) {
        const [hour, minute] = data.time.split(':');
        setTimeHour(hour || '09');
        setTimeMinute(minute || '00');
      }
      
      // Preencher duração
      if (data.duration) {
        const totalMinutes = parseInt(data.duration);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        setDurationHours(hours.toString());
        setDurationMinutes(mins.toString().padStart(2, '0'));
      }
      
      // Preencher outros campos
      setAddress(data.address || '');
      setService(data.service || '');
      setCustomService(data.customService || '');
      setValue(data.value ? formatCurrency(data.value) : '');
      setNotes(data.notes || '');
      
      // Ir direto para a etapa de detalhes
      setStep('details');
      
      // Mostrar toast informando
      toast.info('Usando informações do agendamento anterior');
    }
  }, [location.state]);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleSelectClient = (clientId: string) => {
    setSelectedClient(clientId);
    const client = mockClients.find(c => c.id === clientId);
    if (client) {
      setSearchName(client.name);
      setStep('phone');
    }
  };

  const handleSelectPhone = (selectedPhone: string) => {
    setPhone(selectedPhone);
    setStep('details');
  };

  const handleNewPhone = () => {
    if (phone.trim()) {
      setStep('details');
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedDate || !service || !value) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    toast.success('Agendamento criado com sucesso!');
    setStep('confirmation');
  };

  const generateWhatsAppMessage = () => {
    const client = mockClients.find(c => c.id === selectedClient);
    const clientName = client?.name || searchName;
    const dateFormatted = selectedDate
      ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
      : '';
    const serviceName = service === 'outro' ? customService : serviceLabels[service as ServiceType];
    const time = `${timeHour}:${timeMinute}`;

    let message = `Olá ${clientName}! 😊\n\nSeu agendamento está confirmado:\n\n📅 Data: ${dateFormatted}\n⏰ Horário: ${time}\n💇 Serviço: ${serviceName}`;
    
    if (address.trim()) {
      message += `\n📍 Endereço: ${address}`;
    }
    
    message += `\n💰 Valor: R$ ${formatCurrency(parseFloat(value))}\n\nSe precisar remarcar, é só me avisar.`;
    
    return message;
  };

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    const message = generateWhatsAppMessage();
    const success = await copyText(message);
    if (success) {
      toast.success('Mensagem copiada!');
    } else {
      toast.error('Erro ao copiar mensagem');
    }
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

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  
  // Generate minutes in 15-minute intervals
  const minutes = ['00', '15', '30', '45'];
  
  // Generate duration hours (0-12)
  const durationHoursOptions = Array.from({ length: 13 }, (_, i) => i.toString());

  // Progress indicator
  const getStepNumber = () => {
    if (step === 'name') return 1;
    if (step === 'phone') return 2;
    if (step === 'details') return 3;
    return 4;
  };

  const handleBack = () => {
    if (step === 'name') navigate('/');
    else if (step === 'phone') setStep('name');
    else if (step === 'details') setStep('phone');
    else setStep('details');
  };

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        {step !== 'confirmation' && (
          <>
            <h2 className="text-xl mb-3">Novo Agendamento</h2>
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map(num => (
                <div
                  key={num}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    getStepNumber() >= num ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Step 1: Name */}
      {step === 'name' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Nome do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Digite o nome</Label>
              <Input
                id="name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="mt-1.5"
                autoFocus
              />
            </div>

            {searchName && (
              <div className="space-y-2">
                {filteredClients.length > 0 ? (
                  <>
                    <Label className="text-sm">Clientes encontrados:</Label>
                    {filteredClients.map(client => (
                      <Button
                        key={client.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3"
                        onClick={() => handleSelectClient(client.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">
                            {client.name.charAt(0)}
                          </div>
                          <span>{client.name}</span>
                        </div>
                      </Button>
                    ))}
                  </>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Nenhum cliente encontrado com esse nome
                    </p>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => setStep('phone')}
                    >
                      Criar novo cliente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Phone */}
      {step === 'phone' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Telefone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedClient && mockClients.find(c => c.id === selectedClient)?.phones.length! > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Telefones cadastrados:</Label>
                {mockClients
                  .find(c => c.id === selectedClient)
                  ?.phones.map((p, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 text-base"
                      onClick={() => handleSelectPhone(p)}
                    >
                      📱 {p}
                    </Button>
                  ))}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">ou</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="phone" className="text-sm">
                {selectedClient ? 'Adicionar novo telefone' : 'Digite o telefone'}
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="mt-1.5 text-base"
                type="tel"
              />
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleNewPhone}
              disabled={!phone.trim()}
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Detalhes do Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <CalendarComponent
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

            <div>
              <Label htmlFor="address" className="text-sm">Endereço <span className="text-gray-400"> (opcional)</span></Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento"
                className="mt-1.5"
              />
            </div>

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

            <div>
              <Label htmlFor="notes" className="text-sm">Observações <span className="text-gray-400"> (opcional)</span></Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cliente quer cabelo cacheado"
                className="mt-1.5"
              />
            </div>

            {/* Recurrence Section */}
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox 
                  id="recurring" 
                  checked={isRecurring}
                  onCheckedChange={(checked) => {
                    setIsRecurring(checked as boolean);
                    if (checked && selectedDate) {
                      setRecurrenceWeekDays([selectedDate.getDay()]);
                    }
                  }}
                />
                <Label htmlFor="recurring" className="text-sm font-medium flex items-center gap-1.5 cursor-pointer">
                  <Repeat className="w-4 h-4" />
                  Agendamento recorrente
                </Label>
              </div>

              {isRecurring && (
                <div className="space-y-4 pl-6 border-l-2 border-purple-100">
                  {/* Repeat every */}
                  <div>
                    <Label className="text-sm mb-2 block">Repetir a cada:</Label>
                    <div className="flex gap-2 items-center">
                      <NumberPicker
                        value={parseInt(recurrenceInterval) || 1}
                        onChange={(val) => setRecurrenceInterval(val.toString())}
                        min={1}
                        max={30}
                        className="w-20"
                      />
                      <SegmentedControl
                        value={recurrenceType}
                        onChange={(val) => {
                          setRecurrenceType(val);
                          // Update month day when changing to monthly
                          if (val === 'monthly' && selectedDate) {
                            setRecurrenceMonthDay(selectedDate.getDate());
                          }
                        }}
                        options={[
                          { 
                            value: 'daily', 
                            label: parseInt(recurrenceInterval) === 1 ? 'Dia' : 'Dias' 
                          },
                          { 
                            value: 'weekly', 
                            label: parseInt(recurrenceInterval) === 1 ? 'Semana' : 'Semanas' 
                          },
                          { 
                            value: 'monthly', 
                            label: parseInt(recurrenceInterval) === 1 ? 'Mês' : 'Meses' 
                          },
                        ]}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Weekly - Day of week selector */}
                  {recurrenceType === 'weekly' && (
                    <div>
                      <Label className="text-sm mb-2 block">Neste dia da semana:</Label>
                      <div className="flex gap-2 justify-between">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => {
                          const isSelected = recurrenceWeekDays.includes(index);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setRecurrenceWeekDays(recurrenceWeekDays.filter(d => d !== index));
                                } else {
                                  setRecurrenceWeekDays([...recurrenceWeekDays, index]);
                                }
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                isSelected 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Monthly - Day of month */}
                  {recurrenceType === 'monthly' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">no dia</span>
                      <NumberPicker
                        value={recurrenceMonthDay}
                        onChange={setRecurrenceMonthDay}
                        min={1}
                        max={31}
                        className="w-20"
                      />
                    </div>
                  )}

                  {/* End type */}
                  <div>
                    <Label className="text-sm mb-2 block">Termina em:</Label>
                    <div className="space-y-3">
                      <SegmentedControl
                        value={recurrenceEndType}
                        onChange={setRecurrenceEndType}
                        options={[
                          { value: 'never', label: 'Nunca' },
                          { value: 'on', label: 'Em' },
                          { value: 'after', label: 'Após' },
                        ]}
                        className="w-full"
                      />
                      
                      {recurrenceEndType === 'on' && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-left hover:bg-gray-50 transition-colors"
                            >
                              {recurrenceEndDate 
                                ? format(recurrenceEndDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                                : 'Selecionar data'
                              }
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={recurrenceEndDate}
                              onSelect={setRecurrenceEndDate}
                              className="p-2"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                      
                      {recurrenceEndType === 'after' && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={recurrenceEndCount}
                            onChange={(e) => setRecurrenceEndCount(e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600">ocorrências</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base" 
              onClick={handleSubmit}
            >
              Criar Agendamento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 'confirmation' && (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-2">Agendamento Criado!</h2>
            <p className="text-sm text-gray-600">Envie a confirmação para o cliente</p>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-600">Cliente</span>
                  <div className="font-medium">{searchName}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Telefone</span>
                  <div className="font-medium">{phone}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Data</span>
                  <div className="font-medium">
                    {selectedDate && format(selectedDate, "d 'de' MMM", { locale: ptBR })}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Horário</span>
                  <div className="font-medium">{`${timeHour}:${timeMinute}`}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Serviço</span>
                  <div className="font-medium">
                    {service === 'outro' ? customService : service && serviceLabels[service as ServiceType]}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Valor</span>
                  <div className="font-medium text-purple-600">R$ {formatCurrency(parseFloat(value))}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mensagem de confirmação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-xs whitespace-pre-wrap mb-4">
                {generateWhatsAppMessage()}
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                  onClick={openWhatsApp}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Enviar pelo WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Voltar ao Início
          </Button>
        </div>
      )}
    </div>
  );
}