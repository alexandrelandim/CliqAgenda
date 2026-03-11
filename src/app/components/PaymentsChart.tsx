import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { mockAppointments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  value: number;
  id: string;
}

export default function PaymentsChart() {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  
  // Filtros de tipo de pagamento
  const [showReceived, setShowReceived] = useState(true); // paid = true
  const [showPending, setShowPending] = useState(true); // concluido && paid = false
  const [showScheduled, setShowScheduled] = useState(true); // agendado

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 1, currentYear, currentYear + 1];

  // Calcular dados do gráfico
  const chartData = useMemo(() => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const data: ChartData[] = months.map((month, idx) => ({
      month,
      value: 0,
      id: `${selectedYear}-${idx}`,
    }));

    mockAppointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      const aptYear = aptDate.getFullYear();
      
      if (aptYear !== selectedYear) return;

      const monthIndex = aptDate.getMonth();
      
      // Aplicar filtros
      let includeInChart = false;
      
      if (showReceived && apt.paid === true) {
        includeInChart = true;
      }
      
      if (showPending && apt.status === 'concluido' && !apt.paid) {
        includeInChart = true;
      }
      
      if (showScheduled && apt.status === 'agendado') {
        includeInChart = true;
      }

      if (includeInChart) {
        data[monthIndex].value += apt.value;
      }
    });

    return data;
  }, [selectedYear, showReceived, showPending, showScheduled]);

  const maxValue = Math.max(...chartData.map(d => d.value));
  const hasData = maxValue > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.month}</p>
          <p className="text-lg font-bold text-purple-600">
            R$ {Math.floor(payload[0].value).toLocaleString('pt-BR')}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (hideValues) return '••••';
    return `${Math.floor(value)}`;
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/payments')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
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
        <h2 className="text-xl">Gráfico de Pagamentos</h2>
        <p className="text-gray-600 text-sm mt-1">
          Visualize seus recebimentos ao longo do tempo
        </p>
      </div>

      {/* Seletor de Ano */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block">Selecionar Ano</Label>
          <div className="grid grid-cols-3 gap-2">
            {availableYears.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                onClick={() => setSelectedYear(year)}
                className={selectedYear === year ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                {year}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros de Tipo */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-3 block">Filtrar por Tipo</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="received"
                checked={showReceived}
                onCheckedChange={(checked) => setShowReceived(checked as boolean)}
              />
              <label
                htmlFor="received"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Pagamentos Recebidos
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pending"
                checked={showPending}
                onCheckedChange={(checked) => setShowPending(checked as boolean)}
              />
              <label
                htmlFor="pending"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Pagamentos Pendentes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheduled"
                checked={showScheduled}
                onCheckedChange={(checked) => setShowScheduled(checked as boolean)}
              />
              <label
                htmlFor="scheduled"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Agendamentos Futuros
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card>
        <CardContent className="p-4">
          {!hasData ? (
            <div className="py-12 text-center">
              <p className="text-gray-600">Nenhum dado disponível para os filtros selecionados</p>
            </div>
          ) : (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    width={45}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo */}
      {hasData && (
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">Total do Ano {selectedYear}:</span>
              <span className="text-xl font-bold text-purple-700">
                {hideValues ? '••••' : `R$ ${Math.floor(chartData.reduce((sum, d) => sum + d.value, 0)).toLocaleString('pt-BR')}`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}