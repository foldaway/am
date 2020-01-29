import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8vw;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  background-color: #fff;
  border-radius: 5px;
  min-height: 300px;
  margin: 0 auto;
  padding: 30px;
  background-color: ${(props) => props.theme.background.primary};
`;

const Footer = styled.div`
  margin-top: 8px;
`;

const Modal = ({ children, show, onClose }) => {
  if (!show) return null;
  return (
    <Wrapper>
      <Content>
        {children}

        <Footer>
          <button onClick={onClose} type="button">
            Close
          </button>
        </Footer>
      </Content>
    </Wrapper>
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
