import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, GraduationCap, CreditCard, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as ReTooltip } from 'recharts';

interface DashboardStats {
  users: number;
  memoires: number;
  jurys: number;
  montant: number;
}

const formatAmount = (amount?: number) =>
  amount === undefined ? '--' : `${new Intl.NumberFormat('fr-FR').format(amount).replace(/\s/g, '.')} FCFA`;

const Statistics = () => {
  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Rapport des Statistiques', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Étudiants Actifs', data.users.toString()],
        ['Mémoires en Cours', data.memoires.toString()],
        ['Soutenances Planifiées', data.jurys.toString()],
        ['Revenus Mensuels', formatAmount(data.montant)],
      ],
    });

    doc.save('rapport-statistiques.pdf');
  };
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  const stats = [
    { key: 'users', title: 'Étudiants Actifs', value: data?.users ?? 0, icon: Users, color: 'from-blue-600 to-blue-700' },
    { key: 'memoires', title: 'Mémoires en Cours', value: data?.memoires ?? 0, icon: BookOpen, color: 'from-green-600 to-green-700' },
    { key: 'jurys', title: 'Soutenances Planifiées', value: data?.jurys ?? 0, icon: GraduationCap, color: 'from-purple-600 to-purple-700' },
    { key: 'montant', title: 'Revenus Mensuels', value: formatAmount(data?.montant), icon: CreditCard, color: 'from-orange-600 to-orange-700' },
  ];


  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
            <p className="text-gray-600 mt-1">Aperçu des performances et des indicateurs clés</p>
          </div>
          <Button onClick={exportPDF} className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Download className="mr-2 h-4 w-4" />
            Exporter le Rapport
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pie Chart */}
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: 'Étudiants', value: data?.users ?? 0 },
                  { name: 'Mémoires', value: data?.memoires ?? 0 },
                  { name: 'Soutenances', value: data?.jurys ?? 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {['#2563EB', '#16A34A', '#7C3AED'].map((c, i) => (
                  <Cell key={`cell-${i}`} fill={c} />
                ))}
              </Pie>
              <ReTooltip formatter={(v:number)=>v.toLocaleString('fr-FR')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
