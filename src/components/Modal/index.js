import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Modal = ({ children, show, onClose }) => {
  if (!show) return null;
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {children}

        <div className={styles.modal__footer}>
          <button className={styles.modal__footer__close} onClick={onClose} type="button">
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
