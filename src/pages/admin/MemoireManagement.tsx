
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Download, Eye, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';

const MemoireManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const memoires = [
    {
      id: 1,
      titre: "Système de Recommandation Intelligent",
      etudiant: "Marie Dupont",
      encadreur: "Dr. Ahmed Ben Ali",
      sujet: "Intelligence Artificielle et Machine Learning",
      statut: "déposé",
      dateDepot: "2024-03-15",
      fichier: "memoire_marie_dupont.pdf",
      taille: "2.5 MB",
      progression: 100
    },
    {
      id: 2,
      titre: "Application E-commerce Mobile",
      etudiant: "Amine Trabelsi",
      encadreur: "Dr. Mohamed Trabelsi",
      sujet: "Développement Mobile",
      statut: "en_cours",
      dateDepot: null,
      fichier: null,
      taille: null,
      progression: 75
    },
    {
      id: 3,
      titre: "Analyse de Vulnérabilités Web",
      etudiant: "Fatma Zahra",
      encadreur: "Dr. Sonia Mahmoud",
      sujet: "Cybersécurité",
      statut: "validé",
      dateDepot: "2024-02-28",
      fichier: "memoire_fatma_zahra.pdf",
      taille: "3.1 MB",
      progression: 100
    },
    {
      id: 4,
      titre: "Plateforme IoT pour Smart City",
      etudiant: "Mohamed Salah",
      encadreur: "Dr. Ahmed Ben Ali",
      sujet: "Internet des Objets",
      statut: "en_cours",
      dateDepot: null,
      fichier: null,
      taille: null,
      progression: 45
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'en_cours': 'bg-blue-100 text-blue-800',
      'déposé': 'bg-yellow-100 text-yellow-800',
      'validé': 'bg-green-100 text-green-800',
      'refusé': 'bg-red-100 text-red-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en_cours': return <Clock className="h-4 w-4" />;
      case 'déposé': return <FileText className="h-4 w-4" />;
      case 'validé': return <CheckCircle className="h-4 w-4" />;
      case 'refusé': return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredMemoires = memoires.filter(memoire => {
    const matchesSearch = memoire.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.encadreur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || memoire.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Mémoires</h1>
          <p className="text-gray-600 mt-1">Suivi et validation des mémoires déposés</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{memoires.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {memoires.filter(m => m.statut === 'en_cours').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Déposés</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {memoires.filter(m => m.statut === 'déposé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">
                  {memoires.filter(m => m.statut === 'validé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
                  placeholder="Rechercher par titre, étudiant ou encadreur..."
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
                variant={filterStatus === 'en_cours' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('en_cours')}
              >
                En cours
              </Button>
              <Button
                variant={filterStatus === 'déposé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('déposé')}
              >
                Déposés
              </Button>
              <Button
                variant={filterStatus === 'validé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('validé')}
              >
                Validés
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memoires List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Liste des Mémoires</CardTitle>
          <CardDescription>
            {filteredMemoires.length} mémoire(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMemoires.map((memoire) => (
              <div key={memoire.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{memoire.titre}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Étudiant:</span>
                        <p className="font-medium text-gray-900">{memoire.etudiant}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Encadreur:</span>
                        <p className="font-medium text-gray-900">{memoire.encadreur}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sujet:</span>
                        <p className="font-medium text-gray-900">{memoire.sujet}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadge(memoire.statut)}>
                      {getStatusIcon(memoire.statut)}
                      <span className="ml-1 capitalize">{memoire.statut.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium text-gray-900">{memoire.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${memoire.progression}%` }}
                    />
                  </div>
                </div>

                {/* File Info and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {memoire.fichier ? (
                      <div className="flex items-center space-x-4">
                        <span>Fichier: {memoire.fichier}</span>
                        <span>Taille: {memoire.taille}</span>
                        <span>Déposé le: {memoire.dateDepot}</span>
                      </div>
                    ) : (
                      <span className="text-orange-600">Aucun fichier déposé</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {memoire.fichier && (
                      <>
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <Eye className="mr-1 h-4 w-4" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <Download className="mr-1 h-4 w-4" />
                          Télécharger
                        </Button>
                      </>
                    )}
                    {memoire.statut === 'déposé' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Valider
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="mr-1 h-4 w-4" />
                          Refuser
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoireManagement;
