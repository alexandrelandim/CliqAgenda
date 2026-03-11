import { Link, useNavigate } from 'react-router';
import { ChevronRight, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { mockClients, mockAppointments } from '../data/mockData';
import { useState } from 'react';
import { UserAvatar } from './UserAvatar';

type FilterType = 'all' | 'pending-payment' | 'scheduled';
type SortType = 'name' | 'appointments' | 'total-paid' | 'pending-amount';

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('name');

  const getClientStats = (clientId: string) => {
    const clientAppointments = mockAppointments.filter(apt => apt.clientId === clientId);
    const totalServices = clientAppointments.length;
    const unpaidServices = clientAppointments.filter(
      apt => apt.status === 'concluido' && !apt.paid
    ).length;
    const hasScheduled = clientAppointments.some(apt => apt.status === 'agendado');
    const totalPaid = clientAppointments
      .filter(apt => apt.paid)
      .reduce((sum, apt) => sum + apt.value, 0);
    const pendingAmount = clientAppointments
      .filter(apt => apt.status === 'concluido' && !apt.paid)
      .reduce((sum, apt) => sum + apt.value, 0);

    return { totalServices, unpaidServices, hasScheduled, totalPaid, pendingAmount };
  };

  // Filter clients
  let filteredClients = mockClients;

  if (filter === 'pending-payment') {
    filteredClients = filteredClients.filter(client => {
      const stats = getClientStats(client.id);
      return stats.unpaidServices > 0;
    });
  } else if (filter === 'scheduled') {
    filteredClients = filteredClients.filter(client => {
      const stats = getClientStats(client.id);
      return stats.hasScheduled;
    });
  }

  // Apply search
  if (searchTerm) {
    filteredClients = filteredClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sort === 'name') {
      return a.name.localeCompare(b.name);
    }
    
    const statsA = getClientStats(a.id);
    const statsB = getClientStats(b.id);
    
    if (sort === 'appointments') {
      return statsB.totalServices - statsA.totalServices;
    }
    
    if (sort === 'total-paid') {
      return statsB.totalPaid - statsA.totalPaid;
    }
    
    if (sort === 'pending-amount') {
      return statsB.pendingAmount - statsA.pendingAmount;
    }
    
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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

      {/* Sort Selector - Native HTML Select */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="flex-1 h-9 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="name">Nome do Cliente</option>
          <option value="appointments">Quantidade de Atendimentos</option>
          <option value="total-paid">Valor Pago</option>
          <option value="pending-amount">Valor Pendente</option>
        </select>
      </div>

      <div className="space-y-3">
        {sortedClients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600 text-sm">
              Nenhum cliente encontrado
            </CardContent>
          </Card>
        ) : (
          sortedClients.map(client => {
            const stats = getClientStats(client.id);

            return (
              <Link key={client.id} to={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="px-4 !py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <UserAvatar 
                          name={client.name}
                          size="md"
                          className="flex-shrink-0"
                        />
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