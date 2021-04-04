import React from 'react';
import {seo} from '../../helpers';
import './NotFound.scss';

const NotFound = () => {
  seo({title: 'This page does not exist', metaDescription: '404 page'});

  return (
    <section className='not-found'>
      <h1>Requested page found on the server</h1>
      <p>Here are the most common reasons why you are reading this message:</p>
      <ul className='not-found__list'>
        <li>This page was removed and doesn't exist anymore</li>
        <li>This page was accessed from old bookmark or link and could be moved, please double check in top navigation
          if there is a link to the content you are looking for
        </li>
        <li>Something went really wrong on our server, blame a developer</li>
        <li>Something went really wrong on our frontend, blame a developer</li>
      </ul>
    </section>
  );
};

export default NotFound;
