
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Edit, Trash2, Search, Eye, Users } from 'lucide-react';

const MySubjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    titre: '',
    description: '',
    specialite: ''
  });

  const subjects = [
    {
      id: 1,
      titre: "Intelligence Artificielle et Machine Learning",
      description: "Développement d'un système de recommandation intelligent utilisant des algorithmes d'apprentissage automatique pour personnaliser l'expérience utilisateur.",
      specialite: "IA",
      statut: "validé",
      dateCreation: "2024-01-15",
      etudiants: [
        { nom: "Marie Dupont", progression: 85 },
        { nom: "Ahmed Trabelsi", progression: 60 }
      ]
    },
    {
      id: 2,
      titre: "Blockchain et Cryptomonnaies",
      description: "Étude et implémentation d'un système de paiement décentralisé basé sur la technologie blockchain avec focus sur la sécurité.",
      specialite: "Blockchain",
      statut: "en_attente",
      dateCreation: "2024-02-10",
      etudiants: []
    },
    {
      id: 3,
      titre: "Internet des Objets pour Smart Cities",
      description: "Conception d'une plateforme IoT pour la gestion intelligente des ressources urbaines incluant éclairage, trafic et qualité de l'air.",
      specialite: "IoT",
      statut: "validé",
      dateCreation: "2024-01-28",
      etudiants: [
        { nom: "Mohamed Salah", progression: 45 }
      ]
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      validé: 'bg-green-100 text-green-800',
      en_attente: 'bg-yellow-100 text-yellow-800',
      refusé: 'bg-red-100 text-red-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    console.log('Nouveau sujet:', newSubject);
    setShowAddForm(false);
    setNewSubject({ titre: '', description: '', specialite: '' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Sujets</h1>
          <p className="text-gray-600 mt-1">Gérez vos propositions de sujets de mémoire</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Sujet
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par titre ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Subject Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Proposer un Nouveau Sujet</CardTitle>
            <CardDescription>
              Remplissez les informations pour votre nouvelle proposition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Titre du sujet</label>
              <Input
                value={newSubject.titre}
                onChange={(e) => setNewSubject({...newSubject, titre: e.target.value})}
                placeholder="Ex: Intelligence Artificielle et Machine Learning"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={newSubject.description}
                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                placeholder="Décrivez les objectifs et la portée du sujet..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Spécialité</label>
              <Input
                value={newSubject.specialite}
                onChange={(e) => setNewSubject({...newSubject, specialite: e.target.value})}
                placeholder="Ex: IA, Blockchain, IoT"
                className="mt-1"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddSubject} className="bg-green-600 hover:bg-green-700">
                Proposer le Sujet
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                      {subject.statut === 'validé' ? '✓' : subject.statut === 'en_attente' ? '⏳' : '✗'}
                      <span className="ml-1 capitalize">{subject.statut.replace('_', ' ')}</span>
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {subject.specialite}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                {subject.description}
              </CardDescription>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Date de création:</span>
                  <span className="text-gray-700">{subject.dateCreation}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Étudiants assignés:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="font-medium text-gray-900">{subject.etudiants.length}</span>
                  </div>
                </div>
              </div>

              {/* Students Progress */}
              {subject.etudiants.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Progression des étudiants</h5>
                  <div className="space-y-2">
                    {subject.etudiants.map((etudiant, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{etudiant.nom}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full"
                              style={{ width: `${etudiant.progression}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{etudiant.progression}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Eye className="mr-1 h-4 w-4" />
                  Voir
                </Button>
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MySubjects;
