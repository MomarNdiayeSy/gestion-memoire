
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, BookOpen, FileText, CreditCard, TrendingUp, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Statistics = () => {
  const monthlyData = [
    { mois: 'Jan', memoires: 12, sujets: 18, paiements: 11 },
    { mois: 'Fév', memoires: 15, sujets: 22, paiements: 14 },
    { mois: 'Mar', memoires: 8, sujets: 15, paiements: 8 },
    { mois: 'Avr', memoires: 18, sujets: 25, paiements: 17 },
    { mois: 'Mai', memoires: 22, sujets: 30, paiements: 21 },
    { mois: 'Jun', memoires: 16, sujets: 20, paiements: 15 }
  ];

  const specialityData = [
    { name: 'IA & ML', value: 35, color: '#3b82f6' },
    { name: 'Développement Web', value: 28, color: '#10b981' },
    { name: 'Cybersécurité', value: 20, color: '#f59e0b' },
    { name: 'Mobile', value: 12, color: '#ef4444' },
    { name: 'Blockchain', value: 5, color: '#8b5cf6' }
  ];

  const statusData = [
    { name: 'En cours', value: 45, color: '#3b82f6' },
    { name: 'Déposés', value: 25, color: '#f59e0b' },
    { name: 'Validés', value: 20, color: '#10b981' },
    { name: 'Refusés', value: 10, color: '#ef4444' }
  ];

  const progressData = [
    { semaine: 'S1', soutenances: 3 },
    { semaine: 'S2', soutenances: 7 },
    { semaine: 'S3', soutenances: 12 },
    { semaine: 'S4', soutenances: 8 },
    { semaine: 'S5', soutenances: 15 },
    { semaine: 'S6', soutenances: 10 }
  ];

  const stats = [
    {
      title: "Étudiants Actifs",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Sujets Proposés",
      value: "89",
      change: "+8%",
      icon: BookOpen,
      color: "from-green-600 to-green-700"
    },
    {
      title: "Mémoires Déposés",
      value: "67",
      change: "+15%",
      icon: FileText,
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Revenus Générés",
      value: "€16,750",
      change: "+22%",
      icon: CreditCard,
      color: "from-orange-600 to-orange-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-1">Analyse des données de la plateforme</p>
        </div>
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
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
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
        {/* Évolution Mensuelle */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Évolution Mensuelle
            </CardTitle>
            <CardDescription>
              Comparaison des mémoires, sujets et paiements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="memoires" fill="#3b82f6" name="Mémoires" />
                <Bar dataKey="sujets" fill="#10b981" name="Sujets" />
                <Bar dataKey="paiements" fill="#f59e0b" name="Paiements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par Spécialité */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-green-600" />
              Répartition par Spécialité
            </CardTitle>
            <CardDescription>
              Distribution des sujets par domaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {specialityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statut des Mémoires */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-600" />
              Statut des Mémoires
            </CardTitle>
            <CardDescription>
              État d'avancement des mémoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Soutenances par Semaine */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-orange-600" />
              Soutenances Programmées
            </CardTitle>
            <CardDescription>
              Nombre de soutenances par semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="soutenances" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Taux de Réussite</h3>
            <p className="text-3xl font-bold text-blue-600">94.5%</p>
            <p className="text-sm text-gray-600 mt-1">Mémoires validés</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progression Moyenne</h3>
            <p className="text-3xl font-bold text-green-600">78%</p>
            <p className="text-sm text-gray-600 mt-1">Avancement des projets</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Délai Moyen</h3>
            <p className="text-3xl font-bold text-purple-600">5.2</p>
            <p className="text-sm text-gray-600 mt-1">Mois par mémoire</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
