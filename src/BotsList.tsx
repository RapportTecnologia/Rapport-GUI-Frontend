import React from 'react';

interface Bot {
  id?: number;
  alias: string;
  name: string;
}

interface BotsListProps {
  bots: Bot[];
  onEdit: (bot: Bot) => void;
  onDelete: (id: number) => void;
}

const BotsList: React.FC<BotsListProps> = ({ bots, onEdit, onDelete }) => {
  if (!bots || bots.length === 0) {
    return <p>Nenhum bot encontrado.</p>;  // Mensagem se não houver bots
  }

  return (
    <ul>
      {bots.map(bot => (
        <li key={bot.id}>
          {bot.alias} - {bot.name}
          <button onClick={() => onEdit(bot)}>Editar</button>
          <button onClick={() => onDelete(bot.id!)}>Apagar</button>
        </li>
      ))}
    </ul>
  );
};

export default BotsList;
