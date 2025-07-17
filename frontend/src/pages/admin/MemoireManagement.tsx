import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Download, Eye, Filter, CheckCircle, Clock, XCircle, Edit, Award } from 'lucide-react';
import { memoireApi } from '@/services/api';
import { toast } from 'sonner';

interface Document {
  id: string;
  nom: string;
  url: string;
  type: string;
  createdAt: Date;
}

interface Memoire {
  id: string;
  titre: string;
  description: string;
  status: string;
  motsCles: string[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  etudiant: {
    id: string;
    nom: string;
    prenom: string;
  };
  encadreur: {
    id: string;
    nom: string;
    prenom: string;
  };
  sujet: {
    id: string;
    titre: string;
  };
}

const MemoireManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemoires();
  }, []);

  const loadMemoires = async () => {
    try {
      setLoading(true);
      const data = await memoireApi.getAll();
      setMemoires(data);
    } catch (error) {
      console.error('Erreur lors du chargement des mémoires:', error);
      toast.error('Erreur lors du chargement des mémoires');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await memoireApi.updateStatus(id, { status: newStatus });
      toast.success('Statut du mémoire mis à jour avec succès');
      loadMemoires(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'EN_COURS': 'bg-blue-100 text-blue-800',
      'SOUMIS': 'bg-yellow-100 text-yellow-800',
      'EN_REVISION': 'bg-orange-100 text-orange-800',
      'VALIDE': 'bg-green-100 text-green-800',
      'REJETE': 'bg-red-100 text-red-800',
      'SOUTENU': 'bg-purple-100 text-purple-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EN_COURS': return <Clock className="h-4 w-4" />;
      case 'SOUMIS': return <FileText className="h-4 w-4" />;
      case 'EN_REVISION': return <Edit className="h-4 w-4" />;
      case 'VALIDE': return <CheckCircle className="h-4 w-4" />;
      case 'REJETE': return <XCircle className="h-4 w-4" />;
      case 'SOUTENU': return <Award className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusCount = (status: string) => {
    return memoires.filter(m => m.status === status).length;
  };

  const filteredMemoires = memoires.filter(memoire => {
    const matchesSearch = 
      memoire.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${memoire.etudiant.nom} ${memoire.etudiant.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${memoire.encadreur.nom} ${memoire.encadreur.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || memoire.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
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
                    {getStatusCount('EN_COURS')}
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
                    {getStatusCount('SOUMIS')}
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
                    {getStatusCount('VALIDE')}
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
                  variant={filterStatus === 'EN_COURS' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('EN_COURS')}
                >
                  En cours
                </Button>
                <Button
                  variant={filterStatus === 'SOUMIS' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('SOUMIS')}
                >
                  Soumis
                </Button>
                <Button
                  variant={filterStatus === 'EN_REVISION' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('EN_REVISION')}
                >
                  En révision
                </Button>
                <Button
                  variant={filterStatus === 'VALIDE' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('VALIDE')}
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
            {loading ? (
              <p>Chargement des mémoires...</p>
            ) : (
              <div className="space-y-4">
                {filteredMemoires.map((memoire) => (
                  <div key={memoire.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{memoire.titre}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Étudiant:</span>
                            <p className="font-medium text-gray-900">
                              {`${memoire.etudiant.prenom} ${memoire.etudiant.nom}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Encadreur:</span>
                            <p className="font-medium text-gray-900">
                              {`${memoire.encadreur.prenom} ${memoire.encadreur.nom}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Sujet:</span>
                            <p className="font-medium text-gray-900">{memoire.sujet.titre}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadge(memoire.status)}>
                          {getStatusIcon(memoire.status)}
                          <span className="ml-1">{memoire.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Documents */}
                    {memoire.documents.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                        <div className="space-y-2">
                          {memoire.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{doc.nom}</span>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Voir
                                  </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={doc.url} download>
                                    <Download className="h-4 w-4 mr-1" />
                                    Télécharger
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {memoire.status === 'SOUMIS' && (
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(memoire.id, 'VALIDE')}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          onClick={() => handleStatusUpdate(memoire.id, 'EN_REVISION')}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Demander des révisions
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(memoire.id, 'REJETE')}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MemoireManagement;
