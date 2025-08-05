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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Filter,
  GraduationCap,
  Search,
  User,
  Users
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi, memoireApi } from "@/services/api";

interface Sujet {
  id: string;
  titre: string;
  description: string;
  motsCles?: string[];
  encadreur: {
    nom: string;
    prenom: string;
    specialite: string;
  };
  technologies: string[];
  difficulte: 'FACILE' | 'MOYEN' | 'DIFFICILE';
  dureeEstimee: string;
}

const SubjectSelection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterEncadreur, setFilterEncadreur] = React.useState('all');
  const [selectedSujet, setSelectedSujet] = React.useState<Sujet | null>(null);

  // Récupération des sujets disponibles depuis le backend
  const queryClient = useQueryClient();
  const { data: sujets = [], isLoading } = useQuery({
    queryKey: ['sujets'],
    queryFn: () => subjectApi.getAll({ status: 'VALIDE' })
  });

  // Mémoire déjà choisi par l'étudiant (s'il existe)
  const { data: memoire } = useQuery({
    queryKey: ['memoire'],
    queryFn: () => memoireApi.getMy(),
    staleTime: 1000 * 60 // 1 min
  });

  const hasChosen = !!memoire && (!!memoire.id || !!(memoire as any)?.sujetId || !!(memoire as any)?.sujet?.id) || !!selectedSujet;

  const handleSelectSujet = (sujet: Sujet) => {
    setSelectedSujet(sujet);
  };

  const createMemoireMutation = useMutation({
    mutationFn: (sujet: Sujet) => memoireApi.create({
      titre: sujet.titre,
      description: sujet.description,
      motsCles: sujet.motsCles ?? [],
      sujetId: sujet.id,
    }),
    onSuccess: () => {
      toast({ title: 'Sujet sélectionné', description: 'Votre mémoire a été créé avec succès' });
      queryClient.invalidateQueries({ queryKey: ['memoire'] });
      queryClient.invalidateQueries({ queryKey: ['sujets'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de créer votre mémoire', variant: 'destructive' });
    },
  });

  const handleConfirmSelection = () => {
    if (!selectedSujet) return;
    createMemoireMutation.mutate(selectedSujet);
  };

  // Pagination
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 2;

  const filteredSujets = (sujets as any[]).filter(sujet => {
    const matchesSearch =
      sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sujet.technologies ?? sujet.motsCles ?? []).some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEncadreur = filterEncadreur === 'all' || sujet.encadreur.nom === filterEncadreur;
    return matchesSearch && matchesEncadreur;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'FACILE':
        return "bg-green-100 text-green-800";
      case 'MOYEN':
        return "bg-yellow-100 text-yellow-800";
      case 'DIFFICILE':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sélection du Sujet</h1>
          <p className="text-gray-600 mt-1">Choisissez votre sujet de mémoire parmi les propositions disponibles</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sujets Disponibles</p>
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
                  <p className="text-sm font-medium text-gray-600">Encadreurs</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {new Set(sujets.map(s => s.encadreur.nom)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Technologies Uniques</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {new Set(sujets.flatMap((s: any) => s.technologies ?? s.motsCles ?? [])).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-600" />
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
                  placeholder="Rechercher par titre, description ou technologie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer par encadreur
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterEncadreur('all')}>
                    Tous les encadreurs
                  </DropdownMenuItem>
                  {Array.from(new Set((sujets as any[]).map(s => s.encadreur.nom))).map((name) => (
                    <DropdownMenuItem key={name} onClick={() => setFilterEncadreur(name)}>
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Sujets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSujets
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((sujet) => {
            const chosenSujetId = (memoire as any)?.sujetId ?? (memoire as any)?.sujet?.id;
            const isChosen = chosenSujetId === sujet.id || (!memoire && selectedSujet?.id === sujet.id);
            const isSelected = isChosen || selectedSujet?.id === sujet.id;
            const disabled = hasChosen && !isSelected;
            return (
              <Card
                key={sujet.id}
                className={`border-0 shadow-lg transition-all duration-200 ${isChosen ? 'ring-2 ring-green-500' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{sujet.titre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {sujet.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {((sujet.technologies ?? sujet.motsCles ?? [])).map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <span className="font-medium">Encadreur: </span>
                          {sujet.encadreur.prenom} {sujet.encadreur.nom}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Spécialité: {sujet.encadreur.specialite}
                      </div>
                    </div>

                    {memoire?.sujetId === sujet.id ? (
                      <Button className="w-full mt-4" variant="outline" disabled>
                        Sujet sélectionné
                      </Button>
                    ) : hasChosen ? (
                      <Button className="w-full mt-4" variant="secondary" disabled>
                        Vous avez déjà choisi un sujet
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full mt-4"
                            variant={isChosen ? 'outline' : 'default'}
                            onClick={() => handleSelectSujet(sujet)}
                          >
                            {
                                isChosen ? 'Sujet sélectionné' :
                                disabled ? (memoire ? 'Vous avez déjà choisi un sujet' : 'Vous avez déjà choisi un sujet') :
                                'Choisir ce Sujet'
                              }
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la sélection</DialogTitle>
                            <DialogDescription>
                              Êtes-vous sûr de vouloir choisir ce sujet ? Ce choix est définitif.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Sujet sélectionné:</h4>
                              <p className="text-sm text-gray-600">{sujet.titre}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Encadreur:</h4>
                              <p className="text-sm text-gray-600">
                                {sujet.encadreur.prenom} {sujet.encadreur.nom}
                              </p>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setSelectedSujet(null)}>
                                Annuler
                              </Button>
                              <Button onClick={handleConfirmSelection}>Confirmer</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredSujets.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun sujet trouvé</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredSujets.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-600 self-center">
              Page {page} / {Math.ceil(filteredSujets.length / itemsPerPage)}
            </span>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(filteredSujets.length / itemsPerPage)}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubjectSelection;
