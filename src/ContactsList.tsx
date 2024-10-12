import React from 'react';

interface Contact {
  id?: number;
  contact: string;
  name: string;
  type: string;
  origem: string;
  description: string;
}

interface ContactsListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onEdit, onDelete }) => {
  if (contacts.length === 0) {
    return <p>Nenhum contato encontrado.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Contato</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.id}</td>
            <td>{contact.contact}</td>
            <td>{contact.name}</td>
            <td>{contact.type}</td>
            <td>
              <button onClick={() => onEdit(contact)}>Editar</button>
              <button onClick={() => onDelete(contact.id!)}>Deletar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsList;
