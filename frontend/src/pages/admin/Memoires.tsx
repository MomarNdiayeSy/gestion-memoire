import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Edit,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memoireApi } from '@/services/api';

const AdminMemoires = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');

  const { data: memoires = [] } = useQuery<any[]>({
    queryKey: ['admin-memoires'],
    queryFn: () => memoireApi.getAll(),
  });

  /* ------------ Mutation validation finale admin -------------- */
  const validateFinalMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'ACCEPTE' | 'REFUSE' }) =>
      memoireApi.validateFinalAdmin(id, action),
    onSuccess: () => {
      toast({ title: 'Statut mis à jour' });
      queryClient.invalidateQueries({ queryKey: ['admin-memoires'] });
    },
  });

  // Helpers statuts
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      VALIDE_ENCADREUR: 'bg-yellow-100 text-yellow-800',
      VALIDE_ADMIN: 'bg-green-100 text-green-800',
      ARCHIVE: 'bg-purple-100 text-purple-800',
      EN_REVISION: 'bg-orange-100 text-orange-800',
    };
    return styles[status] ?? 'bg-gray-100 text-gray-800';
  };

  const filteredMemoires = memoires.filter((m) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      m.titre.toLowerCase().includes(search) ||
      `${m.etudiant?.prenom ?? ''} ${m.etudiant?.nom ?? ''}`.toLowerCase().includes(search);
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Validation des mémoires</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher…"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des mémoires</CardTitle>
            <CardDescription>{filteredMemoires.length} élément(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMemoires.map((memoire) => (
                <div
                  key={memoire.id}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{memoire.titre}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Étudiant: {memoire.etudiant?.prenom} {memoire.etudiant?.nom}
                      </p>
                      <Badge className={getStatusBadge(memoire.status)}>{memoire.status}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      {memoire.fichierUrl && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => window.open(memoire.fichierUrl, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" /> Consulter
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.open(memoire.fichierUrl, '_blank')}>
                            <Download className="h-4 w-4 mr-2" /> Télécharger
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {memoire.status === 'VALIDE_ENCADREUR' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={validateFinalMutation.isPending}
                        onClick={() => validateFinalMutation.mutate({ id: memoire.id, action: 'ACCEPTE' })}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={validateFinalMutation.isPending}
                        onClick={() => validateFinalMutation.mutate({ id: memoire.id, action: 'REFUSE' })}
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Refuser
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminMemoires;
