import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { notificationApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  titre: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.lu).length);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      loadNotifications();
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(id);
      loadNotifications();
      toast({
        title: "Succès",
        description: "Notification supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 border-b last:border-b-0 cursor-default ${
                  !notification.lu ? 'bg-blue-50' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{notification.titre}</h3>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(notification.createdAt)}</span>
                    {!notification.lu && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 