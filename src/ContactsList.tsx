import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

interface Contact {
  id?: number;
  name: string;
  description: string;
  type: string;
  origin: string;
  contact: string;
}

interface ContactsListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  currentPage: number; // Página atual
  totalPages: number;  // Total de páginas
  onNextPage: () => void; // Função para ir para a próxima página
  onPrevPage: () => void; // Função para ir para a página anterior
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onEdit, onDelete, currentPage, totalPages, onNextPage, onPrevPage }) => {
  if (!contacts || contacts.length === 0) {
    return <p>Nenhum contato encontrado.</p>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div>Nome</div>
        <div>Descrição</div>
        <div>Tipo</div>
        <div>Origem</div>
        <div>Ações</div>
      </div>
      {contacts.map(contact => (
        <div className="table-row" key={contact.id}>
          <div>{contact.name}</div>
          <div>{contact.description}</div>
          <div>{contact.type}</div>
          <div>{contact.origin}</div>
          <div className="actions">
            <button onClick={() => onEdit(contact)} className="edit-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDelete(contact.id!)} className="delete-button">
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

export default ContactsList;
