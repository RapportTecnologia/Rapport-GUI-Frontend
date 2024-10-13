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
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const BotsList: React.FC<BotsListProps> = ({ bots, onEdit, onDelete, currentPage, totalPages, onNextPage, onPrevPage }) => {
  if (!bots || bots.length === 0) {
    return <p>Nenhum bot encontrado.</p>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div>Alias</div>
        <div>Nome</div>
        <div>Ações</div>
      </div>
      {bots.map(bot => (
        <div className="table-row" key={bot.id}>
          <div>{bot.alias}</div>
          <div>{bot.name}</div>
          <div className="actions">
            <button onClick={() => onEdit(bot)} className="edit-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDelete(bot.id!)} className="delete-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}

      {/* Botões de paginação */}
      <div className="pagination">
        <button onClick={onPrevPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={onNextPage} disabled={currentPage === totalPages}>Próximo</button>
      </div>
    </div>
  );
};

export default BotsList;
