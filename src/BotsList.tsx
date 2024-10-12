import React from 'react';

interface Bot {
  id?: number;
  alias: string;
  name: string;
  contact_id: number;
}

interface BotsListProps {
  bots: Bot[];
  onEdit: (bot: Bot) => void;
  onDelete: (id: number) => void;
}

const BotsList: React.FC<BotsListProps> = ({ bots, onEdit, onDelete }) => {
  if (bots.length === 0) {
    return <p>Nenhum bot encontrado.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Alias</th>
          <th>Nome</th>
          <th>Contato ID</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {bots.map((bot) => (
          <tr key={bot.id}>
            <td>{bot.id}</td>
            <td>{bot.alias}</td>
            <td>{bot.name}</td>
            <td>{bot.contact_id}</td>
            <td>
              <button onClick={() => onEdit(bot)}>Editar</button>
              <button onClick={() => onDelete(bot.id!)}>Deletar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BotsList;
