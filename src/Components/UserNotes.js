import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: "", text: "" });
  const [currentIndex, setCurrentIndex] = useState(null);
  const [user, setUserId] = useState(null);
  const [responseMessage, setResponseMessage] = useState({ text: "", type: "" });
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch userId from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in local storage");
    }
  }, []);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}notes`,{
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
        });
        // console.log(response.data.data)
        setNotes(response.data.data); // Assuming data is an array of notes
      } catch (error) {
        // console.error("Error fetching notes:", error.response.data);
        const response = error.response.data
        const data = [{ title: "No requests", text: response.message }]
        setNotes(data);
      }
    };
    fetchNotes();
  }, [apiUrl]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}notes`,{
          headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
      });
      setNotes(response.data.data);
    } catch (error) {
      // console.error('Error fetching notes:', error);
      const response = error.response.data
      const data = [{ title: "No requests", text: response.message }]
      setNotes(data);
    }
  };

  
  // Function to add or update a note
  const handleSaveNote = async () => {
    try {
      if (!user) throw new Error("User not logged in");
      
      let response;
      if (currentIndex !== null) {
        const payload = {
          id : notes[currentIndex]._id,
          user,
          title: currentNote.title,
          text: currentNote.text,
          completed: currentNote.completed === "true" ? true : false,
        };
        // console.log(payload);
        // Update note
        // const noteId = notes[currentIndex]._id;
        response = await axios.patch(`${apiUrl}notes`, payload);
        const updatedNotes = notes.map((note, index) =>
          index === currentIndex ? response.data : note
        );
        // console.log(response);
        setNotes(updatedNotes);
        setResponseMessage({ text: "Request updated successfully", type: "success" });
        fetchNotes();
      } else {
        const payload = {
          user,
          title: currentNote.title,
          text: currentNote.text,
          completed: currentIndex !== null ? notes[currentIndex].completed : false,
        };
        // console.log(payload);
        // Create note
        response = await axios.post(`${apiUrl}notes`, payload);
        setNotes([...notes, response.data]);
        setResponseMessage({ text: "Request created successfully", type: "success" });
        fetchNotes();
      }

      setCurrentNote({ title: "", text: "" });
      setCurrentIndex(null);
      document.getElementById("closeModalButton").click();
    } catch (error) {
      setResponseMessage({
        text: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    }
  };

  // Function to delete a note
  const deleteNote = async (index) => {
    try {
      const payload = {
        id : notes[index]._id
      };
      // console.log(payload);
      await axios.delete(`${apiUrl}notes`,{ data : payload});
      setNotes(notes.filter((_, i) => i !== index));
      setResponseMessage({ text: "Request deleted successfully", type: "success" });
    } catch (error) {
      setResponseMessage({
        text: error.response?.data?.message || "Error deleting note",
        type: "danger",
      });
    }
  };

  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Request",
      selector: (row) => row.text,
    },
    {
      name: "Status",
      selector : (row) => row.completed === true || row.completed === "true" ? "Completed" : "Not Completed",
      sortable: true
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div>
          <button
            className="btn btn-warning btn-sm me-2"
            data-bs-toggle="modal"
            data-bs-target="#addNotesModal"
            onClick={() => {
              setCurrentNote({ title: row.title, text: row.text, completed:  row.completed === true || row.completed === "true" ? "true" : "false" });
              setCurrentIndex(index);
            }}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteNote(index)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container" style={{
      width: "100%",
      marginTop: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Response Message */}
      {responseMessage.text && (
        <div className={`alert alert-${responseMessage.type} text-center`} role="alert">
          {responseMessage.text}
        </div>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="addNotesModal"
        tabIndex="-1"
        aria-labelledby="addNotesModalLabel"
        aria-hidden="true"
      >
        
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNotesModalLabel">
                {currentIndex !== null ? "Update Request" : "Add Request"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalButton"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Title"
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
              />
              <textarea
                className="form-control mb-3"
                rows={5}
                placeholder="Text"
                value={currentNote.text}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, text: e.target.value })
                }
              ></textarea>
                {currentIndex === null ? (
                  // Render content for edit mode (if needed)
                  null
                ) : (
                  <>
                    {/* Completed Status Select Dropdown */}
                    <select
                      className="form-control mb-3"
                      value={currentNote.completed || ""}
                      onChange={(e) =>
                        setCurrentNote({ ...currentNote, completed: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="true">Completed</option>
                      <option value="false">Not Completed</option>
                    </select>
                  </>
                )}
              <div className={`alert alert-${responseMessage.type} text-center`} role="alert">
                {responseMessage.text}
              </div>
              <button
                type="button"
                onClick={handleSaveNote}
                className="btn btn-primary mt-3"
              >
                {currentIndex !== null ? "Update Request" : "Add Request"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Button */}
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addNotesModal"
          onClick={() => {
            setCurrentNote({ title: "", text: "" });
            setCurrentIndex(null);
          }}
        >
          Add Request
        </button>
      </div>

      {/* Notes List */}
      <DataTable
        title="Notes List"
        columns={columns}
        data={notes}
        pagination
        highlightOnHover
      />
      {/* <ul className="list-group" style={{width:"100%"}}>
        {notes.map((note, index) => (
          <li
            key={note._id}
            className="list-group-item d-flex justify-content-between align-items-center w-100"
          >
            <div>
              <strong>Username : {note.username}</strong> <br></br>
              <strong>Title: {note.title}</strong>
              <p>Request: {note.text}</p>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                data-bs-toggle="modal"
                data-bs-target="#addNotesModal"
                onClick={() => {
                  setCurrentNote({ title: note.title, text: note.text });
                  setCurrentIndex(index);
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteNote(index)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default NoteApp;
