import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  MoreVertical,
  Upload,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Memoire {
  id: string;
  titre: string;
  description: string;
  statut: 'EN_COURS' | 'EN_REVISION' | 'VALIDE' | 'SOUTENANCE_PLANIFIEE';
  progression: number;
  dateSoutenance?: string;
  encadreur: {
    nom: string;
    prenom: string;
  };
  commentaires: {
    id: string;
    texte: string;
    date: string;
    auteur: string;
  }[];
  versions: {
    id: string;
    numero: string;
    date: string;
    commentaire: string;
    fichier: string;
  }[];
}

const MyMemoir = () => {
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Données fictives pour le mémoire
  const [memoire] = React.useState<Memoire>({
    id: '1',
    titre: 'Développement d\'une application de gestion de mémoires',
    description: 'Application web permettant la gestion des mémoires de fin d\'études, incluant le suivi des étudiants, la gestion des soutenances et les paiements.',
    statut: 'EN_COURS',
    progression: 75,
    encadreur: {
      nom: 'Diop',
      prenom: 'Abdoulaye'
    },
    commentaires: [
      {
        id: '1',
        texte: 'La méthodologie est bien détaillée, mais il faudrait approfondir la partie sur les tests unitaires.',
        date: '2024-03-15',
        auteur: 'Dr. Diop'
      },
      {
        id: '2',
        texte: 'Les diagrammes de séquence sont à revoir pour mieux illustrer les interactions.',
        date: '2024-03-14',
        auteur: 'Dr. Diop'
      }
    ],
    versions: [
      {
        id: '1',
        numero: 'v1.0',
        date: '2024-03-10',
        commentaire: 'Première version complète',
        fichier: 'memoire_v1.0.pdf'
      },
      {
        id: '2',
        numero: 'v1.1',
        date: '2024-03-15',
        commentaire: 'Corrections suite aux retours',
        fichier: 'memoire_v1.1.pdf'
      }
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadVersion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData(event.currentTarget);
    
    toast({
      title: "Version uploadée",
      description: "La nouvelle version a été uploadée avec succès",
    });
    setIsUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return "bg-green-100 text-green-800";
      case 'EN_REVISION':
        return "bg-yellow-100 text-yellow-800";
      case 'SOUTENANCE_PLANIFIEE':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Mémoire</h1>
            <p className="text-gray-600 mt-1">Gérez et suivez l'avancement de votre mémoire</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Upload className="mr-2 h-4 w-4" />
                Nouvelle Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Uploader une nouvelle version</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle version de votre mémoire
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUploadVersion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="version">
                    Numéro de version
                  </label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="ex: v1.2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="commentaire">
                    Commentaire
                  </label>
                  <Textarea
                    id="commentaire"
                    name="commentaire"
                    placeholder="Décrivez les modifications apportées"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="file">
                    Fichier
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsUploadDialogOpen(false);
                    setSelectedFile(null);
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={!selectedFile}>
                    Uploader
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{memoire.progression}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Versions</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {memoire.versions.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commentaires</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {memoire.commentaires.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations Générales */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">{memoire.titre}</h3>
                <p className="text-gray-600 mt-2">{memoire.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className={getStatusBadge(memoire.statut)}>
                  {memoire.statut}
                </Badge>
                {memoire.dateSoutenance && (
                  <Badge variant="outline">
                    Soutenance le {new Date(memoire.dateSoutenance).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Encadré par {memoire.encadreur.prenom} {memoire.encadreur.nom}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Progression globale</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(memoire.progression)}`}
                    style={{ width: `${memoire.progression}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Versions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Versions du Mémoire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memoire.versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Version {version.numero}</h3>
                      <p className="text-sm text-gray-500">{version.commentaire}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(version.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commentaires */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Commentaires de l'Encadreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memoire.commentaires.map((commentaire) => (
                <div
                  key={commentaire.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{commentaire.auteur}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(commentaire.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600">{commentaire.texte}</p>
                </div>
              ))}

              {memoire.commentaires.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucun commentaire pour le moment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyMemoir;
