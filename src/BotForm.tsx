import React, { useState, useEffect } from 'react';

interface Bot {
  id?: number;
  alias: string;
  name: string;
  contact_id: number;
}

interface BotFormProps {
  botToEdit?: Bot;
  onSubmit: (bot: Bot) => void;
}

const BotForm: React.FC<BotFormProps> = ({ botToEdit, onSubmit }) => {
  const [bot, setBot] = useState<Bot>({
    alias: '',
    name: '',
    contact_id: 0,
  });

  useEffect(() => {
    if (botToEdit) {
      setBot(botToEdit);
    }
  }, [botToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBot({ ...bot, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bot);
    setBot({ alias: '', name: '', contact_id: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="alias"
        value={bot.alias}
        onChange={handleInputChange}
        placeholder="Alias"
        required
      />
      <input
        name="name"
        value={bot.name}
        onChange={handleInputChange}
        placeholder="Nome"
      />
      <input
        name="contact_id"
        type="number"
        value={bot.contact_id}
        onChange={handleInputChange}
        placeholder="ID do Contato"
        required
      />
      <button type="submit">{botToEdit ? 'Atualizar Bot' : 'Adicionar Bot'}</button>
    </form>
  );
};

export default BotForm;
