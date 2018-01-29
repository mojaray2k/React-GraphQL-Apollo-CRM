import React from 'react';

const NoteList = ({ notes }) => {
  return (
    <ul>
      { notes.map( item => 
        (
          <li key={item.id}>> {item.details}</li>
        )
      )}
    </ul>
  );
}

export default NoteList;
