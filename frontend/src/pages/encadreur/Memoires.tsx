import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Download, Eye, Filter, CheckCircle, Clock, XCircle, Edit, Award } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoireApi } from '@/services/api';

const Memoires = () => {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: memoires = [], isFetching } = useQuery<any[]>({
    queryKey: ['encadreur-memoires'],
    queryFn: () => memoireApi.getAll(),
  });

  /* ------------------------- Mutation accept/refuse ------------------------- */
  // Mutation statuts classiques EN REVISION / VALIDÉ etc.
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'VALIDE' | 'REJETE' }) => memoireApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encadreur-memoires'] });
    },
  });

  // Mutation validation finale (encadreur)
  const validateFinalMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'ACCEPTE' | 'REFUSE'; commentaire?: string }) =>
      memoireApi.validateFinalEncadreur(id, action),
    onSuccess: () => {
      toast({ title: 'Action enregistrée' });
      queryClient.invalidateQueries({ queryKey: ['encadreur-memoires'] });
    },
  });

  // Mutation commentaire document
  const commentMutation = useMutation({
    mutationFn: ({ docId, commentaire }: { docId: string; commentaire: string }) =>
      memoireApi.updateDocumentComment(docId, { commentaire }),
    onSuccess: () => {
      toast({ title: 'Commentaire enregistré' });
      queryClient.invalidateQueries({ queryKey: ['encadreur-memoires'] });
    },
  });

  // Helpers utilitaires pour l’affichage des statuts
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      EN_COURS: 'bg-blue-100 text-blue-800',
      SOUMIS: 'bg-yellow-100 text-yellow-800',
      EN_REVISION: 'bg-orange-100 text-orange-800',
      VALIDE: 'bg-green-100 text-green-800',
      REJETE: 'bg-red-100 text-red-800',
      SOUTENU: 'bg-purple-100 text-purple-800',
    };
    return (styles as any)[status] ?? 'bg-gray-100 text-gray-800';
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

  const getProgress = (memoire: any): number => {
    if (memoire.progression && memoire.progression > 0) {
      return memoire.progression;
    }
    const status = memoire.status;
    switch (status) {
      case 'EN_COURS':
        return 25;
      case 'SOUMIS':
        return 50;
      case 'SOUMIS_FINAL':
        return 75;
      case 'VALIDE_ENCADREUR':
        return 85;
      case 'EN_REVISION':
        return 75;
      case 'SOUTENU':
        return 100;
      case 'VALIDE':
      case 'VALIDE_ADMIN':
        return 100;
      default:
        return 0;
    }
  };

  const filteredMemoires = memoires.filter((memoire: any) => {
    const étudiantNomComplet = `${memoire.etudiant?.prenom ?? ''} ${memoire.etudiant?.nom ?? ''}`.toLowerCase();
    const sujetTitre = memoire.sujet?.titre?.toLowerCase() ?? '';
    const matchesSearch = memoire.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         étudiantNomComplet.includes(searchTerm.toLowerCase()) ||
                          sujetTitre.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || memoire.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mémoires</h1>
            <p className="text-gray-600 mt-1">Suivi et évaluation des mémoires de vos étudiants</p>
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
                  <p className="text-sm font-medium text-gray-600">Validés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {memoires.filter(m => m.status === 'VALIDE').length}
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
                  <p className="text-sm font-medium text-gray-600">Refusés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {memoires.filter(m => m.status === 'REJETE').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Soutenus</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {memoires.filter(m => m.status === 'SOUTENU').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par titre, étudiant ou sujet..."
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
                  variant={filterStatus === 'REJETE' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('REJETE')}
                >
                  Refusés
                </Button>
                <Button
                  variant={filterStatus === 'SOUTENU' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('SOUTENU')}
                >
                  Soutenus
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Étudiant:</span>
                          <p className="font-medium text-gray-900">{`${memoire.etudiant?.prenom} ${memoire.etudiant?.nom}`}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Sujet:</span>
                          <p className="font-medium text-gray-900">{memoire.sujet?.titre}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(memoire.status)}>
                        {getStatusIcon(memoire.status)}
                        <span className="ml-1 capitalize">{memoire.status.replace('_', ' ').toLowerCase()}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium text-gray-900">{getProgress(memoire)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(memoire)}%` }}
                      />
                    </div>
                  </div>

                  {/* Versions / Documents */}
                  {memoire.documents && memoire.documents.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <h5 className="font-medium text-gray-700">Versions</h5>
                      {memoire.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="text-sm flex-1">
                            <span className="font-medium mr-2">{doc.numero}</span>
                            <span className="text-gray-500 mr-4">{new Date(doc.date).toLocaleDateString()}</span>
                            {doc.commentaire && doc.commentaire.trim() !== '' && (
                              <span className="text-green-700">Commentaire ajouté</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(doc.fichierUrl, '_blank')}>
                              <Eye className="h-4 w-4 mr-1" />Voir
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedDoc(doc);
                                setCommentText(doc.commentaire ?? '');
                                setIsCommentDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />Commenter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Info and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {memoire.fichierUrl ? (
                        <div className="flex items-center space-x-4">
                          <span>Fichier final</span>
                          <span>Déposé le: {memoire.dateDepot ? new Date(memoire.dateDepot).toLocaleDateString() : '—'}</span>
                        </div>
                      ) : (
                        <span className="text-orange-600">Aucun fichier final</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {memoire.status === 'SOUMIS_FINAL' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => validateFinalMutation.mutate({ id: memoire.id, action: 'ACCEPTE' })}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => validateFinalMutation.mutate({ id: memoire.id, action: 'REFUSE' })}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Refuser
                          </Button>
                        </>
                      )}
                      {memoire.fichierUrl && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => window.open(memoire.fichierUrl, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Consulter
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

        {/* Dialog Commentaire */}
        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Commenter le document {selectedDoc?.numero}</DialogTitle>
            </DialogHeader>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Votre commentaire..."
              className="min-h-[120px]"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>Annuler</Button>
              <Button
                onClick={() => {
                  if (!selectedDoc) return;
                  commentMutation.mutate({ docId: selectedDoc.id, commentaire: commentText });
                }}
                disabled={commentMutation.isPending}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Memoires;