import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText, Plus, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from '../../components/layout/DashboardLayout';

const EncadreurDashboard = () => {
  const stats = [
    {
      title: "Mes Sujets",
      value: "8",
      description: "sujets proposés",
      icon: BookOpen,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Étudiants",
      value: "12",
      description: "en encadrement",
      icon: Users,
      color: "from-green-600 to-green-700"
    },
    {
      title: "Séances",
      value: "45",
      description: "cette semaine",
      icon: Calendar,
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Mémoires",
      value: "6",
      description: "à évaluer",
      icon: FileText,
      color: "from-orange-600 to-orange-700"
    }
  ];

  const myStudents = [
    { name: "Amine Trabelsi", subject: "IA et Machine Learning", progress: 75, status: "En cours" },
    { name: "Fatma Zahra", subject: "Développement Mobile", progress: 90, status: "Soutenance" },
    { name: "Mohamed Salah", subject: "Cybersécurité", progress: 45, status: "En cours" },
    { name: "Leila Ben Ali", subject: "Big Data Analytics", progress: 60, status: "En cours" },
  ];

  const upcomingSessions = [
    { student: "Amine Trabelsi", date: "Aujourd'hui", time: "14:00", type: "Suivi" },
    { student: "Fatma Zahra", date: "Demain", time: "10:30", type: "Validation" },
    { student: "Mohamed Salah", date: "Vendredi", time: "16:00", type: "Révision" },
  ];

  const recentSubjects = [
    { title: "Intelligence Artificielle et IoT", status: "Validé", students: 3 },
    { title: "Blockchain et Cryptomonnaies", status: "En attente", students: 0 },
    { title: "Réalité Virtuelle et Gaming", status: "Validé", students: 2 },
  ];

  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Encadreur</h1>
            <p className="text-gray-600 mt-1">Gérez vos étudiants et sujets de mémoire</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Sujet
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
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
          {/* My Students */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Mes Étudiants
              </CardTitle>
              <CardDescription>
                Suivi de l'avancement des mémoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myStudents.map((student, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <Badge className={`text-xs ${
                        student.status === 'Soutenance' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{student.subject}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{student.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-600" />
                Séances Programmées
              </CardTitle>
              <CardDescription>
                Prochains rendez-vous avec vos étudiants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">{session.student}</h4>
                      <p className="text-sm text-gray-600">{session.date} à {session.time}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 text-xs mb-2">
                        {session.type}
                      </Badge>
                      <br />
                      <Button size="sm" variant="outline">
                        Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Subjects */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
              Mes Sujets Récents
            </CardTitle>
            <CardDescription>
              Sujets proposés et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentSubjects.map((subject, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{subject.title}</h4>
                    <Badge className={`text-xs ${
                      subject.status === 'Validé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subject.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {subject.students} étudiant(s) intéressé(s)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EncadreurDashboard;
