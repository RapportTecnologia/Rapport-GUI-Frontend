import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactForm from './ContactForm';
import BotsList from './BotsList';
import BotForm from './BotForm';
import AssociationTab from './AssociationTab';
import './App.css';

interface Contact {
  id?: number;
  name: string;
  description: string;
  type: string;
  origin: string;
  contact: string;
}

interface Bot {
  id?: number;
  alias: string;
  name: string;
  contactId?: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts'); // Gerenciar abas
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<Bot | undefined>(undefined);
  const [botSearchTerm, setBotSearchTerm] = useState('');
  const [botPage, setBotPage] = useState(1);
  const [totalBots, setTotalBots] = useState(0);

  const itemsPerPage = 10;

  // Função para buscar contatos do backend
  const fetchContacts = async (page: number, searchTerm: string) => {
    const res = await fetch(`http://localhost:3001/contacts?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}&search=${searchTerm}`);
    const data = await res.json();
    setContacts(data.contacts || []);
    setTotalContacts(data.total);
    return data;
  };

  // Função para buscar bots do backend
  const fetchBots = async (page: number, searchTerm: string) => {
    try {
      const res = await fetch(`http://localhost:3001/bots?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}&search=${searchTerm}`);
      
      if (!res.ok) {
        throw new Error(`Erro ao buscar bots: ${res.statusText}`);
      }
  
      const data = await res.json();
  
      // Verificar se a resposta possui a estrutura correta
      if (!data.bots || !Array.isArray(data.bots)) {
        throw new Error("Estrutura de dados inválida para bots.");
      }
  
      setBots(data.bots); // Atualiza os bots
      setTotalBots(data.total || 0);
      return data;
    } catch (error) {
      console.error("Erro ao buscar bots:", error);
    }
  };
  

  const associateBotToContact = async (contactId: number, botId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/contact_from_bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, botId }),
      });
  
      if (!res.ok) {
        throw new Error(`Erro ao associar bot ao contato: ${res.statusText}`);
      }
  
      alert(`Bot ${botId} associado com sucesso ao contato ${contactId}`);
    } catch (error) {
      console.error('Erro ao associar bot ao contato:', error);
    }
  };

  // Buscar contatos ao carregar ou quando searchTerm ou página mudarem
  useEffect(() => {
    fetchContacts(contactPage, contactSearchTerm);
  }, [contactPage, contactSearchTerm]);

  // Buscar bots ao carregar ou quando searchTerm ou página mudarem
  useEffect(() => {
    fetchBots(botPage, botSearchTerm);
  }, [botPage, botSearchTerm]);

  // Função para lidar com a submissão do formulário de contatos
  const handleContactSubmit = async (contact: Contact) => {
    if (contact.id) {
      await fetch(`http://localhost:3001/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
    } else {
      await fetch(`http://localhost:3001/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
    }
    setEditingContact(undefined);
    fetchContacts(contactPage, contactSearchTerm);
  };

  // Função para editar contato
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  // Função para deletar contato
  const handleDeleteContact = async (id: number) => {
    await fetch(`http://localhost:3001/contacts/${id}`, { method: 'DELETE' });
    fetchContacts(contactPage, contactSearchTerm);
  };

  // Função para lidar com a submissão do formulário de bots
  const handleBotSubmit = async (bot: Bot) => {
    if (bot.id) {
      await fetch(`http://localhost:3001/bots/${bot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      });
    } else {
      await fetch(`http://localhost:3001/bots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      });
    }
    setEditingBot(undefined);
    fetchBots(botPage, botSearchTerm);
  };

  // Função para editar bot
  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
  };

  // Função para deletar bot
  const handleDeleteBot = async (id: number) => {
    await fetch(`http://localhost:3001/bots/${id}`, { method: 'DELETE' });
    fetchBots(botPage, botSearchTerm);
  };

  return (
    <div className="app-container">
      <h1>Gerenciamento de Contatos e Bots</h1>

      {/* Abas de navegação */}
      <div className="tabs">
        <button onClick={() => setActiveTab('contacts')}>Contatos</button>
        <button onClick={() => setActiveTab('bots')}>Bots</button>
        <button onClick={() => setActiveTab('association')}>Associação de Contato com Bot</button>
      </div>

      {/* Conteúdo da aba de Contatos */}
      {activeTab === 'contacts' && (
        <div>
          <h2>Contatos</h2>
          <input
            type="text"
            placeholder="Buscar contatos"
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
          />
          <ContactForm contactToEdit={editingContact} onSubmit={handleContactSubmit} />
          <ContactsList contacts={contacts} onEdit={handleEditContact} onDelete={handleDeleteContact} />
          <button onClick={() => setContactPage(contactPage - 1)} disabled={contactPage === 1}>
            Página Anterior
          </button>
          <button onClick={() => setContactPage(contactPage + 1)} disabled={contactPage * itemsPerPage >= totalContacts}>
            Próxima Página
          </button>
        </div>
      )}

      {/* Conteúdo da aba de Bots */}
      {activeTab === 'bots' && (
        <div>
          <h2>Bots</h2>
          <input
            type="text"
            placeholder="Buscar bots"
            value={botSearchTerm}
            onChange={(e) => setBotSearchTerm(e.target.value)}
          />
          <BotForm botToEdit={editingBot} onSubmit={handleBotSubmit} />
          <BotsList bots={bots} onEdit={handleEditBot} onDelete={handleDeleteBot} />
          <button onClick={() => setBotPage(botPage - 1)} disabled={botPage === 1}>
            Página Anterior
          </button>
          <button onClick={() => setBotPage(botPage + 1)} disabled={botPage * itemsPerPage >= totalBots}>
            Próxima Página
          </button>
        </div>
      )}

      {/* Conteúdo da aba de Associação */}
      {activeTab === 'association' && (
        <div>
          <h2>Associação de Contatos com Bots</h2>
          <AssociationTab fetchBots={fetchBots} fetchContacts={fetchContacts} associateBotToContact={associateBotToContact} />
        </div>
      )}
    </div>
  );
};

export default App;
