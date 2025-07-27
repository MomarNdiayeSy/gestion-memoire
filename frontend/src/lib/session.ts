// Shared types and helper utilities for Session management
// This file centralises enums, interface and common UI helper functions
// so that Encadreur and Etudiant pages stay perfectly in sync.

export enum SessionStatus {
  PLANIFIE = 'PLANIFIE',
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  EFFECTUEE = 'EFFECTUEE',
  ANNULEE = 'ANNULEE',
}

export enum SessionType {
  PRESENTIEL = 'PRESENTIEL',
  VIRTUEL = 'VIRTUEL',
}

export enum SessionRequestStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
}

export interface SessionRequest {
  id: string;
  date: string;
  heure: string;
  type: SessionType;
  statut: SessionRequestStatus;
  encadreur?: { nom: string; prenom: string };
  etudiant?: { nom: string; prenom: string };
}

export interface Session {
  id: string;
  numero: number;
  date: string;
  duree: number;
  type: SessionType;
  statut: SessionStatus;
  // Champs facultatifs — présents selon le rôle
  memoireTitre?: string;
  titre?: string;
  etudiants?: string[];
  encadreur?: { nom: string; prenom: string };
  meetingLink?: string;
  salle?: string;
  visaEtudiant?: boolean;
  visaEncadreur?: boolean;
  rapport?: string;
  remarques?: string;
}

// ----- UI helpers --------------------------------------------------

const statusClasses: Record<SessionStatus, string> = {
  [SessionStatus.PLANIFIE]: 'bg-blue-100 text-blue-800',
  [SessionStatus.PLANIFIEE]: 'bg-blue-100 text-blue-800',
  [SessionStatus.EN_COURS]: 'bg-yellow-100 text-yellow-800',
  [SessionStatus.TERMINE]: 'bg-green-100 text-green-800',
  [SessionStatus.EFFECTUEE]: 'bg-green-100 text-green-800',
  [SessionStatus.ANNULEE]: 'bg-red-100 text-red-800',
};

export const getStatusBadge = (status: string): string => {
  return statusClasses[status as SessionStatus] ?? 'bg-gray-100 text-gray-800';
};

export const typeClasses: Record<SessionType, string> = {
  [SessionType.VIRTUEL]: 'bg-purple-100 text-purple-800',
  [SessionType.PRESENTIEL]: 'bg-orange-100 text-orange-800',
};

export const getTypeBadge = (type: string): string => {
  return typeClasses[type as SessionType] ?? 'bg-gray-100 text-gray-800';
};

export const formatDuree = (duree: number): string => {
  const hours = Math.floor(duree / 60);
  const minutes = duree % 60;
  return `${hours}h${minutes.toString().padStart(2, '0')}`;
};

export const formatDate = (date: string, locale = 'fr-FR'): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
