import { Link, useNavigate } from 'react-router';
import { ChevronRight, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockClients, mockAppointments } from '../data/mockData';
import { useState } from 'react';

type FilterType = 'all' | 'pending-payment' | 'scheduled';

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const getClientStats = (clientId: string) => {
    const clientAppointments = mockAppointments.filter(apt => apt.clientId === clientId);
    const totalServices = clientAppointments.length;
    const unpaidServices = clientAppointments.filter(
      apt => apt.status === 'concluido' && !apt.paid
    ).length;
    const hasScheduled = clientAppointments.some(apt => apt.status === 'agendado');

    return { totalServices, unpaidServices, hasScheduled };
  };

  const getFilteredClients = () => {
    let filtered = mockClients;

    // Apply filter
    if (filter === 'pending-payment') {
      filtered = filtered.filter(client => {
        const stats = getClientStats(client.id);
        return stats.unpaidServices > 0;
      });
    } else if (filter === 'scheduled') {
      filtered = filtered.filter(client => {
        const stats = getClientStats(client.id);
        return stats.hasScheduled;
      });
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredClients = getFilteredClients();

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

      <div>
        <h2 className="text-xl">Clientes</h2>
        <p className="text-gray-600 text-sm mt-1">{mockClients.length} clientes cadastrados</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="all" className="text-xs py-2">
            Todos
          </TabsTrigger>
          <TabsTrigger value="pending-payment" className="text-xs py-2">
            Pag. Pendente
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs py-2">
            Agendados
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <Input
          type="search"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600 text-sm">
              Nenhum cliente encontrado
            </CardContent>
          </Card>
        ) : (
          filteredClients.map(client => {
            const stats = getClientStats(client.id);

            return (
              <Link key={client.id} to={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm">{client.name}</h3>
                          <p className="text-xs text-gray-600">
                            {stats.totalServices} atendimento(s)
                            {stats.unpaidServices > 0 && (
                              <span className="text-red-600 ml-2">
                                • {stats.unpaidServices} pendente(s)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}