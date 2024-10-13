export interface Contact {
    id?: number;
    name: string;
    description: string;
    type: string;
    origin: string;
    contact: string;
  }
  
  export interface Bot {
    id?: number;
    alias: string;
    name: string;
    contactId?: number;
  }
  