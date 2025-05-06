import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatusTag from './StatusTag';
import IconBtn from './IconBtn';
import ActionBtn from './ActionBtn';
import PostItem from './PostItem';
import '../index.css';
import { db } from './firebase';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { motion, AnimatePresence } from 'framer-motion';

const IntroText = styled.input`
  max-width: 1512px;
  width: 100%;
  height: 60px;
  border-radius: 8px;
  background-color: #E7F3F8;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  border: none;
  padding-left: 16px;
  margin-top: 20px;

  color: ${({ disabled }) => (disabled ? '#131313' : '#0077D4')};
`;

const ServiceTitle = styled.input`
  font-size: 36px;
  line-height: 40px;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
  width: 1512px;
  margin-right: 20px;

  color: ${({ disabled }) => (disabled ? '#131313' : '#0077D4')};
`;

const HeaderWrap = styled.div`
  max-width: 1512px;
  margin: 0 auto;
`;

function MainPage() {
  const nav = useNavigate();

  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('전체 작업');
  const [toggle, setToggle] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    db.collection('meta').doc('intro').get().then((doc) => {
      if (doc.data) {
        const { title = '', text = '' } = doc.data();
        setTitle(title || '고명현님의 Work-Log');
        setIntro(text || '블로그 소개 글을 작성해주세요');
      } else {
        setTitle('고명현님의 Work-Log');
        setIntro('블로그 소개 글을 작성해주세요');
      }
    });
  }, []);

  useEffect(() => {
    let tempData = [];
    db.collection('post')
      .get()
      .then((qs) => {
        qs.forEach((doc) => {
          tempData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        const sortedData = tempData.sort((a, b) => Number(b.id) - Number(a.id));
        setData(sortedData);
      });
  }, []);

  const saveIntro = () => {
    db.collection('meta').doc('intro').set(
      {
        title: title,
        text: intro,
      },
      { merge: true }
    )
      .then(() => {
        toast.success('설정이 완료되었습니다!');
        setEditMode(false);
      })
      .catch((err) => {
        toast.error('저장 실패: 다시 시도해주세요.');
        console.error(err);
      });
  };

  const statusCounts = {
    '전체 작업': data.length,
    '급한 작업': data.filter((p) => p.status === '급한 작업').length,
    '진행 작업': data.filter((p) => p.status === '진행 작업').length,
    '완료 작업': data.filter((p) => p.status === '완료 작업').length,
    '보류 작업': data.filter((p) => p.status === '보류 작업').length,
  };

  return (
    <div>
      <HeaderWrap>
        <div className="headerTitleWrap">
          <ServiceTitle
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!editMode}
            maxLength={30}
          />
          <IconBtn
            iconName={editMode ? 'check' : 'settings'}
            onClick={editMode ? saveIntro : () => setEditMode(true)}
          />
        </div>

        <IntroText
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          disabled={!editMode}
          maxLength={60}
        />
      </HeaderWrap>

      <section className="content">
        <div className="statusCon">
          <p className="subtitletext">Status</p>
          <hr />
          <div className="statusConWrap">
            <div onClick={() => setFilterStatus('전체 작업')}>
              <StatusTag status="전체 작업" select={filterStatus === '전체 작업'} count={statusCounts['전체 작업']} />
            </div>
            <div onClick={() => setFilterStatus('급한 작업')}>
              <StatusTag status="급한 작업" select={filterStatus === '급한 작업'} count={statusCounts['급한 작업']} />
            </div>
            <div onClick={() => setFilterStatus('진행 작업')}>
              <StatusTag status="진행 작업" select={filterStatus === '진행 작업'} count={statusCounts['진행 작업']} />
            </div>
            <div onClick={() => setFilterStatus('완료 작업')}>
              <StatusTag status="완료 작업" select={filterStatus === '완료 작업'} count={statusCounts['완료 작업']} />
            </div>
            <div onClick={() => setFilterStatus('보류 작업')}>
              <StatusTag status="보류 작업" select={filterStatus === '보류 작업'} count={statusCounts['보류 작업']} />
            </div>
          </div>
        </div>

        <div className="postCon">
          <div className="postConTitle">
            <p className="subtitletext">Log list</p>
            <div className="btnWrap">
            <IconBtn iconName={toggle ? 'close' : 'search'}
              onClick={() => {
                setToggle((prev) => !prev);
                if (toggle) setSearch('');
              }}  
              />
              <AnimatePresence>
                {toggle && (
                  <motion.input
                    key="inputView"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    placeholder="검색어 입력"
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      height: 40 ,
                      padding: '0 8px',
                      fontSize: 14,
                      borderRadius: 8,
                      border: '1px solid #EEEDEB',
                      overflow: 'hidden',
                      outline: 'none'
                    }}
                  />
                )}
              </AnimatePresence>
              <ActionBtn type="write" onClick={() => nav('/write')} />
            </div>
          </div>
          <hr />
          <div className="postItemWrap">
            {data
              .filter(post =>
                (filterStatus === '전체 작업' || post.status === filterStatus) &&
                post.title.toLowerCase().includes(search.toLowerCase()) // 🔹 필터링
              )
              .map((post, idx) => (
                <PostItem key={idx} post={post} itemClicked={() => nav(`/post/${post.id}`)} />
              ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default MainPage;
