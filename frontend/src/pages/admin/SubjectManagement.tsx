import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Plus, Edit, Trash2, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { sujetApi } from '@/services/api';
import { toast } from 'sonner';

interface Sujet {
  id: string;
  titre: string;
  description: string;
  status: string;
  motsCles: string[];
  dateValidation?: Date;
  createdAt: Date;
  encadreur: {
    nom: string;
    prenom: string;
    specialite: string;
  };
  memoires: {
    id: string;
    etudiant: {
      nom: string;
      prenom: string;
    };
  }[];
}

const SubjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [subjects, setSubjects] = useState<Sujet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSujets();
  }, []);

  const loadSujets = async () => {
    try {
      setLoading(true);
      const data = await sujetApi.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sujets:', error);
      toast.error('Erreur lors du chargement des sujets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await sujetApi.updateStatus(id, newStatus);
      toast.success('Statut du sujet mis à jour avec succès');
      loadSujets(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      VALIDE: 'bg-green-100 text-green-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      REJETE: 'bg-red-100 text-red-800',
      ATTRIBUE: 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDE': return <CheckCircle className="h-4 w-4" />;
      case 'EN_ATTENTE': return <Clock className="h-4 w-4" />;
      case 'REJETE': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = 
      subject.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${subject.encadreur.nom} ${subject.encadreur.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subject.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    return subjects.filter(s => s.status === status).length;
  };

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
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
                    {getStatusCount('VALIDE')}
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
                    {getStatusCount('EN_ATTENTE')}
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
                    {getStatusCount('REJETE')}
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
                  variant={filterStatus === 'VALIDE' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('VALIDE')}
                >
                  Validés
                </Button>
                <Button
                  variant={filterStatus === 'EN_ATTENTE' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('EN_ATTENTE')}
                >
                  En attente
                </Button>
                <Button
                  variant={filterStatus === 'REJETE' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('REJETE')}
                >
                  Refusés
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <p>Chargement des sujets...</p>
          ) : (
            filteredSubjects.map((subject) => (
              <Card key={subject.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-2">{subject.titre}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusBadge(subject.status)}>
                          {getStatusIcon(subject.status)}
                          <span className="ml-1">{subject.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {subject.encadreur.specialite}
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
                      <span className="font-medium text-gray-900">
                        {`${subject.encadreur.prenom} ${subject.encadreur.nom}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Date de proposition:</span>
                      <span className="text-gray-700">
                        {new Date(subject.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Étudiants intéressés:</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {subject.memoires.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {subject.status === 'EN_ATTENTE' && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(subject.id, 'VALIDE')}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(subject.id, 'REJETE')}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Refuser
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubjectManagement;
