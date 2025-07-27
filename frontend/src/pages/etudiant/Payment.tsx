import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '@/services/api';
import { useAuth } from '@/stores/authStore';
import { Paiement, PaymentStatus } from '@/lib/payment';
import { useToast } from '@/hooks/use-toast';

const statusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'VALIDE':
      return 'bg-green-100 text-green-800';
    case 'REJETE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const PaymentPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ montant: 0, methode: 'ESPECE' as const });

  const { user } = useAuth();
  const { data: paiements = [] } = useQuery<Paiement[]>({
    queryKey: ['paiements'],
    queryFn: () => paymentApi.getAll(),
    });

  // Filtrage défensif : ne garder que les paiements de l'étudiant connecté
  const myPaiements = paiements.filter(p => p.etudiantId === user?.id);

  // Stats
  const TOTAL_FEES = 60000; // frais totaux définis par l'école
  const paidAmount = myPaiements.filter(p => p.status === 'VALIDE').reduce((sum, p) => sum + p.montant, 0);
  const remaining = Math.max(TOTAL_FEES - paidAmount, 0);
  const progress = Math.min(Math.round((paidAmount / TOTAL_FEES) * 100), 100);

  const createMutation = useMutation({
    mutationFn: (data: { montant: number; date: string; methode: 'ESPECE' | 'ORANGE_MONEY' | 'WAVE' | 'YAS' }) => paymentApi.create(data),
    onSuccess: () => {
      toast({ title: 'Paiement soumis', description: 'En attente de validation' });
      setDialogOpen(false);
      setFormData({ montant: 0, methode: 'ESPECE' });
      queryClient.invalidateQueries({ queryKey: ['paiements'] });
    },
    onError: () => toast({ title: 'Erreur', description: 'Impossible de créer le paiement', variant: 'destructive' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.montant) return;
    createMutation.mutate({ montant: formData.montant, date: new Date().toISOString(), methode: formData.methode });
  };

  return (
    <DashboardLayout allowedRoles={['ETUDIANT']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mes Paiements</h1>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                <Plus className="mr-2 h-4 w-4" /> Nouveau Paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau Paiement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium">Montant (CFA)</label>
                  <Input type="number" value={formData.montant || ''} onChange={e => setFormData({ ...formData, montant: Number(e.target.value) })} required min={1000} />
                </div>
                <div>
                  <label className="text-sm font-medium">Méthode</label>
                  <select className="w-full border rounded-md p-2" value={formData.methode} onChange={e => setFormData({ ...formData, methode: e.target.value as any })}>
                    <option value="ESPECE">Espèce</option>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="WAVE">Wave</option>
                    <option value="YAS">Yas</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={createMutation.isPending}>Soumettre</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold">{TOTAL_FEES.toLocaleString()} CFA</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Montant Payé</p>
              <p className="text-2xl font-bold text-green-600">{paidAmount.toLocaleString()} CFA</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Montant Restant</p>
              <p className="text-2xl font-bold text-red-600">{remaining.toLocaleString()} CFA</p>
            </CardContent>
          </Card>
        </div>

        {/* Progression */}
        <div className="bg-gray-100 h-3 rounded-full overflow-hidden my-4">
          <div className="bg-green-600 h-full" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Historique */}
        <h2 className="text-xl font-semibold">Historique des Paiements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPaiements.map(p => (
            <Card key={p.id} className="shadow-sm">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{p.montant.toLocaleString()} CFA</span>
                  <Badge className={statusBadge(p.status as PaymentStatus)}>{p.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">Réf : {p.reference}</p>
                <p className="text-sm text-gray-600">Méthode : {p.methode}</p>
                <p className="text-sm text-gray-600">Date : {new Date(p.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;