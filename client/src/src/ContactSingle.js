import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import Notelist from './NoteList';
import ContactHeader from './ContactHeader';
import AddNote from './AddNote';

class ContactSingle extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: notesSubscription,
      variables: {
        contactId: this.props.match.params.contactId,
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newNote = subscriptionData.data.noteAdded;

        if (!prev.contact.notes.find((item) => item.id === newNote.id)) {
          return Object.assign({}, prev, {
            contact: Object.assign({}, prev.contact, {
              notes: [...prev.contact.notes, newNote]
            })
          });
        } else {
          return prev;
        }
      }
    })
  }

  render() {
    const { data: {loading, error, contact }, match } = this.props;
    if (loading) {
      return <ContactHeader contactId={match.params.contactId}/>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    if (contact.notes === null) {
      return (
        <div className="container">
          <h2>{contact.firstName} {contact.lastName}</h2>
          <AddNote />
        </div>
      );
    }
    
    return (
      <div className="container">
        <div className="row"><h2>{contact.firstName} {contact.lastName}</h2></div>
        <Notelist notes={contact.notes} />
        <AddNote />
      </div>
    );
  }
}

export const contactSingleQuery = gql`
  query ContactSingleQuery($contactId: ID!) {
    contact(id: $contactId) {
      id
      firstName
      lastName
      notes {
        id
        details
      }
    }
  }
`;

const notesSubscription = gql`
  subscription noteAdded($contactId: ID!) {
    noteAdded(contactId: $contactId) {
      id
      details
    }
  }
`;

export default (graphql(contactSingleQuery, {
  options: (props) => ({
    variables: { contactId: props.match.params.contactId },
  }),
})(ContactSingle));