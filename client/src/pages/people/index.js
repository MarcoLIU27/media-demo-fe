import React, { useState, useEffect } from 'react';

function People() {
  const [parentNamePresentPairs, setParentNamePresentPairs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/people')
      .then((res) => res.json())
      .then((data) => setParentNamePresentPairs(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>People Page</h1>
      <p>Here is a list of people:</p>
      <ul>
        {parentNamePresentPairs.map(({ parentName, encodedParentName, parentPresent, shortBio }) => (
          <li key={parentName} style={{lineHeight: '2'}}>
            <a href={`/people/${encodedParentName}`}>{parentPresent}</a>: {shortBio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default People;
