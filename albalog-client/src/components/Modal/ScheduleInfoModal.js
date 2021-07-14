import React, { useState } from 'react';
import client from 'utils/api';
import './ScheduleInfoModal.scss';

const ScheduleInfoModal = ({ handleInfoModal, employee, locationId }) => {
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.delete(
        `shift/${employee.index}/location/${locationId}/employee/${employee.staffId}/delete`,
      );
      handleInfoModal();
      if (response.status === 200) {
        window.location.replace(`/admin/${locationId}/schedule`); // 페이지 이동 후 새로고침
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="info-modal-container">
      <div className="info-modal-wrap">
        <h2 className="title">스케줄 정보</h2>
        <div className="employee-detail">
          <p className="content">🤔 이름: {employee.title}</p>
          <p className="content">
            {`📅 날짜: ${employee.start.getFullYear()}년 ${
              employee.start.getMonth() + 1
            }월 ${employee.start.getDate()}일`}
          </p>
          <p className="content">
            {`🕑 근무시간: ${employee.start.getHours()}시 ${employee.start.getMinutes()}분 ~ ${employee.end.getHours()}시 ${employee.end.getMinutes()}분`}
          </p>
        </div>
        <button className="btn-del" onClick={handleDeleteSubmit}>
          삭제하기
        </button>
        <button className="btn-close" onClick={handleInfoModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ScheduleInfoModal;
