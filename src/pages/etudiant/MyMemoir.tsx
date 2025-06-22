
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MyMemoir = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const memoir = {
    titre: "Développement d'une Application Mobile de Gestion des Tâches",
    sujet: "Application Mobile avec React Native",
    encadreur: "Dr. Ahmed Ben Ali",
    progression: 75,
    phase: "Développement",
    dateDebut: "2024-01-15",
    dateEcheance: "2024-06-15",
    statut: "en_cours"
  };

  const phases = [
    { nom: "Choix du sujet", completed: true, date: "15/01/2024" },
    { nom: "Validation encadreur", completed: true, date: "20/01/2024" },
    { nom: "Validation administrative", completed: true, date: "25/01/2024" },
    { nom: "Recherche documentaire", completed: true, date: "15/02/2024" },
    { nom: "Conception", completed: true, date: "15/03/2024" },
    { nom: "Développement", completed: false, date: "En cours" },
    { nom: "Tests et validation", completed: false, date: "À venir" },
    { nom: "Rédaction finale", completed: false, date: "À venir" },
    { nom: "Dépôt du mémoire", completed: false, date: "À venir" },
    { nom: "Soutenance", completed: false, date: "À venir" }
  ];

  const documents = [
    {
      nom: "Cahier des charges",
      type: "PDF",
      taille: "1.2 MB",
      dateUpload: "2024-02-01",
      statut: "validé"
    },
    {
      nom: "Maquettes UI/UX",
      type: "PDF",
      taille: "3.5 MB",
      dateUpload: "2024-03-10",
      statut: "validé"
    },
    {
      nom: "Architecture technique",
      type: "PDF",
      taille: "2.1 MB",
      dateUpload: "2024-03-15",
      statut: "en_attente"
    }
  ];

  const sessions = [
    {
      numero: 7,
      date: "2024-03-20",
      sujet: "Révision de l'architecture",
      statut: "programmée"
    },
    {
      numero: 6,
      date: "2024-03-13",
      sujet: "Présentation des maquettes",
      statut: "validée"
    },
    {
      numero: 5,
      date: "2024-03-06",
      sujet: "Conception de l'interface",
      statut: "validée"
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'en_cours': 'bg-blue-100 text-blue-800',
      'validé': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'programmée': 'bg-purple-100 text-purple-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const completedPhases = phases.filter(phase => phase.completed).length;
  const progressPercentage = (completedPhases / phases.length) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Mémoire</h1>
          <p className="text-gray-600 mt-1">Suivi de votre projet de fin d'études</p>
        </div>
        <Badge className={getStatusBadge(memoir.statut)}>
          {memoir.statut === 'en_cours' ? <Clock className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
          {memoir.statut === 'en_cours' ? 'En cours' : 'Terminé'}
        </Badge>
      </div>

      {/* Memoir Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-violet-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Informations du Mémoire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{memoir.titre}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium w-20">Sujet:</span>
                    <span>{memoir.sujet}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">Encadreur:</span>
                    <span className="ml-2">{memoir.encadreur}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Période:</span>
                    <span className="ml-2">{memoir.dateDebut} → {memoir.dateEcheance}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Progression globale</span>
                <span className="text-lg font-bold text-blue-600">{memoir.progression}%</span>
              </div>
              <Progress value={memoir.progression} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Phase actuelle: {memoir.phase}</span>
                <span>{completedPhases}/{phases.length} étapes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Timeline */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Étapes du Projet
            </CardTitle>
            <CardDescription>
              Suivi détaillé de votre progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((phase, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  phase.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    phase.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {phase.completed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      phase.completed ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {phase.nom}
                    </p>
                    <p className="text-xs text-gray-500">{phase.date}</p>
                  </div>
                  {!phase.completed && index === completedPhases && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      En cours
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents & Upload */}
        <div className="space-y-6">
          {/* Documents */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-600" />
                Documents
              </CardTitle>
              <CardDescription>
                Vos documents déposés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{doc.nom}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.taille}</span>
                          <span>•</span>
                          <span>{doc.dateUpload}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(doc.statut)}>
                        {doc.statut === 'validé' ? '✓' : '⏳'}
                        <span className="ml-1">{doc.statut}</span>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5 text-orange-600" />
                Déposer un Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez votre fichier ici ou
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      parcourir vos fichiers
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX (Max. 10MB)
                  </p>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Déposer
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sessions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-green-600" />
            Séances d'Encadrement
          </CardTitle>
          <CardDescription>
            Historique de vos séances avec votre encadreur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((session, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Séance #{session.numero}
                  </Badge>
                  <Badge className={getStatusBadge(session.statut)}>
                    {session.statut === 'validée' ? '✓' : session.statut === 'programmée' ? '📅' : '⏳'}
                    <span className="ml-1">{session.statut}</span>
                  </Badge>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{session.sujet}</h4>
                <p className="text-xs text-gray-600">{session.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyMemoir;
