import { motion } from 'motion/react';
import { 
  MessageCircle, 
  Globe, 
  Zap, 
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function IntegrationsView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">CENTRAL DE SINAPSES</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">Conecte o BarberCyber Pro ao mundo exterior.</p>
        </div>
        <Badge variant="outline" className="text-cyber-blue border-cyber-blue/30 text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-none">
          MODO OPERACIONAL: ATIVO
        </Badge>
      </div>

      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md">
          {/* WhatsApp Card */}
          <Card className="bg-[#0a0a0a] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <MessageCircle size={100} className="text-[#25D366]" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-2">
                <MessageCircle className="text-[#25D366]" size={24} />
              </div>
              <CardTitle className="font-heading font-black text-2xl uppercase">WHATSAPP</CardTitle>
              <CardDescription className="uppercase text-[9px] font-bold tracking-widest text-[#888888]">Acesso Direto ao WhatsApp Web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-[#25D366]/5 border border-[#25D366]/20 rounded-xl">
                <Globe size={16} className="text-[#25D366]" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-white">Modo: Navegador Externo</p>
                  <p className="text-[8px] uppercase text-[#25D366] font-bold">Gerencie seus clientes em uma aba dedicada</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Status de Conexão</p>
                <div className="flex items-center justify-between text-[11px] font-bold py-1 border-b border-white/5">
                  <span className="text-muted-foreground">Sincronização Online</span>
                  <span className="text-[#25D366] flex items-center gap-1">ATIVO <Zap size={10} /></span>
                </div>
                <p className="text-[8px] uppercase text-[#888888] leading-tight mt-2">Clique no botão abaixo para abrir o WhatsApp Web e realizar seus atendimentos com foco total.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => window.open('https://web.whatsapp.com', '_blank')}
                className="bg-[#25D366] text-black font-black uppercase tracking-tighter hover:bg-[#25D366]/90 w-full h-11 rounded-none"
              >
                ABRIR WHATSAPP WEB <ExternalLink size={14} className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
