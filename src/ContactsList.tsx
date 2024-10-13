import React from 'react';

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
          <button onClick={() => onEdit(contact)}>Editar</button>
          <button onClick={() => onDelete(contact.id!)}>Apagar</button>
        </li>
      ))}
    </ul>
  );
};

export default ContactsList;
