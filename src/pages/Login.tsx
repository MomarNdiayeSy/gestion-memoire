
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, BookOpen, User, GraduationCap, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (role: 'admin' | 'encadreur' | 'etudiant') => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement real authentication
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plateforme ISI</h1>
          <p className="text-gray-600">Gestion des Mémoires Académiques</p>
        </div>

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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@isi.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Se connecter
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>

            {/* Boutons de connexion rapide pour le développement */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Connexion rapide (développement)</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => onLogin('admin')}
                  variant="outline"
                  className="w-full h-10 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Se connecter comme Administrateur
                </Button>
                <Button 
                  onClick={() => onLogin('encadreur')}
                  variant="outline"
                  className="w-full h-10 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <User className="mr-2 h-4 w-4" />
                  Se connecter comme Encadreur
                </Button>
                <Button 
                  onClick={() => onLogin('etudiant')}
                  variant="outline"
                  className="w-full h-10 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Se connecter comme Étudiant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Plateforme de Gestion des Mémoires - ISI © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
