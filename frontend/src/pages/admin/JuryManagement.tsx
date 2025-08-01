import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Save,
  Search,
  Trash2,
  Users
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Valeurs/labels normalisés pour la Mention
type MentionOption = { value: string; label: string };
const MENTION_OPTIONS: MentionOption[] = [
  { value: 'PASSABLE', label: 'Passable' },
  { value: 'ASSEZ_BIEN', label: 'Assez bien' },
  { value: 'BIEN', label: 'Bien' },
  { value: 'TRES_BIEN', label: 'Très bien' },
  { value: 'EXCELLENT', label: 'Excellent' },
];

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
  memoireId: string;
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
    note?: number;
    mention?: string;
    memoireId: string;
  };
  statut: 'PLANIFIE' | 'TERMINE' | 'ANNULE' | 'SOUTENU';
}

const JuryManagement = () => {
  const queryClient = useQueryClient();
  // Mutation pour la mise à jour note / mention
  const evaluationMutation = useMutation({
    mutationFn: ({ memoireId, note, mention }: { memoireId: string; note?: number; mention?: string }) =>
      memoireApi.updateEvaluation(memoireId, { note, mention }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jurys'] }),
  });
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [editingJury, setEditingJury] = React.useState<Jury | null>(null);
  // État du statut dans le formulaire pour afficher dynamiquement Note/Mention
  const [formStatut, setFormStatut] = React.useState<string>('PLANIFIE');
  // État local pour stocker les valeurs en édition par jury
  const [editValues, setEditValues] = React.useState<Record<string, { note?: number; mention?: string }>>({});
  const [isJuryDialogOpen, setIsJuryDialogOpen] = React.useState(false);
  // IDs des mémoires actuellement sélectionnés dans le formulaire (pour filtrer les encadreurs)
  const [selectedMemoireIds, setSelectedMemoireIds] = React.useState<string[]>([]);

  // Synchroniser le statut du formulaire lorsque l'on ouvre le modal sur un jury existant
  React.useEffect(() => {
    if (editingJury) {
      setFormStatut(editingJury.statut);
    } else {
      setFormStatut('PLANIFIE');
    }
  }, [editingJury]);

  // Récupération des jurys depuis l'API
  const { data: rawJurys = [], refetch } = useQuery<any[]>({
    queryKey: ['jurys'],
    queryFn: juryApi.getAll,
    select: (data: any[]) =>
      data.map((j: any) => ({
        id: j.id,
        memoireId: j.memoireId,
        nom: j.nom,
        membres: [j.encadreurJury1, j.encadreurJury2, j.encadreurJury3].filter(Boolean),
        soutenance: {
          date: j.dateSoutenance,
          heure: new Date(j.dateSoutenance).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          salle: j.salle,
          etudiant: `${j.memoire.etudiant.prenom} ${j.memoire.etudiant.nom}`,
          sujet: j.memoire.titre,
          note: j.memoire?.note,
          mention: j.memoire?.mention,
          memoireId: j.memoireId,
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
    const memoireIds = formData.getAll('memoireIds[]') as string[];
    const basePayload = {
      nom: formData.get('nom') as string,
      encadreurJury1Id: formData.get('encadreur1') as string,
      encadreurJury2Id: formData.get('encadreur2') as string,
      encadreurJury3Id: formData.get('encadreur3') as string,
      dateSoutenance: new Date(`${date}T${heure}:00`).toISOString(),
      salle: formData.get('salle') as string,
      statut: (formData.get('statut') as 'PLANIFIE' | 'TERMINE' | 'ANNULE' | 'SOUTENU') || 'PLANIFIE',
    };

    const noteStr = formData.get('note') as string | null;
    const note = noteStr ? Number(noteStr) : undefined;
    const mention = formData.get('mention') as string | null || undefined;

    if (editingJury) {
      updateMutation.mutate({ id: editingJury.id, payload: { ...basePayload, memoireId: editingJury.memoireId } });
      // Mettre à jour note/mention si fournis
      if ((note !== undefined || mention !== undefined) && basePayload.statut === 'TERMINE') {
        evaluationMutation.mutate({ memoireId: editingJury.memoireId, note, mention });
      }
    } else {
      memoireIds.forEach((id) => {
        createMutation.mutate({ ...basePayload, memoireId: id });
      });
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
  // Exclure les mémoires déjà associés à un jury PLANIFIE
  const availableMemoires = safeMemoires.filter(m => !jurys.some(j => j.memoireId === m.id && j.statut === 'PLANIFIE'));
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

  // Utils
  const getMentionLabel = (value?: string) => MENTION_OPTIONS.find(o => o.value === value)?.label ?? value ?? '-';
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERMINE':
        return "bg-green-100 text-green-800";
      case 'ANNULE':
        return "bg-red-100 text-red-800";
      case 'SOUTENU':
        return "bg-purple-100 text-purple-800";
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
          <Dialog
            open={isJuryDialogOpen}
            onOpenChange={(open) => {
              if (open) setEditingJury(null);
              setIsJuryDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Jury
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
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
              <form
                key={editingJury ? editingJury.id : 'new'}
                onSubmit={handleCreateJury}
                className="space-y-4"
              >
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
                  <select
                    multiple
                    name="memoireIds[]"
                    className="w-full border rounded p-2"
                    defaultValue={editingJury ? [editingJury.id] : []}
                    onChange={(e) => {
                      const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
                      setSelectedMemoireIds(ids);
                    }}
                    required
                  >
                    {availableMemoires.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.etudiant.prenom} {m.etudiant.nom} – {m.titre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['encadreur1','encadreur2','encadreur3'].map((field, idx) => (
                    <div className="space-y-2" key={`encadreur-${idx}`}>
                      <label className="text-sm font-medium" htmlFor={field}>
                        Encadreur {idx+1}
                      </label>
                      <Select name={field} required defaultValue={editingJury ? editingJury.membres[idx]?.id : undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Choisir encadreur ${idx+1}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {safeEncadreurs.map((e) => (
                            <SelectItem key={`${field}-${e.id}`} value={e.id}>
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
                  <Select name="statut" defaultValue={editingJury?.statut ?? 'PLANIFIE'} required onValueChange={(v)=>setFormStatut(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {['PLANIFIE','TERMINE','ANNULE', 'SOUTENU'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formStatut === 'TERMINE' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="note">
                        Note (/20)
                      </label>
                      <Input
                        id="note"
                        name="note"
                        type="number"
                        min={0}
                        max={20}
                        step={0.25}
                        defaultValue={editingJury?.soutenance.note}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="mention">
                        Mention
                      </label>
                      <Select
                        key={editingJury?.id ?? 'new'}
                        name="mention"
                        defaultValue={editingJury?.soutenance.mention ?? undefined}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une mention" />
                        </SelectTrigger>
                        <SelectContent>
                          {MENTION_OPTIONS.map(o => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
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
          <Card key="total-jurys" className="border-0 shadow-lg">
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

          <Card key="soutenances-planifiees" className="border-0 shadow-lg">
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

          <Card key="soutenances-terminees" className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Soutenances terminées</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {jurys.filter(j => j.statut === 'TERMINE').length}
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
                  <DropdownMenuItem key="all" onClick={() => setFilterStatus('all')}>
                    Tous les statuts
                  </DropdownMenuItem>
                  <DropdownMenuItem key="planifie" onClick={() => setFilterStatus('PLANIFIE')}>
                    Planifiés
                  </DropdownMenuItem>
                  <DropdownMenuItem key="termine" onClick={() => setFilterStatus('TERMINE')}>
                    Terminés
                  </DropdownMenuItem>
                  <DropdownMenuItem key="annule" onClick={() => setFilterStatus('ANNULE')}>
                    Annulés
                  </DropdownMenuItem>
                  <DropdownMenuItem key="soutenu" onClick={() => setFilterStatus('SOUTENU')}>
                    Soutenus
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
                  <TableHead>Note</TableHead>
                  <TableHead>Mention</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJurys.map((jury) => {
                  const isEditable = jury.statut === 'TERMINE' && (jury.soutenance?.note == null || jury.soutenance?.mention == null);
                  const current = editValues[jury.id] ?? {
                    note: jury.soutenance?.note,
                    mention: jury.soutenance?.mention,
                  };
                  const hasChanged = isEditable && (
                    current.note !== jury.soutenance?.note || current.mention !== jury.soutenance?.mention
                  );

                  return (
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
                        {isEditable ? (
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            className="w-20"
                            value={current.note ?? ''}
                            onChange={(e) => {
                              const val = e.target.value ? Number(e.target.value) : undefined;
                              setEditValues(prev => ({
                                ...prev,
                                [jury.id]: { ...current, note: val },
                              }));
                            }}
                          />
                        ) : (
                          jury.soutenance?.note ?? '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditable ? (
                          <Select
                            value={current.mention ?? undefined}
                            onValueChange={(val) => {
                              setEditValues(prev => ({
                                ...prev,
                                [jury.id]: { ...current, mention: val },
                              }));
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Mention" />
                            </SelectTrigger>
                            <SelectContent>
                              {MENTION_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getMentionLabel(jury.soutenance?.mention)
                        )}
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
                            {isEditable && (
                              <DropdownMenuItem
                                disabled={!hasChanged}
                                onClick={() => {
                                  const payload = editValues[jury.id] ?? { note: jury.soutenance?.note, mention: jury.soutenance?.mention };
                                  evaluationMutation.mutate({
                                    memoireId: jury.soutenance.memoireId,
                                    note: payload.note,
                                    mention: payload.mention,
                                  });
                                }}
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer
                              </DropdownMenuItem>
                            )}
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
                  );
                })}
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