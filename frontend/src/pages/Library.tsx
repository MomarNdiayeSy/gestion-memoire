import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface LibraryMemoire {
  id: string;
  titre: string;
  fichierUrl: string | null;
  dateSoutenance: string | null;
  etudiant: { nom: string; prenom: string } | null;
  encadreur: { nom: string; prenom: string } | null;
}

const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: memoires = [], isFetching } = useQuery<LibraryMemoire[]>({
    queryKey: ['library', search],
    queryFn: () => libraryApi.list({ search }),
  });

  return (
    <DashboardLayout allowedRoles={['ADMIN', 'ENCADREUR', 'ETUDIANT']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bibliothèque</h1>
            <p className="text-gray-600 mt-1">Consultez et téléchargez les mémoires soutenus</p>
          </div>
          <Input
            placeholder="Rechercher un mémoire…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoires.map((m) => (
            <Card
              key={m.id}
              className="flex flex-col justify-between w-80 min-w-[300px] h-full border-0 shadow-md hover:shadow-lg hover:-translate-y-1 transition"
            >
              <CardHeader>
                <CardTitle className="line-clamp-3 break-words">{m.titre}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {m.etudiant ? `${m.etudiant.prenom} ${m.etudiant.nom}` : '—'} • {new Date(m.dateSoutenance ?? '').getFullYear()}
                </CardDescription>
              </CardHeader>
              <CardContent className="self-end mt-4">
                {m.fichierUrl && (
                  <Button size="sm" asChild>
                    <a href={m.fichierUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" /> Télécharger
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {!isFetching && memoires.length === 0 && (
            <p className="text-gray-500">Aucun mémoire trouvé.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Library;
