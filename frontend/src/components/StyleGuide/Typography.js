import React from "react";

const Typography = () => (
  <React.Fragment>
    <h1>Styleguide Typography</h1>
    <section className='styleguide__section styleguide__section--small'>
      <h1>Styleguide</h1>
      <h2>Styleguide</h2>
      <h3>Styleguide</h3>
      <h4>Styleguide</h4>
      <h5>Styleguide</h5>
      <h6>Styleguide</h6>
      <br/><br/>
      <p><a className='link'>Link</a></p>
      <p><a className='link link--secondary'>Link Secondary</a></p>
      <p>
        <button className='btn btn--cta'>Button CTA</button>
      </p>
      <p>
        <button className='btn btn--secondary'>Button Secondary</button>
      </p>
      <p>
        <button className='link'>Button Link</button>
      </p>
    </section>
    <section className='styleguide__section styleguide__section--large'>
      <h1>Text</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultricies, tortor id aliquam aliquet, urna
        ipsum hendrerit augue, sed facilisis mauris nibh non ligula. Duis arcu velit, malesuada sed odio eu, sodales
        mattis leo. Integer vitae metus sodales, tincidunt justo quis, hendrerit eros. Aenean luctus mi vitae nunc
        cursus feugiat. Praesent vitae erat a mi vestibulum aliquam sed eu ante. Morbi euismod dui rhoncus vestibulum
        tincidunt. Ut ligula diam, commodo quis lacus ut, sollicitudin sagittis sapien.
      </p>
      <p className='long-text'>
        Paragraph <code>className='long-text'</code>. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultricies, tortor id aliquam aliquet, urna
        ipsum hendrerit augue, sed facilisis mauris nibh non ligula. Duis arcu velit, malesuada sed odio eu, sodales
        mattis leo. Integer vitae metus sodales, tincidunt justo quis, hendrerit eros. Aenean luctus mi vitae nunc
        cursus feugiat. Praesent vitae erat a mi vestibulum aliquam sed eu ante. Morbi euismod dui rhoncus vestibulum
      </p>
      <p><span className='bold'>Span <code>className='bold'</code></span></p>
      <p><span className='italic'>Span <code>className='italic'</code></span></p>
      <p><span className='monospace'>Span monospaced <code>className='monospace'</code></span></p>
      <p><span className='capitalize'>span all lowercase <code>className='capitalize'</code></span></p>
      <p><span className='muted'>Span <code>className='muted'</code></span></p>
      <p><span className='disclaimer'>Span <code>className='disclaimer'</code></span></p>
      <div className='styleguide__flex'>
        <section className='styleguide__section--small'>
          <ul>
            <li>List without any classes</li>
            <li>Item</li>
            <li>Item</li>
          </ul>
        </section>
        <section className='styleguide__section--small'>
          <ul className='ul--packed'>
            <li>List <code>className='ul--packed'</code></li>
            <li>Item</li>
            <li>Item</li>
          </ul>
        </section>
        <section className='styleguide__section--small'>
          <ul className='ul--links'>
            <li>List <code>className='ul--links'</code></li>
            <li><a href='#'>Link</a></li>
            <li><a href='#'>Link</a></li>
          </ul>
        </section>
      </div>
    </section>
  </React.Fragment>
);

export default Typography;
