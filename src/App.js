import React, { useState} from 'react';
// import DataList from './Components/DataList';
import Register from './Components/Register';
import Login from './Components/Login';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isLogin,setIsLogin] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setLoggedInUser(null); // Set logged-in user to null
    };

    const toggleAuth = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className="App">
            
            {loggedInUser ? (
                <div className='row'>
                    <p>Hai <b>{loggedInUser}</b></p>
                    <div className='col-2'>
                        <p>Welcome to SDK edits</p>
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    {/* <Register /> */}
                    {isLogin ? (
                        <Login setLoggedInUser={setLoggedInUser} />
                    ):(
                        <Register />
                    )}
                    <button style={style.button} className='btn-primary' onClick={toggleAuth}>
                        {isLogin?'Go to Register':'Go to Login'}
                    </button>
                </div>
            )}
        </div>
    );
};

const style = {
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#008000',  // Corrected to camelCase
        color: '#fff',
        border: 'none',             // 'border' should be a string
        borderRadius: '3px',        // Corrected to camelCase
        cursor: 'pointer',
    },
};

export default App;
