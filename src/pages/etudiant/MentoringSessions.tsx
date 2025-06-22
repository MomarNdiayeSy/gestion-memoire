
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, CheckCircle, MessageSquare, User, FileText } from 'lucide-react';

const MentoringSessions = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [feedback, setFeedback] = useState('');

  const sessions = [
    {
      id: 1,
      numero: 8,
      date: "2024-03-20",
      heure: "14:00",
      duree: "1h30",
      sujet: "Révision de l'architecture technique",
      objectifs: ["Valider l'architecture proposée", "Discuter des choix techniques", "Planifier la phase de développement"],
      statut: "programmée",
      travauxEffectues: "",
      observations: "",
      encadreurNotes: "",
      visaEncadreur: false,
      visaEtudiant: false,
      type: "Suivi"
    },
    {
      id: 2,
      numero: 7,
      date: "2024-03-13",
      heure: "10:30",
      duree: "2h00",
      sujet: "Présentation des maquettes UI/UX",
      objectifs: ["Présenter les maquettes finalisées", "Recevoir feedback sur l'ergonomie", "Valider le parcours utilisateur"],
      statut: "validée",
      travauxEffectues: "Finalisation des maquettes haute fidélité avec Figma. Création du prototype interactif et tests utilisateur préliminaires.",
      observations: "Excellent travail sur les maquettes. L'interface est intuitive et moderne. Quelques ajustements mineurs à apporter sur la navigation.",
      encadreurNotes: "Très bon niveau de réalisation. Continuer avec la même rigueur pour la partie développement.",
      visaEncadreur: true,
      visaEtudiant: true,
      type: "Validation"
    },
    {
      id: 3,
      numero: 6,
      date: "2024-03-06",
      heure: "16:00",
      duree: "1h15",
      sujet: "Conception de l'interface utilisateur",
      objectifs: ["Définir la charte graphique", "Créer les wireframes", "Choisir les technologies front-end"],
      statut: "validée",
      travauxEffectues: "Création des wireframes pour toutes les pages principales. Définition de la palette de couleurs et sélection des polices.",
      observations: "Bon travail sur la conception. Les wireframes sont clairs et fonctionnels. Passer aux maquettes haute fidélité.",
      encadreurNotes: "Progression satisfaisante. Bien respecter les principes UX/UI lors des maquettages.",
      visaEncadreur: true,
      visaEtudiant: true,
      type: "Suivi"
    },
    {
      id: 4,
      numero: 5,
      date: "2024-02-28",
      heure: "14:30",
      duree: "1h45",
      sujet: "Analyse des besoins et spécifications",
      objectifs: ["Finaliser l'analyse des besoins", "Rédiger les spécifications techniques", "Planifier l'architecture"],
      statut: "validée",
      travauxEffectues: "Rédaction complète du cahier des charges. Diagrammes UML et spécifications fonctionnelles détaillées.",
      observations: "Très bon travail d'analyse. Cahier des charges complet et professionnel. Architecture bien pensée.",
      encadreurNotes: "Excellent niveau de documentation. Prêt pour passer à la phase de conception.",
      visaEncadreur: true,
      visaEtudiant: true,
      type: "Validation"
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

  const getTypeBadge = (type: string) => {
    const styles = {
      'Suivi': 'bg-purple-100 text-purple-800',
      'Validation': 'bg-orange-100 text-orange-800',
      'Révision': 'bg-blue-100 text-blue-800'
    };
    return styles[type as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'programmée': return <Calendar className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'validée': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleValidateSession = () => {
    if (selectedSession) {
      console.log('Validation séance:', selectedSession.id, feedback);
      setFeedback('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Séances d'Encadrement</h1>
          <p className="text-gray-600 mt-1">Suivi de vos rencontres avec votre encadreur</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">{sessions.filter(s => s.statut === 'validée').length} validées</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">{sessions.filter(s => s.statut === 'programmée').length} programmées</span>
          </div>
        </div>
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
                <p className="text-sm font-medium text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((sessions.filter(s => s.statut === 'validée').length / 10) * 100)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
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
              <CardTitle>Historique des Séances</CardTitle>
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
                          Séance #{session.numero} - {session.sujet}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusBadge(session.statut)}>
                            {getStatusIcon(session.statut)}
                            <span className="ml-1 capitalize">{session.statut}</span>
                          </Badge>
                          <Badge className={getTypeBadge(session.type)}>
                            {session.type}
                          </Badge>
                        </div>
                      </div>
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
                          {session.visaEtudiant ? '✅' : '❌'} Vous
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
              <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
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
                    <div><span className="text-gray-500">Sujet:</span> {selectedSession.sujet}</div>
                    <div><span className="text-gray-500">Date:</span> {selectedSession.date}</div>
                    <div><span className="text-gray-500">Heure:</span> {selectedSession.heure}</div>
                    <div><span className="text-gray-500">Durée:</span> {selectedSession.duree}</div>
                    <div><span className="text-gray-500">Type:</span> {selectedSession.type}</div>
                  </div>
                </div>

                {selectedSession.objectifs && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Objectifs</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedSession.objectifs.map((obj: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                    <h5 className="font-medium text-gray-700 mb-2">Observations de l'Encadreur</h5>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {selectedSession.observations}
                    </p>
                  </div>
                )}

                {selectedSession.encadreurNotes && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      {selectedSession.encadreurNotes}
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
                      <span>Votre Visa:</span>
                      <span className={selectedSession.visaEtudiant ? 'text-green-600' : 'text-red-600'}>
                        {selectedSession.visaEtudiant ? '✅ Validé' : '❌ En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSession.statut === 'en_attente' && !selectedSession.visaEtudiant && (
                  <div className="pt-4 border-t">
                    <h5 className="font-medium text-gray-700 mb-2">Votre Feedback</h5>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Ajoutez vos commentaires sur cette séance..."
                      rows={3}
                      className="mb-3"
                    />
                    <Button 
                      onClick={handleValidateSession}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Valider la Séance
                    </Button>
                  </div>
                )}
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

export default MentoringSessions;
