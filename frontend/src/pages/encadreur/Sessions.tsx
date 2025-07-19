import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Plus, CheckCircle, Edit, Eye, Users, XCircle, Filter, MoreVertical, Search } from 'lucide-react';
import { sessionApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Session {
  id: string;
  titre: string;
  date: string;
  heure: string;
  duree: number; // Changé de string à number
  type: 'PRESENTIEL' | 'VIRTUEL';
  statut: 'PLANIFIEE' | 'EN_COURS' | 'EFFECTUEE' | 'ANNULEE'; // Workflow complet
  etudiants: string[];
  lien?: string;
  salle?: string;
  rapport?: string; // Ajouté
  remarques?: string; // Ajouté
}

const Sessions = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionApi.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, data: {
    status: 'PLANIFIEE' | 'EN_COURS' | 'EFFECTUEE' | 'ANNULEE';
    rapport?: string;
    remarques?: string;
  }) => {
    try {
      await sessionApi.update(id, data);
      toast({
        title: "Succès",
        description: "Session mise à jour avec succès",
      });
      loadSessions();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la session",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'PLANIFIEE': 'bg-blue-100 text-blue-800',
      'EFFECTUEE': 'bg-green-100 text-green-800',
      'ANNULEE': 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANIFIEE': return <Calendar className="h-4 w-4" />;
      case 'EFFECTUEE': return <CheckCircle className="h-4 w-4" />;
      case 'ANNULEE': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusCount = (status: string) => {
    return sessions.filter(s => s.statut === status).length;
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

  const formatDuree = (duree: number) => {
    const hours = Math.floor(duree / 60);
    const minutes = duree % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const handleCreateSession = () => {
    toast({
      title: "Nouvelle session",
      description: "Formulaire de création de session ouvert",
    });
  };

  const handleJoinSession = (session: Session) => {
    if (session.type === 'VIRTUEL' && session.lien) {
      window.open(session.lien, '_blank');
    } else {
      toast({
        title: "Information salle",
        description: `La session se déroule en ${session.salle}`,
      });
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast({
        title: "Session supprimée",
        description: "La session a été supprimée avec succès",
      });
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.etudiants.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || session.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    return type === 'VIRTUEL' 
      ? "bg-purple-100 text-purple-800"
      : "bg-orange-100 text-orange-800";
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
          <Button 
            onClick={handleCreateSession}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Session
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions à venir</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {sessions.filter(s => s.statut === 'PLANIFIEE').length}
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
                    {sessions.filter(s => s.statut === 'EN_COURS').length}
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
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    Tous les types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('VIRTUEL')}>
                    Virtuel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('PRESENTIEL')}>
                    Présentiel
                  </DropdownMenuItem>
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
                <CardDescription>
                  Cliquez sur une session pour voir les détails
                </CardDescription>
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
                          selectedSession?.id === session.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {session.titre}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {session.etudiants.join(', ')}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(session.statut)}>
                            {session.statut}
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-purple-600" />
                Détails de la Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSession ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedSession.titre}
                    </h4>
                    <div className="text-sm space-y-2">
                      <div><span className="text-gray-500">Étudiants:</span> {selectedSession.etudiants.join(', ')}</div>
                      <div><span className="text-gray-500">Date:</span> {formatDate(selectedSession.date)}</div>
                      <div><span className="text-gray-500">Durée:</span> {formatDuree(selectedSession.duree)}</div>
                      <div><span className="text-gray-500">Type:</span> {selectedSession.type}</div>
                    </div>
                  </div>

                  {selectedSession.statut === 'EFFECTUEE' && (
                    <>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Rapport</h5>
                        <p className="text-sm text-gray-600">{selectedSession.rapport || 'Aucun rapport'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Remarques</h5>
                        <p className="text-sm text-gray-600">{selectedSession.remarques || 'Aucune remarque'}</p>
                      </div>
                    </>
                  )}

                  {selectedSession.statut === 'PLANIFIEE' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleStatusUpdate(selectedSession.id, { 
                          status: 'EN_COURS'
                        })}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Commencer
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedSession.id, { 
                          status: 'ANNULEE'
                        })}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  )}

                  {selectedSession.statut === 'EN_COURS' && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Rapport de la session..."
                        className="min-h-[100px]"
                        value={selectedSession.rapport || ''}
                        onChange={(e) => setSelectedSession({
                          ...selectedSession,
                          rapport: e.target.value
                        })}
                      />
                      <Textarea
                        placeholder="Remarques et observations..."
                        className="min-h-[100px]"
                        value={selectedSession.remarques || ''}
                        onChange={(e) => setSelectedSession({
                          ...selectedSession,
                          remarques: e.target.value
                        })}
                      />
                      <Button 
                        onClick={() => handleStatusUpdate(selectedSession.id, {
                          status: 'EFFECTUEE',
                          rapport: selectedSession.rapport,
                          remarques: selectedSession.remarques
                        })}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Terminer la session
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Sélectionnez une session pour voir les détails
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sessions;
