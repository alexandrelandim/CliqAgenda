import { useEffect, useCallback } from 'react';
import { driver } from 'driver.js';
import { useNavigate, useLocation } from 'react-router';

const TOUR_STORAGE_KEY = 'cliqagenda-tour-completed';

export const useTour = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const startTour = useCallback(() => {
    // Garantir que estamos na home antes de iniciar
    if (location.pathname !== '/') {
      navigate('/');
      // Aguardar navegação antes de iniciar
      setTimeout(() => {
        startTourSteps();
      }, 500);
    } else {
      startTourSteps();
    }
  }, [navigate, location]);

  const startTourSteps = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        {
          popover: {
            title: '👋 Bem-vindo ao CliqAgenda!',
            description: 'Organize seus agendamentos de forma profissional e simples. No final do mês, você vai sentir os ganhos de ter todos os seus atendimentos organizados, pagamentos controlados e um histórico completo dos seus clientes!',
            side: 'center',
            align: 'center',
          },
        },
        {
          element: '[data-tour="notifications"]',
          popover: {
            title: '🔔 Notificações',
            description: 'Aqui você recebe as mensagens importantes do sistema, como lembretes de agendamentos próximos e atualizações.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tour="add-button"]',
          popover: {
            title: '➕ Criar Agendamento',
            description: 'Este é o botão mais importante! Toque aqui para criar novos agendamentos de forma rápida e prática. O sistema vai te guiar em cada passo.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-tour="profile"]',
          popover: {
            title: '👤 Meu Perfil',
            description: 'Aqui você encontra opções importantes como configurar seus serviços, gerenciar chave Pix, compartilhar o app e muito mais!',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          popover: {
            title: '🚀 Pronto para começar!',
            description: 'Explore todo o app! Tem muitas funções legais esperando por você. Que tal começar criando seu primeiro agendamento? É só tocar no botão + da tela inicial!',
            side: 'center',
            align: 'center',
          },
        },
      ],
      onDestroyed: () => {
        // Marcar como concluído
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      },
    });

    driverObj.drive();
  };

  const checkFirstAccess = useCallback(() => {
    const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    
    if (!hasCompletedTour) {
      // Pequeno delay para garantir que os elementos estão renderizados
      setTimeout(() => {
        startTour();
      }, 1000);
    }
  }, [startTour]);

  return {
    startTour,
    checkFirstAccess,
  };
};