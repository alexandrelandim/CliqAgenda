import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import AppointmentsCalendar from './AppointmentsCalendar';

export default function NextAppointments() {
  const navigate = useNavigate();

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

      <h1 className="text-xl font-semibold">Próximos Agendamentos</h1>

      {/* Use AppointmentsCalendar with future filter */}
      <AppointmentsCalendar filterMode="future" />
    </div>
  );
}