
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Filter, User, Clock, Heart, CheckCircle } from 'lucide-react';

const SubjectSelection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpeciality, setFilterSpeciality] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);

  const subjects = [
    {
      id: 1,
      titre: "Intelligence Artificielle et Machine Learning",
      description: "Développement d'un système de recommandation intelligent utilisant des algorithmes d'apprentissage automatique pour personnaliser l'expérience utilisateur. Le projet incluera l'étude des différentes techniques de ML, l'implémentation et l'évaluation des performances.",
      encadreur: "Dr. Ahmed Ben Ali",
      specialite: "IA",
      niveau: "Avancé",
      duree: "6 mois",
      prerequis: ["Python", "Mathématiques", "Statistiques"],
      placesDisponibles: 2,
      placesTotales: 3,
      statut: "disponible"
    },
    {
      id: 2,
      titre: "Développement d'une Application Mobile E-commerce",
      description: "Création d'une application mobile complète pour le commerce électronique avec React Native. Le projet comprend la conception UI/UX, l'intégration d'APIs, le système de paiement et la gestion des commandes.",
      encadreur: "Dr. Mohamed Trabelsi",
      specialite: "Mobile",
      niveau: "Intermédiaire",
      duree: "5 mois",
      prerequis: ["JavaScript", "React", "API REST"],
      placesDisponibles: 1,
      placesTotales: 2,
      statut: "disponible"
    },
    {
      id: 3,
      titre: "Cybersécurité et Protection des Données",
      description: "Analyse des vulnérabilités dans les applications web et développement d'outils de sécurisation. Étude des techniques d'attaque et de défense, implémentation de mesures de protection.",
      encadreur: "Dr. Sonia Mahmoud",
      specialite: "Sécurité",
      niveau: "Avancé",
      duree: "6 mois",
      prerequis: ["Réseaux", "Linux", "Cryptographie"],
      placesDisponibles: 0,
      placesTotales: 2,
      statut: "complet"
    },
    {
      id: 4,
      titre: "Blockchain et Cryptomonnaies",
      description: "Étude et implémentation d'un système de paiement décentralisé basé sur la technologie blockchain. Développement d'un smart contract et d'une interface utilisateur.",
      encadreur: "Dr. Karim Nasri",
      specialite: "Blockchain",
      niveau: "Avancé",
      duree: "6 mois",
      prerequis: ["Solidity", "Web3", "JavaScript"],
      placesDisponibles: 1,
      placesTotales: 1,
      statut: "disponible"
    },
    {
      id: 5,
      titre: "Internet des Objets pour Smart Cities",
      description: "Conception d'une plateforme IoT pour la gestion intelligente des ressources urbaines. Intégration de capteurs, collecte de données et tableau de bord analytique.",
      encadreur: "Dr. Ahmed Ben Ali",
      specialite: "IoT",
      niveau: "Intermédiaire",
      duree: "5 mois",
      prerequis: ["Arduino", "Python", "Réseaux"],
      placesDisponibles: 2,
      placesTotales: 3,
      statut: "disponible"
    },
    {
      id: 6,
      titre: "Développement d'un CRM avec Analytics",
      description: "Création d'un système de gestion de la relation client avec des fonctionnalités d'analyse avancées et de visualisation de données.",
      encadreur: "Dr. Leila Sfaxi",
      specialite: "Web",
      niveau: "Intermédiaire",
      duree: "4 mois",
      prerequis: ["React", "Node.js", "MongoDB"],
      placesDisponibles: 1,
      placesTotales: 2,
      statut: "disponible"
    }
  ];

  const specialities = ['all', 'IA', 'Mobile', 'Sécurité', 'Blockchain', 'IoT', 'Web'];

  const getStatusBadge = (statut: string) => {
    const styles = {
      disponible: 'bg-green-100 text-green-800',
      complet: 'bg-red-100 text-red-800',
      bientot: 'bg-yellow-100 text-yellow-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getNiveauBadge = (niveau: string) => {
    const styles = {
      'Débutant': 'bg-blue-100 text-blue-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-red-100 text-red-800'
    };
    return styles[niveau as keyof typeof styles];
  };

  const toggleFavorite = (subjectId: number) => {
    setFavorites(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.encadreur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = filterSpeciality === 'all' || subject.specialite === filterSpeciality;
    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choisir un Sujet</h1>
          <p className="text-gray-600 mt-1">Explorez les sujets de mémoire disponibles</p>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {filteredSubjects.filter(s => s.statut === 'disponible').length} sujets disponibles
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, encadreur ou mots-clés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {specialities.map((spec) => (
                <Button
                  key={spec}
                  variant={filterSpeciality === spec ? 'default' : 'outline'}
                  onClick={() => setFilterSpeciality(spec)}
                  size="sm"
                  className="flex items-center"
                >
                  {spec === 'all' && <Filter className="mr-1 h-3 w-3" />}
                  {spec === 'all' ? 'Toutes' : spec}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 mb-2">{subject.titre}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusBadge(subject.statut)}>
                      {subject.statut === 'disponible' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                       subject.statut === 'complet' ? '🔒' : '⏳'}
                      {subject.statut === 'disponible' ? 'Disponible' : 
                       subject.statut === 'complet' ? 'Complet' : 'Bientôt'}
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {subject.specialite}
                    </Badge>
                    <Badge className={getNiveauBadge(subject.niveau)}>
                      {subject.niveau}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(subject.id)}
                  className={favorites.includes(subject.id) ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(subject.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                {subject.description}
              </CardDescription>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Encadreur:</span>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{subject.encadreur}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Durée estimée:</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{subject.duree}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Places:</span>
                  <span className={`font-medium ${subject.placesDisponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.placesDisponibles}/{subject.placesTotales}
                  </span>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Prérequis</h5>
                <div className="flex flex-wrap gap-1">
                  {subject.prerequis.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  className={`flex-1 ${
                    subject.statut === 'disponible' 
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700' 
                      : ''
                  }`}
                  disabled={subject.statut !== 'disponible'}
                >
                  {subject.statut === 'disponible' ? 'Choisir ce Sujet' : 'Non Disponible'}
                </Button>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sujet trouvé</h3>
            <p className="text-gray-600">
              Essayez d'ajuster vos filtres ou votre recherche pour trouver des sujets correspondants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubjectSelection;
