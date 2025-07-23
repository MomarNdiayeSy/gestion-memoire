import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { juryApi, userApi, memoireApi } from '@/services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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


interface User {
  id: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT';
}

interface MemoireOption {
  id: string;
  titre: string;
  etudiant: {
    id: string;
    nom: string;
    prenom: string;
  };
}

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

  // Récupération des jurys depuis l'API
  const { data: rawJurys = [], refetch } = useQuery<any[]>({
    queryKey: ['jurys'],
    queryFn: juryApi.getAll,
    select: (data: any[]) =>
      data.map((j: any) => ({
        id: j.id,
        nom: j.nom,
        membres: [j.encadreurJury1, j.encadreurJury2, j.encadreurJury3].filter(Boolean),
        soutenance: {
          date: j.dateSoutenance,
          heure: new Date(j.dateSoutenance).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          salle: j.salle,
          etudiant: `${j.memoire.etudiant.prenom} ${j.memoire.etudiant.nom}`,
          sujet: j.memoire.titre,
        },
        statut: j.statut,
      })),
  });

  // Récupération des encadreurs (roll ENCADREUR)
  const { data: encadreurs = [] } = useQuery<User[]>({
    queryKey: ['encadreurs'],
    queryFn: () => userApi.getAll({ role: 'ENCADREUR' }),
  });

  // Récupération des mémoires validés (étudiants) pour lesquels il n'y a pas encore de jury
  const { data: memoires = [] } = useQuery<any[]>({
    queryKey: ['memoires-valides'],
    queryFn: () => memoireApi.getAll({ status: 'VALIDE' }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => juryApi.create(data),
    onSuccess: () => { toast({ title: 'Jury créé' }); refetch(); }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => juryApi.update(id, payload),
    onSuccess: () => { toast({ title: 'Jury modifié' }); refetch(); }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => juryApi.delete(id),
    onSuccess: () => {
      refetch();
      toast({ title: "Jury supprimé", description: "Le jury a été supprimé avec succès" });
    },
  });

  const handleCreateJury = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const date = formData.get('date') as string;
    const heure = formData.get('heure') as string;
    const payload = {
      nom: formData.get('nom') as string,
      memoireId: formData.get('memoireId') as string,
      encadreurJury1Id: formData.get('encadreur1') as string,
      encadreurJury2Id: formData.get('encadreur2') as string,
      encadreurJury3Id: formData.get('encadreur3') as string,
      dateSoutenance: new Date(`${date}T${heure}:00`).toISOString(),
      salle: formData.get('salle') as string,
    statut: (formData.get('statut') as 'PLANIFIE' | 'TERMINE' | 'ANNULE') || 'PLANIFIE',
    };

    if (editingJury) {
      updateMutation.mutate({ id: editingJury.id, payload });
    } else {
      createMutation.mutate(payload);
    }

    setIsJuryDialogOpen(false);
    setEditingJury(null);
  };

  const handleDeleteJury = (juryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jury ?')) {
      deleteMutation.mutate(juryId);
      toast({
        title: "Jury supprimé",
        description: "Le jury a été supprimé avec succès",
      });
    }
  };

  // Sécuriser les données éventuellement non tableau
  const safeEncadreurs = Array.isArray(encadreurs)
    ? encadreurs
    : (encadreurs && Array.isArray((encadreurs as any).users) ? (encadreurs as any).users : []);
  const safeMemoires = Array.isArray(memoires) ? memoires : [];

  const jurys = rawJurys as Jury[];
  const filteredJurys = jurys.filter(jury => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch = [
      jury.nom ?? '',
      jury.soutenance?.etudiant ?? '',
      jury.soutenance?.sujet ?? '',
      ...(Array.isArray(jury.membres) ? jury.membres : []).map(m => `${m.prenom} ${m.nom}`)
    ].some(text => text.toLowerCase().includes(lowerSearch));
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
                  <label className="text-sm font-medium" htmlFor="memoireId">
                    Étudiant
                  </label>
                  <Select name="memoireId" defaultValue={editingJury?.id} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un mémoire" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeMemoires.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.etudiant.prenom} {m.etudiant.nom} – {m.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['encadreur1','encadreur2','encadreur3'].map((field, idx) => (
                    <div className="space-y-2" key={field}>
                      <label className="text-sm font-medium" htmlFor={field}>
                        Encadreur {idx+1}
                      </label>
                      <Select name={field} required defaultValue={editingJury ? editingJury.membres[idx]?.id : undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Choisir encadreur ${idx+1}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {safeEncadreurs.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.prenom} {e.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="statut">
                    Statut
                  </label>
                  <Select name="statut" defaultValue={editingJury?.statut ?? 'PLANIFIE'} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {['PLANIFIE','TERMINE','ANNULE'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {new Set(jurys.flatMap(j => (Array.isArray(j.membres) ? j.membres : []).map(m => m.id))).size}
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
                        <p>{jury.soutenance?.etudiant ?? ''}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {jury.soutenance?.sujet ?? ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {jury.soutenance ? new Date(jury.soutenance.date).toLocaleDateString() : '-'}
                          <br />
                          {jury.soutenance?.heure ?? ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{jury.soutenance?.salle ?? ''}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {(Array.isArray(jury.membres) ? jury.membres : []).map((membre) => (
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