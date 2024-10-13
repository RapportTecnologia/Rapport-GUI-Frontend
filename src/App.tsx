import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import BotsList from './BotsList';
import AssociationTab from './AssociationTab';
import ContactForm from './ContactForm';
import BotForm from './BotForm';
import {Contact, Bot} from './types'
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactPage, setContactPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [botPage, setBotPage] = useState(1);
  const [totalBots, setTotalBots] = useState(0);
  const [botSearchTerm, setBotSearchTerm] = useState('');

  const itemsPerPage = 10;

  // Função para buscar contatos do backend
  const fetchContacts = async (page: number, searchTerm: string): Promise<{ contacts: Contact[]; total: number }>  => {
    const res = await fetch(`http://localhost:3001/contacts?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}&search=${searchTerm}`);
    const data = await res.json();
    setContacts(data.contacts || []);
    setTotalContacts(data.total || 0);
    return {
      contacts: data.contacts || [],
      total: data.total || 0,
    };
  };

  // Função para buscar bots do backend
  const fetchBots = async (page: number, searchTerm: string) => {
    const res = await fetch(`http://localhost:3001/bots?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}&search=${searchTerm}`);
    const data = await res.json();
    setBots(data.bots || []);
    setTotalBots(data.total || 0);
    return {
      bots: data.bots || [],
      total: data.total || 0,
    };
  };

  // Carregar contatos ao montar o componente ou quando o page/searchTerm mudar
  useEffect(() => {
    fetchContacts(contactPage, contactSearchTerm);
  }, [contactPage, contactSearchTerm]);

  // Carregar bots ao montar o componente ou quando o page/searchTerm mudar
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
    setEditingContact(null);
    fetchContacts(contactPage, contactSearchTerm); // Atualizar lista de contatos
  };

  // Função para editar contato
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  // Função para deletar contato
  const handleDeleteContact = async (id: number) => {
    await fetch(`http://localhost:3001/contacts/${id}`, { method: 'DELETE' });
    fetchContacts(contactPage, contactSearchTerm); // Atualizar lista de contatos
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
    setEditingBot(null);
    fetchBots(botPage, botSearchTerm); // Atualizar lista de bots
  };

  // Função para editar bot
  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
  };

  // Função para deletar bot
  const handleDeleteBot = async (id: number) => {
    await fetch(`http://localhost:3001/bots/${id}`, { method: 'DELETE' });
    fetchBots(botPage, botSearchTerm); // Atualizar lista de bots
  };

  // Função para associar bot a contato
  const associateBotToContact = async (contactId: number, botId: number) => {
    await fetch(`http://localhost:3001/contact_from_bot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, botId }),
    });
    alert(`Bot ${botId} associado com sucesso ao contato ${contactId}`);
  };

  return (
    <div className="app-container">
      <h1>Gerenciamento de Contatos e Bots</h1>

      {/* Guias de navegação */}
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('contacts')} 
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}>
          Contatos
        </button>
        <button 
          onClick={() => setActiveTab('bots')} 
          className={`tab-button ${activeTab === 'bots' ? 'active' : ''}`}>
          Bots
        </button>
        <button 
          onClick={() => setActiveTab('association')} 
          className={`tab-button ${activeTab === 'association' ? 'active' : ''}`}>
          Associação
        </button>
      </div>

      {/* Conteúdo das guias */}
      {activeTab === 'contacts' && (
        <>
          <input
            type="text"
            placeholder="Buscar contatos"
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
          />
          <ContactForm contactToEdit={editingContact ?? undefined} onSubmit={handleContactSubmit} />
          <ContactsList
            contacts={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            currentPage={contactPage}
            totalPages={Math.ceil(totalContacts / itemsPerPage)}
            onNextPage={() => setContactPage(contactPage + 1)}
            onPrevPage={() => setContactPage(contactPage - 1)}
          />
        </>
      )}

      {activeTab === 'bots' && (
        <>
          <input
            type="text"
            placeholder="Buscar bots"
            value={botSearchTerm}
            onChange={(e) => setBotSearchTerm(e.target.value)}
          />
          <BotForm botToEdit={editingBot ?? undefined} onSubmit={handleBotSubmit} />
          <BotsList
            bots={bots}
            onEdit={handleEditBot}
            onDelete={handleDeleteBot}
            currentPage={botPage}
            totalPages={Math.ceil(totalBots / itemsPerPage)}
            onNextPage={() => setBotPage(botPage + 1)}
            onPrevPage={() => setBotPage(botPage - 1)}
          />
        </>
      )}

      {activeTab === 'association' && (
        <AssociationTab
          fetchContacts={fetchContacts}
          fetchBots={fetchBots}
          associateBotToContact={associateBotToContact}
        />
      )}
    </div>
  );
};

export default App;
