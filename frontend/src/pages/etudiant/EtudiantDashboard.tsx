import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, AlertCircle, Upload } from 'lucide-react';
import SessionCard from '@/components/SessionCard';

import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoireApi, sessionApi, notificationApi } from '@/services/api';

const EtudiantDashboard = () => {
  const navigate = useNavigate();
  // Queries
  const { data: memoire, isFetching: loadingMemoire } = useQuery<any | null>({
    queryKey: ['my-memoire'],
    queryFn: () => memoireApi.getMy(),
  });

  const queryClient = useQueryClient();

  // mutation visa
  const visaMutation = useMutation({
    mutationFn: (id: string) => sessionApi.visa(id, 'ETUDIANT'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  // handlers
  const handleVisa = (id: string) => visaMutation.mutate(id);

  const handleJoinSession = (session: any) => {
    if (session.type === 'VIRTUEL' && session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  const { data: sessions = [], isFetching: loadingSessions } = useQuery<any[]>({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.getAll(),
  });

  const getProgress = (m: any): number => {
    if (m?.progression && m.progression > 0) return m.progression;
    switch (m?.status) {
      case 'EN_COURS': return 25;
      case 'SOUMIS': return 50;
      case 'SOUMIS_FINAL': return 75;
      case 'VALIDE_ENCADREUR': return 85;
      case 'EN_REVISION': return 75;
      case 'SOUTENU':
      case 'VALIDE':
      case 'VALIDE_ADMIN':
        return 100;
      default:
        return 0;
    }
  };

  const upcoming = sessions
    .slice()
    .filter((s: any) => new Date(s.date) > new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const currentMemoir = memoire ? {
    title: memoire.titre,
    encadreur: `${memoire.encadreur?.prenom ?? ''} ${memoire.encadreur?.nom ?? ''}`.trim(),
    progress: getProgress(memoire),
    nextSession: upcoming ? `${new Date(upcoming.date).toLocaleDateString()}${upcoming.heure ? ' à ' + upcoming.heure : ''}` : 'Aucune session à venir',
  } : null;

  const recentSessions: any[] = sessions
    .slice()
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  // --- Notifications ---
  const { data: notifications = [], isFetching: loadingNotifs } = useQuery<any[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleRead = (id: string) => markReadMutation.mutate(id);

  const recentNotifs = notifications
    .slice()
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loadingMemoire || loadingSessions || loadingNotifs || !currentMemoir) {
    return (
      <DashboardLayout allowedRoles={['ETUDIANT']}>
        <div className="p-8 text-center">Chargement...</div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Étudiant</h1>
            <p className="text-gray-600 mt-1">Suivez l'avancement de votre mémoire</p>
          </div>
          <Button
            onClick={() => navigate('/etudiant/memoire')}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
            <Upload className="mr-2 h-4 w-4" />
            Déposer un document
          </Button>
        </div>

        {/* Current Memoir Overview */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-violet-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Mon Mémoire Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentMemoir.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Encadreur:</span> {currentMemoir.encadreur}</p>
                  <p><span className="font-medium">Prochaine séance:</span> {currentMemoir.nextSession}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression globale</span>
                  <span className="text-sm font-bold text-blue-600">{currentMemoir.progress}%</span>
                </div>
                <Progress value={currentMemoir.progress} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  Séances d'Encadrement Récentes
                </CardTitle>
                <CardDescription>
                  Historique de vos dernières séances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentSessions.map((session:any) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      role="ETUDIANT"
                      onJoin={handleJoinSession}
                      onVisa={handleVisa}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifs.map((notif:any) => (
                  <div key={notif.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div onClick={() => handleRead(notif.id)} className={`cursor-pointer w-2 h-2 rounded-full mt-2 ${
                        notif.type === 'warning' ? 'bg-orange-500' :
                        notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{notif.title || notif.titre}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message || notif.contenu}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                      </div>
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

export default EtudiantDashboard;