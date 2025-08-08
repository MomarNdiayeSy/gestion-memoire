import React from 'react';
import { useAuth } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { useToast } from '../components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: '',
    specialite: '',
    matricule: '',
    level: '',
    academicYear: '',
    telephone: '',
  });
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* Logo ISI */}
            <img
              src="/logo-isi.jpg"
              alt="Logo ISI"
              className="h-16 w-16 object-contain rounded-full border border-gray-200 shadow-sm"
            />
          </div>
          <p className="text-gray-600">Gestion des Mémoires Académiques</p>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Inscription
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Créez votre compte pour accéder à la plateforme
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@isi.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({...formData, role: value})}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENCADREUR">Encadreur</SelectItem>
                    <SelectItem value="ETUDIANT">Étudiant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'ENCADREUR' && (
                <div className="space-y-2">
                  <Label htmlFor="specialite">Spécialité</Label>
                  <Input
                    id="specialite"
                    value={formData.specialite}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    className="h-11"
                    required
                  />
                </div>
              )}

              {formData.role === 'ETUDIANT' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="matricule">Matricule</Label>
                    <Input
                      id="matricule"
                      value={formData.matricule}
                      onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({...formData, level: value})}
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionnez le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LICENCE">Licence</SelectItem>
                        <SelectItem value="MASTER">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Année académique</Label>
                    <Input
                      id="academicYear"
                      placeholder="2024-2025"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                      className="h-11"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="h-11"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                S'inscrire
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Déjà inscrit ? Connectez-vous
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Gestion des Mémoires - ISI © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 