// src/jsx/IconBtn.jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  background-color: ${({ iconName, disabled }) =>
    iconName === 'send' && !disabled ? '#0077D4' : '#EEEDEB'};

  .icon {
    font-size: 24px;
    color: ${({ iconName, disabled }) =>
      iconName === 'send' && !disabled ? '#ffffff' : '#333333'};
  }
`;

function IconBtn({ iconName, onClick, disabled = false }) {
  return (
    <StyledButton onClick={onClick} iconName={iconName} disabled={disabled}>
      <span className="material-symbols-outlined icon">{iconName}</span>
    </StyledButton>
  );
}

export default IconBtn;
