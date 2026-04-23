import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  MoreHorizontal, 
  DollarSign,
  Star,
  Loader2,
  AlertCircle,
  X,
  Trash2,
  Edit3,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useStaff } from '@/hooks/useStaff';
import type { Staff, CreateStaffData } from '@/lib/api';

// Cores para avatares
const AVATAR_COLORS = ['#00D1FF', '#FF8A00', '#00FF85', '#FF00FF', '#7000FF', '#FF4444', '#44FF44'];

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function TeamView() {
  const { staff, isLoading, error, createStaff, updateStaff, deleteStaff } = useStaff();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateStaffData>({
    name: '',
    specialty: '',
    commissionRate: 0.40,
    isAvailable: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      commissionRate: 0.40,
      isAvailable: true,
    });
    setFormError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const result = await createStaff(formData);
    
    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsCreateOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    
    setFormError(null);
    setIsSubmitting(true);

    const result = await updateStaff(selectedStaff.id, formData);
    
    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsEditOpen(false);
    setSelectedStaff(null);
    resetForm();
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    
    setIsSubmitting(true);
    const result = await deleteStaff(selectedStaff.id);
    
    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsDeleteOpen(false);
    setSelectedStaff(null);
    setIsSubmitting(false);
  };

  const handleToggleAvailability = async (staffMember: Staff) => {
    await updateStaff(staffMember.id, { isAvailable: !staffMember.isAvailable });
  };

  const openEditModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      specialty: staffMember.specialty,
      commissionRate: staffMember.commissionRate,
      isAvailable: staffMember.isAvailable,
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">EQUIPE DE ELITE</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">Gerencie seus profissionais e comissões.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="bg-cyber-blue text-black font-black uppercase tracking-tighter h-10 px-6 rounded-none hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all"
        >
          <UserPlus size={16} className="mr-2" /> RECRUTAR
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl">
          <UserPlus className="w-16 h-16 mx-auto mb-4 text-[#444]" />
          <h3 className="text-xl font-bold mb-2">Nenhum barbeiro cadastrado</h3>
          <p className="text-[#888] mb-6">Comece adicionando membros à sua equipe.</p>
          <Button 
            onClick={() => { resetForm(); setIsCreateOpen(true); }}
            className="bg-cyber-blue text-black font-black uppercase tracking-tighter"
          >
            <UserPlus size={16} className="mr-2" /> Adicionar Primeiro Barbeiro
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue/20 to-cyber-orange/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-cyber-blue/30 p-1 bg-black">
                      <AvatarFallback style={{ backgroundColor: getAvatarColor(index) }} className="text-black font-bold">
                        {member.name.substring(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a]",
                      member.isAvailable ? "bg-green-500" : "bg-zinc-700"
                    )} />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10">
                      <DropdownMenuItem 
                        onClick={() => openEditModal(member)}
                        className="text-[10px] uppercase font-black tracking-widest"
                      >
                        <Edit3 size={12} className="mr-2" /> Editar Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleAvailability(member)}
                        className="text-[10px] uppercase font-black tracking-widest"
                      >
                        <Power size={12} className="mr-2" /> 
                        {member.isAvailable ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteModal(member)}
                        className="text-[10px] uppercase font-black tracking-widest text-destructive"
                      >
                        <Trash2 size={12} className="mr-2" /> Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{member.name}</h3>
                  <p className="text-cyber-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4">{member.specialty}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                        <DollarSign size={12} />
                        <span className="text-[8px] uppercase font-black tracking-widest">Comissão</span>
                      </div>
                      <p className="text-sm font-bold text-white">{Math.round(member.commissionRate * 100)}%</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                        <Star size={12} />
                        <span className="text-[8px] uppercase font-black tracking-widest">Status</span>
                      </div>
                      <p className={cn("text-sm font-bold", member.isAvailable ? "text-green-400" : "text-zinc-500")}>
                        {member.isAvailable ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest rounded-none">
                    ID: {member.id.slice(0, 8)}
                  </Badge>
                  <div 
                    className="ml-auto w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: getAvatarColor(index) }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Criar */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Recrutar Barbeiro</DialogTitle>
          </DialogHeader>
          
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Nome</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="Nome do barbeiro"
                required
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Especialidade</Label>
              <Input 
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="Ex: Fade & Beard"
                required
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Taxa de Comissão (%)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={Math.round((formData.commissionRate || 0) * 100)}
                onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: Number(e.target.value) / 100 }))}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="40"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="border-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyber-blue text-black font-bold">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Editar Barbeiro</DialogTitle>
          </DialogHeader>
          
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Nome</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                required
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Especialidade</Label>
              <Input 
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                required
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Taxa de Comissão (%)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={Math.round((formData.commissionRate || 0) * 100)}
                onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: Number(e.target.value) / 100 }))}
                className="mt-2 bg-white/5 border-white/10"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="border-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyber-blue text-black font-bold">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Deletar */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-red-500">Remover Barbeiro</DialogTitle>
          </DialogHeader>
          
          <p className="text-[#888]">
            Tem certeza que deseja remover <span className="text-white font-bold">{selectedStaff?.name}</span>? 
            Esta ação não pode ser desfeita.
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} className="border-white/10">
              Cancelar
            </Button>
            <Button onClick={handleDelete} disabled={isSubmitting} className="bg-red-500 text-white font-bold hover:bg-red-600">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
