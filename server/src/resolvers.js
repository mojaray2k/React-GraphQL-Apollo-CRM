import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

const contacts = [
  {
    id: '1',
    firstName: 'Amen',
    lastName: 'Ra',
    notes: [
      { 
        id: '1',
        details: 'I think this guy is a great full stack web developer'
      },
      { 
        id: '2',
        details: 'His nickname is Mo'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Barack',
    lastName: 'Obama',
    notes: [
      { 
        id: '1',
        details: 'I think this guy was a great president'
      },
      { 
        id: '2',
        details: 'His nickname is Barry'
      }
    ]
  },
    {
    id: '3',
    firstName: 'K',
    lastName: 'Michelle',
    notes: [
      { 
        id: '1',
        details: 'I think she is a great entertainer'
      },
      { 
        id: '2',
        details: 'Her first name is Kimberly'
      }
    ]
  }
]

export const resolvers = {
  Query: {
    contacts: () => {
      return contacts;
    },
    contact: (root, { id }) => {
      return contacts.find(contact => contact.id === id);
    },
  },
  Mutation: {
    addContact: (root, args) => {
      const newContact = { id: args.id, firstName: args.firstName, lastName: args.lastName, notes: [] };
      contacts.push(newContact);
      return newContact;
    },
    addNote: (root, { note }) => {
      const newId = require('crypto').randomBytes(5).toString('hex');
      const contact = contacts.find(contact => contact.id === note.contactId);
      const newNote = { id: String(newId), details: note.details };
      contact.notes.push(newNote);
      pubsub.publish('noteAdded', { noteAdded: newNote, contactId: note.contactId });
      return newNote;
    }
  },
  Subscription: {
    noteAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('noteAdded'), (payload, variables) => {
        return payload.contactId === variables.contactId;
      }),
    }
  },
};
