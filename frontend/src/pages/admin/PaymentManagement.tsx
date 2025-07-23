import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { CreditCard, Download, Filter, MoreVertical, Search, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import api, { paiementApi } from '@/services/api';
import { jsPDF } from 'jspdf';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – side-effect import to extend jsPDF prototype
import autoTable from 'jspdf-autotable';

interface Payment {
  id: string;
  etudiant: string;
  montant: number;
  date: string;
  status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  methode: string;
  reference: string;
}

interface AddPaymentFormProps {
  onSuccess: () => void;
}

interface EditPaymentFormProps {
  payment: Payment;
  onClose: () => void;
}

const EditPaymentForm: React.FC<EditPaymentFormProps> = ({ payment, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: any = {
      montant: Number(data.get('montant')),
      date: String(data.get('date')),
      methode: String(data.get('methode')),
      status: String(data.get('status')),
    };
    const etu = data.get('etudiantId');
    if (etu && typeof etu === 'string' && etu.trim() !== '') {
      payload.etudiantId = etu;
    }
    try {
      setLoading(true);
      await paiementApi.update(payment.id, payload);
      toast({ title: 'Paiement mis à jour' });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] });
      onClose();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err?.response?.data?.message || 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">Référence : {payment.reference}</p>
      <div>
        <Label htmlFor="montant">Montant</Label>
        <Input name="montant" type="number" defaultValue={payment.montant} required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input name="date" type="date" defaultValue={payment.date.split('T')[0]} required />
      </div>
      <div>
        <Label htmlFor="methode">Méthode</Label>
        <Select name="methode" defaultValue={payment.methode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ESPECE">Espèce</SelectItem>
            <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
            <SelectItem value="WAVE">Wave</SelectItem>
            <SelectItem value="YAS">Yas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select name="status" defaultValue={payment.status}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="VALIDE">Validé</SelectItem>
            <SelectItem value="REJETE">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  );
}

interface AddPaymentFormProps {
  onSuccess: () => void;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [students, setStudents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users?role=ETUDIANT');
        const list = Array.isArray(res.data) ? res.data : res.data?.users ?? [];
        setStudents(list);
      } catch {
        setStudents([]);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: any = {
      montant: Number(data.get('montant')),
      date: String(data.get('date')),
      methode: String(data.get('methode')) as any,
      etudiantId: String(data.get('etudiantId')),
    };
    try {
      setLoading(true);
      await paiementApi.create(payload as any);
      toast({ title: 'Paiement ajouté' });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err?.response?.data?.message || 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="etudiantId">Étudiant</Label>
        <Select name="etudiantId" required>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un étudiant" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{`${s.prenom} ${s.nom}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="montant">Montant</Label>
        <Input name="montant" type="number" step="0.01" required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input name="date" type="date" required />
      </div>
      <div>
        <Label htmlFor="methode">Méthode</Label>
        <Select name="methode" defaultValue="ESPECE">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ESPECE">Espèce</SelectItem>
            <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
            <SelectItem value="WAVE">Wave</SelectItem>
            <SelectItem value="YAS">Yas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  );
}

// -------------------
// Page principale
// -------------------
const PaymentManagement = () => {
  const { toast } = useToast();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  // Date range filters
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const queryClient = useQueryClient();

  // Fetch payments from API
  const { data: payments = [], refetch } = useQuery<Payment[]>({
    queryKey: ['payments', { status: filterStatus !== 'all' ? filterStatus : undefined }],
    queryFn: () => paiementApi.getAll(filterStatus !== 'all' ? { status: filterStatus as any } : undefined),
    select: (data: any[]) =>
      data.map(p => ({
        id: p.id,
        etudiant: `${p.etudiant.prenom} ${p.etudiant.nom}`,
        montant: p.montant,
        date: p.date,
        status: p.status,
        methode: p.methode ?? '—',
        reference: p.reference,
      }))
  });
  

  // Récupérer les statistiques des paiements
  const { data: statsData } = useQuery<{ TOTAL: number; VALIDE: number; EN_ATTENTE: number; REJETE: number }>({
    queryKey: ['paymentStats'],
    queryFn: () => paiementApi.getStats(),
  });

  const stats = React.useMemo(() => {
    if (!statsData) return [] as { title: string; value: string; subtitle: string }[];
    return [
      {
        title: 'Paiements Validés',
        value: `${statsData.VALIDE.toLocaleString()} FCFA`,
        subtitle: '',
      },
      {
        title: 'En Attente',
        value: `${statsData.EN_ATTENTE.toLocaleString()} FCFA`,
        subtitle: '',
      },
    ];
  }, [statsData]);

  const validateMutation = useMutation({
    mutationFn: (id: string) => paiementApi.updateStatus(id, 'VALIDE'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] }); toast({ title: 'Paiement validé', description: 'Le paiement a été validé avec succès' }); }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => paiementApi.updateStatus(id, 'REJETE'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] }); toast({ title: 'Paiement rejeté', description: 'Le paiement a été rejeté' }); }
  });

  const handleValidatePayment = (paymentId: string) => {
    validateMutation.mutate(paymentId);
  };

    const handleRejectPayment = (paymentId: string) => {
    rejectMutation.mutate(paymentId);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const paymentDate = new Date(payment.date);
    const matchesStart = startDate ? paymentDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? paymentDate <= new Date(endDate) : true;
    const matchesDate = matchesStart && matchesEnd;
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const handleExportPdf = () => {
    if (filteredPayments.length === 0) {
      toast({ title: 'Aucun paiement à exporter', variant: 'destructive' });
      return;
    }
    const doc = new jsPDF('p', 'pt');

    // Header
    const formatDateFr = (iso: string | undefined) => {
      if (!iso) return '...';
      const d = new Date(iso);
      const day = d.getDate();
      const dayStr = day === 1 ? '1er' : day.toString();
      const month = d.toLocaleString('fr-FR', { month: 'long' });
      const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
      return `${dayStr} ${monthCap} ${d.getFullYear()}`;
    };

    const rangeLabel = startDate || endDate
      ? `du ${formatDateFr(startDate || '')} au ${formatDateFr(endDate || '')}`
      : '– Tous les paiements –';

    doc.setFontSize(14);
    doc.text(`Rapport des Paiements ${rangeLabel}`, 40, 40);
    let currentY = 60;

    const total = filteredPayments.reduce((sum, p) => sum + p.montant, 0);

    const formatAmount = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Table
    autoTable(doc, {
      startY: 80,
      head: [['Référence', 'Étudiant', 'Montant (FCFA)', 'Date', 'Méthode', 'Statut']],
      body: filteredPayments.map(p => [
        p.reference,
        p.etudiant,
        formatAmount(p.montant),
        new Date(p.date).toLocaleDateString(),
        p.methode,
        p.status,
      ]),
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.text(`Montant total: ${formatAmount(total)} FCFA`, 40, finalY + 30);

    try {
      doc.save('paiements.pdf');
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur lors de la génération du PDF', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
            <p className="text-gray-600 mt-1">Gérez et suivez tous les paiements des étudiants</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un paiement</DialogTitle>
                </DialogHeader>
                <AddPaymentForm onSuccess={() => setOpenAdd(false)} />
              </DialogContent>
            </Dialog>
            <Button onClick={handleExportPdf} className="bg-gradient-to-r from-blue-600 to-violet-600">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Payment Modal */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setOpenAdd(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un paiement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un paiement</DialogTitle>
            </DialogHeader>
            <AddPaymentForm onSuccess={() => { setOpenAdd(false); queryClient.invalidateQueries({ queryKey: ['payments'] }); queryClient.invalidateQueries({ queryKey: ['paymentStats'] }); }} />
          </DialogContent>
        </Dialog>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Rechercher par étudiant ou référence..."
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
                  <DropdownMenuItem onClick={() => setFilterStatus('VALIDE')}>
                    Validés
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('EN_ATTENTE')}>
                    En attente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('REJETE')}>
                    Rejetés
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Date range */}
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} placeholder="Date début" />
                <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} placeholder="Date fin" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.reference}</TableCell>
                    <TableCell>{payment.etudiant}</TableCell>
                    <TableCell>{payment.montant.toLocaleString()} FCFA</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.methode}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => { setEditingPayment(payment); }}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                             onClick={() => handleValidatePayment(payment.id)}
                            className="text-green-600"
                          >
                            Valider
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRejectPayment(payment.id)}
                            className="text-red-600"
                          >
                            Rejeter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun paiement trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    {/* Edit Payment Modal */}
      {editingPayment && (
        <Dialog open={true} onOpenChange={(v) => !v && setEditingPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le paiement</DialogTitle>
            </DialogHeader>
            <EditPaymentForm payment={editingPayment} onClose={() => setEditingPayment(null)} />
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default PaymentManagement;
