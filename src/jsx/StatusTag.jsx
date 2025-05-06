import styled from 'styled-components';

const statusColorMap = {
  '급한 작업': { text: '#EF4444', bg: '#FAE3DE', dot: '#EF4444' },
  '진행 작업': { text: '#F59E0B', bg: '#FAEDCC', dot: '#F59E0B' },
  '완료 작업': { text: '#10B981', bg: '#DFEDDD', dot: '#10B981' },
  '보류 작업': { text: '#3B82F6', bg: '#D3E7F2', dot: '#3B82F6' },
};

const StyledTag = styled.button`
  white-space: nowrap;
  min-height: 32px;
  min-width: 120px;
  max-width: 140px;
  font-size: 16px;
  padding: 10px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  background-color: ${({ bg }) => bg};
  color: ${({ text }) => text};
  line-height: 16px;

  ${({ select, dot }) =>
    select &&
    `
    box-shadow: 0 0 0 1.5px ${dot} inset;
  `}
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ dot }) => dot};
  display: inline-block;
`;

function StatusTag({ status, select, count }) {
  const colorSet = statusColorMap[status] || {
    text: '#6B7280',
    bg: '#E5E7EB',
    dot: '#9CA3AF',
  };

  return (
    <StyledTag bg={colorSet.bg} text={colorSet.text} dot={colorSet.dot} select={select}>
      <Dot dot={colorSet.dot} />
      {status} {typeof count === 'number' ? `(${count})` : ''}
    </StyledTag>
  );
}

export default StatusTag;
