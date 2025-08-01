import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, MoreVertical, User, Video, CheckCircle } from 'lucide-react';
import { Session, getStatusBadge, getTypeBadge } from "@/lib/session";

interface Props {
  session: Session;
  role: 'ETUDIANT' | 'ENCADREUR';
  onJoin?: (session: Session) => void;
  onVisa?: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, role, onJoin, onVisa }) => {
  const cancelled = session.statut === 'ANNULEE';
  const canJoin = session.type === 'VIRTUEL' && session.meetingLink && !['TERMINE', 'EFFECTUEE', 'ANNULEE'].includes(session.statut);
  const showVisaBtn = !cancelled && (role === 'ETUDIANT' ? !session.visaEtudiant : !session.visaEncadreur);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Séance {session.numero}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canJoin && onJoin && (
              <DropdownMenuItem onClick={() => onJoin(session)}>
                Rejoindre
              </DropdownMenuItem>
            )}
            {showVisaBtn && onVisa && (
              <DropdownMenuItem onClick={() => onVisa(session.id)}>
                Signer le visa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusBadge(session.statut)}>{session.statut}</Badge>
            <Badge className={getTypeBadge(session.type)}>{session.type}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(session.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duree} min)
            </div>
            {session.encadreur && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {session.encadreur.prenom} {session.encadreur.nom}
              </div>
            )}
            {session.type === 'PRESENTIEL' && (
              <div className="text-sm text-gray-600">📍 {session.salle || 'Salle non renseignée'}</div>
            )}
            {showVisaBtn && onVisa && (
              <Button
                onClick={() => onVisa(session.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
              >
                <CheckCircle className="mr-1 h-4 w-4" /> Signer le visa
              </Button>
            )}
            {role === 'ETUDIANT' && !cancelled && (
              <>
                {session.visaEtudiant && (
                  <Button disabled className="w-full bg-green-600 cursor-default mt-2">
                    <CheckCircle className="mr-1 h-4 w-4" /> Vous avez déjà signé le visa
                  </Button>
                )}
                {session.visaEncadreur ? (
                  <Button disabled className="w-full bg-green-600 cursor-default mt-2">
                    <CheckCircle className="mr-1 h-4 w-4" /> Visa encadreur signé
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="w-full cursor-default mt-2">
                    En attente du visa encadreur
                  </Button>
                )}
              </>
            )}
          </div>

          {canJoin && onJoin && (
            <Button className="w-full mt-4" variant="outline" onClick={() => onJoin(session)}>
              <Video className="mr-2 h-4 w-4" /> Rejoindre la session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
