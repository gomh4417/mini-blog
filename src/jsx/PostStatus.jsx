
const statusColorMap = {
    '급한 작업': { text: '#EF4444', bg: '#FAE3DE' },
    '진행 작업': { text: '#F59E0B', bg: '#FAEDCC' },
    '완료 작업': { text: '#10B981', bg: '#DFEDDD' },
    '보류 작업': { text: '#3B82F6', bg: '#D3E7F2' },
  };
  
  function PostStatus({ status }) {
    const colorSet = statusColorMap[status] || { text: '#6B7280', bg: '#E5E7EB' };
  
    return (
      <span
        style={{
            whiteSpace: 'nowrap',
            maxWidth: '72px',
            fontSize: '14px',
            padding: '4px 8px',
            borderRadius: '8px',
            backgroundColor: colorSet.bg,
            color: colorSet.text,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          
          fontWeight: 500,
        }}
      >
        {status}
      </span>
    );
  }
  
  export default PostStatus;
  