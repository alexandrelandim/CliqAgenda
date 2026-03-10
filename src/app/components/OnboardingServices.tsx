import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Info, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { serviceIcons, serviceLabels } from '../data/mockData';
import { ServiceType } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface ServiceConfig {
  service: string;
  displayName: string;
  defaultValue: string;
  defaultDuration: string;
  isCustom?: boolean;
}

export default function OnboardingServices() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, ServiceConfig>>({});
  const [loading, setLoading] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServices, setCustomServices] = useState<Array<{ id: string; name: string }>>([]);
  const [pixKey, setPixKey] = useState('');

  const baseServices: ServiceType[] = [
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

  const toggleService = (serviceId: string, displayName: string, isCustom = false) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceId));
      const newConfigs = { ...serviceConfigs };
      delete newConfigs[serviceId];
      setServiceConfigs(newConfigs);
    } else {
      setSelectedServices([...selectedServices, serviceId]);
      setServiceConfigs({
        ...serviceConfigs,
        [serviceId]: {
          service: serviceId,
          displayName,
          defaultValue: '',
          defaultDuration: '60',
          isCustom,
        },
      });
    }
  };

  const handleAddCustomService = () => {
    if (!customServiceName.trim()) {
      toast.error('Digite o nome do serviço');
      return;
    }

    const customId = `custom_${Date.now()}`;
    const newCustomService = { id: customId, name: customServiceName.trim() };
    
    setCustomServices([...customServices, newCustomService]);
    toggleService(customId, customServiceName.trim(), true);
    setCustomServiceName('');
    setShowCustomDialog(false);
    toast.success('Serviço adicionado!');
  };

  const removeCustomService = (serviceId: string) => {
    setCustomServices(customServices.filter(s => s.id !== serviceId));
    if (selectedServices.includes(serviceId)) {
      toggleService(serviceId, '', true);
    }
  };

  const updateServiceConfig = (serviceId: string, field: 'defaultValue' | 'defaultDuration', value: string) => {
    setServiceConfigs({
      ...serviceConfigs,
      [serviceId]: {
        ...serviceConfigs[serviceId],
        [field]: value,
      },
    });
  };

  const handleComplete = async () => {
    if (selectedServices.length === 0) {
      toast.error('Selecione pelo menos um serviço');
      return;
    }

    // Check if all selected services have values and durations
    for (const serviceId of selectedServices) {
      const config = serviceConfigs[serviceId];
      if (!config.defaultValue || !config.defaultDuration) {
        toast.error(`Configure o valor e duração de ${config.displayName}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Simulate API call to save configurations
      await new Promise(resolve => setTimeout(resolve, 500));
      
      completeOnboarding();
      toast.success('Configuração concluída!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configure seus Serviços
          </h1>
          <p className="text-sm text-gray-600">
            Selecione os serviços que você oferece e defina valores padrão
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Não se preocupe!</p>
            <p className="text-blue-700">
              Você poderá ajustar o valor e a duração durante cada agendamento. 
              Estes são apenas valores padrão para facilitar.
            </p>
          </div>
        </div>

        {/* Services Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selecione seus serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {baseServices.map(service => (
                <button
                  key={service}
                  onClick={() => toggleService(service, serviceLabels[service])}
                  className={`p-3 rounded-lg border-2 transition-all relative ${
                    selectedServices.includes(service)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 active:bg-gray-50'
                  }`}
                >
                  {selectedServices.includes(service) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">{serviceIcons[service]}</div>
                  <div className="text-xs leading-tight">{serviceLabels[service]}</div>
                </button>
              ))}
              
              {/* Custom Services */}
              {customServices.map(custom => (
                <div
                  key={custom.id}
                  className={`p-3 rounded-lg border-2 transition-all relative cursor-pointer ${
                    selectedServices.includes(custom.id)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 active:bg-gray-50'
                  }`}
                  onClick={() => toggleService(custom.id, custom.name, true)}
                >
                  {selectedServices.includes(custom.id) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomService(custom.id);
                    }}
                    className="absolute top-1 left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                    aria-label="Remover serviço"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-xs leading-tight">{custom.name}</div>
                </div>
              ))}
              
              {/* Add Others Button */}
              <button
                onClick={() => setShowCustomDialog(true)}
                className="p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all"
              >
                <div className="text-2xl mb-1">
                  <Plus className="w-6 h-6 mx-auto text-gray-400" />
                </div>
                <div className="text-xs leading-tight text-gray-600">Outros</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Service Configuration */}
        {selectedServices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuração dos Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServices.map(serviceId => {
                const config = serviceConfigs[serviceId];
                const icon = config.isCustom ? '✨' : serviceIcons[serviceId as ServiceType];
                
                return (
                  <div key={serviceId} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium text-sm">{config.displayName}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`value-${serviceId}`} className="text-xs">
                          Valor Padrão
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            R$
                          </span>
                          <Input
                            id={`value-${serviceId}`}
                            type="text"
                            inputMode="decimal"
                            value={config.defaultValue}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.,]/g, '');
                              updateServiceConfig(serviceId, 'defaultValue', value);
                            }}
                            placeholder="0,00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`duration-${serviceId}`} className="text-xs">
                          Duração (min)
                        </Label>
                        <Input
                          id={`duration-${serviceId}`}
                          type="text"
                          inputMode="numeric"
                          value={config.defaultDuration}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            updateServiceConfig(serviceId, 'defaultDuration', value);
                          }}
                          placeholder="60"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* PIX Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chave PIX</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="pix-key" className="text-sm">
                Chave PIX para recebimentos (opcional)
              </Label>
              <Input
                id="pix-key"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Digite sua chave PIX"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                CPF, CNPJ, e-mail, telefone ou chave aleatória
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="h-12"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            className="bg-purple-600 hover:bg-purple-700 h-12 text-base"
            disabled={loading || selectedServices.length === 0}
          >
            {loading ? 'Salvando...' : 'Concluir'}
          </Button>
        </div>
      </div>

      {/* Custom Service Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="max-w-[90vw] w-full mx-4">
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Adicione um serviço que não está na lista padrão.
          </DialogDescription>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-service">Nome do Serviço</Label>
              <Input
                id="custom-service"
                value={customServiceName}
                onChange={(e) => setCustomServiceName(e.target.value)}
                placeholder="Ex: Limpeza de Pele"
                className="mt-1.5"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomService();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomDialog(false);
                  setCustomServiceName('');
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddCustomService}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}