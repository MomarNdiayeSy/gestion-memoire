import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Search, Filter, Eye, Trash2, File, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  titre: string;
  type: 'MEMOIRE' | 'RAPPORT' | 'PRESENTATION' | 'AUTRE';
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  dateUpload: string;
  commentaire?: string;
}

const Documents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      titre: 'Mémoire_V1.pdf',
      type: 'MEMOIRE',
      statut: 'EN_ATTENTE',
      dateUpload: '2024-03-10',
      commentaire: 'En attente de validation'
    },
    {
      id: '2',
      titre: 'Présentation_Soutenance.pptx',
      type: 'PRESENTATION',
      statut: 'VALIDE',
      dateUpload: '2024-03-12'
    }
  ]);

  const categories = [
    { id: 'all', label: 'Tous', count: documents.length },
    { id: 'MEMOIRE', label: 'Mémoire', count: documents.filter(d => d.type === 'MEMOIRE').length },
    { id: 'PRESENTATION', label: 'Présentation', count: documents.filter(d => d.type === 'PRESENTATION').length },
    { id: 'RAPPORT', label: 'Rapport', count: documents.filter(d => d.type === 'RAPPORT').length },
    { id: 'AUTRE', label: 'Autre', count: documents.filter(d => d.type === 'AUTRE').length }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return "bg-green-100 text-green-800";
      case 'REJETE':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MEMOIRE':
        return "text-blue-600";
      case 'PRESENTATION':
        return "text-purple-600";
      case 'RAPPORT':
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.commentaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Implémenter la logique d'upload
    toast({
      title: "Upload en cours",
      description: "Votre document est en cours d'upload...",
    });
  };

  const handleDownload = (document: Document) => {
    // Implémenter la logique de téléchargement
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.titre} en cours...`,
    });
  };

  const handleDelete = (document: Document) => {
    // Implémenter la logique de suppression
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(docs => docs.filter(d => d.id !== document.id));
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
      });
    }
  };

  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
            <p className="text-gray-600 mt-1">Gérez vos documents et suivez leur statut</p>
          </div>
          <Button onClick={handleUpload} className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Upload className="mr-2 h-4 w-4" />
            Uploader un document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
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
                    {documents.filter(d => d.statut === 'VALIDE').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-green-600" />
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
                    {documents.filter(d => d.statut === 'EN_ATTENTE').length}
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
                  <p className="text-sm font-medium text-gray-600">Rejetés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {documents.filter(d => d.statut === 'REJETE').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-orange-600" />
              Déposer un Nouveau Document
            </CardTitle>
            <CardDescription>
              Ajoutez vos documents de travail pour validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Glissez-déposez vos fichiers ici ou
              </p>
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  parcourir vos fichiers
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.pptx,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PDF, PPTX, DOC, DOCX, ZIP, Images (Max. 25MB)
              </p>
            </div>
            {selectedFile && (
              <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Déposer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par titre, commentaire ou type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={filterType === category.id ? 'default' : 'outline'}
                    onClick={() => setFilterType(category.id)}
                    size="sm"
                    className="flex items-center"
                  >
                    {category.id === 'all' && <Filter className="mr-1 h-3 w-3" />}
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(document.type)}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{document.titre}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusBadge(document.statut)}>
                          {document.statut}
                        </Badge>
                        <Badge className={getStatusBadge(document.type.toLowerCase())}>
                          {document.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                  {document.commentaire}
                </CardDescription>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Uploadé:</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-700">{new Date(document.dateUpload).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleDownload(document)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleDelete(document)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
              <p className="text-gray-600">
                Essayez d'ajuster vos filtres ou téléchargez votre premier document.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Documents;
