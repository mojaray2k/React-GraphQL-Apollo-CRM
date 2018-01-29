import React from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

const Contacts = ({ data: { loading, error, contacts }}) => {
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <div className="row">
      <ul className="collection">
        { contacts.map( item => 
        (<li className="collection-item" key={item.id}><Link to={item.id < 0 ? `/` : `contact/${item.id}`}>
          {item.firstName} {item.lastName}
          </Link></li>)
        )}
      </ul>
    </div>
  );
}

export const contactsListQuery = gql`
  query ContactsQuery {
    contacts {
      id
      firstName
      lastName
    }
  }
`;

export default graphql(contactsListQuery)(Contacts);
