import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactForm from './ContactForm';
import BotsList from './BotsList';
import BotForm from './BotForm';
import AssociationTab from './AssociationTab'; // Nova aba para associação de contatos e bots
import './App.css';

interface Contact {
  id?: number;
  contact: string;
  name: string;
  type: string;
  origem: string;
  description: string;
}

interface Bot {
  id?: number;
  alias: string;
  name: string;
  contact_id: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'bots' | 'association'>('contacts'); // Nova aba para associação
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined); // Estado para edição de contato
  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<Bot | undefined>(undefined); // Estado para edição de bot

  // Fetch contatos do backend
  const fetchContacts = async () => {
    try {
      const res = await fetch(`http://localhost:3001/contacts`);
      const data = await res.json();
      setContacts(data.data); // Atualizar estado com contatos
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  // Fetch bots do backend
  const fetchBots = async () => {
    try {
      const res = await fetch(`http://localhost:3001/bots`);
      const data = await res.json();
      setBots(data.data); // Atualizar estado com bots
    } catch (error) {
      console.error('Erro ao carregar bots:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchBots();
  }, []);

  // Função para adicionar ou editar um contato
  const handleContactSubmit = (contact: Contact) => {
    if (contact.id) {
      // Edição de contato (PUT)
      fetch(`http://localhost:3001/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
        .then(() => fetchContacts()) // Recarrega os contatos após edição
        .catch((error) => console.error('Erro ao atualizar contato:', error));
    } else {
      // Adição de novo contato (POST)
      fetch('http://localhost:3001/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
        .then(() => fetchContacts()) // Recarrega os contatos após adição
        .catch((error) => console.error('Erro ao adicionar contato:', error));
    }
    setEditingContact(undefined); // Limpar estado de edição
  };

  // Função para editar contato
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact); // Preencher formulário com dados para edição
  };

  // Função para adicionar ou editar um bot
  const handleBotSubmit = (bot: Bot) => {
    if (bot.id) {
      // Edição de bot (PUT)
      fetch(`http://localhost:3001/bots/${bot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      })
        .then(() => fetchBots()) // Recarrega os bots após edição
        .catch((error) => console.error('Erro ao atualizar bot:', error));
    } else {
      // Adição de novo bot (POST)
      fetch('http://localhost:3001/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      })
        .then(() => fetchBots()) // Recarrega os bots após adição
        .catch((error) => console.error('Erro ao adicionar bot:', error));
    }
    setEditingBot(undefined); // Limpar estado de edição
  };

  // Renderização das abas
  const renderTabContent = () => {
    if (activeTab === 'contacts') {
      return (
        <div className="tab-content">
          <h2>Contatos</h2>
          <ContactForm contactToEdit={editingContact} onSubmit={handleContactSubmit} />
          <ContactsList contacts={contacts} onEdit={handleEditContact} onDelete={() => { }} />
        </div>
      );
    } else if (activeTab === 'bots') {
      return (
        <div className="tab-content">
          <h2>Bots</h2>
          <BotForm botToEdit={editingBot} onSubmit={handleBotSubmit} />
          <BotsList bots={bots} onEdit={setEditingBot} onDelete={() => { }} />
        </div>
      );
    } else if (activeTab === 'association') {
      return (
        <div className="tab-content">
          <h2>Associação Contato-Bot</h2>
          <AssociationTab contacts={contacts} bots={bots} />
        </div>
      );
    }
  };

  return (
    <div className="app-container">
      <h1>Gerenciamento de Contatos e Bots</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contatos
        </button>
        <button
          className={`tab-button ${activeTab === 'bots' ? 'active' : ''}`}
          onClick={() => setActiveTab('bots')}
        >
          Bots
        </button>
        <button
          className={`tab-button ${activeTab === 'association' ? 'active' : ''}`}
          onClick={() => setActiveTab('association')}
        >
          Associação Contato-Bot
        </button>
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};

export default App;
