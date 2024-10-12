import React, { useState, useEffect } from 'react';

interface Contact {
  id?: number;
  contact: string | null; // Pode ser string ou null
  name: string | null; // Pode ser string ou null
  description: string | null; // Pode ser string ou null
}

interface Bot {
  id?: number;
  alias: string;
  name: string;
}

interface AssociationTabProps {
  contacts: Contact[];
  bots: Bot[];
}

const AssociationTab: React.FC<AssociationTabProps> = ({ contacts, bots }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [availableBots, setAvailableBots] = useState<Bot[]>([]);
  const [associatedBots, setAssociatedBots] = useState<Bot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filtrar contatos por nome ou descrição
  const filteredContacts = contacts.filter(contact =>
    (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.description && contact.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Função para buscar bots associados ao contato selecionado
  useEffect(() => {
    if (selectedContact) {
      fetch(`http://localhost:3001/contact_from_bot/${selectedContact.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Erro ao carregar bots associados');
          }
          return res.json();
        })
        .then(data => {
          const associatedIds = data.map((bot: Bot) => bot.id);
          setAssociatedBots(data); // Definir bots associados
          setAvailableBots(bots.filter(bot => !associatedIds.includes(bot.id))); // Definir bots disponíveis
        })
        .catch(error => {
          console.error('Erro ao carregar bots associados:', error);
          setError('Erro ao carregar bots associados');
        });
    }
  }, [selectedContact, bots]);

  const handleAssociateBot = (bot: Bot) => {
    if (!selectedContact) return;
    fetch(`http://localhost:3001/associate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: selectedContact.id, bot_id: bot.id }),
    })
      .then(() => {
        setAssociatedBots([...associatedBots, bot]);
        setAvailableBots(availableBots.filter(b => b.id !== bot.id));
      })
      .catch(err => {
        console.error('Erro ao associar bot:', err);
        setError('Erro ao associar bot');
      });
  };

  const handleRemoveBot = (bot: Bot) => {
    if (!selectedContact) return;
    fetch(`http://localhost:3001/disassociate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: selectedContact.id, bot_id: bot.id }),
    })
      .then(() => {
        setAvailableBots([...availableBots, bot]);
        setAssociatedBots(associatedBots.filter(b => b.id !== bot.id));
      })
      .catch(err => {
        console.error('Erro ao remover bot:', err);
        setError('Erro ao remover bot');
      });
  };

  return (
    <div>
      <h3>Selecione um Contato</h3>
      <input
        type="text"
        placeholder="Pesquisar por nome ou descrição"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibir erros de carregamento */}
      <ul>
        {filteredContacts.map(contact => (
          <li
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            style={{ cursor: 'pointer', color: selectedContact?.id === contact.id ? 'blue' : 'black' }}
          >
            {contact.name || 'Sem nome'} - {contact.description || 'Sem descrição'}
          </li>
        ))}
      </ul>

      {selectedContact && (
        <div>
          <h3>Associar Bots ao Contato: {selectedContact.name || 'Sem nome'}</h3>

          <div className="bot-lists">
            <div>
              <h4>Bots Disponíveis</h4>
              <ul>
                {availableBots.map(bot => (
                  <li key={bot.id}>
                    {bot.alias} - {bot.name}
                    <button onClick={() => handleAssociateBot(bot)}>Associar</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Bots Associados</h4>
              <ul>
                {associatedBots.map(bot => (
                  <li key={bot.id}>
                    {bot.alias} - {bot.name}
                    <button onClick={() => handleRemoveBot(bot)}>Remover</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationTab;
