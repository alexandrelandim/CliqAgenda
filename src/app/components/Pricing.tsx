import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Sparkles, Zap, Mic, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      description: 'Ideal para começar',
      icon: Check,
      iconColor: 'text-gray-600',
      gradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      features: [
        { text: '15 agendamentos por 30 dias', available: true },
        { text: 'Gestão básica de clientes', available: true },
        { text: 'Mensagens para WhatsApp', available: true },
        { text: 'Agendamentos ilimitados', available: false },
        { text: 'Gráficos e relatórios', available: false },
        { text: 'Agendamento por áudio (IA)', available: false },
      ],
      buttonText: 'Plano Atual',
      buttonDisabled: true,
    },
    {
      name: 'Pró',
      price: 'R$ 19,90',
      priceAnnual: 'R$ 199',
      period: 'por mês',
      periodAnnual: 'por ano',
      description: 'Para profissionais que querem crescer',
      badge: '🔥 Apenas 100 vagas!',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      features: [
        { text: 'Agendamentos ilimitados', available: true },
        { text: 'Gestão completa de clientes', available: true },
        { text: 'Mensagens para WhatsApp', available: true },
        { text: 'Gráficos de pagamentos', available: true },
        { text: 'Relatórios detalhados', available: true },
        { text: 'Suporte prioritário', available: true },
      ],
      buttonText: 'Assinar Agora',
      buttonDisabled: false,
      highlight: true,
    },
    {
      name: 'Pró + IA',
      price: 'R$ 49,90',
      priceAnnual: 'R$ 499',
      period: 'por mês',
      periodAnnual: 'por ano',
      description: 'O futuro dos agendamentos',
      badge: '🚀 Em desenvolvimento',
      icon: Mic,
      iconColor: 'text-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      features: [
        { text: 'Tudo do Plano Pró', available: true },
        { text: 'Agendamento por áudio', available: true },
        { text: 'IA para sugestões de horários', available: true },
        { text: 'Análise inteligente de dados', available: true },
        { text: 'Lembretes automáticos por voz', available: true },
        { text: 'Assistente virtual 24/7', available: true },
      ],
      buttonText: 'Em Breve',
      buttonDisabled: true,
      comingSoon: true,
    },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/payments')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl">Escolha Seu Plano</h2>
        <p className="text-gray-600 text-sm mt-1">
          Desbloqueie todo o potencial do CliqAgenda
        </p>
      </div>

      {/* Plans Grid */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${plan.gradient} ${plan.borderColor} ${
                plan.highlight ? 'ring-2 ring-purple-400 shadow-lg' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <p className="text-xs text-gray-600 mt-0.5">{plan.description}</p>
                    </div>
                  </div>
                  {plan.badge && (
                    <span className="text-xs bg-white/80 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                      {plan.badge}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.iconColor}`}>
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-600">{plan.period}</span>
                  </div>
                  {plan.priceAnnual && (
                    <p className="text-sm text-gray-600 mt-1">
                      ou <span className="font-semibold">{plan.priceAnnual}</span> {plan.periodAnnual}
                      <span className="text-green-600 ml-1">(economize 17%)</span>
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {feature.available ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.available ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : plan.comingSoon
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400'
                  }`}
                  disabled={plan.buttonDisabled}
                  onClick={() => {
                    if (!plan.buttonDisabled) {
                      // Aqui seria a integração com pagamento
                      alert('Funcionalidade de pagamento em desenvolvimento!');
                    }
                  }}
                >
                  {plan.comingSoon && <Zap className="w-4 h-4 mr-2" />}
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700 text-center">
            <strong>💡 Dica:</strong> O plano anual oferece o melhor custo-benefício!
            <br />
            Você pode cancelar a qualquer momento, sem complicações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
