import styled from 'styled-components';
import PostStatus from './PostStatus';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

const PostWrap = styled.div`
  background-color: #ffffff;
  border: 1px solid #EEEDEB;
  width: 224px;
  height: 320px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  cursor: pointer;
`;

const PostTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0px 12px;
  height: 152px;
`;

const PostTitle = styled.p`
  font-weight: 700;
  font-size: 20px;
  text-align: justify;
`;

const PostDate = styled.p`
  font-size: 12px;
  color: #777777;
`;

const PostImgWrap = styled.div`
  height: 132px;
  width: 100%;
  overflow: hidden;
`

const statusColorMap = {
  '급한 작업': '#EF4444',
  '진행 작업': '#F59E0B',
  '완료 작업': '#10B981',
  '보류 작업': '#3B82F6',
};

function PostItem({ post }) {
  const { title, status, id } = post;
  const borderColor = statusColorMap[status] || '#ccc';
  const nav = useNavigate(); 

  const formattedDate = new Date(Number(id)).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PostWrap
      borderColor={borderColor}
      onClick={() => nav(`/post/${post.id}`)}
    >
      <PostImgWrap><img
        className="postImg"
        src={post.imageUrl || '/default.png'}
      />
      </PostImgWrap>
      <PostTextWrap>
        <PostStatus status={status} />
        <PostTitle>{title}</PostTitle>
        <PostDate>{formattedDate}</PostDate>
      </PostTextWrap>
    </PostWrap>
  );
}

export default PostItem;
