import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  align-items: center;
  color: #fff;
  background: none;
  border: none;
  background-color: ${(props) => props.theme.branding};
  text-decoration: none;
  border-radius: 3px;
  padding: 5px 8px;
  transition: 200ms background-color;

  &:hover {
    cursor: pointer;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  > svg {
    transition: 200ms transform;
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }

  &.active {
    background-color: ${(props) => props.theme.branding};
    color: #fff;

    svg {
      fill: #fff;
    }
  }
`;

export default Button;
