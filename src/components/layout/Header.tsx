import { Bell, Search, Plus, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function Header({ title }: { title: string }) {
  return (
    <header className="h-20 border-b border-cyber-blue/15 px-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-30">
      <div>
        <h1 className="font-sans text-xl font-bold uppercase tracking-tight text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-white/[0.03] border-cyber-blue/15 rounded-lg h-10 text-xs tracking-widest placeholder:text-[#888888]/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-[#888888] relative hover:bg-white/5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-orange rounded-full shadow-[0_0_10px_rgba(255,138,0,0.5)]" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-cyber-blue text-[#050505] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(0,209,255,0.2)] hover:bg-cyber-blue/90 h-10 px-6 rounded-lg transition-all active:scale-95 group">
                <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> NOVO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f0f0f] border-cyber-blue/20 text-white max-w-md p-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-cyber-blue/20 to-transparent p-6 border-b border-white/5">
                <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tighter mb-1">NOVO AGENDAMENTO</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyber-blue">Injetando dados no sistema central</DialogDescription>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Nome do Cliente</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                      <Input placeholder="CLIENT_ID_OR_NAME" className="pl-10 bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Data</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input type="date" className="pl-10 bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Horário</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input type="time" className="pl-10 bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Serviço & Especialista</Label>
                    <div className="relative">
                      <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                      <Input placeholder="SELECT_SERVICE_AND_BARBER" className="pl-10 bg-white/[0.03] border-white/10 rounded-none focus:border-cyber-blue" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyber-orange/5 border border-cyber-orange/20 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-cyber-orange">Total Estimado</span>
                    <span className="text-white">R$ 0,00</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-6 bg-[#0a0a0a] border-t border-white/5">
                <Button className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all">
                  CONFIRMAR REGISTRO
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
