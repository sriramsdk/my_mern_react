// require('dotenv').config();
import React, { useState, useEffect } from 'react';
import DataList from './Components/DataList';
import Register from './Components/Register';
import Login from './Components/Login';
import UserNotes from './Components/UserNotes';
// import swal from 'sweetalert';
// import AddNewUser from './Components/AddNewUser';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInRole, setLoggedInRole] = useState(null);
    const [isLogin, setIsLogin] = useState(true);

    // On mount, check localStorage for token, user, and role to persist login state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('token');
        
        // If all required data is in localStorage, restore login state
        if (storedUser && storedRole && storedToken) {
            setLoggedInUser(storedUser);
            setLoggedInRole(storedRole);
        }
    }, []);

    // const handleLogout = () => {
    //     swal({
    //         title: "Are you sure?",
    //         text: "You will be logged out!",
    //         icon: "warning",
    //         buttons: true,
    //         dangerMode: true,
    //     }).then((willLogout) => {
    //         if (willLogout) {
    //             localStorage.removeItem('token'); // Remove token from localStorage
    //             localStorage.removeItem('user');  // Remove user from localStorage
    //             localStorage.removeItem('role');  // Remove role from localStorage
    //             setLoggedInUser(null); // Reset state
    //             setLoggedInRole(null); // Reset state
    //             swal("Logged out successfully!", { icon: "success" });
    //         }
    //     });
    // };

    const toggleAuth = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="App" style={{width: "150%",margin: "-3px 0px 0px -58px"}}>
            {/* Navbar should be rendered outside of the App's main content */}
            {/* <Navbar loggedInUser={loggedInUser} handleLogout={handleLogout} /> */}
            {loggedInUser ? (
                <>  
                    {loggedInRole === 'Admin' ? (
                        <>
                            <DataList />
                            {/* <AddNewUser /> */}
                        </>
                    ) : (
                        <>
                            <UserNotes />
                        </>
                        // <div className='row main'>
                        //     <p>Hai <b>{loggedInUser}</b></p>
                        //     <div className='col-2'>
                        //         <p>Welcome to SDK edits</p>
                        //     </div>
                        //     {/* <button style={style.buttonLogout} className='btn-primary' onClick={handleLogout}>Logout</button> */}
                        // </div>
                    )}
                </>
            ) : (
                <div>
                    {isLogin ? (
                        <Login setLoggedInUser={setLoggedInUser} setLoggedInRole={setLoggedInRole} />
                    ) : (
                        <Register />
                    )}
                    <button style={style.button} className='btn-primary' onClick={toggleAuth}>
                        {isLogin ? 'Go to Register' : 'Go to Login'}
                    </button>
                </div>
            )}
        </div>
    );
};

const style = {
    button: {
        width: '350px',
        padding: '10px',
        backgroundColor: '#008000',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    buttonLogout: {
        width: '50%',
        padding: '10px',
        backgroundColor: '#ff0000',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    navbar: {
        width: '900px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '10px',
        color: '#fff',
    },
    navbarLeft: {
        flex: 1,
    },
    navbarRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
};

export default App;
