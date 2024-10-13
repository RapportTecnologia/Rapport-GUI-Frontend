import React, { useState, useEffect } from 'react';

interface Contact {
  id?: number;
  name: string;
  description: string;
}

interface Bot {
  id?: number;
  alias: string;
  name: string;
  contactId?: number;
}

interface BotFormProps {
  botToEdit?: Bot;
  onSubmit: (bot: Bot) => void;
}

const BotForm: React.FC<BotFormProps> = ({ botToEdit, onSubmit }) => {
  const [bot, setBot] = useState<Bot>({
    alias: '',
    name: '',
    contactId: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (botToEdit) {
      setBot(botToEdit);
    }
  }, [botToEdit]);

  // Função para buscar contatos da API com filtro
  const fetchContacts = async (search: string) => {
    const res = await fetch(`http://localhost:3001/contacts?search=${search}`);
    const data = await res.json();
    setContacts(data.contacts);
  };

  useEffect(() => {
    fetchContacts(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bot);
    setBot({ alias: '', name: '', contactId: undefined });
  };

  const handleSelectContact = (contactId: number) => {
    setBot({ ...bot, contactId });
    setIsModalOpen(false); // Fechar o modal após selecionar o contato
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Alias"
          value={bot.alias}
          onChange={(e) => setBot({ ...bot, alias: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={bot.name}
          onChange={(e) => setBot({ ...bot, name: e.target.value })}
          required
        />
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Selecionar Contato
        </button>
        {bot.contactId && <p>Contato Selecionado: {bot.contactId}</p>}
        <button type="submit">{botToEdit ? 'Editar Bot' : 'Adicionar Bot'}</button>
      </form>

      {/* Modal para seleção de contatos */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Selecione um Contato</h3>
            <input
              type="text"
              placeholder="Buscar contato"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {contacts.map(contact => (
                <li key={contact.id}>
                  {contact.name} - {contact.description}
                  <button onClick={() => handleSelectContact(contact.id!)}>Selecionar</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotForm;
