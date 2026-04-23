import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Download,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useFinanceSummary } from '@/hooks/useFinance';
import { useStaff } from '@/hooks/useStaff';
import { useAppointments } from '@/hooks/useAppointments';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FinanceView() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Datas do mês atual
  const now = new Date();
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const todayStr = format(now, 'yyyy-MM-dd');

  // Buscar dados
  const { summary, isLoading: loadingSummary } = useFinanceSummary(monthStart, monthEnd);
  const { staff, isLoading: loadingStaff } = useStaff();
  const { appointments: todayAppointments, isLoading: loadingToday } = useAppointments({ date: todayStr });

  const isLoading = loadingSummary || loadingStaff || loadingToday;

  // Calcular comissões por barbeiro
  const commissionData = useMemo(() => {
    if (!staff.length || !todayAppointments.length) return [];

    return staff.map(member => {
      const memberAppointments = todayAppointments.filter(
        a => a.staffId === member.id && a.status === 'COMPLETED'
      );
      const revenue = memberAppointments.reduce((sum, a) => sum + a.price, 0);
      const commission = revenue * member.commissionRate;

      return {
        barber: member.name,
        revenue,
        rate: member.commissionRate,
        commission,
        status: commission > 0 ? 'pending' : 'none',
      };
    }).filter(d => d.revenue > 0);
  }, [staff, todayAppointments]);

  // Estatísticas do dia
  const todayStats = useMemo(() => {
    const completed = todayAppointments.filter(a => a.status === 'COMPLETED');
    const totalRevenue = completed.reduce((sum, a) => sum + a.price, 0);
    const totalCommission = completed.reduce((sum, a) => {
      const staffMember = staff.find(s => s.id === a.staffId);
      return sum + (a.price * (staffMember?.commissionRate || 0.4));
    }, 0);

    return {
      totalRevenue,
      totalCommission,
      netProfit: totalRevenue - totalCommission,
      totalServices: completed.length,
    };
  }, [todayAppointments, staff]);

  // Cards de estatísticas
  const financialStats = [
    { 
      label: 'Faturamento Mensal', 
      value: `R$ ${(summary?.totalGross || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      change: '+12%', 
      icon: <TrendingUp className="text-cyber-blue" />, 
      up: true 
    },
    { 
      label: 'Comissões Pagas', 
      value: `R$ ${(summary?.totalCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      change: '+8%', 
      icon: <Users className="text-muted-foreground" />, 
      up: true 
    },
    { 
      label: 'Lucro Líquido', 
      value: `R$ ${(summary?.totalNetProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      change: '+15%', 
      icon: <DollarSign className="text-cyber-blue" />, 
      up: true 
    },
    { 
      label: 'Serviços do Mês', 
      value: `${summary?.totalAppointments || 0}`, 
      change: '+5%', 
      icon: <CalendarIcon className="text-cyber-orange" />, 
      up: true 
    },
  ];

  const generateDailyPDF = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const doc = new jsPDF();
      const today = format(now, 'dd/MM/yyyy');
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(0, 209, 255);
      doc.text('BARBERCYBER PRO', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`RELATÓRIO DIÁRIO - ${today}`, 105, 30, { align: 'center' });
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(12);
      doc.text('RESUMO FINANCEIRO:', 20, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [['Métrica', 'Valor']],
        body: [
          ['Faturamento Bruto', `R$ ${todayStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['Serviços Realizados', String(todayStats.totalServices)],
          ['Comissões Totais', `R$ ${todayStats.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['Lucro Líquido do Dia', `R$ ${todayStats.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['Média por Cliente', `R$ ${(todayStats.totalServices > 0 ? todayStats.totalRevenue / todayStats.totalServices : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 209, 255] }
      });

      if (commissionData.length > 0) {
        doc.text('DESEMPENHO POR BARBEIRO:', 20, (doc as any).lastAutoTable.finalY + 15);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          head: [['Barbeiro', 'Receita Bruta', 'Taxa', 'Comissão']],
          body: commissionData.map(d => [
            d.barber,
            `R$ ${d.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `${Math.round(d.rate * 100)}%`,
            `R$ ${d.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [0, 209, 255] }
        });
      }

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em: ${format(now, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 105, 285, { align: 'center' });
      
      doc.save(`relatorio-diario-barbercyber-${format(now, 'yyyy-MM-dd')}.pdf`);
      setIsGenerating(false);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/[0.03] border-cyber-blue/15 relative overflow-hidden group rounded-xl">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </div>
              <CardHeader className="pb-2 px-5 py-4">
                <CardDescription className="uppercase tracking-widest text-[0.7rem] font-bold text-[#888888]">{stat.label}</CardDescription>
                <CardTitle className="text-xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[0.7rem] font-bold uppercase",
                    stat.up ? "text-cyber-blue" : "text-cyber-orange"
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-[0.65rem] text-[#888888] uppercase tracking-widest">v. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commissions Table */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-cyber-blue/15 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="font-sans font-black uppercase text-xl leading-none mb-1">Comissões do Dia</CardTitle>
              <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">
                {format(now, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-cyber-blue/15 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest h-9">
              <Download size={14} className="mr-2" /> EXPORTAR
            </Button>
          </CardHeader>
          <CardContent>
            {commissionData.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#444]" />
                <p className="text-[#888]">Nenhum serviço finalizado hoje.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Barbeiro</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Faturamento</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Comissão (%)</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Valor Ganho</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionData.map((row, idx) => (
                    <TableRow key={idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <TableCell className="font-bold text-sm tracking-tight">{row.barber}</TableCell>
                      <TableCell className="text-[#888888] font-mono text-xs">R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-[#888888] font-mono text-xs">{Math.round(row.rate * 100)}%</TableCell>
                      <TableCell className="font-bold text-cyber-blue">R$ {row.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-cyber-orange/10 text-cyber-orange uppercase tracking-widest text-[8px] border-none font-black">
                          PENDENTE
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Closing Summary */}
        <Card className="bg-white/[0.03] border-cyber-blue/15 rounded-xl">
          <CardHeader>
            <CardTitle className="font-sans font-black uppercase text-xl">Fechamento Rápido</CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">Resumo do dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                <span>Meta mensal (R$ 20k)</span>
                <span className="text-cyber-blue">{Math.min(100, Math.round(((summary?.totalGross || 0) / 20000) * 100))}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,209,255,0.5)]" 
                  style={{ width: `${Math.min(100, Math.round(((summary?.totalGross || 0) / 20000) * 100))}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-cyber-blue/15">
              <p className="text-[10px] uppercase font-black tracking-widest text-cyber-blue mb-2 flex items-center gap-2">
                <DollarSign size={12} /> HOJE
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Faturamento:</span>
                  <span className="font-bold">R$ {todayStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Serviços:</span>
                  <span className="font-bold">{todayStats.totalServices}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Lucro:</span>
                  <span className="font-bold text-cyber-blue">R$ {todayStats.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <Button 
                onClick={() => setIsReportOpen(true)}
                className="w-full bg-[#00D1FF] text-black font-black uppercase tracking-tighter h-12 hover:scale-[1.02] transition-transform rounded-lg"
              >
                RELATÓRIO DO DIA
              </Button>
              <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/10 text-white rounded-2xl overflow-hidden p-0">
                <div className="bg-cyber-blue h-1 w-full" />
                <div className="p-8">
                  <DialogHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <DialogTitle className="text-3xl font-heading font-black tracking-tight uppercase">FECHAMENTO DIÁRIO</DialogTitle>
                        <DialogDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mt-1">
                          Dados consolidados de hoje: {format(now, 'dd/MM/yyyy')}
                        </DialogDescription>
                      </div>
                      <Badge className="bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20">ESTÁVEL</Badge>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Faturamento Bruto</p>
                      <p className="text-2xl font-bold">R$ {todayStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Serviços Totais</p>
                      <p className="text-2xl font-bold">{todayStats.totalServices} Fluxos</p>
                    </div>
                  </div>

                  {commissionData.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Detalhamento por Operador</h4>
                      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <Table>
                          <TableHeader className="bg-white/5">
                            <TableRow className="border-none hover:bg-transparent">
                              <TableHead className="text-[9px] uppercase font-black tracking-widest text-[#888888] h-8">Barbeiro</TableHead>
                              <TableHead className="text-[9px] uppercase font-black tracking-widest text-[#888888] h-8 text-right">Valor</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {commissionData.map((row, idx) => (
                              <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                                <TableCell className="text-xs font-bold py-3">{row.barber}</TableCell>
                                <TableCell className="text-xs font-bold text-cyber-blue py-3 text-right">
                                  R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <Button 
                      onClick={generateDailyPDF}
                      disabled={isGenerating}
                      className="flex-1 bg-white text-black font-black uppercase tracking-tighter h-11 hover:bg-cyber-blue transition-colors rounded-none"
                    >
                      {isGenerating ? (
                        <>PROCESSANDO...</>
                      ) : (
                        <>BAIXAR PDF COMPLETO <Download size={14} className="ml-2" /></>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsReportOpen(false)}
                      className="border-white/10 uppercase font-black tracking-widest text-[9px] h-11 px-6 rounded-none hover:bg-white/5"
                    >
                      FECHAR
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
