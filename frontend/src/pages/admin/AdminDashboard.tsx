import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";


import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminDashboard = () => {
  // Default static fallback
  const fallbackStats = [
    { title: 'Utilisateurs', value: '0', description: 'utilisateurs actifs', icon: Users, color: 'from-blue-600 to-blue-700', change: '' },
    { title: 'Mémoires', value: '0', description: 'en cours', icon: BookOpen, color: 'from-green-600 to-green-700', change: '' },
    { title: 'Jurys', value: '0', description: 'programmés', icon: GraduationCap, color: 'from-purple-600 to-purple-700', change: '' },
    { title: 'Paiements', value: '0', description: 'FCFA collectés', icon: CreditCard, color: 'from-orange-600 to-orange-700', change: '' },
  ];

  interface DashboardStats { users: number; memoires: number; jurys: number; montant: number; }
  const { data: statsData } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  const stats = React.useMemo(() => {
    if (!statsData) return fallbackStats;
    return [
      { title: 'Utilisateurs', value: statsData.users.toString(), description: 'utilisateurs', icon: Users, color: 'from-blue-600 to-blue-700', change: '' },
      { title: 'Mémoires', value: statsData.memoires.toString(), description: 'mémoires', icon: BookOpen, color: 'from-green-600 to-green-700', change: '' },
      { title: 'Jurys', value: statsData.jurys.toString(), description: 'jurys', icon: GraduationCap, color: 'from-purple-600 to-purple-700', change: '' },
      { title: 'Paiements', value: statsData.montant.toLocaleString('fr-FR').replace(/\s/g, '.'), description: 'FCFA collectés', icon: CreditCard, color: 'from-orange-600 to-orange-700', change: '' },
    ];
  }, [statsData]);

  // Activities
  type Activity = { type: string; message: string; details: string; createdAt?: string; time?: string };
  const { data: activitiesData } = useQuery<Activity[]>({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardApi.getActivities,
  });

  const recentActivities = activitiesData ?? [
    { type: 'info', message: 'Pas d\'activité', details: '', time: '' },
  ];

  // Events
  type EventItem = {
    title: string;
    date: string;
    time: string;
    location: string;
    status: string;
    student?: string;
    description?: string;
  };
  const { data: eventsData } = useQuery<EventItem[]>({
    queryKey: ['dashboard-events'],
    queryFn: dashboardApi.getEvents,
  });

  const upcomingEvents = eventsData ?? [];

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
            <p className="text-gray-600 mt-1">Supervision générale de la plateforme</p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      <p className="text-xs text-green-600 font-medium mt-2">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>
                Dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'payment' ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{activity.message}</h4>
                        <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-600" />
                Événements à Venir
              </CardTitle>
              <CardDescription>
                Prochains événements programmés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge className={`text-xs ${
                        event.status === 'Confirmé' ? 'bg-green-100 text-green-800' :
                        event.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{event.student || event.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{event.date} à {event.time}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
