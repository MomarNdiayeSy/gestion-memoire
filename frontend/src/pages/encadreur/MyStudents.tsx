import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Calendar,
  Filter,
  GraduationCap,
  MoreVertical,
  Search,
  Users
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  sujet: string;
  progression: number;
  statut: 'ACTIF' | 'EN_PAUSE' | 'TERMINE';
  derniereMaj: string;
}

const MyStudents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Données fictives pour les étudiants
  const [students, setStudents] = React.useState<Student[]>([
    {
      id: '1',
      nom: 'Diallo',
      prenom: 'Aminata',
      email: 'aminata.diallo@example.com',
      sujet: 'Développement d\'une application de gestion de mémoires',
      progression: 75,
      statut: 'ACTIF',
      derniereMaj: '2024-03-15'
    },
    {
      id: '2',
      nom: 'Sy',
      prenom: 'Moussa',
      email: 'moussa.sy@example.com',
      sujet: 'Plateforme e-learning intelligente',
      progression: 45,
      statut: 'ACTIF',
      derniereMaj: '2024-03-14'
    },
    {
      id: '3',
      nom: 'Ndiaye',
      prenom: 'Fatou',
      email: 'fatou.ndiaye@example.com',
      sujet: 'Système de reconnaissance faciale',
      progression: 100,
      statut: 'TERMINE',
      derniereMaj: '2024-03-10'
    }
  ]);

  const stats = [
    {
      title: "Total Étudiants",
      value: students.length.toString(),
      icon: Users,
      color: "blue"
    },
    {
      title: "Étudiants Actifs",
      value: students.filter(s => s.statut === 'ACTIF').length.toString(),
      icon: GraduationCap,
      color: "green"
    },
    {
      title: "Mémoires Terminés",
      value: students.filter(s => s.statut === 'TERMINE').length.toString(),
      icon: BookOpen,
      color: "purple"
    }
  ];

  const handleUpdateProgress = (studentId: string, newProgress: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            progression: newProgress,
            derniereMaj: new Date().toISOString().split('T')[0]
          }
        : student
    ));
    toast({
      title: "Progression mise à jour",
      description: "La progression a été mise à jour avec succès",
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.nom} ${student.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sujet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIF':
        return "bg-green-100 text-green-800";
      case 'EN_PAUSE':
        return "bg-yellow-100 text-yellow-800";
      case 'TERMINE':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout allowedRoles={['ENCADREUR']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Étudiants</h1>
            <p className="text-gray-600 mt-1">Suivez la progression de vos étudiants</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Rechercher par nom, email ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer par statut
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    Tous les statuts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('ACTIF')}>
                    Actifs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('EN_PAUSE')}>
                    En pause
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('TERMINE')}>
                    Terminés
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière Mise à Jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.prenom} {student.nom}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {student.sujet}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(student.progression)}`}
                            style={{ width: `${student.progression}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{student.progression}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(student.statut)}>
                        {student.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {new Date(student.derniereMaj).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateProgress(student.id, Math.min(100, student.progression + 10))}>
                            Augmenter progression (+10%)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateProgress(student.id, Math.max(0, student.progression - 10))}>
                            Diminuer progression (-10%)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun étudiant trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyStudents;
