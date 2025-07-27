export type PaymentStatus = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
export type PaymentMethod = 'ESPECE' | 'ORANGE_MONEY' | 'WAVE' | 'YAS';

export interface Paiement {
  id: string;
  montant: number;
  reference: string;
  date: string; // ISO
  status: PaymentStatus;
  methode: PaymentMethod;
  etudiantId: string;
  createdAt: string;
}
