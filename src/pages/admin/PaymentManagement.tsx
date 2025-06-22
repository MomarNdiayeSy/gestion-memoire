
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, Filter, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const payments = [
    {
      id: 1,
      etudiant: "Marie Dupont",
      memoire: "Système de Recommandation Intelligent",
      montant: 250,
      datePaiement: "2024-03-10",
      methodePaiement: "Carte bancaire",
      statut: "validé",
      reference: "PAY-2024-001"
    },
    {
      id: 2,
      etudiant: "Amine Trabelsi",
      memoire: "Application E-commerce Mobile",
      montant: 250,
      datePaiement: "2024-03-12",
      methodePaiement: "Virement bancaire",
      statut: "en_attente",
      reference: "PAY-2024-002"
    },
    {
      id: 3,
      etudiant: "Fatma Zahra",
      memoire: "Analyse de Vulnérabilités Web",
      montant: 250,
      datePaiement: "2024-02-25",
      methodePaiement: "Carte bancaire",
      statut: "validé",
      reference: "PAY-2024-003"
    },
    {
      id: 4,
      etudiant: "Mohamed Salah",
      memoire: "Plateforme IoT pour Smart City",
      montant: 250,
      datePaiement: "2024-03-15",
      methodePaiement: "PayPal",
      statut: "refusé",
      reference: "PAY-2024-004"
    },
    {
      id: 5,
      etudiant: "Leila Ben Ali",
      memoire: "Intelligence Artificielle en Médecine",
      montant: 250,
      datePaiement: null,
      methodePaiement: null,
      statut: "en_attente",
      reference: "PAY-2024-005"
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'validé': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'refusé': 'bg-red-100 text-red-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'validé': return <CheckCircle className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'refusé': return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenu = payments.filter(p => p.statut === 'validé').reduce((sum, p) => sum + p.montant, 0);
  const totalEnAttente = payments.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="text-gray-600 mt-1">Suivi des frais de soutenance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paiements</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Validés</p>
                <p className="text-2xl font-bold text-green-600">{totalRevenu}€</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{totalEnAttente}€</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter(p => p.statut === 'validé').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
                  placeholder="Rechercher par étudiant ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Tous
              </Button>
              <Button
                variant={filterStatus === 'validé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('validé')}
              >
                Validés
              </Button>
              <Button
                variant={filterStatus === 'en_attente' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('en_attente')}
              >
                En attente
              </Button>
              <Button
                variant={filterStatus === 'refusé' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('refusé')}
              >
                Refusés
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Liste des Paiements</CardTitle>
          <CardDescription>
            {filteredPayments.length} paiement(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Référence</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Étudiant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mémoire</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Méthode</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-blue-600">{payment.reference}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {payment.etudiant.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{payment.etudiant}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{payment.memoire}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{payment.montant}€</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{payment.methodePaiement || '-'}</td>
                    <td className="py-4 px-4 text-gray-600">{payment.datePaiement || '-'}</td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusBadge(payment.statut)}>
                        {getStatusIcon(payment.statut)}
                        <span className="ml-1 capitalize">{payment.statut}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {payment.statut === 'en_attente' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;
