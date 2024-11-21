import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AddUserModal from './AddNewUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'; // Import SweetAlert
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { width } from '@fortawesome/free-solid-svg-icons/fa0';

const DataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInRole, setLoggedInRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userroles, setRoles] = useState([]); // Holds roles
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const url = process.env.REACT_APP_API_URL;
  const allRoles = ['Admin', 'User'];

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL;
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

  const [active, setActive] = useState(''); // State to hold active status

  const handleStatusChange = (event) => {
    setActive(event.target.value); // Update state based on selection
  };

  const handleEdit = async (userId) => {
    // Perform edit action for the specific user
    console.log('Edit user with ID:', userId);
    try{
      const response = await axios.post(url+'users/getUser',{id: userId });
      if(response){
        const user = response.data.data;
        setUserData(user); // Set user data to state
        setId(user._id); // Set user data to state
        setRoles(user.roles || []); // Set roles from user data
        setActive(user.active)
        setIsModalOpen(true); // Open modal
      }
    }catch(err){
      swal(err.message, { icon: "warning" });
      console.log(err.message);
    }
    // You can redirect to an edit form or show a modal
  };

  const handleEditRoleChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setRoles((prevRoles) => [...prevRoles, value]); // Add role
    } else {
      setRoles((prevRoles) => prevRoles.filter((role) => role !== value)); // Remove role
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserData(null); // Clear user data when closing
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
      selector: row => row.active === true ? "Active" : "Inactive",
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
  
  const UpdateUser = async e => {
    e.preventDefault();

    // Construct the data object to send in the API request
    const data = {
      id: id,  // Include the user ID
      username: userData.username,
      password: userData.password,
      roles: userData.roles,
      active: userData.active,
    };

    // setLoading(true);
    try {
        const res = await axios.patch(url+'users', data);
        // console.log(res);
        swal(res.data.message, { icon: "success" }).then((iscreated) => { if(iscreated){ window.location.reload() } });
        setMessage(res.data.message); // Set success message
    } catch (err) {
        console.error(err.response.data);
        setMessage(err.response.data.message); // Set error message
    }
  }

  return (
    (loggedInUser || loggedInRole) && (
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

      {/* Edit Modal Component */}
      {isModalOpen && (
      <div
        className="modal fade show"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {userData ? (
                <form>
                  <div className="mb-3">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      type="text"
                      className="form-control"
                      name='password'
                    />
                  </div>
                  <label>Select Roles:</label>
                  <div className="mb-3 mt-3">
                    {allRoles.map((role) => (
                      <label key={role} className="w-25">
                        <input
                          type="checkbox"
                          value={role}
                          checked={userroles.includes(role)} // Pre-check based on roles state
                          onChange={handleEditRoleChange}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                  <div className='mb-3 mt-3'>
                    <label>Status</label>
                    <select className='status form-control' name='active' value={active} onChange={handleStatusChange}>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                  <button type="submit" onClick={UpdateUser} className="btn btn-success">
                    Update
                  </button>
                </form>

                
              ) : (
                <p>Loading...</p>
              )}
              {message && <p className="mt-3">{message}</p>},
            </div>
          </div>
        </div>
      </div>
    )}


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
          customStyles={{
            header: {
              style: {
                fontSize: '18px',
                fontWeight: 'bold',
              },
            },
            rows: {
              style: {
                minHeight: '45px', // override the row height
              },
            },
            headCells: {
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                paddingLeft: '20px',
                paddingRight: '20px',
              },
            },
            cells: {
              style: {
                paddingLeft: '20px',
                paddingRight: '20px',
              },
            },
          }}
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
    // width: '100%',
    height: '100%',
    marginTop: '50px',
    padding: '20px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    width: '70%',
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #ced4da',
    marginRight: '15px',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    color: '#28a745',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '10px',
  },
  deleteButton: {
    color: '#dc3545',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
  },
  '@media (max-width: 600px)': {
    container: {
      // padding: '10px',
      // width: '50px',
    },
    searchInput: {
      width: '100%',
      marginBottom: '15px',
    },
    actionButtons: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
};


export default DataList;
