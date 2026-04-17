import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Download,
  Calendar as CalendarIcon
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

            <Button className="w-full bg-[#00D1FF] text-black font-black uppercase tracking-tighter h-12 hover:scale-[1.02] transition-transform rounded-lg">
              RELATÓRIO DO DIA
            </Button>
            <Button variant="outline" className="w-full border-cyber-blue/15 uppercase font-black tracking-widest text-[10px] h-12 rounded-lg hover:bg-white/5">
               CONCILIAR PIX
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
