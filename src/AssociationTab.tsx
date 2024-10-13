import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons'; // Ícone de link para associação
import { Contact, Bot} from './types'

interface AssociationTabProps {
  fetchContacts: (page: number, searchTerm: string) => Promise<{ contacts: Contact[]; total: number }>;
  fetchBots: (page: number, searchTerm: string) => Promise<{ bots: Bot[]; total: number }>;
  associateBotToContact: (contactId: number, botId: number) => Promise<void>;
}

const AssociationTab: React.FC<AssociationTabProps> = ({ fetchContacts, fetchBots, associateBotToContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);

  const [contactPage, setContactPage] = useState(1);
  const [botPage, setBotPage] = useState(1);

  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [botSearchTerm, setBotSearchTerm] = useState('');

  const [totalContacts, setTotalContacts] = useState(0);
  const [totalBots, setTotalBots] = useState(0);

  const itemsPerPage = 10;

  // Função para carregar contatos paginados
  const loadContacts = async (page: number, searchTerm: string) => {
    const { contacts, total } = await fetchContacts(page, searchTerm);
    setContacts(contacts);
    setTotalContacts(total);
  };

  // Função para carregar bots paginados
  const loadBots = async (page: number, searchTerm: string) => {
    const { bots, total } = await fetchBots(page, searchTerm);
    setBots(bots);
    setTotalBots(total);
  };

  // Carregar contatos e bots ao montar o componente ou quando página/searchTerm mudar
  useEffect(() => {
    loadContacts(contactPage, contactSearchTerm);
  }, [contactPage, contactSearchTerm]);

  useEffect(() => {
    loadBots(botPage, botSearchTerm);
  }, [botPage, botSearchTerm]);

  const handleAssociateBot = async (botId: number) => {
    if (selectedContactId) {
      await associateBotToContact(selectedContactId, botId);
      alert(`Bot ${botId} associado com sucesso ao contato ${selectedContactId}`);
    } else {
      alert('Selecione um contato antes de associar.');
    }
  };

  // Função de push-pull para selecionar/deselecionar contato
  const toggleContactSelection = (contactId: number) => {
    if (selectedContactId === contactId) {
      setSelectedContactId(null); // Deselecionar
    } else {
      setSelectedContactId(contactId); // Selecionar
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
              <button
                onClick={() => toggleContactSelection(contact.id as number)}
                className={`small-btn ${selectedContactId === contact.id ? 'selected' : ''}`}
              >
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
              <button onClick={() => handleAssociateBot(bot.id as number)} className="link-btn">
                <FontAwesomeIcon icon={faLink} /> {/* Ícone de associação */}
              </button>
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
