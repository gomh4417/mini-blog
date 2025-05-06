import styled from 'styled-components';

const CommentWrap = styled.div`
  display: flex;
  gap: 16px;
  align-items: start;
  
`;

const CommentTextWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentNameWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  h5 {
    font-size: 16px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    color: #888;
  }
`;

const CommentContent = styled.p`
  font-size: 14px;
  color: #333;
`;

const NickBtn = styled.button`
  font-size: 12px;
  color: #3B82F6;
  background-color: #EEEDEB;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
`;

function CommentItem({ comment, idx, setCommentIndex }) {
  const { name, date, content } = comment;

  return (
    <CommentWrap>
      <img src="/profile.png" alt="profile" width="32" height="32" />
      <CommentTextWrap>
        <CommentNameWrap>
          <h5>{name}</h5>
          <p>{date}</p>
          {setCommentIndex && (
            <NickBtn onClick={() => setCommentIndex(idx)}>대댓글</NickBtn>
          )}
        </CommentNameWrap>
        <CommentContent>{content}</CommentContent>
      </CommentTextWrap>
    </CommentWrap>
  );
}

export default CommentItem;
