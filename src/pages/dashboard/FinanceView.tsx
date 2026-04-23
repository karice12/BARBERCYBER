import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Calendar as CalendarIcon,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useFinanceSummary } from '@/hooks/useData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return { start, end };
}

export default function FinanceView() {
  const [reportOpen, setReportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { start, end } = getMonthRange();
  const { summary, isLoading, error } = useFinanceSummary(start, end);

  const generateDailyPDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString('pt-BR');

      doc.setFontSize(22);
      doc.setTextColor(0, 209, 255);
      doc.text('BARBERCYBER PRO', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`RELATÓRIO MENSAL - ${today}`, 105, 30, { align: 'center' });
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(12);
      doc.text('RESUMO FINANCEIRO:', 20, 45);

      autoTable(doc, {
        startY: 50,
        head: [['Métrica', 'Valor']],
        body: [
          ['Faturamento Bruto', fmt(summary?.totalGross ?? 0)],
          ['Total de Atendimentos', String(summary?.totalAppointments ?? 0)],
          ['Comissões Totais', fmt(summary?.totalCommission ?? 0)],
          ['Lucro Líquido', fmt(summary?.totalNetProfit ?? 0)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 209, 255] },
      });

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: 'center' });
      doc.save(`relatorio-barbercyber-${today.replace(/\//g, '-')}.pdf`);
      setIsGenerating(false);
    }, 1000);
  };

  const stats = summary
    ? [
        { label: 'Faturamento Bruto', value: fmt(summary.totalGross), icon: <TrendingUp className="text-cyber-blue" />, sub: `${summary.totalAppointments} atendimentos` },
        { label: 'Comissões Pagas', value: fmt(summary.totalCommission), icon: <Users className="text-muted-foreground" />, sub: 'Este mês' },
        { label: 'Lucro Líquido', value: fmt(summary.totalNetProfit), icon: <DollarSign className="text-cyber-blue" />, sub: 'Bruto - Comissões' },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="text-cyber-blue animate-spin" size={32} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle size={16} className="text-red-400" />
          <p className="text-red-400 text-sm">
            Erro ao carregar dados financeiros. Verifique a conexão com o backend.
          </p>
        </div>
      )}

      {!isLoading && summary && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="bg-white/[0.03] border-cyber-blue/15 relative overflow-hidden group rounded-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    {stat.icon}
                  </div>
                  <CardHeader className="pb-2 px-5 py-4">
                    <CardDescription className="uppercase tracking-widest text-[0.7rem] font-bold text-[#888888]">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-xl font-bold">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <span className="text-[0.65rem] text-[#888888] uppercase tracking-widest">{stat.sub}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Period Info */}
            <Card className="lg:col-span-2 bg-white/[0.03] border-cyber-blue/15 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div>
                  <CardTitle className="font-sans font-black uppercase text-xl leading-none mb-1">
                    Resumo do Período
                  </CardTitle>
                  <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">
                    {new Date(summary.period.startDate).toLocaleDateString('pt-BR')} — {new Date(summary.period.endDate).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateDailyPDF}
                  className="border-cyber-blue/15 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest h-9"
                >
                  <Download size={14} className="mr-2" /> EXPORTAR PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Atendimentos Realizados', value: summary.totalAppointments, type: 'number' },
                    { label: 'Faturamento Bruto', value: fmt(summary.totalGross), type: 'text' },
                    { label: 'Total em Comissões', value: fmt(summary.totalCommission), type: 'text' },
                    { label: 'Lucro Líquido', value: fmt(summary.totalNetProfit), type: 'highlight' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-none">
                      <span className="text-[#888888] text-sm uppercase tracking-widest font-bold">{row.label}</span>
                      <span className={cn(
                        'font-bold',
                        row.type === 'highlight' ? 'text-cyber-blue text-lg' : 'text-white'
                      )}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/[0.03] border-cyber-blue/15 rounded-xl">
              <CardHeader>
                <CardTitle className="font-sans font-black uppercase text-xl">Fechamento</CardTitle>
                <CardDescription className="uppercase tracking-widest text-[10px] text-[#888888]">
                  Ações imediatas de caixa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lucro meter */}
                {summary.totalGross > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                      <span>Margem Líquida</span>
                      <span className="text-cyber-blue">
                        {((summary.totalNetProfit / summary.totalGross) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,209,255,0.5)] transition-all"
                        style={{ width: `${Math.min((summary.totalNetProfit / summary.totalGross) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-white/[0.03] border border-cyber-blue/15">
                  <p className="text-[10px] uppercase font-black tracking-widest text-cyber-orange mb-2 flex items-center gap-2">
                    <CalendarIcon size={12} /> PERÍODO
                  </p>
                  <p className="text-xs leading-relaxed text-[#888888]">
                    Dados de{' '}
                    <span className="text-foreground font-bold">
                      {new Date(summary.period.startDate).toLocaleDateString('pt-BR')}
                    </span>{' '}
                    até{' '}
                    <span className="text-foreground font-bold">
                      {new Date(summary.period.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </p>
                </div>

                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                  <DialogTrigger render={
                    <Button className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 hover:scale-[1.02] transition-transform rounded-lg">
                      RELATÓRIO DO MÊS
                    </Button>
                  } />
                  <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-2xl overflow-hidden p-0">
                    <div className="bg-cyber-blue h-1 w-full" />
                    <div className="p-8">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-sans font-black tracking-tight uppercase mb-1">
                          FECHAMENTO MENSAL
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 my-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Faturamento Bruto</p>
                          <p className="text-2xl font-bold">{fmt(summary.totalGross)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Atendimentos</p>
                          <p className="text-2xl font-bold">{summary.totalAppointments}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Comissões</p>
                          <p className="text-xl font-bold text-cyber-orange">{fmt(summary.totalCommission)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] uppercase font-black text-[#888888] mb-1">Lucro Líquido</p>
                          <p className="text-xl font-bold text-cyber-blue">{fmt(summary.totalNetProfit)}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <Button
                          onClick={generateDailyPDF}
                          disabled={isGenerating}
                          className="flex-1 bg-white text-black font-black uppercase tracking-tighter h-11 hover:bg-cyber-blue transition-colors rounded-none"
                        >
                          {isGenerating ? 'PROCESSANDO...' : <><Download size={14} className="mr-2" /> BAIXAR PDF</>}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setReportOpen(false)}
                          className="border-white/10 uppercase font-black tracking-widest text-[9px] h-11 px-6 rounded-none hover:bg-white/5"
                        >
                          FECHAR
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Badge variant="outline" className="w-full justify-center border-cyber-blue/15 text-cyber-blue text-[9px] uppercase tracking-widest py-2">
                  Dados atualizados em tempo real
                </Badge>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!isLoading && !error && !summary && (
        <div className="text-center py-20 opacity-30">
          <p className="text-6xl font-black uppercase tracking-tighter mb-2">VAZIO</p>
          <p className="text-sm uppercase tracking-widest">Nenhuma transação encontrada para este período.</p>
        </div>
      )}
    </div>
  );
}
