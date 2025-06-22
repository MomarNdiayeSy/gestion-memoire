
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Search, Filter, Eye, Trash2, File, Calendar } from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const documents = [
    {
      id: 1,
      nom: "Cahier des charges final",
      type: "PDF",
      taille: "1.2 MB",
      dateUpload: "2024-02-01",
      dateModification: "2024-02-15",
      statut: "validé",
      categorie: "specifications",
      description: "Document définissant les spécifications complètes du projet"
    },
    {
      id: 2,
      nom: "Maquettes UI/UX",
      type: "PDF",
      taille: "3.5 MB",
      dateUpload: "2024-03-10",
      dateModification: "2024-03-12",
      statut: "validé",
      categorie: "design",
      description: "Maquettes haute fidélité de l'interface utilisateur"
    },
    {
      id: 3,
      nom: "Architecture technique",
      type: "PDF",
      taille: "2.1 MB",
      dateUpload: "2024-03-15",
      dateModification: "2024-03-15",
      statut: "en_attente",
      categorie: "technique",
      description: "Diagrammes d'architecture et choix techniques"
    },
    {
      id: 4,
      nom: "Rapport d'avancement - Mars",
      type: "DOCX",
      taille: "890 KB",
      dateUpload: "2024-03-18",
      dateModification: "2024-03-18",
      statut: "en_attente",
      categorie: "rapport",
      description: "Rapport mensuel de progression du projet"
    },
    {
      id: 5,
      nom: "Code source - Version 1.0",
      type: "ZIP",
      taille: "15.2 MB",
      dateUpload: "2024-03-20",
      dateModification: "2024-03-20",
      statut: "brouillon",
      categorie: "code",
      description: "Archive contenant le code source de l'application"
    },
    {
      id: 6,
      nom: "Documentation API",
      type: "PDF",
      taille: "1.8 MB",
      dateUpload: "2024-03-22",
      dateModification: "2024-03-22",
      statut: "brouillon",
      categorie: "technique",
      description: "Documentation complète de l'API développée"
    }
  ];

  const categories = [
    { id: 'all', label: 'Tous', count: documents.length },
    { id: 'specifications', label: 'Spécifications', count: documents.filter(d => d.categorie === 'specifications').length },
    { id: 'design', label: 'Design', count: documents.filter(d => d.categorie === 'design').length },
    { id: 'technique', label: 'Technique', count: documents.filter(d => d.categorie === 'technique').length },
    { id: 'rapport', label: 'Rapports', count: documents.filter(d => d.categorie === 'rapport').length },
    { id: 'code', label: 'Code', count: documents.filter(d => d.categorie === 'code').length }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'validé': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'refusé': 'bg-red-100 text-red-800',
      'brouillon': 'bg-gray-100 text-gray-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': 
      case 'doc': return '📝';
      case 'zip': 
      case 'rar': return '📦';
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️';
      default: return '📎';
    }
  };

  const getCategoryBadge = (categorie: string) => {
    const styles = {
      'specifications': 'bg-blue-100 text-blue-800',
      'design': 'bg-purple-100 text-purple-800',
      'technique': 'bg-orange-100 text-orange-800',
      'rapport': 'bg-green-100 text-green-800',
      'code': 'bg-gray-100 text-gray-800'
    };
    return styles[categorie as keyof typeof styles];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.categorie === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos documents de mémoire</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <Upload className="mr-2 h-4 w-4" />
          Nouveau Document
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
                  {documents.filter(d => d.statut === 'validé').length}
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
                  {documents.filter(d => d.statut === 'en_attente').length}
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
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-600">
                  {documents.filter(d => d.statut === 'brouillon').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <File className="h-4 w-4 text-gray-600" />
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
                accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, ZIP, Images (Max. 25MB)
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
                  placeholder="Rechercher par nom ou description..."
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
                  <div className="text-2xl">{getFileIcon(document.type)}</div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{document.nom}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusBadge(document.statut)}>
                        {document.statut === 'validé' ? '✓' : 
                         document.statut === 'en_attente' ? '⏳' : 
                         document.statut === 'refusé' ? '✗' : '📝'}
                        <span className="ml-1 capitalize">{document.statut.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getCategoryBadge(document.categorie)}>
                        {document.categorie}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                {document.description}
              </CardDescription>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">{document.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Taille:</span>
                  <span className="text-gray-700">{document.taille}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Uploadé:</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-700">{document.dateUpload}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Modifié:</span>
                  <span className="text-gray-700">{document.dateModification}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Eye className="mr-1 h-4 w-4" />
                  Voir
                </Button>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
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
  );
};

export default Documents;
