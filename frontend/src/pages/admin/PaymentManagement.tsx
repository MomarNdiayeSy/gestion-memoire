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
import { CreditCard, Download, Filter, MoreVertical, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  etudiant: string;
  montant: number;
  date: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  methode: string;
  reference: string;
}

const PaymentManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Données fictives pour les paiements
  const [payments, setPayments] = React.useState<Payment[]>([
    {
      id: '1',
      etudiant: 'Aminata Diallo',
      montant: 150000,
      date: '2024-03-15',
      statut: 'VALIDE',
      methode: 'Orange Money',
      reference: 'PAY-2024-001'
    },
    {
      id: '2',
      etudiant: 'Moussa Sy',
      montant: 150000,
      date: '2024-03-14',
      statut: 'EN_ATTENTE',
      methode: 'Wave',
      reference: 'PAY-2024-002'
    },
    {
      id: '3',
      etudiant: 'Fatou Ndiaye',
      montant: 150000,
      date: '2024-03-13',
      statut: 'REJETE',
      methode: 'Free Money',
      reference: 'PAY-2024-003'
    }
  ]);

  const stats = [
    {
      title: "Total Paiements",
      value: "450,000 FCFA",
      subtitle: "Ce mois"
    },
    {
      title: "Paiements Validés",
      value: "300,000 FCFA",
      subtitle: "66.7% du total"
    },
    {
      title: "En Attente",
      value: "150,000 FCFA",
      subtitle: "33.3% du total"
    }
  ];

  const handleValidatePayment = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, statut: 'VALIDE' as const }
        : payment
    ));
    toast({
      title: "Paiement validé",
      description: "Le paiement a été validé avec succès",
    });
  };

  const handleRejectPayment = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, statut: 'REJETE' as const }
        : payment
    ));
    toast({
      title: "Paiement rejeté",
      description: "Le paiement a été rejeté",
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.statut === filterStatus;
    return matchesSearch && matchesStatus;
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

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
            <p className="text-gray-600 mt-1">Gérez et suivez tous les paiements des étudiants</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <Badge className={getStatusBadge(payment.statut)}>
                        {payment.statut}
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
    </DashboardLayout>
  );
};

export default PaymentManagement;
