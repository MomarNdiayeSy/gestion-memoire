
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, Plus, Calendar, Users, Clock } from 'lucide-react';

const JuryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const jurys = [
    {
      id: 1,
      etudiant: "Marie Dupont",
      memoire: "Système de Recommandation Intelligent",
      encadreur: "Dr. Ahmed Ben Ali",
      dateSoutenance: "2024-04-15",
      heure: "14:00",
      salle: "Amphi A",
      president: "Prof. Karim Nasri",
      rapporteur: "Dr. Sonia Mahmoud",
      examinateur: "Dr. Mohamed Trabelsi",
      statut: "programmé"
    },
    {
      id: 2,
      etudiant: "Fatma Zahra",
      memoire: "Analyse de Vulnérabilités Web",
      encadreur: "Dr. Sonia Mahmoud",
      dateSoutenance: "2024-04-18",
      heure: "10:00",
      salle: "Salle 201",
      president: "Prof. Ahmed Ben Ali",
      rapporteur: "Dr. Karim Nasri",
      examinateur: "Dr. Leila Sfaxi",
      statut: "confirmé"
    },
    {
      id: 3,
      etudiant: "Amine Trabelsi",
      memoire: "Application E-commerce Mobile",
      encadreur: "Dr. Mohamed Trabelsi",
      dateSoutenance: "2024-04-20",
      heure: "15:30",
      salle: "Amphi B",
      president: "Prof. Sonia Mahmoud",
      rapporteur: "Dr. Ahmed Ben Ali",
      examinateur: "Dr. Karim Nasri",
      statut: "en_attente"
    }
  ];

  const encadreurs = [
    { id: 1, nom: "Dr. Ahmed Ben Ali", specialite: "Intelligence Artificielle" },
    { id: 2, nom: "Dr. Karim Nasri", specialite: "Blockchain" },
    { id: 3, nom: "Dr. Sonia Mahmoud", specialite: "Cybersécurité" },
    { id: 4, nom: "Dr. Mohamed Trabelsi", specialite: "Développement Mobile" },
    { id: 5, nom: "Dr. Leila Sfaxi", specialite: "Réseaux" },
    { id: 6, nom: "Prof. Karim Nasri", specialite: "Base de Données" }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'programmé': 'bg-blue-100 text-blue-800',
      'confirmé': 'bg-green-100 text-green-800',
      'terminé': 'bg-gray-100 text-gray-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'programmé': return <Calendar className="h-4 w-4" />;
      case 'confirmé': return <GraduationCap className="h-4 w-4" />;
      case 'terminé': return <GraduationCap className="h-4 w-4" />;
    }
  };

  const filteredJurys = jurys.filter(jury => 
    jury.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jury.memoire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Jurys</h1>
          <p className="text-gray-600 mt-1">Organisation des soutenances et composition des jurys</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Jury
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jurys</p>
                <p className="text-2xl font-bold text-gray-900">{jurys.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Programmés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jurys.filter(j => j.statut === 'programmé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-green-600">
                  {jurys.filter(j => j.statut === 'confirmé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Encadreurs</p>
                <p className="text-2xl font-bold text-purple-600">{encadreurs.length}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jurys List */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Jurys de Soutenance</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredJurys.map((jury) => (
                  <div key={jury.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{jury.etudiant}</h4>
                        <p className="text-gray-600 text-sm mb-2">{jury.memoire}</p>
                        <Badge className={getStatusBadge(jury.statut)}>
                          {getStatusIcon(jury.statut)}
                          <span className="ml-1 capitalize">{jury.statut.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{jury.dateSoutenance}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Heure:</span>
                          <span className="font-medium">{jury.heure}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Salle:</span>
                          <span className="font-medium">{jury.salle}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Président:</span>
                          <span className="font-medium">{jury.president}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Rapporteur:</span>
                          <span className="font-medium">{jury.rapporteur}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Examinateur:</span>
                          <span className="font-medium">{jury.examinateur}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        Confirmer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encadreurs Disponibles */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Encadreurs Disponibles
            </CardTitle>
            <CardDescription>
              Pool d'encadreurs pour composition des jurys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {encadreurs.map((encadreur) => (
                <div key={encadreur.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-1">{encadreur.nom}</h4>
                  <Badge variant="outline" className="text-xs">
                    {encadreur.specialite}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JuryManagement;
