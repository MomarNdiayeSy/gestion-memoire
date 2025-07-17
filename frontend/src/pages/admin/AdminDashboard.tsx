import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, CreditCard, ChartBar, Clock, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Utilisateurs",
      value: "156",
      description: "utilisateurs actifs",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      change: "+12% ce mois"
    },
    {
      title: "Mémoires",
      value: "85",
      description: "en cours",
      icon: BookOpen,
      color: "from-green-600 to-green-700",
      change: "+5% ce mois"
    },
    {
      title: "Jurys",
      value: "24",
      description: "programmés",
      icon: GraduationCap,
      color: "from-purple-600 to-purple-700",
      change: "+8% ce mois"
    },
    {
      title: "Paiements",
      value: "2.4M",
      description: "FCFA collectés",
      icon: CreditCard,
      color: "from-orange-600 to-orange-700",
      change: "+15% ce mois"
    }
  ];

  const recentActivities = [
    {
      type: "user",
      message: "Nouvel encadreur ajouté",
      details: "Dr. Ahmed Ben Ali - Département Informatique",
      time: "Il y a 2h"
    },
    {
      type: "payment",
      message: "Paiement reçu",
      details: "50,000 FCFA - Frais de soutenance",
      time: "Il y a 3h"
    },
    {
      type: "jury",
      message: "Nouveau jury programmé",
      details: "Salle A104 - 15 Mars 2024",
      time: "Il y a 5h"
    }
  ];

  const upcomingEvents = [
    {
      title: "Soutenance de Mémoire",
      student: "Amine Trabelsi",
      date: "15 Mars 2024",
      time: "09:00",
      location: "Salle A104",
      status: "Confirmé"
    },
    {
      title: "Réunion du Comité",
      description: "Validation des sujets",
      date: "16 Mars 2024",
      time: "14:00",
      location: "Salle de Conférence",
      status: "En attente"
    },
    {
      title: "Délibération",
      description: "Session Février 2024",
      date: "18 Mars 2024",
      time: "10:00",
      location: "Salle du Conseil",
      status: "Planifié"
    }
  ];

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
            <p className="text-gray-600 mt-1">Supervision générale de la plateforme</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
            <ChartBar className="mr-2 h-4 w-4" />
            Rapport Mensuel
          </Button>
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
