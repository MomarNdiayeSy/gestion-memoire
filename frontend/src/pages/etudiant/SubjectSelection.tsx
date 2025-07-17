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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

interface Sujet {
  id: string;
  titre: string;
  description: string;
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
  const [filterDifficulty, setFilterDifficulty] = React.useState('all');
  const [selectedSujet, setSelectedSujet] = React.useState<Sujet | null>(null);

  // Données fictives pour les sujets
  const [sujets] = React.useState<Sujet[]>([
    {
      id: '1',
      titre: 'Développement d\'une application de gestion de mémoires',
      description: 'Application web permettant la gestion des mémoires de fin d\'études, incluant le suivi des étudiants, la gestion des soutenances et les paiements. Le projet utilisera des technologies modernes et devra être responsive.',
      encadreur: {
        nom: 'Diop',
        prenom: 'Abdoulaye',
        specialite: 'Développement Web'
      },
      technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      difficulte: 'MOYEN',
      dureeEstimee: '4-5 mois'
    },
    {
      id: '2',
      titre: 'Système de reconnaissance faciale pour la sécurité',
      description: 'Implémentation d\'un système de reconnaissance faciale utilisant l\'apprentissage profond pour la sécurité des bâtiments. Le projet inclura la détection en temps réel et la gestion des accès.',
      encadreur: {
        nom: 'Sow',
        prenom: 'Mariama',
        specialite: 'Intelligence Artificielle'
      },
      technologies: ['Python', 'TensorFlow', 'OpenCV'],
      difficulte: 'DIFFICILE',
      dureeEstimee: '5-6 mois'
    },
    {
      id: '3',
      titre: 'Plateforme e-learning intelligente',
      description: 'Développement d\'une plateforme e-learning avec des recommandations personnalisées basées sur l\'IA. Le système adaptera le contenu en fonction du niveau et des préférences de l\'apprenant.',
      encadreur: {
        nom: 'Fall',
        prenom: 'Ibrahim',
        specialite: 'E-learning'
      },
      technologies: ['Vue.js', 'Django', 'Machine Learning'],
      difficulte: 'FACILE',
      dureeEstimee: '3-4 mois'
    }
  ]);

  const handleSelectSujet = (sujet: Sujet) => {
    setSelectedSujet(sujet);
  };

  const handleConfirmSelection = () => {
    if (!selectedSujet) return;
    
    toast({
      title: "Sujet sélectionné",
      description: "Votre choix a été enregistré avec succès",
    });
  };

  const filteredSujets = sujets.filter(sujet => {
    const matchesSearch = 
      sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = filterDifficulty === 'all' || sujet.difficulte === filterDifficulty;
    return matchesSearch && matchesDifficulty;
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
                    {new Set(sujets.flatMap(s => s.technologies)).size}
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
                    Filtrer par difficulté
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterDifficulty('all')}>
                    Toutes les difficultés
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('FACILE')}>
                    Facile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('MOYEN')}>
                    Moyen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('DIFFICILE')}>
                    Difficile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Sujets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSujets.map((sujet) => (
            <Card 
              key={sujet.id} 
              className={`border-0 shadow-lg transition-all duration-200 ${
                selectedSujet?.id === sujet.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{sujet.titre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyBadge(sujet.difficulte)}>
                      {sujet.difficulte}
                    </Badge>
                    <Badge variant="outline">
                      {sujet.dureeEstimee}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {sujet.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {sujet.technologies.map((tech, index) => (
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-4"
                        variant={selectedSujet?.id === sujet.id ? "outline" : "default"}
                        onClick={() => handleSelectSujet(sujet)}
                      >
                        {selectedSujet?.id === sujet.id ? 'Sujet Sélectionné' : 'Choisir ce Sujet'}
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
                          <Button onClick={handleConfirmSelection}>
                            Confirmer
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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

export default SubjectSelection;
