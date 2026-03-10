import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, MailOpen, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { mockNotifications } from '../data/mockData';

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSwipedId(null);
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    (e.currentTarget as any).startX = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    const startX = (element as any).startX || 0;
    const diff = touch.clientX - startX;

    // Arrastar apenas para a esquerda
    if (diff < 0 && diff > -100) {
      element.style.transform = `translateX(${diff}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    const element = e.currentTarget as HTMLElement;
    const transform = element.style.transform;
    const match = transform.match(/-?\d+/);
    const translateX = match ? parseInt(match[0]) : 0;

    if (translateX < -60) {
      // Mostrar botão de deletar
      element.style.transform = 'translateX(-80px)';
      setSwipedId(id);
    } else {
      // Voltar ao normal
      element.style.transform = 'translateX(0)';
      setSwipedId(null);
    }
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
          <span className="text-base">Voltar</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl">Notificações</h2>
        <p className="text-gray-600 text-sm mt-1">
          Acompanhe suas mensagens e avisos
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Não Lidas
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('read')}
          className={filter === 'read' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Lidas
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhuma notificação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <div key={notification.id} className="relative">
              {/* Notification Card */}
              <button
                onClick={() => navigate(`/notifications/${notification.id}`)}
                className="w-full text-left"
              >
                <Card
                  className={`${
                    !notification.read
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-white border-gray-200'
                  } hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className={`text-sm font-semibold line-clamp-1 ${
                              !notification.read ? 'text-purple-900' : 'text-gray-900'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
