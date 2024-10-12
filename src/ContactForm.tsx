import React, { useState, useEffect } from 'react';

interface Contact {
  id?: number;
  contact: string;
  name: string;
  type: string;
  origem: string;
  description: string;
}

interface ContactFormProps {
  contactToEdit?: Contact;
  onSubmit: (contact: Contact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contactToEdit, onSubmit }) => {
  const [contact, setContact] = useState<Contact>({
    contact: '',
    name: '',
    type: 'whatsapp_user',
    origem: '',
    description: '',
  });

  useEffect(() => {
    if (contactToEdit) {
      setContact(contactToEdit);
    }
  }, [contactToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contact);
    setContact({ contact: '', name: '', type: 'whatsapp_user', origem: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="contact"
        value={contact.contact}
        onChange={handleInputChange}
        placeholder="Contato"
        required
      />
      <input
        name="name"
        value={contact.name}
        onChange={handleInputChange}
        placeholder="Nome"
        required
      />
      <select name="type" value={contact.type} onChange={handleInputChange}>
        <option value="whatsapp_user">WhatsApp User</option>
        <option value="whatsapp_group">WhatsApp Group</option>
        <option value="telegram_user">Telegram User</option>
        <option value="telegram_group">Telegram Group</option>
      </select>
      <input
        name="origem"
        value={contact.origem}
        onChange={handleInputChange}
        placeholder="Origem"
      />
      <input
        name="description"
        value={contact.description}
        onChange={handleInputChange}
        placeholder="Descrição"
      />
      <button type="submit">{contactToEdit ? 'Atualizar Contato' : 'Adicionar Contato'}</button>
    </form>
  );
};

export default ContactForm;
