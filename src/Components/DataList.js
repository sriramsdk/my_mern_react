import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AddUserModal from './AddNewUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'; // Import SweetAlert
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const DataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInRole, setLoggedInRole] = useState(null);
  const url = 'https://visiting-lura-sdkgroup-184d32b4.koyeb.app/';
  // const url = 'http://localhost:3500/';
  // Fetch data from Node.js API
  useEffect(() => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (user) {
      setLoggedInUser(user); // Example: Extract actual user info
      setLoggedInRole(role); // Example: Extract actual user info
    }
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://visiting-lura-sdkgroup-184d32b4.koyeb.app/notes');
        const response = await axios.get(url+'users');
        setData(response.data); // Assuming API returns an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (userId) => {
    // Perform edit action for the specific user
    console.log('Edit user with ID:', userId);
    // You can redirect to an edit form or show a modal
  };

  // Handle delete action
  const handleDelete = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      dangerModeText: 'Yes',
    }).then(async (confirmDelete) => {
      if (confirmDelete) {
          try {
            const response = await axios.delete(url+'users',{ data: {id:userId} }); // Assuming API has a delete endpoint
            if(response){
              swal(response.data.message, { icon: "success" });
            }
            setData(data.filter(user => user._id !== userId)); // Filter out deleted user from state
          } catch (error) {
            swal(error, { icon: "warning" });
          }
        
      }
    });
  };

  // Filter data based on search input
  const filteredData = data.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns configuration for DataTable
  const columns = [
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.roles.join(),
      sortable: false,
    },
    {
      name: 'Status',
      selector: row => row.active == true ? "Active" : "Inactive",
      sortable:true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={styles.actionButtons}>
          <button onClick={() => handleEdit(row._id)} style={styles.editButton}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={() => handleDelete(row._id)} style={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roles:[],// 2 means its not from the postman or internal web
  });
  const [message, setMessage] = useState('');
  // const [loading, setLoading] = useState(false); // Add loading state

  const { username, password, roles } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle role selection (checkbox)
  const handleRoleChange = (e) => {
    const role = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevState) => {
        // Add role to the array if checked, otherwise remove it
        if (isChecked) {
            return { ...prevState, roles: [...prevState.roles, role] };
        } else {
            return {
                ...prevState,
                roles: prevState.roles.filter((r) => r !== role)
            };
        }
    });
  };

  const saveNewUser = async e => {
    e.preventDefault();
    // setLoading(true);
    try {
        const res = await axios.post(url+'users', {
            username,
            password,
            roles
        });
        // console.log(res);
        swal(res.data.message, { icon: "success" }).then((iscreated) => { if(iscreated){ window.location.reload() } });
        setMessage(res.data.message); // Set success message
    } catch (err) {
        console.error(err.response.data);
        setMessage(err.response.data.message); // Set error message
    } finally {
        // setLoading(false);  // Stop loading after the request completes
    }
};

  return (
    loggedInUser && (
    <div style={styles.container}>
      {/* <h1>Data List</h1> */}
      
      <input
        type="text"
        placeholder="Search by name..."
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />
      <button type='button' className='btn btn-primary ml-2' data-bs-toggle="modal" data-bs-target="#addUserModal" >Add User</button>
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
              <form>
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
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <label>Select Roles:</label>
                <div className="mb-3 mt-3">
                    <label className='w-10'>
                        <input
                            type="checkbox"
                            value="Admin"
                            onChange={handleRoleChange}
                        />
                        Admin
                    </label>
                    <label className='w-25'>
                        <input
                            type="checkbox"
                            value="User"
                            onChange={handleRoleChange}
                        />
                        User
                    </label>
                </div>
                <button type="button" onClick={saveNewUser} className="btn btn-success">Add User</button>
              </form>
              {message && <p className="mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>

      {loading ? (
        <p>Loading.....</p>
      ) : (
        <>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          bordered
          responsive
        />
        <AddUserModal />
        </>
      )}
    </div>
    )
  );
};

// Simple styling for the component
const styles = {
  container: {
    width: '100%',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '5px',
    width: '50%',
    marginTop: '0',
    marginBottom: '10px',
    marginRight: '20px',
    fontSize: '16px',
  },
};

export default DataList;
