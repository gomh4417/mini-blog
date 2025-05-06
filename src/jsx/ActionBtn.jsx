// src/jsx/ActionBtn.jsx
import styled from 'styled-components';

const ActiondBtn = styled.button`
  color: #ffffff;
  background-color: #0077d4;
  padding: 12px 18px;
  min-width: 120px;
  min-height: 40px;
  max-height: 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  cursor: pointer;
  align-items: center;

  .icon {
    font-size: 24px;
  }
`;

function ActionBtn({ type, onClick }) {
    const iconMap = {
      write: 'add',
      share: 'check',
      edit: 'edit',
    };
  
    const textMap = {
      write: 'New Log',
      share: 'Share Log',
      edit: 'Edit Log',
    };
  
    return (
      <ActiondBtn onClick={onClick}>
        <span className="material-symbols-outlined">{iconMap[type]}</span>
        {textMap[type]}
      </ActiondBtn>
    );
  }

export default ActionBtn;
