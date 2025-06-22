
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Plus, Edit, Trash2, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

const SubjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const subjects = [
    {
      id: 1,
      titre: "Intelligence Artificielle et Machine Learning",
      description: "Développement d'un système de recommandation intelligent",
      encadreur: "Dr. Ahmed Ben Ali",
      specialite: "IA",
      statut: "validé",
      dateProposition: "2024-01-15",
      etudiants: 2
    },
    {
      id: 2,
      titre: "Blockchain et Cryptomonnaies",
      description: "Étude et implémentation d'un système de paiement décentralisé",
      encadreur: "Dr. Karim Nasri",
      specialite: "Blockchain",
      statut: "en_attente",
      dateProposition: "2024-02-10",
      etudiants: 0
    },
    {
      id: 3,
      titre: "Cybersécurité et Protection des Données",
      description: "Analyse des vulnérabilités dans les applications web",
      encadreur: "Dr. Sonia Mahmoud",
      specialite: "Sécurité",
      statut: "validé",
      dateProposition: "2024-01-20",
      etudiants: 3
    },
    {
      id: 4,
      titre: "Développement d'Applications Mobiles Hybrides",
      description: "Création d'une application e-commerce avec React Native",
      encadreur: "Dr. Mohamed Trabelsi",
      specialite: "Mobile",
      statut: "refusé",
      dateProposition: "2024-02-05",
      etudiants: 0
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

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'validé': return <CheckCircle className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'refusé': return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.encadreur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subject.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Sujets</h1>
          <p className="text-gray-600 mt-1">Validation et suivi des sujets de mémoire</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Sujet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">
                  {subjects.filter(s => s.statut === 'validé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {subjects.filter(s => s.statut === 'en_attente').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refusés</p>
                <p className="text-2xl font-bold text-red-600">
                  {subjects.filter(s => s.statut === 'refusé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre ou encadreur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Tous
              </Button>
              <Button
                variant={filterStatus === 'validé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('validé')}
              >
                Validés
              </Button>
              <Button
                variant={filterStatus === 'en_attente' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('en_attente')}
              >
                En attente
              </Button>
              <Button
                variant={filterStatus === 'refusé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('refusé')}
              >
                Refusés
              </Button>
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
                      {getStatusIcon(subject.statut)}
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
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Encadreur:</span>
                  <span className="font-medium text-gray-900">{subject.encadreur}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Date de proposition:</span>
                  <span className="text-gray-700">{subject.dateProposition}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Étudiants intéressés:</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {subject.etudiants}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                {subject.statut === 'en_attente' && (
                  <>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Valider
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                      <XCircle className="mr-1 h-4 w-4" />
                      Refuser
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
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

export default SubjectManagement;
