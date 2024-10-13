import React, { useState, useEffect } from 'react';

interface Contact {
  id?: number;
  name: string;
  description: string;
  type: string;
  origin: string;
  contact: string;
}

interface ContactFormProps {
  contactToEdit?: Contact;
  onSubmit: (contact: Contact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contactToEdit, onSubmit }) => {
  // Lista de tipos válidos para o campo "tipo"
  const contactTypes = ["whatsapp_user", "whatsapp_group", "telegram_user", "telegram_group"];

  const [contact, setContact] = useState<Contact>({
    name: '',
    description: '',
    type: contactTypes[0], // Inicializar com o primeiro tipo válido
    origin: '',
    contact: '',
  });

  // Atualizar o formulário ao editar um contato existente
  useEffect(() => {
    if (contactToEdit) {
      setContact(contactToEdit);
    }
  }, [contactToEdit]);

  // Função para gerenciar o submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contact);
    setContact({ name: '', description: '', type: contactTypes[0], origin: '', contact: '' }); // Resetar o formulário após submissão
  };

  // Função para definir o placeholder e o label do campo "Contato" com base no tipo selecionado
  const getContactPlaceholder = () => {
    switch (contact.type) {
      case "whatsapp_user":
        return "Digite o número de telefone (WhatsApp)";
      case "whatsapp_group":
        return "Digite o código do grupo (WhatsApp)";
      case "telegram_user":
        return "Digite o ID do usuário (Telegram)";
      case "telegram_group":
        return "Digite o ID do grupo (Telegram)";
      default:
        return "Digite o contato";
    }
  };

  const getContactLabel = () => {
    switch (contact.type) {
      case "whatsapp_user":
      case "whatsapp_group":
        return "Contato (WhatsApp)";
      case "telegram_user":
      case "telegram_group":
        return "Contato (Telegram)";
      default:
        return "Contato";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={contact.name}
        onChange={(e) => setContact({ ...contact, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Descrição"
        value={contact.description}
        onChange={(e) => setContact({ ...contact, description: e.target.value })}
        required
      />

      {/* Campo "Tipo" como combobox */}
      <label>Tipo</label>
      <select
        value={contact.type}
        onChange={(e) => setContact({ ...contact, type: e.target.value })}
        required
      >
        {contactTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Origem"
        value={contact.origin}
        onChange={(e) => setContact({ ...contact, origin: e.target.value })}
        required
      />

      {/* Campo de contato dinâmico */}
      <label>{getContactLabel()}</label>
      <input
        type="text"
        placeholder={getContactPlaceholder()}
        value={contact.contact}
        onChange={(e) => setContact({ ...contact, contact: e.target.value })}
        required
      />

      <button type="submit">{contactToEdit ? 'Editar Contato' : 'Adicionar Contato'}</button>
    </form>
  );
};

export default ContactForm;
