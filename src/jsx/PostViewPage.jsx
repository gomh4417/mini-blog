import { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatusTag from './StatusTag';
import IconBtn from './IconBtn';
import ActionBtn from './ActionBtn';
import CommentItem from './Comment';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from './firebase';
import '../index.css';

const CommentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentWrite = styled.input`
  border-radius: 4px;
  border: none;
  width: 1285px;
  outline: none;
  font-size: 16px;
  background-color: #EEEDEB;
  padding-left: 12px;
  height: 40px;
  font-size: 14px;
`;

const ReCommentWrite = styled(CommentWrite)`
  width: 800px;
`;

const CommentWriteWrap = styled.div`
  display: flex;
  gap: 16px;
  img {
    width: 36px;
    height: 36px;
  }
`;

const ReCommentWriteWrap = styled(CommentWriteWrap)`
  margin-left: 40px;
  margin-top: 12px;
`;


function PostViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [nickname, setNickname] = useState('');
  const [commentIndex, setCommentIndex] = useState(null); // 대댓글 입력창 제어
  const [reComment, setReComment] = useState('');
  const [imgModal, setImgModal] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection('post').doc(id).onSnapshot((doc) => {
      if (doc.exists) {
        setPost(doc.data());
      } else {
        alert('해당 글을 찾을 수 없습니다.');
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') return;

    const newComment = {
      id: `${id}_${Date.now()}`,
      name: nickname || '익명',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      content: commentText,
      reContent: []
    };

    const updatedComments = [...(post.comments || []), newComment];

    db.collection('post')
      .doc(id)
      .update({ comments: updatedComments })
      .then(() => {
        setCommentText('');
      })
      .catch((err) => {
        console.error('댓글 저장 실패:', err);
      });
  };

  const handleReComment = (Index) => {
    if (reComment.trim() === '') return;

    const updatedComments = [...post.comments];
    const reply = {
      name: nickname || '익명',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      content: reComment
    };

    if (!updatedComments[Index].reContent) {
      updatedComments[Index].reContent = [];
    }
    updatedComments[Index].reContent.push(reply);

    db.collection('post')
      .doc(id)
      .update({ comments: updatedComments })
      .then(() => {
        setReComment('');
        setCommentIndex(null);
      })
      .catch((err) => {
        console.error('대댓글 저장 실패:', err);
      });
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      db.collection('post')
        .doc(id)
        .delete()
        .then(() => {
          alert('삭제되었습니다');
          navigate('/');
        })
        .catch((error) => {
          console.error('삭제 실패:', error);
        });
    }
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      <div className="viewImg" onClick={() => setImgModal(true)}>
        {post.imageUrl && <img className="uploadImg" src={post.imageUrl} alt="업로드된 이미지" />}
      </div>

      <section className="contentWrite">
        <div className="selectStauts">
          <StatusTag status={post.status} />
        </div>

        <div className="postCon">
          <div className="postConTitle">
            <h1 className="writeTitle">{post.title}</h1>
            <div className="btnWrap">
              <IconBtn iconName="delete" onClick={handleDelete} />
              <ActionBtn type="edit" onClick={() => navigate(`/write/${id}`)} />
            </div>
          </div>

          <hr />

          <p className="ViewText">{post.content}</p>

          <p className="subtitletext">Comments</p>

          <div className="commentWrap">
            <CommentWriteWrap>
              <img className="profile" src="/profile.png" />
              <input
                className="nameInput"
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={6}
              />
            <CommentWrite
              type="text"
              placeholder="댓글을 입력해주세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            </CommentWriteWrap>
            <IconBtn iconName="send" onClick={handleCommentSubmit} />
          </div>

          <hr />

          <CommentsWrap>
          {post.comments?.map((c, idx) => (
            <div key={idx}>
              <CommentItem comment={c} idx={idx} setCommentIndex={setCommentIndex} />
              {commentIndex === idx && (
                <ReCommentWriteWrap>
                  <img className="profile" src="/profile.png" />
                  <input
                    className="nameInput"
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={6}
                  />
                  <ReCommentWrite
                    type="text"
                    placeholder="대댓글을 입력해주세요"
                    value={reComment}
                    onChange={(e) => setReComment(e.target.value)}
                  />
                  <IconBtn iconName="send" onClick={() => handleReComment(idx)} />
                </ReCommentWriteWrap>
              )}
              {c.reContent?.map((r, i) => (
                <div className='reCommentWrap' key={i}>
                  <CommentItem comment={r} />
                </div>
              ))}
            </div>
          ))}

          </CommentsWrap>
        </div>
      </section>

      {imgModal && (
  <div
    onClick={() => setImgModal(false)}
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    }}
  >
    <img
      src={post.imageUrl}
      alt="원본 이미지"
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        backgroundColor: '#fff'
      }}
    />
  </div>
)}

    </div>
  );
}

export default PostViewPage;
