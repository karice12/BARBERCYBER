import { 
  Building2, 
  MapPin, 
  Clock, 
  Shield, 
  Palette, 
  Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">AJUSTES DO NÚCLEO</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">Configure o DNA da sua barbearia.</p>
        </div>
        <Button className="bg-white text-black font-black uppercase tracking-tighter h-10 px-8 rounded-none group hover:bg-cyber-blue transition-colors">
          <Save size={16} className="mr-2" /> SALVAR ALTERAÇÕES
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5 rounded-none p-1 mb-8">
          <TabsTrigger value="general" className="rounded-none data-[state=active]:bg-cyber-blue data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest">Geral</TabsTrigger>
          <TabsTrigger value="hours" className="rounded-none data-[state=active]:bg-cyber-blue data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest">Horários</TabsTrigger>
          <TabsTrigger value="branding" className="rounded-none data-[state=active]:bg-cyber-blue data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest">Branding</TabsTrigger>
          <TabsTrigger value="security" className="rounded-none data-[state=active]:bg-cyber-blue data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-[#0a0a0a] border-white/5 rounded-none">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Building2 size={20} className="text-cyber-blue" />
                <CardTitle className="font-heading font-black uppercase text-xl">Perfil da Unidade</CardTitle>
              </div>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Informações básicas visíveis para o cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Nome Comercial</Label>
                  <Input defaultValue="Barba Cyber Matriz" className="bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue transition-all" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">WhatsApp Administrativo</Label>
                  <Input defaultValue="+55 11 99999-0000" className="bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue transition-all" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Endereço Corporativo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                    <Input defaultValue="Av. Paulista, 1000 - Cyber Tower Floor 4" className="pl-10 bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue transition-all" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border-white/5 rounded-none">
             <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield size={20} className="text-cyber-orange" />
                <CardTitle className="font-heading font-black uppercase text-xl">Políticas de Agendamento</CardTitle>
              </div>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Regras de retenção e no-show.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5">
                 <div>
                   <p className="text-[11px] font-black uppercase text-white">Exigir Pagamento Antecipado</p>
                   <p className="text-[9px] uppercase text-[#888888] font-bold">Solicita 50% do valor no ato do agendamento.</p>
                 </div>
                 <div className="w-12 h-6 bg-cyber-blue rounded-full relative cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-lg" />
                 </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5">
                 <div>
                   <p className="text-[11px] font-black uppercase text-white">Tempo Limite para Cancelamento</p>
                   <p className="text-[9px] uppercase text-[#888888] font-bold">Período gratuito para o cliente desistir.</p>
                 </div>
                 <select className="bg-black border border-white/10 text-xs font-bold uppercase p-2 focus:border-cyber-blue outline-none">
                   <option>2 Horas Antes</option>
                   <option>4 Horas Antes</option>
                   <option>24 Horas Antes</option>
                 </select>
               </div>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6 text-center py-10 opacity-50">
           <Clock size={40} className="mx-auto mb-4 text-[#888888]" />
           <p className="font-heading font-bold uppercase tracking-widest">Módulo de Escala Temporal em Manutenção</p>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 text-center py-10 opacity-50">
           <Palette size={40} className="mx-auto mb-4 text-[#888888]" />
           <p className="font-heading font-bold uppercase tracking-widest">Interface de Estilização Visual em Manutenção</p>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 text-center py-10 opacity-50">
           <Shield size={40} className="mx-auto mb-4 text-[#888888]" />
           <p className="font-heading font-bold uppercase tracking-widest">Sistemas de Proteção de Dados Estáveis</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
