import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import Head from 'next/head';
import { useAuth } from '../../utils/context/authContext';
import createSnippet, { updateSnippet } from '../../api/snippetData';
import { storage } from '../../utils/client';

// these have to match the name "" in the form input
const initialState = {
  firebaseKey: '',
  title: '',
  description: '',
  keyOf: '',
  isPublic: false,
  favorite: false,

};

function SnippetForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const didMount = React.useRef(false);
  const [snippetBpm, setSnippetBpm] = useState(40);

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);
  useEffect(() => {
    if (didMount.current) {
      const uploadTask = () => { storage.ref(`audio/${audio?.name}`).put(audio); };
      uploadTask();
      const delayFunction = async () => {
        await delay(9000);
        storage.ref('audio').child(audio.name).getDownloadURL().then((url) => {
          setAudioUrl(url);
        });
      };
      delayFunction();
    } else { didMount.current = true; }
  }, [audio]);

  const handleUpload = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeBPM = (e) => {
    setSnippetBpm(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateSnippet(formInput)
        .then(() => router.push(`/snippet/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid, audio_url: `${audioUrl}` };
      createSnippet(payload).then(({ name }) => {
        const patchPayloadFBK = { firebaseKey: name };
        updateSnippet(patchPayloadFBK).then(() => {
          setFormInput(initialState);
          router.push('/');
        });
      });
    }
  };

  return (
    <>
      <Head><title>{obj.firebaseKey ? `Update ${obj.title} Snippet` : 'Create Snippet'}</title></Head>

      <Form onSubmit={handleSubmit} className="text-color-drkblu">
        <h2 className="mt-5 text-center">{obj.firebaseKey ? 'Update' : 'Create'} Snippet</h2>
        <div className="mt-5" />

        <div className="">Snippet</div>
        {obj.firebaseKey ? '' : (
          <FloatingLabel controlId="floatingInput0" label="Snippet URL" className="mb-3">
            <Form.Control
              type="file"
              onInput={handleUpload}
              required
            />
          </FloatingLabel>
        )}

        {/* title */}
        <div className="">Title</div>
        <FloatingLabel controlId="floatingInput1" label="Snippet Title" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter a title..."
            name="title"
            value={formInput.title}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* DESCRIPTION TEXTAREA  */}
        <div className="">Description</div>
        <FloatingLabel controlId="floatingTextarea" label="Snippet Description" className="mb-3">
          <Form.Control
            as="textarea"
            placeholder="Description"
            style={{ height: '100px' }}
            name="description"
            value={formInput.description}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* bpm range */}
        <div className="">{snippetBpm} BPM</div>
        <FloatingLabel className="custom-slider m-4 mb-6" label="BPM">
          <input
            type="range"
            min={40}
            max={220}
            step={1}
            onChange={changeBPM}
            value={snippetBpm}
          />
          <output htmlFor="fader" />
        </FloatingLabel>

        {/* isPublic: TOGGLES/RADIOS */}
        <Form.Check
          className="mb-3"
          type="switch"
          id="isPublic"
          name="isPublic"
          label="Public?"
          checked={formInput.isPublic}
          onChange={(e) => {
            setFormInput((prevState) => ({
              ...prevState,
              isPublic: e.target.checked,
            }));
          }}
        />

        {/* SUBMIT BUTTON  */}
        <Button variant="outline-dark" className="m-2 text-color-drkblu" type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Snippet</Button>
      </Form>
    </>
  );
}

SnippetForm.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }),
};

SnippetForm.defaultProps = {
  obj: initialState,
};

export default SnippetForm;
