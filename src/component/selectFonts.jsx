import React from 'react';

function SelectFont({ fonts, onSelect }) {
  return (
    <select onChange={(e) => onSelect(e.target.value)} className='fontSelect'>
      {fonts.map((font, index) => (
        <option key={index} value={font}>
          {font}
        </option>
      ))}
    </select>
  );
}

export default SelectFont;