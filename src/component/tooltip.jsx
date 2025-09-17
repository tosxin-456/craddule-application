import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div className="tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {visible && (
        <div className="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
