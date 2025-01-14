// import RescheduleModal from 'components/Modal/RescheduleModal';
import Aside from 'components/Aside/Aside';
import Header from 'components/Header/Header';
import DashboardAccount from 'components/partTime/dashboard/DashboardAccount';
import DashboardFullschedule from 'components/partTime/dashboard/DashboardFullschedule';
import DashboardNotice from 'components/partTime/dashboard/DashboardNotice';
import DashboardPersonalschedule from 'components/partTime/dashboard/DashboardPersonalschedule';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import './PartTimeDashboard.scss';
import { useSelector } from 'react-redux';
import client from 'utils/api/client';
import Footer from 'components/Footer/Footer';
import Loading from 'components/Loading/Loading';
import { useCallback } from 'react';
import TimeclockModal from 'components/Modal/TimeclockModal';

function PartTimeDashboard() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const today = year + '-' + month + '-' + date;
  const shop = useSelector((state) => state.shop);
  const user = useSelector((state) => state.user);
  const parttime = useSelector((state) => state.parttime);

  const weekArray = ['일', '월', '화', '수', '목', '금', '토'];
  const day = weekArray[new Date().getDay()];

  // 출퇴근 기능
  const lastTimeClock =
    parttime.timeClocks && parttime.timeClocks[parttime.timeClocks.length - 1];

  let clockIn = lastTimeClock
    ? !!lastTimeClock.end_time
      ? false
      : true // true면 값을 클릭 불가능
    : false; // false면 값을 클릭 가능
  let clockOut = clockIn ? false : true;

  const getprofile = () => {
    try {
      client.get(`/location/${shop._id}/employees/${user._id}`).then((res) => {
        sessionStorage.setItem('parttime', JSON.stringify(res.data));
        window.location.replace(`/parttime/${shop._id}`);
      });
    } catch (e) {
      console.log('getprofileErr' + e);
    }
  };

  const clickClockIn = (e) => {
    let newForm = {
      locationId: shop._id,
      wage: parttime.hourly_wage,
    };

    const pushdata = async () => {
      try {
        await client.post(`/timeclock/start`, newForm).then((response) => {
          if (response.status === 201) {
            getprofile();
          }
        });
      } catch (e) {
        console.log(e);
      }
    };
    pushdata();
  };

  const clickClockOut = (e) => {
    clockOut = true;
    clockIn = false;
    const newForm = {
      locationId: shop._id,
      timeClockId: lastTimeClock._id,
    };
    const pushdata = async () => {
      try {
        await client
          .post(`/timeclock/end`, newForm)
          .then((response) => getprofile());
      } catch (e) {
        console.log(e);
      }
    };
    pushdata();
  };

  // 출퇴근 확인 모달 창
  const [timeclockInModal, setTimeclockInModal] = useState(false);
  const [timeclockOutModal, setTimeclockOutModal] = useState(false);

  const timeClockInModalToggle = useCallback(() => {
    setTimeclockInModal(!timeclockInModal);
  }, [timeclockInModal]);
  const timeClockOutModalToggle = useCallback(() => {
    setTimeclockOutModal(!timeclockOutModal);
  }, [timeclockOutModal]);

  return (
    <>
      {!parttime && <Loading />}
      <Header />
      <Aside />
      <div id="partTimeDashboard">
        <div className="container">
          <div className="firstRow">
            <div className="topLeftBox">
              <DashboardAccount />
            </div>
            <div className="topRightBox">
              <div className="title">
                <h2>
                  {today}-{day}
                </h2>
              </div>
              <div className="schedule">
                <div className="fullSchedule">
                  <div className="textLine">
                    <span>전체 스케줄</span>
                    <Link to={`/parttime/${shop._id}/scheduler`} option={'all'}>
                      <span className="moreBtn">
                        더보기
                        <IoIosArrowForward />
                      </span>
                    </Link>
                  </div>
                  <div className="fullScheduleContent">
                    <DashboardFullschedule
                      year={year}
                      month={month}
                      date={date}
                    />
                  </div>
                </div>
                <div className="personalSchedule">
                  <div className="textLine">
                    <span>개인 스케줄</span>
                    <Link
                      to={`/parttime/${shop._id}/scheduler`}
                      option={'personal'}
                    >
                      <span className="moreBtn">
                        더보기
                        <IoIosArrowForward />
                      </span>
                    </Link>
                  </div>
                  <div className="personalScheduleContent">
                    <DashboardPersonalschedule
                      year={year}
                      month={month}
                      date={date}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="secondRow">
            <div className="bottomLeftBox">
              <div className="btnBox">
                <button
                  className="clockInBtn"
                  onClick={timeClockInModalToggle}
                  disabled={clockIn}
                  style={
                    clockIn
                      ? {
                          background: '#ededee',
                          color: 'gray',
                          cursor: 'default',
                        }
                      : { background: 'rgb(18, 113, 175)' }
                  }
                >
                  {clockIn ? '출근 완료' : '출근 하기'}
                </button>
                <button
                  className="clockOutBtn"
                  onClick={timeClockOutModalToggle}
                  disabled={clockOut}
                  style={
                    clockOut
                      ? {
                          background: '#ededee',
                          color: 'gray',
                          cursor: 'default',
                        }
                      : { background: 'rgb(18, 113, 175)' }
                  }
                >
                  {clockOut ? '퇴근 완료' : '퇴근 하기'}
                </button>
              </div>
            </div>
            <div className="bottomRightBox">
              <div className="noticeBox">
                <div className="textLine">
                  <span>공지사항</span>
                  <Link to={`/${shop._id}/notice`}>
                    <span className="moreBtn">
                      더보기
                      <IoIosArrowForward />
                    </span>
                  </Link>
                </div>
                <DashboardNotice />
              </div>
            </div>
          </div>
          {timeclockInModal && (
            <TimeclockModal
              message="출근 하시겠습니까?"
              timeClockModalToggle={timeClockInModalToggle}
              clickClockIn={clickClockIn}
            />
          )}
          {timeclockOutModal && (
            <TimeclockModal
              message="퇴근 하시겠습니까?"
              timeClockModalToggle={timeClockOutModalToggle}
              clickClockOut={clickClockOut}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PartTimeDashboard;
