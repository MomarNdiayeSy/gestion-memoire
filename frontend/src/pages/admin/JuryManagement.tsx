import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Edit,
  Filter,
  GraduationCap,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Jury {
  id: string;
  nom: string;
  membres: {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    specialite: string;
  }[];
  soutenance: {
    date: string;
    heure: string;
    salle: string;
    etudiant: string;
    sujet: string;
  };
  statut: 'PLANIFIE' | 'TERMINE' | 'ANNULE';
}

const JuryManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [isJuryDialogOpen, setIsJuryDialogOpen] = React.useState(false);
  const [editingJury, setEditingJury] = React.useState<Jury | null>(null);

  // Données fictives pour les jurys
  const [jurys, setJurys] = React.useState<Jury[]>([
    {
      id: '1',
      nom: 'Jury - Gestion de Mémoires',
      membres: [
        {
          id: '1',
          nom: 'Diop',
          prenom: 'Abdoulaye',
          role: 'PRESIDENT',
          specialite: 'Développement Web'
        },
        {
          id: '2',
          nom: 'Sow',
          prenom: 'Mariama',
          role: 'RAPPORTEUR',
          specialite: 'Intelligence Artificielle'
        },
        {
          id: '3',
          nom: 'Fall',
          prenom: 'Ibrahim',
          role: 'EXAMINATEUR',
          specialite: 'Base de données'
        }
      ],
      soutenance: {
        date: '2024-04-15',
        heure: '10:00',
        salle: 'Amphi A',
        etudiant: 'Aminata Diallo',
        sujet: 'Développement d\'une application de gestion de mémoires'
      },
      statut: 'PLANIFIE'
    },
    {
      id: '2',
      nom: 'Jury - Reconnaissance Faciale',
      membres: [
        {
          id: '4',
          nom: 'Ndiaye',
          prenom: 'Fatou',
          role: 'PRESIDENT',
          specialite: 'Vision par ordinateur'
        },
        {
          id: '5',
          nom: 'Ba',
          prenom: 'Ousmane',
          role: 'RAPPORTEUR',
          specialite: 'Machine Learning'
        },
        {
          id: '6',
          nom: 'Diallo',
          prenom: 'Mamadou',
          role: 'EXAMINATEUR',
          specialite: 'Sécurité informatique'
        }
      ],
      soutenance: {
        date: '2024-04-20',
        heure: '14:30',
        salle: 'Salle de conférence',
        etudiant: 'Moussa Sy',
        sujet: 'Système de reconnaissance faciale pour la sécurité'
      },
      statut: 'PLANIFIE'
    }
  ]);

  const handleCreateJury = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (editingJury) {
      // Logique de modification
      setJurys(jurys.map(j => j.id === editingJury.id ? {
        ...editingJury,
        // Mettre à jour avec les nouvelles valeurs
      } : j));
      toast({
        title: "Jury modifié",
        description: "Le jury a été modifié avec succès",
      });
    } else {
      // Logique de création
      const newJury: Jury = {
        id: (jurys.length + 1).toString(),
        nom: formData.get('nom') as string,
        membres: [],
        soutenance: {
          date: formData.get('date') as string,
          heure: formData.get('heure') as string,
          salle: formData.get('salle') as string,
          etudiant: formData.get('etudiant') as string,
          sujet: formData.get('sujet') as string
        },
        statut: 'PLANIFIE'
      };
      setJurys([...jurys, newJury]);
      toast({
        title: "Jury créé",
        description: "Le nouveau jury a été créé avec succès",
      });
    }
    
    setIsJuryDialogOpen(false);
    setEditingJury(null);
  };

  const handleDeleteJury = (juryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jury ?')) {
      setJurys(jurys.filter(j => j.id !== juryId));
      toast({
        title: "Jury supprimé",
        description: "Le jury a été supprimé avec succès",
      });
    }
  };

  const filteredJurys = jurys.filter(jury => {
    const matchesSearch = 
      jury.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jury.soutenance.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jury.soutenance.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jury.membres.some(m => 
        `${m.prenom} ${m.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = filterStatus === 'all' || jury.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERMINE':
        return "bg-green-100 text-green-800";
      case 'ANNULE':
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Jurys</h1>
            <p className="text-gray-600 mt-1">Gérez les jurys de soutenance</p>
          </div>
          <Dialog open={isJuryDialogOpen} onOpenChange={setIsJuryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Jury
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingJury ? 'Modifier le jury' : 'Créer un nouveau jury'}
                </DialogTitle>
                <DialogDescription>
                  {editingJury 
                    ? 'Modifiez les informations du jury'
                    : 'Remplissez les informations pour créer un nouveau jury'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateJury} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="nom">
                    Nom du jury
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    defaultValue={editingJury?.nom}
                    placeholder="Nom du jury"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="date">
                      Date
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={editingJury?.soutenance.date}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="heure">
                      Heure
                    </label>
                    <Input
                      id="heure"
                      name="heure"
                      type="time"
                      defaultValue={editingJury?.soutenance.heure}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="salle">
                    Salle
                  </label>
                  <Input
                    id="salle"
                    name="salle"
                    defaultValue={editingJury?.soutenance.salle}
                    placeholder="Salle de soutenance"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="etudiant">
                    Étudiant
                  </label>
                  <Input
                    id="etudiant"
                    name="etudiant"
                    defaultValue={editingJury?.soutenance.etudiant}
                    placeholder="Nom de l'étudiant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="sujet">
                    Sujet
                  </label>
                  <Input
                    id="sujet"
                    name="sujet"
                    defaultValue={editingJury?.soutenance.sujet}
                    placeholder="Sujet du mémoire"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsJuryDialogOpen(false);
                    setEditingJury(null);
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingJury ? 'Modifier' : 'Créer'}
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
                  <p className="text-sm font-medium text-gray-600">Total Jurys</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{jurys.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Soutenances Planifiées</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {jurys.filter(j => j.statut === 'PLANIFIE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Membres de Jury</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {new Set(jurys.flatMap(j => j.membres.map(m => m.id))).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
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
                  placeholder="Rechercher par nom, étudiant ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer par statut
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    Tous les statuts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('PLANIFIE')}>
                    Planifiés
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('TERMINE')}>
                    Terminés
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('ANNULE')}>
                    Annulés
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Jurys Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Jurys</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Salle</TableHead>
                  <TableHead>Membres</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJurys.map((jury) => (
                  <TableRow key={jury.id}>
                    <TableCell className="font-medium">{jury.nom}</TableCell>
                    <TableCell>
                      <div>
                        <p>{jury.soutenance.etudiant}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {jury.soutenance.sujet}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(jury.soutenance.date).toLocaleDateString()}
                          <br />
                          {jury.soutenance.heure}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{jury.soutenance.salle}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {jury.membres.map((membre) => (
                          <div key={membre.id} className="text-sm">
                            <span className="font-medium">
                              {membre.prenom} {membre.nom}
                            </span>
                            <br />
                            <span className="text-gray-500">
                              {membre.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(jury.statut)}>
                        {jury.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingJury(jury);
                              setIsJuryDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteJury(jury.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredJurys.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun jury trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JuryManagement; 