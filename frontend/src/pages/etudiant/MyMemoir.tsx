import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoireApi, sessionApi } from '@/services/api';
import { useAuth } from '@/stores/authStore';
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
  Upload,
  User
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Version {
  description?: string;
  id: string;
  numero: string;
  date: string;
  commentaire: string;
  fichierUrl: string;
}

interface Memoire {
  id: string;
  titre: string;
  description: string;
  status: 'EN_COURS' | 'EN_REVISION' | 'VALIDE' | 'SOUTENANCE_PLANIFIEE';
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
  versions: Version[];
  documents: Version[];
}

const MyMemoir = () => {
  const safeArray = <T,>(arr: T[] | undefined | null): T[] => Array.isArray(arr) ? arr : [];

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isFinalDialogOpen, setIsFinalDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Memoire de l'étudiant
  const { data: memoire, isFetching } = useQuery<any | null>({
    queryKey: ['my-memoire'],
    queryFn: () => memoireApi.getMy(),
  });

  const commentsCount = memoire ? safeArray((memoire as any).commentaires).length + safeArray((memoire as any).documents).filter((d: any) => d.commentaire && d.commentaire.trim() !== '').length : 0;

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

  // Sessions de mentoring de l'étudiant
  const { data: sessions = [] } = useQuery<any[]>({
    queryKey: ['my-sessions'],
    queryFn: () => sessionApi.getAll(),
  });

  const sessionsCount = sessions.filter((s: any) => s.etudiantId === user?.id).length;
  const alreadyFinal = Boolean((memoire as any)?.fichierFinalUrl) || ['SOUMIS_FINAL', 'VALIDE_ENCADREUR', 'VALIDE_ADMIN'].includes((memoire as any)?.status ?? '');
  const canDepositFinal = memoire && !alreadyFinal && sessionsCount >= 10;

  const finalMutation = useMutation({
    mutationFn: async (payload: { file: File; description: string }) => {
      if (!memoire) throw new Error('Aucun mémoire');
      const fd = new FormData();
      fd.append('file', payload.file);
      fd.append('description', payload.description);
      return await memoireApi.depositFinal(memoire.id, fd);
    },
    onSuccess: () => {
      toast({ title: 'Mémoire final déposé', description: 'En attente de validation de votre encadreur' });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['my-memoire'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (payload: { numero: string; description: string; file: File }) => {
      if (!memoire) throw new Error('Aucun mémoire');
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('description', payload.description);
      formData.append('numero', payload.numero);
      
      return await memoireApi.addDocument(memoire.id, formData);
    },
    onSuccess: () => {
      toast({ title: 'Version uploadée', description: 'La nouvelle version a été envoyée' });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['my-memoire'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: "Échec de l'upload", variant: 'destructive' });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadVersion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !memoire) return;

    const formData = new FormData(event.currentTarget);
    const numero = formData.get('numero') as string;
    const description = formData.get('description') as string;
    uploadMutation.mutate({ numero, description, file: selectedFile });
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

  if (isFetching) return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="p-8 text-center">Chargement...</div>
    </DashboardLayout>
  );

  if (!memoire) {
    return (
      <DashboardLayout allowedRoles={['ETUDIANT']}>
        <div className="p-8 text-center">Vous n'avez pas encore de mémoire.</div>
      </DashboardLayout>
    );
  }

  const versions: Version[] = safeArray(((memoire as any).versions ?? (memoire as any).documents) as Version[]);

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
                    id="numero"
                    name="numero"
                    placeholder="ex: v1.2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
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

            {/* Bouton Déposer fichier final – visible seulement si un mémoire existe */}
            {/* Bouton Déposer fichier final */}
            {memoire && canDepositFinal && (
              <Dialog open={isFinalDialogOpen} onOpenChange={setIsFinalDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      if (alreadyFinal) {
                        e.preventDefault();
                        toast({ variant: 'destructive', title: 'Dépôt impossible', description: 'Le fichier final a déjà été déposé.' });
                        return;
                      }
                      if (sessionsCount < 10) {
                        e.preventDefault();
                        toast({ variant: 'destructive', title: 'Dépôt impossible', description: 'Vous devez effectuer au moins 10 séances avant de déposer votre fichier final.' });
                        return;
                      }
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Déposer le fichier final
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Déposer votre fichier final</DialogTitle>
                    <DialogDescription>
                      Téléchargez la version finale de votre mémoire pour validation.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!selectedFile) return;
                      finalMutation.mutate({ file: selectedFile, description: (e.currentTarget as any).description.value });
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="description">
                        Description
                      </label>
                      <Textarea id="description" name="description" placeholder="Ex: Version finale validée par l'encadreur" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="file-final">
                        Fichier
                      </label>
                      <Input id="file-final" name="file-final" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} required />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => { setIsFinalDialogOpen(false); setSelectedFile(null); }}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={!selectedFile} className="bg-green-600 hover:bg-green-700 text-white">
                        Déposer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Cas non éligible : bouton simple qui affiche un toast */}
            {memoire && !canDepositFinal && (
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  if (alreadyFinal) {
                    toast({ variant: 'destructive', title: 'Dépôt impossible', description: 'Le fichier final a déjà été déposé.' });
                  } else if (sessionsCount < 10) {
                    toast({ variant: 'destructive', title: 'Dépôt impossible', description: 'Vous devez effectuer au moins 10 séances avant de déposer votre fichier final.' });
                  }
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Déposer le fichier final
              </Button>
            )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{getProgress(memoire)}%</p>
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
                    {versions.length}
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
                    {commentsCount}
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
                <Badge className={getStatusBadge(memoire.status)}>
                  {memoire.status}
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
                    className={`h-2 rounded-full ${getProgressColor(getProgress(memoire))}`}
                    style={{ width: `${getProgress(memoire)}%` }}
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
              {safeArray((memoire as any).documents)
                .slice()
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((version: any) => (
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
                        <p className="text-sm text-gray-500">{version.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(version.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.open(version.fichierUrl, '_blank')}>
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Commentaires fusionnés */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Commentaires de l'Encadreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Commentaires généraux */}
              {safeArray((memoire as any).commentaires)
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((commentaire: any) => (
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

              {/* Commentaires par version */}
              {safeArray((memoire as any).documents)
              .slice()
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((doc: any) => (
                <div key={doc.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Version {doc.numero}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(doc.date).toLocaleDateString()}
                    </div>
                  </div>
                  {doc.commentaire && doc.commentaire.trim() !== '' ? (
                    <p className="text-gray-600 whitespace-pre-line">{doc.commentaire}</p>
                  ) : (
                    <p className="italic text-gray-500">Aucun commentaire pour cette version</p>
                  )}
                </div>
              ))}

              {/* Si aucun commentaire */}
              {safeArray((memoire as any).commentaires).length === 0 &&
                safeArray((memoire as any).documents).every((d: any) => !d.commentaire || d.commentaire.trim() === '') && (
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
