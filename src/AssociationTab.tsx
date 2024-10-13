import React, { useState, useEffect, useCallback } from 'react';

interface Contact {
  id?: number;
  name: string;
  description: string;
}

interface Bot {
  id?: number;
  alias: string;
  name: string;
}

interface AssociationTabProps {
  fetchContacts: (page: number, searchTerm: string) => Promise<{ contacts: Contact[], total: number }>;
  fetchBots: (page: number, searchTerm: string) => Promise<{ bots: Bot[], total: number }>;
  associateBotToContact: (contactId: number, botId: number) => Promise<void>;
}

const AssociationTab: React.FC<AssociationTabProps> = ({ fetchContacts, fetchBots, associateBotToContact }) => {
  const [selectedContactId, setSelectedContactId] = useState<number | undefined>(undefined);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [botSearchTerm, setBotSearchTerm] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const [botPage, setBotPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalBots, setTotalBots] = useState(0);
  const itemsPerPage = 10;

  // Função para carregar contatos, "memorize" com useCallback
  const loadContacts = useCallback(async (page: number, searchTerm: string) => {
    const { contacts, total } = await fetchContacts(page, searchTerm);
    setContacts(contacts);
    setTotalContacts(total);
  }, [fetchContacts]);

  // Função para carregar bots, "memorize" com useCallback
  const loadBots = useCallback(async (page: number, searchTerm: string) => {
    const { bots, total } = await fetchBots(page, searchTerm);
    setBots(bots);
    setTotalBots(total);
  }, [fetchBots]);

  // Carregar contatos ao carregar o componente ou quando searchTerm ou página mudarem
  useEffect(() => {
    loadContacts(contactPage, contactSearchTerm);
  }, [contactPage, contactSearchTerm, loadContacts]);

  // Carregar bots ao carregar o componente ou quando searchTerm ou página mudarem
  useEffect(() => {
    loadBots(botPage, botSearchTerm);
  }, [botPage, botSearchTerm, loadBots]);

  const handleAssociateBot = async (botId: number) => {
    if (selectedContactId) {
      await associateBotToContact(selectedContactId, botId);
      alert(`Bot ${botId} associado ao contato ${selectedContactId}`);
    } else {
      alert('Por favor, selecione um contato antes de associar um bot.');
    }
  };

  return (
    <div className="association-container">
      <div className="contact-column">
        <h3>Contatos</h3>
        <input
          type="text"
          placeholder="Buscar contatos por nome ou descrição"
          value={contactSearchTerm}
          onChange={(e) => setContactSearchTerm(e.target.value)}
        />
        <ul>
          {contacts.map(contact => (
            <li key={contact.id}>
              <button onClick={() => setSelectedContactId(contact.id)} className={selectedContactId === contact.id ? 'selected' : ''}>
                {contact.name} - {contact.description}
              </button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={() => setContactPage(contactPage - 1)} disabled={contactPage === 1}>Anterior</button>
          <button onClick={() => setContactPage(contactPage + 1)} disabled={contactPage * itemsPerPage >= totalContacts}>Próximo</button>
        </div>
      </div>

      <div className="bot-column">
        <h3>Bots</h3>
        <input
          type="text"
          placeholder="Buscar bots por nome ou descrição"
          value={botSearchTerm}
          onChange={(e) => setBotSearchTerm(e.target.value)}
        />
        <ul>
          {bots.map(bot => (
            <li key={bot.id}>
              {bot.alias} - {bot.name}
              <button onClick={() => handleAssociateBot(bot.id!)}>Associar ao Contato</button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={() => setBotPage(botPage - 1)} disabled={botPage === 1}>Anterior</button>
          <button onClick={() => setBotPage(botPage + 1)} disabled={botPage * itemsPerPage >= totalBots}>Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default AssociationTab;
