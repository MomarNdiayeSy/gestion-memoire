import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Plus, CheckCircle, Eye, Users, XCircle, Filter, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sessionApi } from '@/services/api';
import { useAuth } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Session {
  id: string;
  numero: number;
  memoireTitre: string;
  date: string;
  heure: string;
  duree: number;
  type: 'PRESENTIEL' | 'VIRTUEL';
  statut: 'PLANIFIE' | 'PLANIFIEE' | 'TERMINE' | 'ANNULEE' | 'EN_COURS' | 'EFFECTUEE';
  etudiants: string[];
  visaEncadreur: boolean;
  visaEtudiant: boolean;
  meetingLink?: string;
  salle?: string;
  rapport?: string;
  remarques?: string;
}

const Sessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const [newSession, setNewSession] = useState<{ duree: number; type: 'PRESENTIEL' | 'VIRTUEL'; date: string; meetingLink: string; salle: string }>({
    duree: 60,
    type: 'PRESENTIEL',
    date: '',
    meetingLink: '',
    salle: ''
  });

  const { data: sessions = [], isLoading: loading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.getAll()
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: 'PLANIFIEE' | 'EN_COURS' | 'EFFECTUEE' | 'ANNULEE'; rapport?: string; remarques?: string } }) =>
      sessionApi.update(id, data),
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Session mise à jour avec succès' });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Erreur lors de la mise à jour de la session', variant: 'destructive' });
    }
  });

  const createSessionMutation = useMutation({
    mutationFn: () =>
      sessionApi.create({
        duree: newSession.duree,
        type: newSession.type,
        date: newSession.date,
        meetingLink: newSession.type === 'VIRTUEL' ? newSession.meetingLink : undefined,
        salle: newSession.type === 'PRESENTIEL' ? newSession.salle : undefined
      }),
    onSuccess: () => {
      toast({ title: 'Session créée' });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setShowAddForm(false);
      setNewSession({ duree: 60, type: 'PRESENTIEL', date: '', meetingLink: '', salle: '' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Création impossible', variant: 'destructive' });
    }
  });

  const visaMutation = useMutation({
    mutationFn: (id: string) => sessionApi.visa(id, user?.role as 'ENCADREUR' | 'ETUDIANT'),
    onSuccess: () => {
      toast({ title: 'Visa signé' });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Erreur lors de la signature du visa', variant: 'destructive' });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => sessionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({ title: 'Session supprimée', description: 'La session a été supprimée avec succès' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression', variant: 'destructive' });
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [editData, setEditData] = useState<{ rapport: string; remarques: string }>({ rapport: '', remarques: '' });

  const handleStatusUpdate = (id: string, data: { status: 'PLANIFIEE' | 'EN_COURS' | 'EFFECTUEE' | 'ANNULEE'; rapport?: string; remarques?: string }) => {
    updateStatusMutation.mutate({ id, data });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PLANIFIEE: 'bg-blue-100 text-blue-800',
      PLANIFIE: 'bg-blue-100 text-blue-800',
      EN_COURS: 'bg-yellow-100 text-yellow-800',
      TERMINE: 'bg-green-100 text-green-800',
      EFFECTUEE: 'bg-green-100 text-green-800',
      ANNULEE: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000); // update every minute
    return () => clearInterval(id);
  }, []);

  const getTimeRemaining = (dateStr: string) => {
    const diffMs = new Date(dateStr).getTime() - now;
    if (diffMs <= 0) return 'Imminent';
    const diffMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMinutes / 1440);
    const hours = Math.floor((diffMinutes % 1440) / 60);
    const minutes = diffMinutes % 60;
    const parts: string[] = [];
    if (days) parts.push(`${days}j`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.join(' ');
  };

  const formatDuree = (duree: number) => {
    const hours = Math.floor(duree / 60);
    const minutes = duree % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const handleVisa = (sessionId: string) => {
    visaMutation.mutate(sessionId);
  };

  const getSessionStatus = (s: any) => (s.statut ?? s.status ?? '') as string;

  const filteredSessions = sessions.filter(session => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      lowerSearch === ''
        ? true
        : (session.memoireTitre?.toLowerCase().includes(lowerSearch) ?? false) ||
          (session.etudiants?.some(e => e?.toLowerCase().includes(lowerSearch)) ?? false);

    const matchesType = filterType === 'all' || session.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    return type === 'VIRTUEL' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sessions d'Encadrement</h1>
            <p className="text-gray-600 mt-1">Gérez vos sessions avec les étudiants</p>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button
                disabled={sessions.length >= 10}
                title={sessions.length >= 10 ? 'Limite de 10 séances atteinte' : ''}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={newSession.duree}
                  onChange={(e) => setNewSession({ ...newSession, duree: Number(e.target.value) })}
                />
                <Input
                  type="datetime-local"
                  placeholder="Date et heure"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
                <select
                  className="w-full border px-3 py-2 rounded-md"
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value as 'PRESENTIEL' | 'VIRTUEL' })}
                >
                  <option value="PRESENTIEL">Présentiel</option>
                  <option value="VIRTUEL">Virtuel</option>
                </select>
                {newSession.type === 'PRESENTIEL' && (
                  <Input
                    type="text"
                    placeholder="Salle (ex: B12)"
                    value={newSession.salle}
                    onChange={(e) => setNewSession({ ...newSession, salle: e.target.value })}
                  />
                )}
                {newSession.type === 'VIRTUEL' && (
                  <Input
                    type="url"
                    placeholder="Lien Google Meet ou Zoom"
                    value={newSession.meetingLink}
                    onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                  />
                )}
                <Button onClick={() => createSessionMutation.mutate()} disabled={createSessionMutation.isPending}>
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions à venir</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {sessions.filter(s => getSessionStatus(s) === 'PLANIFIEE' || getSessionStatus(s) === 'PLANIFIE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions en cours</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {sessions.filter(s => getSessionStatus(s) === 'EN_COURS').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions effectuées</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {sessions.filter(s => getSessionStatus(s) === 'TERMINE' || getSessionStatus(s) === 'EFFECTUEE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Étudiants suivis</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {new Set(sessions.flatMap(s => s.etudiants)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Rechercher par titre ou étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer par type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterType('all')}>Tous les types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('VIRTUEL')}>Virtuel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('PRESENTIEL')}>Présentiel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Liste des Sessions</CardTitle>
                <CardDescription>Cliquez sur une session pour voir les détails</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Chargement des sessions...</p>
                ) : (
                  <div className="space-y-4">
                    {filteredSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSession?.id === session.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Séance {session.numero}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {(session.etudiants ?? []).join(', ')}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(getSessionStatus(session))}>
                            {getSessionStatus(session)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <span className="ml-2 font-medium">{formatDate(session.date)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Durée:</span>
                            <span className="ml-2 font-medium">{formatDuree(session.duree)}</span>
                          </div>
                          {session.type === 'PRESENTIEL' && (
                            <div>
                              <span className="text-gray-500">Salle:</span>
                              <span className="ml-2 font-medium">{session.salle || 'Salle non renseignée'}</span>
                            </div>
                          )}
                          {session.meetingLink && getSessionStatus(session) !== 'ANNULEE' && (
                            <div className="flex items-center col-span-2">
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(session.meetingLink, '_blank');
                                }}
                              >
                                Rejoindre
                              </Button>
                            </div>
                          )}
                          <div className="col-span-2 flex items-center space-x-2">
                            <span className="text-gray-500">Visas:</span>
                            {session.visaEncadreur ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">Encadreur</span>
                            {session.visaEtudiant ? (
                              <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 ml-2" />
                            )}
                            <span className="text-sm">Étudiant</span>
                            {(getSessionStatus(session) === 'PLANIFIE' || getSessionStatus(session) === 'PLANIFIEE') && (
                              <span className="text-xs text-gray-500 ml-2">Débute dans {getTimeRemaining(session.date)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <Card className="border-0 shadow-lg max-h-[80vh] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-purple-600" />
                Détails de la Session
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              {selectedSession ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Séance {selectedSession.numero}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {(selectedSession.etudiants ?? []).join(', ')}
                    </p>
                  </div>
                  <Badge className={getStatusBadge(getSessionStatus(selectedSession))}>
                    {getSessionStatus(selectedSession)}
                  </Badge>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Rapport</h5>
                    <p className="text-sm text-gray-600">
                      {selectedSession.rapport || 'Aucun rapport'}
                    </p>
                  </div>
                  {selectedSession.type === 'PRESENTIEL' && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Salle</h5>
                      <p className="text-sm text-gray-600">{selectedSession.salle || 'Non renseignée'}</p>
                    </div>
                  )}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Remarques</h5>
                    <p className="text-sm text-gray-600">
                      {selectedSession.remarques || 'Aucune remarque'}
                    </p>
                    {(getSessionStatus(selectedSession) === 'PLANIFIE' || getSessionStatus(selectedSession) === 'PLANIFIEE') && (
                      <p className="text-sm text-gray-600">Débute dans {getTimeRemaining(selectedSession.date)}</p>
                    )}
                  </div>

                  {selectedSession.meetingLink && (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => window.open(selectedSession.meetingLink, '_blank')}
                    >
                      Rejoindre la session
                    </Button>
                  )}

                  {/* Edition rapport/remarques (tant que la session n'est pas EFFECTUEE) */}
                  {getSessionStatus(selectedSession) !== 'EFFECTUEE' && getSessionStatus(selectedSession) !== 'ANNULEE' && (!selectedSession.rapport || !selectedSession.remarques) && (
                    <div className="space-y-4 border-t pt-4">
                      <Textarea
                        placeholder="Rapport de la séance"
                        value={editData.rapport}
                        onChange={(e) => setEditData({ ...editData, rapport: e.target.value })}
                      />
                      <Textarea
                        placeholder="Remarques"
                        value={editData.remarques}
                        onChange={(e) => setEditData({ ...editData, remarques: e.target.value })}
                      />
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        {getSessionStatus(selectedSession) === 'PLANIFIEE' && (
                          <Button
                            onClick={() => handleStatusUpdate(selectedSession.id, { status: 'EN_COURS' })}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Commencer
                          </Button>
                        )}
                        <Button
                          onClick={() =>
                            handleStatusUpdate(selectedSession.id, {
                              status: 'EFFECTUEE',
                              rapport: editData.rapport,
                              remarques: editData.remarques,
                            })
                          }
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Valider la séance
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusUpdate(selectedSession.id, { status: 'ANNULEE' })}
                          className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Bouton Visa */}
                  {!selectedSession.visaEncadreur && getSessionStatus(selectedSession) !== 'ANNULEE' && user?.role === 'ENCADREUR' && (
                    <Button
                      onClick={() => handleVisa(selectedSession.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Signer le visa
                    </Button>
                  )}
                  {!selectedSession.visaEtudiant && getSessionStatus(selectedSession) !== 'ANNULEE' && user?.role === 'ETUDIANT' && (
                    <Button
                      onClick={() => handleVisa(selectedSession.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Signer le visa
                    </Button>
                  )}
                </div>
              ) : (
                <p>Sélectionnez une session pour voir les détails</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sessions;