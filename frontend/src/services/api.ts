import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    role: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT';
    specialite?: string;
    matricule?: string;
    telephone?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },
};

export const sujetApi = {
  // Créer un nouveau sujet
  create: async (data: {
    titre: string;
    description: string;
    motsCles: string[];
    encadreurId?: string;
  }) => {
    const response = await api.post('/sujets', data);
    return response.data;
  },

  // Obtenir tous les sujets avec filtres optionnels
  getAll: async (filters?: { status?: string; specialite?: string }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/sujets?${params}`);
    return response.data;
  },

  // Obtenir un sujet par ID
  getById: async (id: string) => {
    const response = await api.get(`/sujets/${id}`);
    return response.data;
  },

  // Mettre à jour un sujet
  update: async (id: string, data: {
    titre: string;
    description: string;
    motsCles: string[];
    encadreurId?: string;
  }) => {
    const response = await api.put(`/sujets/${id}`, data);
    return response.data;
  },

  // Mettre à jour le statut d'un sujet
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/sujets/${id}/status`, { status });
    return response.data;
  },

  // Supprimer un sujet
  delete: async (id: string) => {
    const response = await api.delete(`/sujets/${id}`);
    return response.data;
  }
};

export const memoireApi = {
  // Créer un nouveau mémoire
  create: async (data: {
    titre: string;
    description: string;
    motsCles: string[];
    sujetId: string;
  }) => {
    const response = await api.post('/memoires', data);
    return response.data;
  },

  // Obtenir tous les mémoires avec filtre optionnel
  getAll: async (filters?: { status?: 'EN_COURS' | 'SOUMIS' | 'EN_REVISION' | 'VALIDE' | 'REJETE' | 'SOUTENU' }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/memoires?${params}`);
    return response.data;
  },

  // Obtenir un mémoire par ID
  getById: async (id: string) => {
    const response = await api.get(`/memoires/${id}`);
    return response.data;
  },

  // Obtenir le mémoire de l'étudiant connecté
  getMy: async () => {
    try {
      const response = await api.get('/memoires/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Aucun mémoire pour l'étudiant
      }
      throw error;
    }
  },

  // Mettre à jour un mémoire
  update: async (id: string, data: {
    titre?: string;
    description?: string;
    motsCles?: string[];
    dateDepot?: string;
    dateSoutenance?: string;
    status?: 'EN_COURS' | 'SOUMIS' | 'EN_REVISION' | 'VALIDE' | 'REJETE' | 'SOUTENU';
    progression?: number;
  }) => {
    const response = await api.put(`/memoires/${id}`, data);
    return response.data;
  },

  // Mettre à jour le statut d'un mémoire
  updateStatus: async (id: string, data: {
    status: 'EN_COURS' | 'SOUMIS' | 'EN_REVISION' | 'VALIDE' | 'REJETE' | 'SOUTENU';
    commentaire?: string;
  }) => {
    const response = await api.patch(`/memoires/${id}/status`, data);
    return response.data;
  },

  // Ajouter un document
  addDocument: async (id: string, data: {
    nom: string;
    url: string;
    type: string;
  }) => {
    const response = await api.post(`/memoires/${id}/documents`, data);
    return response.data;
  }
};

export const userApi = {
  getAll: async (params?: { role?: string }) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/users${query ? `?${query}` : ''}`);
    return response.data;
  },
  create: async (data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    role: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT';
    matricule?: string;
    specialite?: string;
  }) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id: string, data: { email?: string; nom?: string; prenom?: string; telephone?: string; role?: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT'; matricule?: string; specialite?: string }) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export const subjectApi = {
  // Obtenir tous les sujets (optionnellement filtrés)
  getAll: async (filters?: { status?: string }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/sujets?${params}`);
    return response.data;
  },
  // Réserver / choisir un sujet pour l'étudiant connecté
  reserve: async (id: string) => {
    const response = await api.post(`/sujets/${id}/reserve`);
    return response.data;
  }
};

export const sessionApi = {
  // Créer une nouvelle session
  create: async (data: {
    duree: number;
    type: 'PRESENTIEL' | 'VIRTUEL';
    date: string;
    meetingLink?: string;
    salle?: string;
  }) => {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  // Obtenir toutes les sessions avec filtre optionnel
  getAll: async (filters?: { status?: 'PLANIFIEE' | 'EFFECTUEE' | 'ANNULEE' }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/sessions?${params}`);
    return response.data;
  },

  // Obtenir une session par ID
  getById: async (id: string) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  // Mettre à jour une session
  update: async (id: string, data: {
    date?: string;
    duree?: number;
    status?: 'PLANIFIEE' | 'EN_COURS' | 'EFFECTUEE' | 'ANNULEE';
    rapport?: string;
    remarques?: string;
  }) => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  // ---------------------- Session Requests ----------------------
  // Récupérer les demandes de session (étudiant ou encadreur selon rôle auth)
  getRequests: async () => {
    const response = await api.get('/session-requests');
    return response.data;
  },

  // Encadreur met à jour une demande (accepte/refuse)
  updateRequest: async (id: string, data: { statut: 'ACCEPTEE' | 'REFUSEE'; meetingLink?: string; duree?: number }) => {
    const response = await api.patch(`/session-requests/${id}`, data);
    return response.data;
  },

  // Demander une session (étudiant)
  request: async (data: { date: string; heure: string; type: 'PRESENTIEL' | 'VIRTUEL' }) => {
    const response = await api.post('/session-requests', data);
    return response.data;
  },

  // Signer un visa (encadreur ou étudiant)
  visa: async (id: string, type: 'ENCADREUR' | 'ETUDIANT') => {
    const response = await api.patch(`/sessions/${id}/visa`, { type });
    return response.data;
  },

  // Supprimer une session
  delete: async (id: string) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  }
};

export const paymentApi = {
  // Créer un paiement (étudiant connecté ou admin pour un étudiant)
  create: async (data: { montant: number; date: string; methode: 'ESPECE' | 'ORANGE_MONEY' | 'WAVE' | 'YAS'; reference?: string }) => {
    const response = await api.post('/paiements', data);
    return response.data;
  },

  // Lister les paiements (filtre status optionnel)
  getAll: async (filters?: { status?: 'EN_ATTENTE' | 'VALIDE' | 'REJETE' }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/paiements?${params}`);
    return response.data;
  },
};

export const juryApi = {
  // Créer un nouveau jury
  create: async (data: {
    memoireId: string;
    encadreurJury1Id: string;
    encadreurJury2Id: string;
    encadreurJury3Id: string;
    dateSoutenance: string;
    salle: string;
  }) => {
    const response = await api.post('/jurys', data);
    return response.data;
  },

  // Obtenir tous les jurys
  getAll: async () => {
    const response = await api.get('/jurys');
    return response.data;
  },

  // Obtenir un jury par ID
  getById: async (id: string) => {
    const response = await api.get(`/jurys/${id}`);
    return response.data;
  },

  // Mettre à jour un jury
  update: async (id: string, data: {
    encadreurJury1Id?: string;
    encadreurJury2Id?: string;
    encadreurJury3Id?: string;
    dateSoutenance?: string;
    salle?: string;
  }) => {
    const response = await api.put(`/jurys/${id}`, data);
    return response.data;
  },

  // Supprimer un jury
  delete: async (id: string) => {
    const response = await api.delete(`/jurys/${id}`);
    return response.data;
  }
};

export const paiementApi = {
  // Créer un nouveau paiement
  create: async (data: {
    montant: number;
    reference: string;
    date: string;
  }) => {
    const response = await api.post('/paiements', data);
    return response.data;
  },

  // Obtenir tous les paiements avec filtre optionnel
  getAll: async (filters?: { status?: 'EN_ATTENTE' | 'VALIDE' | 'REJETE' }) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/paiements?${params}`);
    return response.data;
  },

  // Obtenir un paiement par ID
  getById: async (id: string) => {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  },

  // Obtenir les statistiques des paiements
  getStats: async () => {
    const response = await api.get('/paiements/stats');
    return response.data as { TOTAL: number; VALIDE: number; EN_ATTENTE: number; REJETE: number };
  },

  // Mettre à jour un paiement (admin)
  update: async (id: string, data: { montant?: number; date?: string; methode?: string; status?: string; etudiantId?: string; }) => {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data;
  },

  // Mettre à jour le statut d'un paiement
  updateStatus: async (id: string, status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE') => {
    const response = await api.patch(`/paiements/${id}/status`, { status });
    return response.data;
  },

  // Supprimer un paiement
  delete: async (id: string) => {
    const response = await api.delete(`/paiements/${id}`);
    return response.data;
  }
};

// ---------- Dashboard API ----------
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats').then(r => r.data),
  getActivities: () => api.get('/admin/dashboard/activities').then(r => r.data),
  getEvents: () => api.get('/admin/dashboard/events').then(r => r.data),
};

export const notificationApi = {
  // Obtenir toutes les notifications
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Marquer une notification comme lue
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  // Supprimer une notification
  delete: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
}; 