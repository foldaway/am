import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const backdropStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: '8vw',
};

// The modal "window"
const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  minHeight: 300,
  margin: '0 auto',
  padding: 30,
};

const Modal = ({ children, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        {children}

        <div className="modal__footer">
          <button className="modal__footer__close" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool,
  children: PropTypes.node,
};

Modal.defaultProps = {
  onClose: () => {},
  show: true,
  children: null,
};

export default Modal;
