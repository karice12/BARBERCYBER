import { Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import AgendaView from './dashboard/AgendaView';
import FinanceView from './dashboard/FinanceView';
import SubscriptionView from './dashboard/SubscriptionView';
import TeamView from './dashboard/TeamView';
import IntegrationsView from './dashboard/IntegrationsView';
import SettingsView from './dashboard/SettingsView';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={
            <>
              <Header title="Agenda Inteligente" />
              <main className="flex-1 overflow-auto p-0">
                <AgendaView />
              </main>
            </>
          } />
          <Route path="/team" element={
            <>
              <Header title="Gerir Equipe" />
              <main className="flex-1 overflow-auto p-8">
                <TeamView />
              </main>
            </>
          } />
          <Route path="/finance" element={
            <>
              <Header title="Gestão Financeira" />
              <main className="flex-1 overflow-auto p-8">
                <FinanceView />
              </main>
            </>
          } />
          <Route path="/integrations" element={
            <>
              <Header title="Integrações & APIs" />
              <main className="flex-1 overflow-auto p-8">
                <IntegrationsView />
              </main>
            </>
          } />
          <Route path="/subscription" element={
            <>
              <Header title="Minha Assinatura" />
              <main className="flex-1 overflow-auto p-8">
                <SubscriptionView />
              </main>
            </>
          } />
          <Route path="/settings" element={
            <>
              <Header title="Ajustes do Sistema" />
              <main className="flex-1 overflow-auto p-8">
                <SettingsView />
              </main>
            </>
          } />
          {/* Add other routes as simple placeholders for now */}

          <Route path="/*" element={
            <>
              <Header title="Em Construção" />
              <main className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-30 select-none">
                  <h2 className="text-9xl font-black uppercase tracking-tighter">SOON</h2>
                  <p className="font-heading tracking-[1em] uppercase">Setor em upgrade cibernético</p>
                </div>
              </main>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
}
