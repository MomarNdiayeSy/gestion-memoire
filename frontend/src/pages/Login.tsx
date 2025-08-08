import React from 'react';
import { useAuth } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '../components/ui/use-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
      });

      // Redirection basée sur le rôle
      const dashboardRoutes: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        ENCADREUR: '/encadreur/dashboard',
        ETUDIANT: '/etudiant/dashboard',
      };
      navigate(dashboardRoutes[user.role]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo-isi.jpg"
              alt="Logo ISI"
              className="h-16 w-16 object-contain rounded-full border border-gray-200 shadow-sm"
            />
          </div>
          <p className="text-gray-600">Gestion des Mémoires Académiques</p>
        </div>

        {/* Carte de connexion */}
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entrez vos identifiants pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@isi.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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

              {/* Message d'erreur */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Bouton Connexion */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Se connecter
              </Button>

              {/* Lien mot de passe oublié */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Lien vers inscription */}
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  Pas de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')} // Redirection vers la page d'inscription
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    S'inscrire
                  </button>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Gestion des Mémoires - ISI © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
