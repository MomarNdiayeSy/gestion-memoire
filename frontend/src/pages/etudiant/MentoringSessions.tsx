import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Filter,
  MoreVertical,
  Plus,
  Search,
  User,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Session {
  id: string;
  titre: string;
  date: string;
  heure: string;
  duree: string;
  type: 'PRESENTIEL' | 'VIRTUEL';
  statut: 'A_VENIR' | 'EN_COURS' | 'TERMINEE';
  encadreur: {
    nom: string;
    prenom: string;
  };
  lien?: string;
  salle?: string;
}

const MentoringSessions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);

  // Données fictives pour les sessions
  const [sessions] = React.useState<Session[]>([
    {
      id: '1',
      titre: 'Revue de la méthodologie',
      date: '2024-03-20',
      heure: '10:00',
      duree: '1h30',
      type: 'VIRTUEL',
      statut: 'A_VENIR',
      encadreur: {
        nom: 'Diop',
        prenom: 'Abdoulaye'
      },
      lien: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      titre: 'Présentation des résultats',
      date: '2024-03-18',
      heure: '14:30',
      duree: '2h00',
      type: 'PRESENTIEL',
      statut: 'TERMINEE',
      encadreur: {
        nom: 'Diop',
        prenom: 'Abdoulaye'
      },
      salle: 'Salle 2.01'
    },
    {
      id: '3',
      titre: 'Point d\'avancement',
      date: '2024-03-19',
      heure: '09:00',
      duree: '1h00',
      type: 'VIRTUEL',
      statut: 'EN_COURS',
      encadreur: {
        nom: 'Diop',
        prenom: 'Abdoulaye'
      },
      lien: 'https://meet.google.com/xyz-uvw-rst'
    }
  ]);

  const handleRequestSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de session a été envoyée à l'encadreur",
    });
    setIsRequestDialogOpen(false);
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

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || session.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERMINEE':
        return "bg-gray-100 text-gray-800";
      case 'EN_COURS':
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'VIRTUEL' 
      ? "bg-purple-100 text-purple-800"
      : "bg-orange-100 text-orange-800";
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
                  <label className="text-sm font-medium" htmlFor="titre">
                    Titre
                  </label>
                  <Input
                    id="titre"
                    name="titre"
                    placeholder="Titre de la session"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="date">
                    Date souhaitée
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="heure">
                    Heure souhaitée
                  </label>
                  <Input
                    id="heure"
                    name="heure"
                    type="time"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="type">
                    Type de session
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="VIRTUEL">Virtuelle</option>
                    <option value="PRESENTIEL">Présentielle</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Envoyer la demande
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions à venir</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {sessions.filter(s => s.statut === 'A_VENIR').length}
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
                  <p className="text-sm font-medium text-gray-600">Sessions terminées</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {sessions.filter(s => s.statut === 'TERMINEE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Heures de mentorat</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {sessions.reduce((acc, s) => acc + parseInt(s.duree), 0)}h
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
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
                  placeholder="Rechercher par titre..."
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

        {/* Sessions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{session.titre}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleJoinSession(session)}>
                        Rejoindre
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadge(session.statut)}>
                      {session.statut}
                    </Badge>
                    <Badge className={getTypeBadge(session.type)}>
                      {session.type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.heure} ({session.duree})
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {session.encadreur.prenom} {session.encadreur.nom}
                    </div>
                    {session.type === 'PRESENTIEL' && (
                      <div className="text-sm text-gray-600">
                        📍 {session.salle}
                      </div>
                    )}
                  </div>

                  {session.statut !== 'TERMINEE' && (
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => handleJoinSession(session)}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Rejoindre la session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
