import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
    return <p>Nenhum bot encontrado.</p>;
  }

  return (
    <ul>
      {bots.map(bot => (
        <li key={bot.id}>
          {bot.alias} - {bot.name}
          <button onClick={() => onEdit(bot)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={() => onDelete(bot.id!)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BotsList;
