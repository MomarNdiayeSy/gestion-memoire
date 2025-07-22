import { useState } from 'react';
import { useAuth } from '../../stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api';
import { toast } from 'sonner';
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
  const queryClient = useQueryClient();
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll(),
  });
  // La réponse backend peut être soit un tableau direct, soit un objet { users: [...] }
  const users: User[] = Array.isArray(usersResponse)
    ? usersResponse as User[]
    : (usersResponse as any)?.users ?? [];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<{ email: string; password: string; nom: string; prenom: string; role: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT'; telephone: string; matricule?: string; specialite?: string }>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'ETUDIANT',
    telephone: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const addUserMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      toast.success('Utilisateur créé');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Erreur lors de la création'),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userApi.update(id, data),
    onSuccess: () => {
      toast.success('Utilisateur mis à jour');
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      toast.success('Utilisateur supprimé');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newUser } as any;
    if (payload.role !== 'ETUDIANT') delete payload.matricule;
    if (payload.role !== 'ENCADREUR') delete payload.specialite;
    await addUserMutation.mutateAsync(payload);
    setIsAddDialogOpen(false);
    setNewUser({ email: '', password: '', nom: '', prenom: '', role: 'ETUDIANT', telephone: '', matricule: '', specialite: '' });
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
    setEditForm({ email: user.email, nom: user.nom, prenom: user.prenom, telephone: user.telephone ?? '', role: user.role, matricule: user.matricule ?? '', specialite: user.specialite ?? '' });
  };

  const [editForm, setEditForm] = useState<{ email: string; nom: string; prenom: string; telephone: string; role: string; matricule?: string; specialite?: string }>({ email: '', nom: '', prenom: '', telephone: '', role: 'ETUDIANT', matricule: '', specialite: '' });

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updatePayload = { ...editForm } as any;
    if (updatePayload.role !== 'ETUDIANT') delete updatePayload.matricule;
    if (updatePayload.role !== 'ENCADREUR') delete updatePayload.specialite;
    await updateUserMutation.mutateAsync({ id: editingUser.id, data: updatePayload });
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Confirmer la suppression ?')) {
      await deleteUserMutation.mutateAsync(id);
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
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700" onClick={() => setIsAddDialogOpen(true)}>
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
                    {users.filter(u => u.role.toLowerCase() === 'etudiant').length}
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
                    {users.filter(u => u.role.toLowerCase() === 'encadreur').length}
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
                    {users.filter(u => u.role.toLowerCase() === 'admin').length}
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
                <Button variant={filterRole === 'all' ? 'default' : 'outline'} onClick={() => setFilterRole('all')}>
                  <Filter className="mr-2 h-4 w-4" /> Tous
                </Button>
                <Button variant={filterRole === 'etudiant' ? 'default' : 'outline'} onClick={() => setFilterRole('etudiant')}>Étudiants</Button>
                <Button variant={filterRole === 'encadreur' ? 'default' : 'outline'} onClick={() => setFilterRole('encadreur')}>Encadreurs</Button>
                <Button variant={filterRole === 'admin' ? 'default' : 'outline'} onClick={() => setFilterRole('admin')}>Admins</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
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
                  {isLoading ? (
                    <tr><td colSpan={5}>Chargement...</td></tr>
                  ) : (
                    filteredUsers.map((user) => (
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
                          <Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.telephone}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau utilisateur</DialogTitle></DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <Input placeholder="Mot de passe" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <div className="flex space-x-2">
                <Input placeholder="Prénom" value={newUser.prenom} onChange={e => setNewUser({ ...newUser, prenom: e.target.value })} />
                <Input placeholder="Nom" value={newUser.nom} onChange={e => setNewUser({ ...newUser, nom: e.target.value })} />
              </div>
              <Input placeholder="Téléphone" value={newUser.telephone} onChange={e => setNewUser({ ...newUser, telephone: e.target.value })} />
              {newUser.role === 'ETUDIANT' && (
                <Input placeholder="Matricule" value={newUser.matricule ?? ''} onChange={e => setNewUser({ ...newUser, matricule: e.target.value })} />
              )}
              {newUser.role === 'ENCADREUR' && (
                <Input placeholder="Spécialité" value={newUser.specialite ?? ''} onChange={e => setNewUser({ ...newUser, specialite: e.target.value })} />
              )}
              <Select value={newUser.role} onValueChange={(v: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT') => setNewUser({ ...newUser, role: v })}>
                <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="ENCADREUR">ENCADREUR</SelectItem>
                  <SelectItem value="ETUDIANT">ETUDIANT</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier utilisateur</DialogTitle></DialogHeader>
            <form onSubmit={submitEdit} className="space-y-4">
              <Input placeholder="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              <div className="flex space-x-2">
                <Input placeholder="Prénom" value={editForm.prenom} onChange={e => setEditForm({ ...editForm, prenom: e.target.value })} />
                <Input placeholder="Nom" value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })} />
              </div>
              <Input placeholder="Téléphone" value={editForm.telephone} onChange={e => setEditForm({ ...editForm, telephone: e.target.value })} />
              {editForm.role === 'ETUDIANT' && (
                <Input placeholder="Matricule" value={editForm.matricule ?? ''} onChange={e => setEditForm({ ...editForm, matricule: e.target.value })} />
              )}
              {editForm.role === 'ENCADREUR' && (
                <Input placeholder="Spécialité" value={editForm.specialite ?? ''} onChange={e => setEditForm({ ...editForm, specialite: e.target.value })} />
              )}
              <Select value={editForm.role} onValueChange={(v: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT') => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="ENCADREUR">ENCADREUR</SelectItem>
                  <SelectItem value="ETUDIANT">ETUDIANT</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
