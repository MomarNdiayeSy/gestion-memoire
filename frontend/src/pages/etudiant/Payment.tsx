import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Receipt,
  Wallet
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  montant: number;
  date: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  methode: string;
  reference: string;
}

const Payment = () => {
  const { toast } = useToast();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);

  // Données fictives pour les paiements
  const [payments] = React.useState<Payment[]>([
    {
      id: '1',
      montant: 150000,
      date: '2024-03-15',
      statut: 'VALIDE',
      methode: 'Orange Money',
      reference: 'PAY-2024-001'
    },
    {
      id: '2',
      montant: 50000,
      date: '2024-03-10',
      statut: 'EN_ATTENTE',
      methode: 'Wave',
      reference: 'PAY-2024-002'
    }
  ]);

  const totalPaye = payments
    .filter(p => p.statut === 'VALIDE')
    .reduce((acc, p) => acc + p.montant, 0);

  const montantTotal = 200000; // Montant total à payer
  const montantRestant = montantTotal - totalPaye;

  const handlePayment = (methode: string) => {
    toast({
      title: "Paiement initié",
      description: `Redirection vers ${methode}...`,
    });
    setIsPaymentDialogOpen(false);
  };

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
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
            <p className="text-gray-600 mt-1">Gérez vos paiements de frais de mémoire</p>
          </div>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Wallet className="mr-2 h-4 w-4" />
                Effectuer un Paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choisir le mode de paiement</DialogTitle>
                <DialogDescription>
                  Sélectionnez votre méthode de paiement préférée
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handlePayment('Orange Money')}
                >
                  <img src="/orange-money.png" alt="Orange Money" className="h-8" />
                  <span>Orange Money</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handlePayment('Wave')}
                >
                  <img src="/wave.png" alt="Wave" className="h-8" />
                  <span>Wave</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handlePayment('Free Money')}
                >
                  <img src="/free-money.png" alt="Free Money" className="h-8" />
                  <span>Free Money</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handlePayment('Carte Bancaire')}
                >
                  <CreditCard className="h-8 w-8" />
                  <span>Carte Bancaire</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {montantTotal.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant Payé</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {totalPaye.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant Restant</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {montantRestant.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Progression des paiements</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round((totalPaye / montantTotal) * 100)}%
                </p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(totalPaye / montantTotal) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historique des Paiements</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      payment.methode === 'Orange Money' ? 'bg-orange-100' :
                      payment.methode === 'Wave' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <CreditCard className={`h-6 w-6 ${
                        payment.methode === 'Orange Money' ? 'text-orange-600' :
                        payment.methode === 'Wave' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.montant.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.methode} • {payment.reference}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusBadge(payment.statut)}>
                        {payment.statut}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {payments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucun paiement effectué</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
