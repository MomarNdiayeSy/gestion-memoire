import { useState, useEffect } from 'react';
import { useAuth } from '../../stores/authStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Edit, Trash2, Filter } from 'lucide-react';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  telephone: string;
  matricule?: string;
  specialite?: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: '',
    telephone: '',
    matricule: '',
    specialite: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    // TODO: Charger la liste des utilisateurs
    // Cette fonction sera implémentée quand l'API sera prête
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulation de données pour le moment
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@isi.edu',
          nom: 'Admin',
          prenom: 'Super',
          role: 'ADMIN',
          telephone: '77123456',
        },
        {
          id: '2',
          email: 'encadreur@isi.edu',
          nom: 'Diallo',
          prenom: 'Moussa',
          role: 'ENCADREUR',
          telephone: '77234567',
          specialite: 'Génie Logiciel',
        },
        {
          id: '3',
          email: 'etudiant@isi.edu',
          nom: 'Sow',
          prenom: 'Fatou',
          role: 'ETUDIANT',
          telephone: '77345678',
          matricule: 'ISI2024001',
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implémenter l'ajout d'utilisateur via l'API
      console.log('Nouvel utilisateur:', newUser);
      setIsAddDialogOpen(false);
      // Recharger la liste après l'ajout
      await loadUsers();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ENCADREUR':
        return 'bg-blue-100 text-blue-800';
      case 'ETUDIANT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Gérez les comptes étudiants, encadreurs et administrateurs</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Étudiants</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.role === 'etudiant').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Encadreurs</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'encadreur').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-red-600" />
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
                    placeholder="Rechercher par nom, prénom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('all')}
                  className="flex items-center"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Tous
                </Button>
                <Button
                  variant={filterRole === 'etudiant' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('etudiant')}
                >
                  Étudiants
                </Button>
                <Button
                  variant={filterRole === 'encadreur' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('encadreur')}
                >
                  Encadreurs
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('admin')}
                >
                  Admins
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Utilisateur</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rôle</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Téléphone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.prenom[0]}{user.nom[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.prenom} {user.nom}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeClass(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.telephone}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
