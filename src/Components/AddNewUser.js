import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUserModal = ({ fetchData }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [message, setMessage] = useState('');

  const { username, email, role } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3500/users', formData);
      if (response.status === 200) {
        setMessage('User added successfully!');
        fetchData();  // Refresh the data list after adding a user
      } else {
        setMessage('Something went wrong!');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Failed to add user.');
    }
  };

  return (
    <div>

      {/* Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={role}
                    onChange={onChange}
                    required
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success">Add User</button>
              </form>
              {message && <p className="mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
