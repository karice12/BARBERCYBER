import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Download,
  Calendar as CalendarIcon,
  FileText,
  Printer,
  X,
  CheckCircle2
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FINANCIAL_STATS = [
  { label: 'Faturamento Total', value: 'R$ 15.420,00', change: '+12%', icon: <TrendingUp className="text-cyber-blue" />, up: true },
  { label: 'Comissões Pagas', value: 'R$ 6.168,00', change: '+8%', icon: <Users className="text-muted-foreground" />, up: true },
  { label: 'Lucro Líquido', value: 'R$ 9.252,00', change: '+15%', icon: <DollarSign className="text-cyber-blue" />, up: true },
  { label: 'Despesas Operacionais', value: 'R$ 2.100,00', change: '-2%', icon: <TrendingDown className="text-cyber-orange" />, up: false },
];

const COMMISSION_DATA = [
  { barber: 'Zeca Cyber', revenue: 4200, rate: 0.4, commission: 1680, status: 'paid' },
  { barber: 'Rick Neon', revenue: 3800, rate: 0.4, commission: 1520, status: 'pending' },
  { barber: 'Léo Blade', revenue: 3100, rate: 0.4, commission: 1240, status: 'paid' },
  { barber: 'Samu Volt', revenue: 2500, rate: 0.4, commission: 1000, status: 'pending' },
  { barber: 'Davi Gear', revenue: 1820, rate: 0.4, commission: 728, status: 'pending' },
];

export default function FinanceView() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDailyPDF = () => {
    setIsGenerating(true);
    
    // Simulate slight delay for "generation" feel
    setTimeout(() => {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString('pt-BR');
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(0, 209, 255); // Cyber Blue
      doc.text('BARBERCYBER PRO', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`RELATÓRIO DIÁRIO - ${today}`, 105, 30, { align: 'center' });
      
      // Horizontal Line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      // Summary Stats
      doc.setFontSize(12);
      doc.text('RESUMO FINANCEIRO:', 20, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [['Métrica', 'Valor']],
        body: [
          ['Faturamento Bruto', 'R$ 1.250,00'],
          ['Serviços Realizados', '18'],
          ['Comissões Totais', 'R$ 500,00'],
          ['Lucro Líquido do Dia', 'R$ 750,00'],
          ['Média por Cliente', 'R$ 69,44'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 209, 255] }
      });

      // Daily Details
      doc.text('DESEMPENHO POR BARBEIRO:', 20, (doc as any).lastAutoTable.finalY + 15);
      
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Barbeiro', 'Serviços', 'Receita Bruta', 'Comissão']],
        body: [
          ['Zeca Cyber', '8', 'R$ 450,00', 'R$ 180,00'],
          ['Rick Neon', '6', 'R$ 380,00', 'R$ 152,00'],
          ['Léo Blade', '4', 'R$ 420,00', 'R$ 168,00'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 209, 255] }
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: 'center' });
      
      doc.save(`relatorio-diario-barbercyber-${today.replace(/\//g, '-')}.pdf`);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FINANCIAL_STATS.map((stat, idx) => (
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
              <CardTitle className="font-sans font-black uppercase text-xl leading-none mb-1">Cálculo de Comissões</CardTitle>
              <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">Período: Abril 2026</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-cyber-blue/15 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest h-9">
              <Download size={14} className="mr-2" /> EXPORTAR
            </Button>
          </CardHeader>
          <CardContent>
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
                {COMMISSION_DATA.map((row, idx) => (
                  <TableRow key={idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-bold text-sm tracking-tight">{row.barber}</TableCell>
                    <TableCell className="text-[#888888] font-mono text-xs">R$ {row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-[#888888] font-mono text-xs">{row.rate * 100}%</TableCell>
                    <TableCell className="font-bold text-cyber-blue">R$ {row.commission.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "uppercase tracking-widest text-[8px] border-none font-black",
                        row.status === 'paid' ? "bg-green-500/10 text-green-400" : "bg-cyber-orange/10 text-cyber-orange"
                      )}>
                        {row.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Closing Summary */}
        <Card className="bg-white/[0.03] border-cyber-blue/15 rounded-xl">
          <CardHeader>
            <CardTitle className="font-sans font-black uppercase text-xl">Fechamento Rápido</CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">Ações imediatas de caixa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                <span>Meta mensal (R$ 20k)</span>
                <span className="text-cyber-blue">77%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,209,255,0.5)] w-[77%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-cyber-blue/15">
              <p className="text-[10px] uppercase font-black tracking-widest text-cyber-orange mb-2 flex items-center gap-2">
                <CalendarIcon size={12} /> ALERTA
              </p>
              <p className="text-xs leading-relaxed text-[#888888]">Aluguel Estação Cyber em <span className="text-foreground font-bold italic underline">2 dias</span>. Reserva R$ 2.500.</p>
            </div>

            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <DialogTrigger render={
                <Button className="w-full bg-[#00D1FF] text-black font-black uppercase tracking-tighter h-12 hover:scale-[1.02] transition-transform rounded-lg">
                  RELATÓRIO DO DIA
                </Button>
              } />
              <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/10 text-white rounded-2xl overflow-hidden p-0">
                <div className="bg-cyber-blue h-1 w-full" />
                <div className="p-8">
                  <DialogHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <DialogTitle className="text-3xl font-heading font-black tracking-tight uppercase">FECHAMENTO DIÁRIO</DialogTitle>
                        <DialogDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mt-1">
                          Dados consolidados de hoje: {new Date().toLocaleDateString('pt-BR')}
                        </DialogDescription>
                      </div>
                      <Badge className="bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20">ESTÁVEL</Badge>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Faturamento Bruto</p>
                      <p className="text-2xl font-bold">R$ 1.250,00</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Serviços Totais</p>
                      <p className="text-2xl font-bold">18 Fluxos</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Detalhamento por Operador</h4>
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-white/5">
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="text-[9px] uppercase font-black tracking-widest text-[#888888] h-8">Barbeiro</TableHead>
                            <TableHead className="text-[9px] uppercase font-black tracking-widest text-[#888888] h-8">Serv.</TableHead>
                            <TableHead className="text-[9px] uppercase font-black tracking-widest text-[#888888] h-8 text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-xs font-bold py-3">Zeca Cyber</TableCell>
                            <TableCell className="text-xs py-3">08</TableCell>
                            <TableCell className="text-xs font-bold text-cyber-blue py-3 text-right">R$ 450,00</TableCell>
                          </TableRow>
                          <TableRow className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-xs font-bold py-3">Rick Neon</TableCell>
                            <TableCell className="text-xs py-3">06</TableCell>
                            <TableCell className="text-xs font-bold text-cyber-blue py-3 text-right">R$ 380,00</TableCell>
                          </TableRow>
                          <TableRow className="border-none hover:bg-white/5">
                            <TableCell className="text-xs font-bold py-3">Léo Blade</TableCell>
                            <TableCell className="text-xs py-3">04</TableCell>
                            <TableCell className="text-xs font-bold text-cyber-blue py-3 text-right">R$ 420,00</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

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
            <Button variant="outline" className="w-full border-cyber-blue/15 uppercase font-black tracking-widest text-[10px] h-12 rounded-lg hover:bg-white/5">
               CONCILIAR PIX
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

