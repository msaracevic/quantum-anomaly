import React from "react";

const Inputs = props => (
  <React.Fragment>
    <h1>Styleguide Inputs</h1>
    <p className='styleguide__block'>All inputs should always be wrapped with label tag</p>
    <section className='styleguide__section styleguide__section--small'>
      <p>
        <label>
          Label
          <input type='text' placeholder='Input'/>
        </label>
        <label>
          Label two
          <input type='text' placeholder='Input'/>
        </label>
      </p>
      <p>
        <input type='text' placeholder='Exception, no label'/>
      </p>
    </section>
    <section className='styleguide__section styleguide__section--small'>
      <p>Normal radio buttons</p>
      <p>
        <label>
          <input type='radio' name='normal' value='value1' checked/>
          Radio button
        </label>
        <label>
          <input type='radio' name='normal' value='value2'/>
          Radio button
        </label>
      </p>
      <p>Label with <code>className='label--row'</code></p>
      <p>
        <label className='label--row'>
          <input type='radio' name='vertical' value='value1' checked/>
          Radio button
        </label>
        <label className='label--row'>
          <input type='radio' name='vertical' value='value2'/>
          Radio button
        </label>
      </p>
    </section>
    <section className='styleguide__section styleguide__section--small'>
      <p>Normal checkbox</p>
      <p>
        <label>
          <input type='checkbox' defaultChecked/> Checkbox
        </label>
        <label>
          <input type='checkbox'/> Checkbox
        </label>
      </p>
      <p>Label with <code>className='label--row'</code></p>
      <p>
        <label className='label--row'>
          <input type='checkbox' defaultChecked/> Checkbox
        </label>
        <label className='label--row'>
          <input type='checkbox'/> Checkbox
        </label>
      </p>
    </section>
  </React.Fragment>
);

export default Inputs;
