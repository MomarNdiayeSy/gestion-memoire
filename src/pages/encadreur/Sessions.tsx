
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Plus, CheckCircle, Edit, Eye, Users } from 'lucide-react';

const Sessions = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const sessions = [
    {
      id: 1,
      numero: 8,
      etudiant: "Marie Dupont",
      sujet: "Système de Recommandation Intelligent",
      date: "2024-03-15",
      heure: "14:00",
      duree: "1h30",
      statut: "validée",
      travauxEffectues: "Implémentation des algorithmes de filtrage collaboratif",
      observations: "Bon travail sur l'optimisation. Continuer avec les tests de performance.",
      visaEncadreur: true,
      visaEtudiant: true
    },
    {
      id: 2,
      numero: 6,
      etudiant: "Ahmed Trabelsi",
      sujet: "Intelligence Artificielle et Machine Learning",
      date: "2024-03-18",
      heure: "10:30",
      duree: "2h00",
      statut: "programmée",
      travauxEffectues: "",
      observations: "",
      visaEncadreur: false,
      visaEtudiant: false
    },
    {
      id: 3,
      numero: 4,
      etudiant: "Mohamed Salah",
      sujet: "Internet des Objets pour Smart Cities",
      date: "2024-03-12",
      heure: "16:00",
      duree: "1h15",
      statut: "en_attente",
      travauxEffectues: "Configuration des capteurs IoT et collecte de données",
      observations: "Problème avec la communication entre capteurs. Revoir l'architecture réseau.",
      visaEncadreur: false,
      visaEtudiant: true
    },
    {
      id: 4,
      numero: 10,
      etudiant: "Fatma Zahra",
      sujet: "Cybersécurité et Protection des Données",
      date: "2024-03-20",
      heure: "09:00",
      duree: "1h45",
      statut: "validée",
      travauxEffectues: "Finalisation du rapport et préparation soutenance",
      observations: "Excellent travail. Prêt pour la soutenance.",
      visaEncadreur: true,
      visaEtudiant: true
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'programmée': 'bg-blue-100 text-blue-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'validée': 'bg-green-100 text-green-800',
      'annulée': 'bg-red-100 text-red-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'programmée': return <Calendar className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'validée': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Séances d'Encadrement</h1>
          <p className="text-gray-600 mt-1">Planification et suivi des séances avec vos étudiants</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Séance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Séances</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Programmées</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sessions.filter(s => s.statut === 'programmée').length}
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
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {sessions.filter(s => s.statut === 'en_attente').length}
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
                <p className="text-sm font-medium text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.statut === 'validée').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Liste des Séances</CardTitle>
              <CardDescription>
                Cliquez sur une séance pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSession?.id === session.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Séance #{session.numero} - {session.etudiant}
                        </h4>
                        <p className="text-sm text-gray-600">{session.sujet}</p>
                      </div>
                      <Badge className={getStatusBadge(session.statut)}>
                        {getStatusIcon(session.statut)}
                        <span className="ml-1 capitalize">{session.statut}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2 font-medium">{session.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Heure:</span>
                        <span className="ml-2 font-medium">{session.heure}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Durée:</span>
                        <span className="ml-2 font-medium">{session.duree}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">Visas:</span>
                        <span className="ml-2">
                          {session.visaEncadreur ? '✅' : '❌'} Encadreur
                          {' | '}
                          {session.visaEtudiant ? '✅' : '❌'} Étudiant
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Details */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-purple-600" />
              Détails de la Séance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSession ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Séance #{selectedSession.numero}
                  </h4>
                  <div className="text-sm space-y-2">
                    <div><span className="text-gray-500">Étudiant:</span> {selectedSession.etudiant}</div>
                    <div><span className="text-gray-500">Date:</span> {selectedSession.date}</div>
                    <div><span className="text-gray-500">Heure:</span> {selectedSession.heure}</div>
                    <div><span className="text-gray-500">Durée:</span> {selectedSession.duree}</div>
                  </div>
                </div>

                {selectedSession.travauxEffectues && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Travaux Effectués</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedSession.travauxEffectues}
                    </p>
                  </div>
                )}

                {selectedSession.observations && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Observations</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedSession.observations}
                    </p>
                  </div>
                )}

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Validation</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Visa Encadreur:</span>
                      <span className={selectedSession.visaEncadreur ? 'text-green-600' : 'text-red-600'}>
                        {selectedSession.visaEncadreur ? '✅ Validé' : '❌ En attente'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Visa Étudiant:</span>
                      <span className={selectedSession.visaEtudiant ? 'text-green-600' : 'text-red-600'}>
                        {selectedSession.visaEtudiant ? '✅ Validé' : '❌ En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  {selectedSession.statut === 'en_attente' && (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Valider
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Sélectionnez une séance pour voir les détails
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sessions;
