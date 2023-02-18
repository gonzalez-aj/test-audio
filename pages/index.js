import React, { useEffect, useState } from 'react';
import createSnippet from '../api/snippetData';
import { storage } from '../utils/client';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const didMount = React.useRef(false);

  useEffect(() => {
    if (didMount.current) {
      const uploadTask = () => { storage.ref(`audio/${file.name}`).put(file); };
      uploadTask();
    } else { didMount.current = true; }
  }, [file]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    storage.ref('audio').child(file.name).getDownloadURL().then((url) => {
      createSnippet(url);
    });
  };

  return (
    <>
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >

        <div>
          <input type="file" onChange={handleChange} />
          <button type="button" onClick={handleUpload}>upload audio</button>
        </div>

        <h1>Hello {user.displayName}! </h1>
      </div>

    </>
  );
}

export default Home;
