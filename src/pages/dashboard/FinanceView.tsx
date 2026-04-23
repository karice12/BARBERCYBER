import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Download,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
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
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { financeApi, FinanceSummary, ApiError } from '@/lib/api';

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function monthRange(offset = 0) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + offset;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}

export default function FinanceView() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [prevSummary, setPrevSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [curr, prev] = await Promise.all([
        financeApi.summary(monthRange(0)),
        financeApi.summary(monthRange(-1)),
      ]);
      setSummary(curr);
      setPrevSummary(prev);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar dados financeiros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function pctChange(curr: number, prev: number) {
    if (prev === 0) return null;
    const pct = ((curr - prev) / prev) * 100;
    return { value: Math.abs(pct).toFixed(1), up: pct >= 0 };
  }

  const stats = summary
    ? [
        {
          label: 'Faturamento Bruto',
          value: fmtBRL(summary.totalGross),
          change: pctChange(summary.totalGross, prevSummary?.totalGross ?? 0),
          icon: <TrendingUp className="text-amber-500" />,
        },
        {
          label: 'Comissões Pagas',
          value: fmtBRL(summary.totalCommission),
          change: pctChange(summary.totalCommission, prevSummary?.totalCommission ?? 0),
          icon: <Users className="text-muted-foreground" />,
        },
        {
          label: 'Lucro Liquido',
          value: fmtBRL(summary.totalNetProfit),
          change: pctChange(summary.totalNetProfit, prevSummary?.totalNetProfit ?? 0),
          icon: <DollarSign className="text-amber-500" />,
        },
        {
          label: 'Agendamentos',
          value: String(summary.totalAppointments),
          change: pctChange(summary.totalAppointments, prevSummary?.totalAppointments ?? 0),
          icon: <TrendingDown className="text-muted-foreground" />,
        },
      ]
    : [];

  function generatePDF() {
    if (!summary) return;
    setPdfGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString('pt-BR');

      doc.setFontSize(22);
      doc.setTextColor(245, 158, 11);
      doc.text('BARBERCYBER PRO', 105, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`RELATORIO FINANCEIRO - ${summary.period.startDate} a ${summary.period.endDate}`, 105, 30, { align: 'center' });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 36, 190, 36);

      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('RESUMO DO PERIODO:', 20, 46);

      autoTable(doc, {
        startY: 50,
        head: [['Metrica', 'Valor']],
        body: [
          ['Faturamento Bruto', fmtBRL(summary.totalGross)],
          ['Comissoes Totais', fmtBRL(summary.totalCommission)],
          ['Lucro Liquido', fmtBRL(summary.totalNetProfit)],
          ['Total de Agendamentos', String(summary.totalAppointments)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11], textColor: 0 },
      });

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: 'center' });

      doc.save(`relatorio-barbercyber-${today.replace(/\//g, '-')}.pdf`);
      setPdfGenerating(false);
    }, 800);
  }

  const monthGoal = 20000;
  const goalPct = summary ? Math.min((summary.totalGross / monthGoal) * 100, 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div />
        <Button
          variant="ghost"
          size="icon"
          onClick={loadData}
          disabled={loading}
          className="text-[#888] hover:text-white"
        >
          <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-bold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-white/[0.03] border-amber-500/15 rounded-xl animate-pulse h-28" />
            ))
          : stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="bg-white/[0.03] border-amber-500/15 relative overflow-hidden group rounded-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    {stat.icon}
                  </div>
                  <CardHeader className="pb-2 px-5 py-4">
                    <CardDescription className="uppercase tracking-widest text-[0.7rem] font-bold text-[#888]">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-xl font-bold">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {stat.change ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[0.7rem] font-bold uppercase',
                            stat.change.up ? 'text-amber-500' : 'text-red-400'
                          )}
                        >
                          {stat.change.up ? '+' : '-'}{stat.change.value}%
                        </span>
                        <span className="text-[0.65rem] text-[#888] uppercase tracking-widest">
                          v. mes anterior
                        </span>
                      </div>
                    ) : (
                      <span className="text-[0.65rem] text-[#555] uppercase tracking-widest">sem historico</span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Period Summary Table */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-amber-500/15 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="font-sans font-black uppercase text-xl leading-none mb-1">
                Resumo do Periodo
              </CardTitle>
              <CardDescription className="uppercase tracking-widest text-[10px] text-[#888]">
                {summary
                  ? `${summary.period.startDate} a ${summary.period.endDate}`
                  : 'Carregando...'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePDF}
              disabled={!summary || pdfGenerating || loading}
              className="border-amber-500/20 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest h-9"
            >
              {pdfGenerating ? (
                <Loader2 size={14} className="animate-spin mr-2" />
              ) : (
                <Download size={14} className="mr-2" />
              )}
              EXPORTAR PDF
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={28} className="animate-spin text-amber-500" />
              </div>
            ) : summary ? (
              <div className="space-y-3">
                {[
                  { label: 'Faturamento Bruto', value: fmtBRL(summary.totalGross), color: 'text-amber-500' },
                  { label: 'Comissoes Pagas', value: fmtBRL(summary.totalCommission), color: 'text-[#888]' },
                  { label: 'Lucro Liquido', value: fmtBRL(summary.totalNetProfit), color: 'text-green-400' },
                  { label: 'Total de Atendimentos', value: String(summary.totalAppointments), color: 'text-white' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#888]">
                      {row.label}
                    </span>
                    <span className={cn('text-sm font-bold', row.color)}>{row.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Quick Close Card */}
        <Card className="bg-white/[0.03] border-amber-500/15 rounded-xl">
          <CardHeader>
            <CardTitle className="font-sans font-black uppercase text-xl">Fechamento Rapido</CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] text-[#888]">
              Acoes imediatas de caixa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                <span>Meta mensal ({fmtBRL(monthGoal)})</span>
                <span className="text-amber-500">{goalPct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/15">
              <p className="text-[10px] uppercase font-black tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                <CalendarIcon size={12} /> PERIODO ATUAL
              </p>
              <p className="text-xs leading-relaxed text-[#888]">
                {summary
                  ? `${summary.totalAppointments} atendimentos concluidos este mes.`
                  : 'Carregando dados...'}
              </p>
            </div>

            <Button
              onClick={() => setReportOpen(true)}
              disabled={!summary || loading}
              className="w-full bg-amber-500 text-black font-black uppercase tracking-tighter h-12 hover:bg-amber-400 transition-colors rounded-lg"
            >
              RELATORIO DO MES
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/10 text-white rounded-2xl overflow-hidden p-0">
          <div className="bg-amber-500 h-1 w-full" />
          <div className="p-8">
            <DialogHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <DialogTitle className="text-3xl font-heading font-black tracking-tight uppercase">
                    FECHAMENTO MENSAL
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mt-1">
                    {summary
                      ? `${summary.period.startDate} a ${summary.period.endDate}`
                      : ''}
                  </DialogDescription>
                </div>
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">CONSOLIDADO</Badge>
              </div>
            </DialogHeader>

            {summary && (
              <>
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] uppercase font-black text-[#888] mb-1">Faturamento Bruto</p>
                    <p className="text-2xl font-bold">{fmtBRL(summary.totalGross)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] uppercase font-black text-[#888] mb-1">Lucro Liquido</p>
                    <p className="text-2xl font-bold text-green-400">{fmtBRL(summary.totalNetProfit)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] uppercase font-black text-[#888] mb-1">Comissoes</p>
                    <p className="text-2xl font-bold text-amber-500">{fmtBRL(summary.totalCommission)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] uppercase font-black text-[#888] mb-1">Atendimentos</p>
                    <p className="text-2xl font-bold">{summary.totalAppointments}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => { generatePDF(); setReportOpen(false); }}
                    disabled={pdfGenerating}
                    className="flex-1 bg-white text-black font-black uppercase tracking-tighter h-11 hover:bg-amber-500 transition-colors rounded-none"
                  >
                    {pdfGenerating ? (
                      <Loader2 size={14} className="animate-spin mr-2" />
                    ) : (
                      <Download size={14} className="mr-2" />
                    )}
                    BAIXAR PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReportOpen(false)}
                    className="border-white/10 uppercase font-black tracking-widest text-[9px] h-11 px-6 rounded-none hover:bg-white/5"
                  >
                    FECHAR
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
