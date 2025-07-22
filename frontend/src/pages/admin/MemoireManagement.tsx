import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Award,
  Pencil,
} from 'lucide-react';
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
  status: 'EN_COURS' | 'SOUMIS' | 'EN_REVISION' | 'VALIDE' | 'REJETE' | 'SOUTENU';
  motsCles: string[];
  documents: Document[];
  dateDepot?: Date;
  dateSoutenance?: Date;
  etudiant: { id: string; nom: string; prenom: string };
  encadreur: { id: string; nom: string; prenom: string };
  sujet: { id: string; titre: string };
}

const MemoireManagement = () => {
  /* --------------------------- Local state --------------------------- */
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Memoire['status']>('all');

  // edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [currentMemoire, setCurrentMemoire] = useState<Memoire | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    motsCles: '',
    dateDepot: '',
    dateSoutenance: '',
  });

  /* --------------------------- Fetch data --------------------------- */
  useEffect(() => {
    loadMemoires();
  }, []);

  const loadMemoires = async () => {
    try {
      setLoading(true);
      const data = await memoireApi.getAll();
      setMemoires(data);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des mémoires');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------- Helpers UI ---------------------------- */
  const getStatusBadge = (status: Memoire['status']) => {
    const styles: Record<Memoire['status'], string> = {
      EN_COURS: 'bg-blue-100 text-blue-800',
      SOUMIS: 'bg-yellow-100 text-yellow-800',
      EN_REVISION: 'bg-orange-100 text-orange-800',
      VALIDE: 'bg-green-100 text-green-800',
      REJETE: 'bg-red-100 text-red-800',
      SOUTENU: 'bg-purple-100 text-purple-800',
    } as const;
    return styles[status];
  };

  const getStatusIcon = (status: Memoire['status']) => {
    switch (status) {
      case 'EN_COURS':
        return <Clock className="h-4 w-4" />;
      case 'SOUMIS':
        return <FileText className="h-4 w-4" />;
      case 'EN_REVISION':
        return <Edit className="h-4 w-4" />;
      case 'VALIDE':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJETE':
        return <XCircle className="h-4 w-4" />;
      case 'SOUTENU':
        return <Award className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusCount = (status: Memoire['status']) => memoires.filter((m) => m.status === status).length;

  /* ----------------------- Mutations handlers ----------------------- */
  const handleStatusUpdate = async (id: string, newStatus: Memoire['status']) => {
    try {
      await memoireApi.updateStatus(id, { status: newStatus });
      toast.success('Statut mis à jour');
      loadMemoires();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleEditSubmit = async () => {
    if (!currentMemoire) return;
    try {
      await memoireApi.update(currentMemoire.id, {
        titre: formData.titre,
        description: formData.description,
        motsCles: formData.motsCles.split(',').map((m) => m.trim()),
        dateDepot: formData.dateDepot || undefined,
        dateSoutenance: formData.dateSoutenance || undefined,
      });
      toast.success('Mémoire mis à jour');
      setEditOpen(false);
      loadMemoires();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  /* --------------------------- Derived data ------------------------- */
  const filteredMemoires = memoires.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.titre.toLowerCase().includes(term) ||
      `${m.etudiant.nom} ${m.etudiant.prenom}`.toLowerCase().includes(term) ||
      `${m.encadreur.nom} ${m.encadreur.prenom}`.toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  /* ------------------------------ JSX ------------------------------ */
  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Mémoires</h1>
            <p className="text-gray-600 mt-1">Suivi et validation des mémoires déposés</p>
          </div>
        </div>

        {/* Stats */}
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
                  <p className="text-2xl font-bold text-blue-600">{getStatusCount('EN_COURS')}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Déposés</p>
                  <p className="text-2xl font-bold text-yellow-600">{getStatusCount('SOUMIS')}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validés</p>
                  <p className="text-2xl font-bold text-green-600">{getStatusCount('VALIDE')}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, étudiant ou encadreur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Tous' },
                  { key: 'EN_COURS', label: 'En cours' },
                  { key: 'SOUMIS', label: 'Soumis' },
                  { key: 'EN_REVISION', label: 'En révision' },
                  { key: 'VALIDE', label: 'Validés' },
                ].map((f) => (
                  <Button
                    key={f.key}
                    variant={filterStatus === f.key ? 'default' : 'outline'}
                    onClick={() => setFilterStatus(f.key as any)}
                    className="flex items-center"
                  >
                    {f.key === 'all' && <Filter className="mr-2 h-4 w-4" />} {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Mémoires</CardTitle>
            <CardDescription>{filteredMemoires.length} mémoire(s) trouvé(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Chargement des mémoires...</p>
            ) : (
              <div className="space-y-4">
                {filteredMemoires.map((m) => (
                  <div
                    key={m.id}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{m.titre}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Étudiant:</span>
                            <p className="font-medium text-gray-900">
                              {`${m.etudiant.prenom} ${m.etudiant.nom}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Encadreur:</span>
                            <p className="font-medium text-gray-900">
                              {`${m.encadreur.prenom} ${m.encadreur.nom}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Sujet:</span>
                            <p className="font-medium text-gray-900">{m.sujet.titre}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date dépôt:</span>
                            <p className="font-medium text-gray-900">
                              {m.dateDepot ? new Date(m.dateDepot).toLocaleDateString() : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date soutenance:</span>
                            <p className="font-medium text-gray-900">
                              {m.dateSoutenance ? new Date(m.dateSoutenance).toLocaleDateString() : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadge(m.status)}>
                          {getStatusIcon(m.status)}
                          <span className="ml-1">{m.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Documents */}
                    {m.documents.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                        <div className="space-y-2">
                          {m.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{doc.nom}</span>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4 mr-1" /> Voir
                                  </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={doc.url} download>
                                    <Download className="h-4 w-4 mr-1" /> Télécharger
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex space-x-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentMemoire(m);
                          setFormData({
                            titre: m.titre,
                            description: m.description ?? '',
                            motsCles: m.motsCles?.join(', ') ?? '',
                            dateDepot: m.dateDepot ? new Date(m.dateDepot).toISOString().slice(0, 10) : '',
                            dateSoutenance: m.dateSoutenance ? new Date(m.dateSoutenance).toISOString().slice(0, 10) : '',
                          });
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Éditer
                      </Button>
                      {m.status === 'SOUMIS' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusUpdate(m.id, 'VALIDE')}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" /> Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            onClick={() => handleStatusUpdate(m.id, 'EN_REVISION')}
                          >
                            <Edit className="mr-1 h-4 w-4" /> Demander des révisions
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(m.id, 'REJETE')}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Refuser
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le mémoire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="Titre"
            />
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              value={formData.motsCles}
              onChange={(e) => setFormData({ ...formData, motsCles: e.target.value })}
              placeholder="Mots-clés séparés par des virgules"
            />
            <Input
              type="date"
              value={formData.dateDepot}
              onChange={(e) => setFormData({ ...formData, dateDepot: e.target.value })}
            />
            <Input
              type="date"
              value={formData.dateSoutenance}
              onChange={(e) => setFormData({ ...formData, dateSoutenance: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MemoireManagement;