import { useState } from 'react';
import { useNavigate } from 'react-router';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockAppointments, serviceLabels } from '../data/mockData';
import { Appointment } from '../types';

type ViewMode = 'agenda' | 'day' | 'three' | 'week' | 'month';
type FilterMode = 'all' | 'today' | 'future';

interface AppointmentsCalendarProps {
  filterMode?: FilterMode;
}

export default function AppointmentsCalendar({ filterMode = 'all' }: AppointmentsCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  // Filter appointments based on filterMode
  const getFilteredAppointments = () => {
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');
    
    if (filterMode === 'today') {
      return mockAppointments.filter(apt => apt.date === todayStr);
    } else if (filterMode === 'future') {
      return mockAppointments.filter(apt => apt.date > todayStr);
    }
    return mockAppointments;
  };

  const filteredAppointments = getFilteredAppointments();

  const goToPrevious = () => {
    if (viewMode === 'week' || viewMode === 'three') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'week' || viewMode === 'three') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getVisibleDates = () => {
    switch (viewMode) {
      case 'day':
        return [currentDate];
      case 'three':
        return [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];
      case 'week':
        const weekStart = startOfWeek(currentDate, { locale: ptBR });
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
      default: // agenda
        return [];
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt => {
      const aptDate = typeof apt.date === 'string' ? parseISO(apt.date) : apt.date;
      return isSameDay(aptDate, date);
    });
  };

  const visibleDates = getVisibleDates();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <p className="text-sm text-gray-600">
            {viewMode === 'agenda' ? 'Próximos agendamentos' : format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        {viewMode !== 'agenda' && filterMode === 'all' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="h-8 px-3 text-xs"
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* View Mode Tabs - Only show when filterMode is 'all' */}
      {filterMode === 'all' ? (
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1">
            <TabsTrigger value="agenda" className="text-xs py-2">Agenda</TabsTrigger>
            <TabsTrigger value="day" className="text-xs py-2">Dia</TabsTrigger>
            <TabsTrigger value="three" className="text-xs py-2">3 Dias</TabsTrigger>
            <TabsTrigger value="week" className="text-xs py-2">Semana</TabsTrigger>
            <TabsTrigger value="month" className="text-xs py-2">Mês</TabsTrigger>
          </TabsList>

          {/* Agenda View */}
          <TabsContent value="agenda" className="mt-4 space-y-3">
            {filteredAppointments
              .sort((a, b) => {
                const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date;
                const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date;
                return dateA.getTime() - dateB.getTime();
              })
              .map(apt => {
                const aptDate = typeof apt.date === 'string' ? parseISO(apt.date) : apt.date;
                return (
                  <Card 
                    key={apt.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/appointments/${apt.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{apt.clientName}</h3>
                        <p className="text-sm text-gray-600">{apt.customService || serviceLabels[apt.service]}</p>
                        {apt.status === 'concluido' && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Concluído
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-600">
                          {format(aptDate, "d 'de' MMM", { locale: ptBR })}
                        </div>
                        <div className="text-xs text-gray-500">{apt.time}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{apt.address}</span>
                    </div>
                  </Card>
                );
              })}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum agendamento</p>
              </div>
            )}
          </TabsContent>

          {/* Day View */}
          <TabsContent value="day" className="mt-4">
            <DayView date={currentDate} appointments={getAppointmentsForDate(currentDate)} navigate={navigate} />
          </TabsContent>

          {/* 3 Days View */}
          <TabsContent value="three" className="mt-4 space-y-4">
            {visibleDates.map(date => (
              <div key={date.toISOString()}>
                <h3 className="font-medium mb-2 text-sm text-gray-700">
                  {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </h3>
                <DayView date={date} appointments={getAppointmentsForDate(date)} compact navigate={navigate} />
              </div>
            ))}
          </TabsContent>

          {/* Week View */}
          <TabsContent value="week" className="mt-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 min-w-full">
              {visibleDates.map(date => {
                const apts = getAppointmentsForDate(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`border rounded-lg p-2 min-h-[200px] ${
                      isToday ? 'bg-purple-50 border-purple-300' : 'bg-white'
                    }`}
                  >
                    <div className={`text-center mb-2 ${isToday ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                      <div className="text-xs font-medium">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()]}
                      </div>
                      <div className="text-lg">{format(date, 'd')}</div>
                    </div>
                    <div className="space-y-1">
                      {apts.map(apt => (
                        <div
                          key={apt.id}
                          onClick={() => navigate(`/appointments/${apt.id}`)}
                          className="bg-purple-600 text-white rounded px-2 py-1 text-[10px] cursor-pointer hover:bg-purple-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="flex-1 break-words leading-tight">{apt.clientName}</span>
                            <span className="text-[9px] opacity-90 whitespace-nowrap flex-shrink-0">{apt.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Month View */}
          <TabsContent value="month" className="mt-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-600 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1" style={{ height: 'calc(100vh - 320px)' }}>
              {visibleDates.map(date => {
                const apts = getAppointmentsForDate(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => {
                      setCurrentDate(date);
                      setViewMode('day');
                    }}
                    className={`border rounded-lg p-1 cursor-pointer hover:shadow-md transition-shadow ${
                      isToday ? 'bg-purple-50 border-purple-300' : 'bg-white'
                    }`}
                  >
                    <div className={`text-xs mb-1 ${isToday ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                      {format(date, 'd')}
                    </div>
                    {apts.length > 0 && (
                      <div className="space-y-0.5">
                        {apts.slice(0, 3).map(apt => (
                          <div
                            key={apt.id}
                            className="bg-purple-600 text-white rounded-sm px-1 py-0.5 text-[9px] truncate leading-tight"
                          >
                            {apt.clientName}
                          </div>
                        ))}
                        {apts.length > 3 && (
                          <div className="text-[8px] text-purple-600 font-medium">
                            +{apts.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // When filterMode is 'today' or 'future', show only agenda view without tabs
        <div className="mt-4 space-y-3">
          {filteredAppointments
            .sort((a, b) => {
              const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date;
              const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date;
              return dateA.getTime() - dateB.getTime();
            })
            .map(apt => {
              const aptDate = typeof apt.date === 'string' ? parseISO(apt.date) : apt.date;
              return (
                <Card 
                  key={apt.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/appointments/${apt.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{apt.clientName}</h3>
                      <p className="text-sm text-gray-600">{apt.customService || serviceLabels[apt.service]}</p>
                      {apt.status === 'concluido' && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Concluído
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        {format(aptDate, "d 'de' MMM", { locale: ptBR })}
                      </div>
                      <div className="text-xs text-gray-500">{apt.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{apt.address}</span>
                  </div>
                </Card>
              );
            })}
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum agendamento</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DayView({ 
  date, 
  appointments, 
  compact = false, 
  navigate 
}: { 
  date: Date; 
  appointments: typeof mockAppointments; 
  compact?: boolean;
  navigate: (path: string) => void;
}) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum agendamento para este dia</p>
        </div>
      ) : (
        <div className={compact ? 'space-y-2 p-3' : 'space-y-1'}>
          {!compact && (
            <div className="grid grid-cols-[60px_1fr] gap-2 px-3 py-2 bg-gray-50 border-b">
              <div className="text-xs font-medium text-gray-600">Hora</div>
              <div className="text-xs font-medium text-gray-600">Agendamentos</div>
            </div>
          )}
          
          {hours.map(hour => {
            const hourAppointments = appointments.filter(apt => {
              const aptHour = parseInt(apt.time.split(':')[0]);
              return aptHour === hour;
            });

            return (
              <div key={hour} className={compact ? '' : 'grid grid-cols-[60px_1fr] gap-2 px-3 py-2 border-b border-gray-100'}>
                {!compact && (
                  <div className="text-sm text-gray-500">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                )}
                <div className="space-y-2">
                  {hourAppointments.map(apt => (
                    <Card 
                      key={apt.id} 
                      className={`${compact ? 'p-2' : 'p-3'} bg-gradient-to-r from-purple-50 to-white border-l-4 border-l-purple-600 cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => navigate(`/appointments/${apt.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{apt.clientName}</div>
                            {apt.status === 'concluido' && (
                              <Badge variant="secondary" className="text-xs">
                                Concluído
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {apt.customService || serviceLabels[apt.service]} • {apt.duration} min
                          </div>
                        </div>
                        {compact && (
                          <div className="text-xs text-purple-600 font-medium">
                            {apt.time}
                          </div>
                        )}
                      </div>
                      {!compact && (
                        <div className="flex items-start gap-2 mt-1.5 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{apt.address}</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}