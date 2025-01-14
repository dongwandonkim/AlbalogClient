import Loading from 'components/Loading/Loading';
import { SetShop } from 'modules/shop';
import { SetUser } from 'modules/user';
import { SetParttime } from 'modules/parttime';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Header.scss';
import logo from 'static/albalog-logo.png';
import client from 'utils/api/client';
import { FaStoreAlt } from 'react-icons/fa';
import { AiOutlineExport } from 'react-icons/ai';
import { SetAllShift } from 'modules/allShift';
import InviteButton from 'components/InviteButton/InviteButton';
import useLogout from 'hooks/user/useLogout';
import useShopInfoEffect from 'hooks/shop/useShopInfoEffect';

const Header = ({
  user,
  shop,
  parttime,
  dispatchSetParttime,
  dispatchSetShop,
  dispatchSetAllShift,
  match,
}) => {
  const { onLogout } = useLogout();
  useShopInfoEffect();

  console.log("헤더 리랜더링")

  // useEffect(() => {
  //   if (!shop._id) {
  //     const shopId = match.params.shop;
  //     if (user.role === 'owner') {
  //       client.get(`/location/response.data`).then((response) => {
  //         dispatchSetShop(response.data);
  //       });
  //     } else if (user.role === 'staff') {
  //       client.get(`/employee/${shopId}`).then((response) => {
  //         dispatchSetShop(response.data);
  //       });
  //     }
  //   } else if (!user.email) {
  //     window.location.replace('/login');
  //   } else if (shop._id) {
  //     client.get(`/shift/location/${shop._id}`).then((response) => {
  //       let shiftBody = response.data.map((a) => {
  //         const st = new Date(new Date(a.start).getTime() - 540 * 60 * 1000);
  //         const ed = new Date(new Date(a.end).getTime() - 540 * 60 * 1000);
  //         let newData = {
  //           title: a.title,
  //           start: new Date(st),
  //           end: new Date(ed),
  //         };
  //         return newData;
  //       });
  //       dispatchSetAllShift(shiftBody);
  //     });
  //   }
  // }, [user, dispatchSetShop, match.params.shop, shop._id, dispatchSetAllShift]);

  // payroll과 개인스케줄을 리덕스에 추가
  // useEffect(() => {
  //   const getPayroll = async () => {
  //     try {
  //       const responseP = await client.get(`/timeclock/${shop._id}/staff`);
  //       const responseOneSht = await client.get(`/shift/employee/${user._id}`);

  //       let shift = await responseOneSht.data.map((a) => {
  //         const st = new Date(new Date(a.start).getTime() - 540 * 60 * 1000);
  //         const ed = new Date(new Date(a.end).getTime() - 540 * 60 * 1000);

  //         let newData = {
  //           title: user.name,
  //           start: new Date(st),
  //           end: new Date(ed),
  //         };
  //         return newData;
  //       });
  //       const shiftParttime = {
  //         ...parttime,
  //         payrolls: responseP.data,
  //         one_shift: shift,
  //       };
  //       dispatchSetParttime(shiftParttime);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (!parttime.payrolls && shop._id && user.role === 'staff') {
  //     getPayroll();
  //   }
  // }, [shop._id, dispatchSetParttime, user._id, parttime, user.name, user.role]);

  return (
    <>
      {!shop._id && <Loading />}
      <header className="header">
        <a href="/">
          <img src={logo} alt="" />
        </a>

        <h3 className="header-middle">
          <FaStoreAlt size="24" />
          <span>{shop.name}</span>
        </h3>
        <div className="header-right">
          <span className="user-name">
            <b>{user.name}</b>님 안녕하세요.
          </span>
          {user.role === 'owner' && <InviteButton />}
          <button className="btn-logout" onClick={onLogout}>
            <span>로그아웃</span>
            <AiOutlineExport size="25" />
          </button>
        </div>
      </header>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    shop: state.shop,
    parttime: state.parttime,
    allShift: state.allShift,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchSetUser: (UserBody) => dispatch(SetUser(UserBody)),
    dispatchSetShop: (ShopBody) => dispatch(SetShop(ShopBody)),
    dispatchSetParttime: (ParttimeBody) => dispatch(SetParttime(ParttimeBody)),
    dispatchSetAllShift: (shiftBody) => dispatch(SetAllShift(shiftBody)),
  };
}

export default React.memo(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Header)),
);
