import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, sujetApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Edit, Filter, MoreVertical, Plus, Search, Trash2, Users
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Sujet {
  id: string;
  titre: string;
  description: string;
  motsCles: string[];
  status: 'DISPONIBLE' | 'RESERVE' | 'EN_COURS' | 'TERMINE';
  memoires: any[];
  etudiant?: string;
  createdAt: string;
  encadreurId?: string;
}

const MySubjects = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSujet, setEditingSujet] = React.useState<Sujet | null>(null);
  const [sujets, setSujets] = React.useState<Sujet[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<string>('');

  // Récupération utilisateur
  React.useEffect(() => {
    (async () => {
      const me = await authApi.getCurrentUser();
      if (me) setCurrentUserId(me.id);
    })();
  }, []);

  // Récupération des sujets depuis le backend
  const queryClient = useQueryClient();
  const { data: fetchedSujets = [] } = useQuery<Sujet[]>({
    queryKey: ['encadreur-sujets'],
    queryFn: () => sujetApi.getAll(),
  });

  React.useEffect(() => {
    const mine = fetchedSujets.filter(s => s.encadreurId === currentUserId);
    setSujets(mine);
  }, [fetchedSujets, currentUserId]);

  // Mutations
  const createSujetMutation = useMutation({
    mutationFn: (data: any) => sujetApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encadreur-sujets'] });
      toast({ title: 'Sujet créé', description: 'Le nouveau sujet a été créé avec succès' });
    },
    onError: () => toast({ title: 'Erreur', description: 'Création impossible' })
  });

  const updateSujetMutation = useMutation({
    mutationFn: (payload: { id: string; data: any }) =>
      sujetApi.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encadreur-sujets'] });
      toast({ title: 'Sujet modifié', description: 'Le sujet a été mis à jour avec succès' });
    },
    onError: () => toast({ title: 'Erreur', description: 'Modification impossible' })
  });

  const deleteSujetMutation = useMutation({
    mutationFn: (id: string) => sujetApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encadreur-sujets'] });
      toast({ title: 'Sujet supprimé', description: 'Le sujet a été supprimé avec succès' });
    },
    onError: () => toast({ title: 'Erreur', description: 'Suppression impossible' })
  });

  // Handlers
  const handleCreateSujet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSujet = {
      titre: formData.get('titre') as string,
      description: formData.get('description') as string,
      motsCles: (formData.get('motsCles') as string).split(',').map(t => t.trim()),
      status: 'DISPONIBLE',
      createdAt: new Date().toISOString(),
    };
    createSujetMutation.mutate(newSujet);
    setIsDialogOpen(false);
  };

  const handleEditSujet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSujet) return;

    const formData = new FormData(event.currentTarget);
    updateSujetMutation.mutate({
      id: editingSujet.id,
      data: {
        titre: formData.get('titre') as string,
        description: formData.get('description') as string,
        motsCles: (formData.get('motsCles') as string).split(',').map(t => t.trim()),
      },
    });
    setEditingSujet(null);
    setIsDialogOpen(false);
  };

  const handleDeleteSujet = (sujetId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) return;
    deleteSujetMutation.mutate(sujetId);
  };

  // Filtrage
  const filteredSujets = sujets.filter(sujet => {
    const matchesSearch =
      sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.motsCles.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || sujet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return "bg-green-100 text-green-800";
      case 'RESERVE': return "bg-yellow-100 text-yellow-800";
      case 'EN_COURS': return "bg-blue-100 text-blue-800";
      case 'TERMINE': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Sujets</h1>
            <p className="text-gray-600 mt-1">Gérez vos sujets de mémoire</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Sujet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSujet ? 'Modifier le sujet' : 'Créer un nouveau sujet'}
                </DialogTitle>
                <DialogDescription>
                  {editingSujet
                    ? 'Modifiez les informations du sujet ci-dessous'
                    : 'Remplissez les informations pour créer un nouveau sujet'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editingSujet ? handleEditSujet : handleCreateSujet} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="titre">
                    Titre
                  </label>
                  <Input
                    id="titre"
                    name="titre"
                    defaultValue={editingSujet?.titre}
                    placeholder="Titre du sujet"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingSujet?.description}
                    placeholder="Description détaillée du sujet"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="motsCles">
                    Mots clés (séparés par des virgules)
                  </label>
                  <Input
                    id="motsCles"
                    name="motsCles"
                    defaultValue={(editingSujet?.motsCles ?? []).join(', ')}
                    placeholder="React, Node.js, TypeScript"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs" onClick={() => {
                    setIsDialogOpen(false);
                    setEditingSujet(null);
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingSujet ? 'Modifier' : 'Créer'}
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
                  <p className="text-sm font-medium text-gray-600">Total Sujets</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{sujets.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sujets Disponibles</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {sujets.filter(s => s.status === 'DISPONIBLE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Étudiants Assignés</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {sujets.reduce((total, s) => total + (s.memoires?.length ?? 0), 0)}
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
                  placeholder="Rechercher par titre, description ou mots clés..."
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
                  <DropdownMenuItem onClick={() => setFilterStatus('DISPONIBLE')}>
                    Disponibles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('EN_COURS')}>
                    En cours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('TERMINE')}>
                    Terminés
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Sujets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSujets.map((sujet) => (
            <Card key={sujet.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sujet.titre}</CardTitle>
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
                          setEditingSujet(sujet);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteSujet(sujet.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className={getStatusBadge(sujet.status)}>
                    {sujet.status}
                  </Badge>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {sujet.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {/* Tags / mots clés */}
                    {sujet.motsCles.map((tech: string, index: number) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Étudiants assignés: {sujet.memoires.length}
                  </div>

                  <div className="text-sm text-gray-500">
                    Créé le {new Date(sujet.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSujets.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun sujet trouvé</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MySubjects;
