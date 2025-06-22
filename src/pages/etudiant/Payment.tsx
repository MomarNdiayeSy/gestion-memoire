
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const paymentInfo = {
    montant: 250,
    description: "Frais de soutenance de mémoire",
    reference: "PAY-2024-STU-001",
    echeance: "2024-04-30",
    statut: "en_attente"
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      disponible: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: DollarSign,
      description: 'Paiement sécurisé via PayPal',
      disponible: true
    },
    {
      id: 'bank',
      name: 'Virement Bancaire',
      icon: Shield,
      description: 'Transfert bancaire direct',
      disponible: true
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      reference: "PAY-2023-STU-045",
      montant: 200,
      description: "Frais d'inscription mémoire",
      date: "2024-01-15",
      statut: "validé",
      methode: "Carte bancaire"
    },
    {
      id: 2,
      reference: "PAY-2024-STU-001",
      montant: 250,
      description: "Frais de soutenance",
      date: "En attente",
      statut: "en_attente",
      methode: "-"
    }
  ];

  const getStatusBadge = (statut: string) => {
    const styles = {
      'validé': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'refusé': 'bg-red-100 text-red-800',
      'en_cours': 'bg-blue-100 text-blue-800'
    };
    return styles[statut as keyof typeof styles];
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'validé': return <CheckCircle className="h-4 w-4" />;
      case 'en_attente': return <Clock className="h-4 w-4" />;
      case 'refusé': return <AlertCircle className="h-4 w-4" />;
      case 'en_cours': return <Clock className="h-4 w-4" />;
    }
  };

  const handlePayment = () => {
    console.log('Paiement initié:', { selectedMethod, paymentData });
    // Ici, on intégrerait la logique de paiement réelle
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>
          <p className="text-gray-600 mt-1">Gérez vos paiements liés à votre mémoire</p>
        </div>
        <Badge className={getStatusBadge(paymentInfo.statut)}>
          {getStatusIcon(paymentInfo.statut)}
          <span className="ml-1 capitalize">{paymentInfo.statut.replace('_', ' ')}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Payment */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Paiement en Attente
              </CardTitle>
              <CardDescription>
                Réglez vos frais de soutenance pour finaliser votre mémoire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{paymentInfo.description}</h3>
                    <p className="text-sm text-gray-600">Référence: {paymentInfo.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{paymentInfo.montant}€</p>
                    <p className="text-sm text-gray-500">TTC</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Échéance: {paymentInfo.echeance}</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Paiement requis
                  </Badge>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-900">Choisissez votre méthode de paiement</h4>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMethod === method.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } ${!method.disponible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => method.disponible && setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedMethod === method.id ? 'bg-blue-600' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              selectedMethod === method.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{method.name}</h5>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Payment Form */}
              {selectedMethod === 'card' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900">Informations de la carte</h5>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'expiration
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <Input
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom sur la carte
                      </label>
                      <Input
                        placeholder="Nom complet"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {selectedMethod === 'bank' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Informations de virement</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bénéficiaire:</span>
                      <span className="font-medium">Institut Supérieur d'Informatique</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IBAN:</span>
                      <span className="font-mono">TN59 1234 5678 9012 3456 7890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Référence:</span>
                      <span className="font-mono">{paymentInfo.reference}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      ⚠️ N'oubliez pas d'inclure la référence dans votre virement
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={!selectedMethod}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-50"
              >
                {selectedMethod === 'bank' ? 'Confirmer les Informations' : `Payer ${paymentInfo.montant}€`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary & History */}
        <div className="space-y-6">
          {/* Security Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Paiement Sécurisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Chiffrement SSL 256-bit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Conformité PCI DSS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Protection contre la fraude</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>
                Vos transactions précédentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">{payment.description}</h5>
                        <p className="text-xs text-gray-500">{payment.reference}</p>
                      </div>
                      <Badge className={getStatusBadge(payment.statut)}>
                        {getStatusIcon(payment.statut)}
                        <span className="ml-1">{payment.statut}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{payment.date}</span>
                      <span className="font-semibold text-gray-900">{payment.montant}€</span>
                    </div>
                    {payment.methode !== '-' && (
                      <p className="text-xs text-gray-500 mt-1">via {payment.methode}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  En cas de problème avec votre paiement, contactez le service administratif.
                </p>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Email:</span> admin@isi.edu</p>
                  <p><span className="font-medium">Tél:</span> +216 71 123 456</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
