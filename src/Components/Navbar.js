// import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import React, { useEffect, useState } from 'react';
import swal from 'sweetalert'; 

const Navbar = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInRole, setLoggedInRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (user) {
      setLoggedInUser(user); // Example: Extract actual user info
      setLoggedInRole(role); // Example: Extract actual user info
    }
  }, []);
  const handleLogout = () => {
    swal({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willLogout) => {
        if (willLogout) {
            localStorage.removeItem('token'); // Remove token from localStorage
            localStorage.removeItem('user');  // Remove user from localStorage
            localStorage.removeItem('role');  // Remove role from localStorage
            setLoggedInUser(null); // Reset state
            setLoggedInRole(null); // Reset state
            swal("Logged out successfully!", { icon: "success" }).then((logout) => { if(logout){window.location.reload()} });
            // window.location.reload()
        }else{
          swal("Logged out cancelled!", { icon: "info" });
        }
    });
};
  return (
    loggedInUser && (
      <nav className="navbar bg-primary">
        <div className="navbar-left">
          <p><b>{loggedInUser}</b></p>
        </div>
        <div className="navbar-right">
          <button style={style.buttonLogout} onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>
    )
  );
};

const style = {
  buttonLogout: {
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  navbar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '10px',
    color: '#fff',
  },
  navbarLeft: {
    flex: 1,
    width: '50px',
  },
  navbarRight: {
    flex: 1,
    width: '100px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '10px'
  },
};

export default Navbar;
