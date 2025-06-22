
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Calendar, FileText, MessageSquare, Eye } from 'lucide-react';

const MyStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: 1,
      nom: "Marie Dupont",
      email: "marie.dupont@isi.edu",
      telephone: "+216 98 123 456",
      classe: "3ème année GL",
      sujet: "Système de Recommandation Intelligent",
      progression: 85,
      statut: "actif",
      seances: {
        total: 10,
        effectuees: 8,
        prochaine: "2024-03-20 14:00"
      },
      derniereActivite: "Il y a 2 jours"
    },
    {
      id: 2,
      nom: "Ahmed Trabelsi",
      email: "ahmed.trabelsi@isi.edu",
      telephone: "+216 97 234 567",
      classe: "3ème année RT",
      sujet: "Intelligence Artificielle et Machine Learning",
      progression: 60,
      statut: "actif",
      seances: {
        total: 10,
        effectuees: 5,
        prochaine: "2024-03-22 10:30"
      },
      derniereActivite: "Il y a 1 jour"
    },
    {
      id: 3,
      nom: "Mohamed Salah",
      email: "mohamed.salah@isi.edu",
      telephone: "+216 96 345 678",
      classe: "3ème année GL",
      sujet: "Internet des Objets pour Smart Cities",
      progression: 45,
      statut: "retard",
      seances: {
        total: 10,
        effectuees: 3,
        prochaine: "2024-03-25 16:00"
      },
      derniereActivite: "Il y a 5 jours"
    },
    {
      id: 4,
      nom: "Fatma Zahra",
      email: "fatma.zahra@isi.edu",
      telephone: "+216 95 456 789",
      classe: "3ème année GL",
      sujet: "Cybersécurité et Protection des Données",
      progression: 92,
      statut: "soutenance",
      seances: {
        total: 10,
        effectuees: 10,
        prochaine: "Terminé"
      },
      derniereActivite: "Il y a 1 heure"
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      actif: 'bg-green-100 text-green-800',
      retard: 'bg-red-100 text-red-800',
      soutenance: 'bg-purple-100 text-purple-800',
      terminé: 'bg-gray-100 text-gray-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getProgressColor = (progression: number) => {
    if (progression >= 80) return 'bg-green-500';
    if (progression >= 60) return 'bg-blue-500';
    if (progression >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Étudiants</h1>
          <p className="text-gray-600 mt-1">Suivi et encadrement de vos étudiants</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Étudiants</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.statut === 'actif').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.statut === 'retard').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression Moy.</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(students.reduce((sum, s) => sum + s.progression, 0) / students.length)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, sujet ou classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {student.nom.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{student.nom}</CardTitle>
                    <p className="text-sm text-gray-500">{student.classe}</p>
                  </div>
                </div>
                <Badge className={getStatusBadge(student.statut)}>
                  {student.statut === 'actif' ? '✓' : 
                   student.statut === 'retard' ? '⚠️' : 
                   student.statut === 'soutenance' ? '🎓' : '✅'}
                  <span className="ml-1 capitalize">{student.statut}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-700">{student.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Téléphone:</span>
                    <span className="text-gray-700">{student.telephone}</span>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Sujet de mémoire</h5>
                  <p className="text-sm text-gray-600">{student.sujet}</p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-bold text-gray-900">{student.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(student.progression)}`}
                      style={{ width: `${student.progression}%` }}
                    />
                  </div>
                </div>

                {/* Sessions Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Séances:</span>
                    <p className="font-medium text-gray-900">
                      {student.seances.effectuees}/{student.seances.total}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Prochaine:</span>
                    <p className="font-medium text-gray-900">{student.seances.prochaine}</p>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Dernière activité: {student.derniereActivite}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyStudents;
