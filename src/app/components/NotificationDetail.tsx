import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Mail, MailOpen, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { mockNotifications } from '../data/mockData';

export default function NotificationDetail() {
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const [notification, setNotification] = useState(
    mockNotifications.find(n => n.id === notificationId)
  );

  useEffect(() => {
    // Marcar como lida ao abrir
    if (notification && !notification.read) {
      setNotification({ ...notification, read: true });
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = () => {
    if (confirm('Deseja realmente apagar esta notificação?')) {
      // Aqui seria a lógica para deletar da lista
      navigate('/notifications');
    }
  };

  if (!notification) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-2 text-purple-600 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Voltar</span>
          </button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Notificação não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-2 text-purple-600 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Voltar</span>
        </button>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-50 rounded-full transition-colors active:scale-95"
          aria-label="Apagar notificação"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {/* Notification Card */}
      <Card className={notification.read ? 'bg-white' : 'bg-purple-50 border-purple-200'}>
        <CardContent className="p-6 space-y-4">
          {/* Icon and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  notification.read ? 'bg-gray-100' : 'bg-purple-100'
                }`}
              >
                {notification.read ? (
                  <MailOpen className="w-6 h-6 text-gray-600" />
                ) : (
                  <Mail className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    notification.read
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-purple-200 text-purple-700'
                  }`}
                >
                  {notification.read ? 'Lida' : 'Não lida'}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{notification.title}</h2>
          </div>

          {/* Message */}
          <div className="pt-2">
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {notification.message}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}