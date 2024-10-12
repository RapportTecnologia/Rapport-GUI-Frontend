import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactForm from './ContactForm';
import BotsList from './BotsList';
import BotForm from './BotForm';
import './App.css'; // Importa o arquivo de estilo

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
  const [activeTab, setActiveTab] = useState<'contacts' | 'bots'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<Bot | undefined>(undefined);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`http://localhost:3001/contacts`);
      const data = await res.json();
      setContacts(data.data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const fetchBots = async () => {
    try {
      const res = await fetch(`http://localhost:3001/bots`);
      const data = await res.json();
      setBots(data.data);
    } catch (error) {
      console.error('Erro ao carregar bots:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'bots') {
      fetchBots();
    }
  }, [activeTab]);

  const handleContactSubmit = (contact: Contact) => {
    if (contact.id) {
      fetch(`http://localhost:3001/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
        .then(() => fetchContacts())
        .catch((error) => console.error('Erro ao atualizar contato:', error));
    } else {
      fetch('http://localhost:3001/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
        .then(() => fetchContacts())
        .catch((error) => console.error('Erro ao adicionar contato:', error));
    }
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleBotSubmit = (bot: Bot) => {
    if (bot.id) {
      fetch(`http://localhost:3001/bots/${bot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      })
        .then(() => fetchBots())
        .catch((error) => console.error('Erro ao atualizar bot:', error));
    } else {
      fetch('http://localhost:3001/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bot),
      })
        .then(() => fetchBots())
        .catch((error) => console.error('Erro ao adicionar bot:', error));
    }
    setEditingBot(undefined);
  };

  const renderTabContent = () => {
    if (activeTab === 'contacts') {
      return (
        <div className="tab-content">
          <h2>Contatos</h2>
          <ContactForm contactToEdit={editingContact} onSubmit={handleContactSubmit} />
          <ContactsList contacts={contacts} onEdit={handleEditContact} onDelete={() => {}} />
        </div>
      );
    } else if (activeTab === 'bots') {
      return (
        <div className="tab-content">
          <h2>Bots</h2>
          <BotForm botToEdit={editingBot} onSubmit={handleBotSubmit} />
          <BotsList bots={bots} onEdit={setEditingBot} onDelete={() => {}} />
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
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};

export default App;
