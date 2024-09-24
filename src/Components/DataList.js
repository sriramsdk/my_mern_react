import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from Node.js API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/notes');
        setData(response.data); // Assuming API returns an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on search input
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>Data List</h1>
      <input
        type="text"
        placeholder="Search by name..."
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {loading ? (
        <p>Loading....</p>
      ) : (
        <ul style={styles.list}>
          {filteredData.map(item => (
            <li key={item._id} style={styles.listItem}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Simple styling for the component
const styles = {
  container: {
    width: '80%',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '10px',
    width: '50%',
    marginBottom: '20px',
    fontSize: '16px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    border: '1px solid #ddd',
    marginBottom: '10px',
    borderRadius: '5px',
  },
};

export default DataList;
