/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSingleSnippet } from '../../api/snippetData';

export default function ViewSnippet() {
  const [snippetDetails, setSnippetDetails] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getSingleSnippet(firebaseKey).then(setSnippetDetails);
  }, [firebaseKey]);

  return (
    <>
      <Head>
        <title> View {snippetDetails.title} </title>
      </Head>
      <div className="PD-container">
        <div className="PD-detail-container">
          <h5 className="PD-pin-name">
            {snippetDetails.title}
          </h5>
          <hr />
          <p className="PD-desc">{snippetDetails.description || ''}
          </p>
          <hr />
          <p className="PD-lock">
            {snippetDetails.isPublic ? 'public 👥' : 'private 🔒'}
          </p>
        </div>
      </div>
    </>

  );
}
