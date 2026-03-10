import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Copy, ExternalLink, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockClients, serviceIcons, serviceLabels } from '../data/mockData';
import { ServiceType } from '../types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from './ui/utils';

type Step = 'name' | 'phone' | 'details' | 'confirmation';

export default function NewAppointment() {
  const navigate = useNavigate();
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
    
    message += `\n💰 Valor: R$ ${parseFloat(value).toFixed(2)}\n\nSe precisar remarcar, é só me avisar.`;
    
    return message;
  };

  const copyToClipboard = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada!');
  };

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => {
              if (step === 'name') navigate('/');
              else if (step === 'phone') setStep('name');
              else if (step === 'details') setStep('phone');
              else setStep('details');
            }}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
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
                  <div className="font-medium text-purple-600">R$ {parseFloat(value).toFixed(2)}</div>
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