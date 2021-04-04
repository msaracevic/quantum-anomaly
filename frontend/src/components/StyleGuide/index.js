import React from "react";

import './StyleGuide.scss';
import Typography from "./Typography";
import Inputs from "./Inputs";

const StyleGuide = () => {
  return (
    <div className='styleguide'>
      <Typography/>
      <Inputs/>
    </div>
  )
}

export default StyleGuide;
