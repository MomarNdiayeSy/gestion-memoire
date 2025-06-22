
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FileText, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Utilisateurs",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Sujets Proposés",
      value: "48",
      change: "+5%",
      icon: BookOpen,
      color: "from-green-600 to-green-700"
    },
    {
      title: "Mémoires Déposés",
      value: "23",
      change: "+18%",
      icon: FileText,
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Paiements Validés",
      value: "€12,450",
      change: "+8%",
      icon: CreditCard,
      color: "from-orange-600 to-orange-700"
    }
  ];

  const recentActivities = [
    { action: "Nouveau mémoire déposé", user: "Marie Dupont", time: "Il y a 2h", status: "pending" },
    { action: "Paiement validé", user: "Jean Martin", time: "Il y a 4h", status: "success" },
    { action: "Sujet proposé", user: "Dr. Ahmed Ben Ali", time: "Il y a 6h", status: "info" },
    { action: "Jury assigné", user: "Sarah Belgacem", time: "Il y a 1j", status: "success" },
  ];

  const pendingValidations = [
    { type: "Sujet", title: "Intelligence Artificielle et Blockchain", author: "Dr. Karim Nasri" },
    { type: "Mémoire", title: "Développement d'une app mobile", author: "Amine Trabelsi" },
    { type: "Paiement", title: "Frais de soutenance", author: "Fatma Zahra" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          Rapport complet
        </Button>
      </div>

      {/* Stats Cards */}
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
                    <div className="flex items-center mt-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">vs mois dernier</span>
                    </div>
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
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Activités Récentes
            </CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">par {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Validations */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="mr-2 bg-orange-100 text-orange-800">3</Badge>
              Validations en Attente
            </CardTitle>
            <CardDescription>
              Éléments nécessitant votre validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingValidations.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        item.type === 'Sujet' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'Mémoire' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.type}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">par {item.author}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    Valider
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
