import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  PieChart,
  LineChart,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Download
} from 'lucide-react';

const Statistics = () => {
  // Données fictives pour les statistiques
  const stats = [
    {
      title: "Étudiants Actifs",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Mémoires en Cours",
      value: "85",
      change: "+5%",
      icon: BookOpen,
      color: "from-green-600 to-green-700"
    },
    {
      title: "Soutenances Planifiées",
      value: "24",
      change: "+8%",
      icon: GraduationCap,
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Revenus Mensuels",
      value: "2.4M FCFA",
      change: "+15%",
      icon: CreditCard,
      color: "from-orange-600 to-orange-700"
    }
  ];

  const performanceData = [
    { label: "Excellente", value: 25, color: "bg-green-500" },
    { label: "Bonne", value: 45, color: "bg-blue-500" },
    { label: "Moyenne", value: 20, color: "bg-yellow-500" },
    { label: "Insuffisante", value: 10, color: "bg-red-500" }
  ];

  const recentSoutenances = [
    {
      etudiant: "Aminata Diallo",
      note: "18/20",
      date: "2024-03-15",
      mention: "Excellent",
      status: "success"
    },
    {
      etudiant: "Moussa Sy",
      note: "16/20",
      date: "2024-03-14",
      mention: "Très Bien",
      status: "success"
    },
    {
      etudiant: "Fatou Ndiaye",
      note: "15/20",
      date: "2024-03-13",
      mention: "Bien",
      status: "success"
    }
  ];

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
            <p className="text-gray-600 mt-1">Aperçu des performances et des indicateurs clés</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Download className="mr-2 h-4 w-4" />
            Exporter le Rapport
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-green-600 font-medium mt-2">{stat.change} ce mois</p>
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
          {/* Graphique des Performances */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-blue-600" />
                Distribution des Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dernières Soutenances */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
                Dernières Soutenances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSoutenances.map((soutenance, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{soutenance.etudiant}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{soutenance.note}</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {soutenance.mention}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(soutenance.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tendances */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-green-600" />
              Tendances Mensuelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Taux de Réussite</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">92%</p>
                <p className="text-xs text-gray-500 mt-1">+5% par rapport au mois dernier</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Moyenne Générale</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">15.8/20</p>
                <p className="text-xs text-gray-500 mt-1">+0.3 points ce mois</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Délai Moyen</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">4.5 mois</p>
                <p className="text-xs text-gray-500 mt-1">-0.5 mois d'amélioration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
