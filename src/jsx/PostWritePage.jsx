import StatusTag from './StatusTag';
import IconBtn from './IconBtn';
import ActionBtn from './ActionBtn';
import '../index.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { db, storage } from './firebase';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PostWritePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정 모드일 경우 postId
  const ImgRef = useRef();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // base64 이미지 URL
  const [status, setStatus] = useState('진행 작업');

  const ImgClick = () => {
    ImgRef.current.click(); 
  };

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (id) {
      db.collection('post').doc(id).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          setImageUrl(data.imageUrl || '');
          setStatus(data.status || '진행 작업');
        }
      });
    }
  }, [id]);

  // 이미지 업로드 (base64 인코딩)
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`images/${file.name}_${Date.now()}`);
  
    try {
      await imageRef.put(file);
      const downloadURL = await imageRef.getDownloadURL();
      setImageUrl(downloadURL);
      toast.success('이미지 업로드 완료!'); // ✅ 여기 추가
    } catch (err) {
      console.error(err);
      toast.error('이미지 업로드 실패');
    }
  };

  const savePost = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
  
    const timestamp = id || new Date().getTime().toString();
  
    const postData = {
      id: timestamp,
      title,
      content,
      imageUrl: imageUrl || '/default.png',  // 기본 이미지 경로
      status,
    };
  
    const ref = db.collection('post').doc(timestamp);
  
    const action = id
      ? ref.update(postData)
      : ref.set({ ...postData, comments: [] });
  
    action
      .then(() => {
        toast.success(id ? '수정 완료!' : '글이 등록되었습니다!');
        navigate('/');
      })
      .catch((err) => {
        toast.error('저장 실패: 다시 시도해주세요.');
        console.error(err);
      });
  };



  return (
    <div>
      <div className="viewImg">
        <img className="uploadImg" src={imageUrl || '/default.png'} />
      </div>

      <section className="contentWrite">
  <div className="selectStauts">
      <div onClick={() => setStatus('급한 작업')}>
        <StatusTag status="급한 작업" select={status === '급한 작업'} />
      </div>
      <div onClick={() => setStatus('진행 작업')}>
        <StatusTag status="진행 작업" select={status === '진행 작업'} />
      </div>
      <div onClick={() => setStatus('완료 작업')}>
        <StatusTag status="완료 작업" select={status === '완료 작업'} />
      </div>
      <div onClick={() => setStatus('보류 작업')}>
        <StatusTag status="보류 작업" select={status === '보류 작업'} />
      </div>
  </div>

        <div className="postCon">
          <div className="postConTitle">
            <input
              className="writeTitle"
              placeholder="제목을 작성해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={20}
            />
            <div className="btnWrap">
              <label>
                <IconBtn iconName="image" onClick={ImgClick} />
              </label>
                <input type="file" accept="image/*" ref={ImgRef} onChange={handleImage} style={{ display: 'none' }} />
              
              <ActionBtn type="share" onClick={savePost} />
            </div>
          </div>

          <hr />

          <textarea
            placeholder="본문을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </section>
      
    </div>
  );
}

export default PostWritePage;
