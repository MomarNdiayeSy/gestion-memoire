
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, FileText, CreditCard, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const EtudiantDashboard = () => {
  const currentMemoir = {
    title: "Développement d'une Application Mobile de Gestion des Tâches",
    encadreur: "Dr. Ahmed Ben Ali",
    progress: 65,
    phase: "Développement",
    nextSession: "Vendredi 15 Mars à 14:00"
  };

  const tasks = [
    { task: "Choisir un sujet", completed: true, dueDate: "15 Jan 2024" },
    { task: "Validation encadreur", completed: true, dueDate: "20 Jan 2024" },
    { task: "Validation administrative", completed: true, dueDate: "25 Jan 2024" },
    { task: "Séances d'encadrement (6/10)", completed: false, dueDate: "En cours" },
    { task: "Rédaction mémoire", completed: false, dueDate: "15 Avr 2024" },
    { task: "Paiement frais soutenance", completed: false, dueDate: "20 Avr 2024" },
    { task: "Dépôt mémoire final", completed: false, dueDate: "30 Avr 2024" },
    { task: "Soutenance", completed: false, dueDate: "Mai 2024" },
  ];

  const recentSessions = [
    { 
      numero: 6, 
      date: "10 Mars 2024", 
      sujet: "Conception de l'interface utilisateur",
      statut: "Validée",
      remarques: "Bon travail sur les maquettes"
    },
    { 
      numero: 5, 
      date: "3 Mars 2024", 
      sujet: "Architecture de l'application",
      statut: "Validée",
      remarques: "Revoir la base de données"
    },
    { 
      numero: 4, 
      date: "24 Fév 2024", 
      sujet: "Étude de l'existant",
      statut: "Validée",
      remarques: "Très complet"
    },
  ];

  const notifications = [
    {
      type: "warning",
      title: "Séance programmée",
      message: "Prochaine séance vendredi à 14:00",
      time: "Il y a 2h"
    },
    {
      type: "info",
      title: "Nouveau document",
      message: "Votre encadreur a ajouté des commentaires",
      time: "Il y a 1j"
    },
    {
      type: "success",
      title: "Séance validée",
      message: "Séance #6 validée avec succès",
      time: "Il y a 2j"
    }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace Étudiant</h1>
          <p className="text-gray-600 mt-1">Suivez l'avancement de votre mémoire</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <Upload className="mr-2 h-4 w-4" />
          Déposer un document
        </Button>
      </div>

      {/* Current Memoir Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-violet-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Mon Mémoire Actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentMemoir.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Encadreur:</span> {currentMemoir.encadreur}</p>
                <p><span className="font-medium">Phase actuelle:</span> 
                  <Badge className="ml-2 bg-blue-100 text-blue-800">{currentMemoir.phase}</Badge>
                </p>
                <p><span className="font-medium">Prochaine séance:</span> {currentMemoir.nextSession}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression globale</span>
                <span className="text-sm font-bold text-blue-600">{currentMemoir.progress}%</span>
              </div>
              <Progress value={currentMemoir.progress} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">
                {completedTasks} sur {tasks.length} étapes complétées
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Étapes du Mémoire
              </CardTitle>
              <CardDescription>
                Suivi détaillé de votre progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                    task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      task.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        task.completed ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-500">Échéance: {task.dueDate}</p>
                    </div>
                    {!task.completed && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        En attente
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notif.type === 'warning' ? 'bg-orange-500' :
                      notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
            Séances d'Encadrement Récentes
          </CardTitle>
          <CardDescription>
            Historique de vos dernières séances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSessions.map((session, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    Séance #{session.numero}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {session.statut}
                  </Badge>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{session.sujet}</h4>
                <p className="text-xs text-gray-600 mb-2">{session.date}</p>
                <p className="text-xs text-gray-500 italic">"{session.remarques}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EtudiantDashboard;
