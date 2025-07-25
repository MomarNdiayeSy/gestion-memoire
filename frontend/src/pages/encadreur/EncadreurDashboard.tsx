import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sujetApi, memoireApi, sessionApi } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText, Plus, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from '../../components/layout/DashboardLayout';

const EncadreurDashboard = () => {
  /* --- Queries --- */
  const sujetsQuery = useQuery({ queryKey: ['sujets'], queryFn: () => sujetApi.getAll() });
  const memoiresQuery = useQuery({ queryKey: ['memoires'], queryFn: () => memoireApi.getAll?.({}) ?? Promise.resolve([]) });
  const sessionsQuery = useQuery({ queryKey: ['sessions'], queryFn: () => sessionApi.getAll() });

  const sujets = sujetsQuery.data || [];
  const memoires = memoiresQuery.data || [];
  const sessions = sessionsQuery.data || [];

  const upcomingSessionsAll = sessions.filter((s: any) => ['PLANIFIE', 'PLANIFIEE'].includes(s.status));

  /* --- Derived data --- */
  const studentsSet = new Set<string>();
  memoires.forEach((m: any) => {
    if (m.etudiant) studentsSet.add(`${m.etudiant.prenom} ${m.etudiant.nom}`);
  });

  const stats = [
    {
      title: 'Mes Sujets',
      value: sujets.length.toString(),
      description: 'sujets proposés',
      icon: BookOpen,
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Étudiants',
      value: studentsSet.size.toString(),
      description: 'en encadrement',
      icon: Users,
      color: 'from-green-600 to-green-700',
    },
    {
      title: 'Séances',
      value: upcomingSessionsAll.length.toString(),
      description: 'à venir',
      icon: Calendar,
      color: 'from-purple-600 to-purple-700',
    },
    {
      title: 'Mémoires',
      value: memoires.length.toString(),
      description: 'attribués',
      icon: FileText,
      color: 'from-orange-600 to-orange-700',
    },
  ];

  // Utilitaire pour la progression par défaut
  function getDefaultProgression(status: string): number {
    const progressMap: Record<string, number> = {
      EN_COURS: 25,
      SOUMIS: 50,
      EN_REVISION: 75,
      VALIDE: 100,
      SOUTENU: 100,
      REJETE: 0,
    };
    return progressMap[status] ?? 25;
  }

  /* My Students list */
  const myStudents = memoires.map((m: any) => ({
    name: `${m.etudiant?.prenom || ''} ${m.etudiant?.nom || ''}`.trim(),
    subject: m.titre || m.sujet?.titre || '',
    progress: (m.progression === 0 && ['VALIDE','SOUTENU'].includes(m.status)) ? 100 : (m.progression ?? getDefaultProgression(m.status)),
    status: m.status || 'En cours',
  }));

  /* Upcoming sessions list */
  const upcomingSessions = upcomingSessionsAll
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((s: any) => ({
      numero: s.numero,
      student: (s.etudiants || []).join(', '),
      date: new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      time: new Date(s.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: s.type,
       salle: s.salle,
    }));

  /* Recent subjects */
  const recentSubjects = sujets.slice(0, 6).map((s: any) => ({
    title: s.titre,
    status: s.status === 'VALIDE' ? 'Validé' : 'En attente',
    students: s.memoires?.length || 0,
  }));




  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Encadreur</h1>
            <p className="text-gray-600 mt-1">Gérez vos étudiants et sujets de mémoire</p>
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
                      <h4 className="font-medium text-gray-900">Séance {session.numero}</h4>
                      <p className="text-sm text-gray-600">{session.date} à {session.time}</p>
                      {session.type === 'PRESENTIEL' && (
                        <p className="text-xs text-gray-500">Salle: {session.salle || 'Non renseignée'}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 text-xs mb-2">
                        {session.type}
                      </Badge>
                      <br />
                      <Link to={`/encadreur/sessions?numero=${session.numero}`}>
                        <Button size="sm" variant="outline">
                          Détails
                        </Button>
                      </Link>
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
