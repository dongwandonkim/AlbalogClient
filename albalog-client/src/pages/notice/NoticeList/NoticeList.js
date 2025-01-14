import React, { useCallback, useEffect, useState } from 'react';
import './NoticeList.scss';
import { AiOutlineSearch } from 'react-icons/ai';
import Pagination from 'components/Pagination/Pagination';
import { paginate } from 'utils/paginate';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from 'components/Header';
import Aside from 'components/Aside';
import Footer from 'components/Footer/Footer';
import NoDataType2 from 'components/NoData/NodataType2';
import { searchNotice } from 'utils/api/notice';

const NoticeList = ({ user, shop }) => {
  const [getNotices, setGetNotices] = useState([]);
  const [searchNoticeInput, setSearchNoticeInput] = useState('');
  const [noticeInfo, setNoticeInfo] = useState({
    pageSize: 10, // 한 페이지에 보여줄 공지사항 게시물 수
    currentPage: 1, // 현재 활성화 된 페이지 위치
  });

  const { pageSize, currentPage } = noticeInfo;

  // utils 함수에 있는 paginate로 화면에 보여줘야할 컨텐츠 개수의 배열을 가져옴
  const pagedNotices = paginate(getNotices, currentPage, pageSize);

  useEffect(() => {
    setGetNotices(shop.notices);
  }, [shop]);

  const pageCount = Math.ceil(getNotices.length / pageSize); // 몇 페이지가 필요한지 계산
  const handlePageChange = useCallback(
    (page) => {
      if (page >= pageCount) {
        page = pageCount;
      }
      if (page <= 1) {
        page = 1;
      }
      setNoticeInfo({
        ...noticeInfo,
        currentPage: page,
      });
    },
    [noticeInfo, pageCount],
  );

  const NoticeSearchInputChange = useCallback((e) => {
    setSearchNoticeInput(e.target.value);
  }, []);

  const NoticeSearchHandle = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const notices = await searchNotice(shop._id, searchNoticeInput);
        setGetNotices(notices);
      } catch (e) {
        alert('공지사항 검색에 실패했습니다.');
      }
    },
    [searchNoticeInput, shop._id],
  );

  return (
    <>
      <Header />
      <Aside />
      <div id="Notice" className="page-layout">
        <div className="cont">
          <div className="search-comm">
            <form action="" onSubmit={NoticeSearchHandle}>
              <fieldset>
                <input
                  type="text"
                  className="search-input"
                  placeholder="검색어를 입력해주세요"
                  value={searchNoticeInput}
                  onChange={NoticeSearchInputChange}
                />
                <button type="submit" className="search-btn">
                  <AiOutlineSearch size="23" />
                </button>
              </fieldset>
            </form>
          </div>

          {user.role === 'owner' && (
            <div className="upload">
              <Link to={`/${shop._id}/notice/upload`}>작성</Link>
            </div>
          )}
          <div className="table-comm">
            <table className="table">
              <colgroup>
                <col className="left" />
                <col className="right" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">제목</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>

              <tbody>
                {shop._id && pagedNotices.length === 0 ? (
                  <tr>
                    <td style={{ borderBottom: 'none' }}>
                      <NoDataType2 text={'등록된 공지사항이 없습니다.'} />
                    </td>
                  </tr>
                ) : (
                  <>
                    {pagedNotices.map((notice, index) => (
                      <tr key={index}>
                        <td className="td-left">
                          <div className="inner-cont">
                            <span className="inner-text">
                              <Link
                                to={`/${shop._id}/notice/${notice._id}`}
                                className="link-text"
                              >
                                {notice.title}
                              </Link>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="inner-cont inner-date">
                            {notice.createdAt.slice(0, 10)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="paging-comm">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

function mapStateToProps(state) {
  return { shop: state.shop, user: state.user };
}

export default React.memo(connect(mapStateToProps)(NoticeList));
