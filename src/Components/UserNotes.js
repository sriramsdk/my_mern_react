import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
//   const url = process.env.REACT_APP_API_URL;

  // Fetch notes from API
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL;
    const fetchNotes = async () => {
      try {
        const response = await axios.get(url+'notes'); // Replace with your API URL
        console.log(response);
        // if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.data;
        setNotes(data); // Assuming data is an array of notes
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  // Function to add new note
  const addNote = async note => {
    const url = process.env.REACT_APP_API_URL;
    console.log(note);
    try {
      const response = await axios.post(url+'notes', { // Replace with your API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: note }),
      });
      console.log(response);return;
      const newNote = await response.json();
      setNotes([...notes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Function to delete note
  const deleteNote = async (index) => {
    try {
      const noteId = notes[index]._id; // Assuming each note has a unique identifier
      await fetch(`https://api.example.com/notes/${noteId}`, { // Replace with your API URL
        method: 'DELETE',
      });
      setNotes(notes.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Function to update note
  const updateNote = async (index, updatedNote) => {
    console.log(updatedNote);return;
    try {
      const noteId = notes[index]._id; // Assuming each note has a unique identifier
      const response = await fetch(`https://api.example.com/notes/${noteId}`, { // Replace with your API URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: updatedNote }),
      });
      const updatedData = await response.json();
      const updatedNotes = notes.map((note, i) =>
        i === index ? updatedData : note
      );
      setNotes(updatedNotes);
      setCurrentNote('');
      setCurrentIndex(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleSubmit = (e) => {
    // console.log(e);return;
    e.preventDefault();
    // if (currentIndex !== null) {
      // updateNote(currentIndex, currentNote);
    // } else {
      addNote(currentNote);
    // }
    setCurrentNote('');
  };

  return (
    <div className='container mt-5'>
    {/* Modal */}
    <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="addUserModalLabel">Add Request</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <form>
            <textarea className='form-control' rows={5} id='text' name='text'></textarea>
            <button type='button' onClick={addNote} className='btn btn-primary mt-3'>Request</button>
          </form>
        </div>
      </div>
    </div>
    </div>


    <div className="container mt-5" style={{ marginTop : '100px' }}>
      {/* add Request button */}
      <div className="input-group-append justify-center mt-5 mb-3 ml-5">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal" type="submit">
          {currentIndex !== null ? 'Update Note' : 'Add Request'}
        </button>
      </div>
      <ul className="list-group">
        {notes.map((note, index) => (
          <li
            key={note._id} // Assuming each note has a unique identifier
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{note.text}</strong>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => {
                  setCurrentNote(note.text);
                  setCurrentIndex(index);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteNote(index)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default NoteApp;
