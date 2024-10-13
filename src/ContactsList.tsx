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
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onEdit, onDelete }) => {
  if (!contacts || contacts.length === 0) {
    return <p>Nenhum contato encontrado.</p>;
  }

  return (
    <ul>
      {contacts.map(contact => (
        <li key={contact.id}>
          {contact.name} - {contact.description} ({contact.type} - {contact.origin})
          <button onClick={() => onEdit(contact)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={() => onDelete(contact.id!)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ContactsList;
