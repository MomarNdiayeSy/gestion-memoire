import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Filter,
  Plus,
  Search,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/services/api';
import { Session, SessionRequest } from "@/lib/session";
import { MessageSquare } from 'lucide-react';
import SessionCard from "@/components/SessionCard";

const MentoringSessions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);

  // mutation pour la demande de session
  const requestMutation = useMutation({
    mutationFn: (data: { date: string; heure: string; type: 'PRESENTIEL' | 'VIRTUEL' }) => sessionApi.request(data),
    onSuccess: (created) => {
      // ajout immédiat dans le cache des demandes
      queryClient.setQueryData(['sessionRequests'], (old: any[] | undefined) => old ? [...old, created] : [created]);
      toast({ title: 'Demande envoyée', description: 'Votre encadreur a été notifié' });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setIsRequestDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Échec de l\'envoi', variant: 'destructive' });
    }
  });

  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.getAll(),
  });

  const { data: sessionRequests = [] } = useQuery<any[]>({
    queryKey: ['sessionRequests'],
    queryFn: () => sessionApi.getRequests(),
  });

  const lowerSearch = searchTerm.toLowerCase();
  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      lowerSearch === '' ? true :
        session.numero.toString().includes(lowerSearch) ||
        `${session.encadreur.prenom} ${session.encadreur.nom}`.toLowerCase().includes(lowerSearch);

    const matchesType = filterType === 'all' || session.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleRequestSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement & { date: { value: string }; heure: { value: string }; type: { value: 'PRESENTIEL' | 'VIRTUEL' }; };
    requestMutation.mutate({ date: form.date.value, heure: form.heure.value, type: form.type.value });
  };

  const visaMutation = useMutation({
    mutationFn: (id: string) => sessionApi.visa(id, 'ETUDIANT'),
    onSuccess: () => {
      toast({ title: 'Visa signé' });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Erreur lors de la signature du visa', variant: 'destructive' });
    }
  });

  const handleVisa = (id: string) => {
    visaMutation.mutate(id);
  };

  const handleJoinSession = (session: Session) => {
    if (session.type === 'VIRTUEL' && session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      toast({
        title: "Information salle",
        description: `La session se déroule en ${session.salle}`,
      });
    }
  };

  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sessions de Mentorat</h1>
            <p className="text-gray-600 mt-1">Gérez vos sessions avec votre encadreur</p>
          </div>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Plus className="mr-2 h-4 w-4" />
                Demander une Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demander une nouvelle session</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour demander une session avec votre encadreur
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestSession} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="date">Date souhaitée</label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="heure">Heure souhaitée</label>
                  <Input id="heure" name="heure" type="time" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="type">Type de session</label>
                  <select id="type" name="type" className="w-full rounded-md border border-gray-300 p-2" required>
                    <option value="VIRTUEL">Virtuelle</option>
                    <option value="PRESENTIEL">Présentielle</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={requestMutation.isPending}>
                    Envoyer la demande
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sessions à venir */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessions à venir</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {sessions.filter(s => s.statut === 'PLANIFIE' || s.statut === 'PLANIFIEE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Sessions terminées */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessions terminées</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {sessions.filter(s => s.statut === 'TERMINE' || s.statut === 'EFFECTUEE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Demandes en attente */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demandes de session</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {sessionRequests.filter(r => r.statut === 'EN_ATTENTE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes de session */}
        {sessionRequests.length > 0 ? (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Mes demandes de session</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionRequests.map((req: SessionRequest) => (
                <div key={req.id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{req.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${req.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : req.statut === 'ACCEPTEE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{req.statut.replace('_', ' ')}</span>
                  </div>
                  <p className="text-gray-800 text-sm">Date : {new Date(req.date).toLocaleDateString()} à {req.heure}</p>
                  {req.encadreur && (
                    <p className="text-gray-500 text-sm mt-1">Encadreur : {req.encadreur.prenom} {req.encadreur.nom}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Aucune demande de session pour le moment.</p>
        )}

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Rechercher par numéro ou encadreur..."
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

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              role="ETUDIANT"
              onJoin={handleJoinSession}
              onVisa={handleVisa}
            />
          ))}

          {filteredSessions.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucune session trouvée</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentoringSessions;
