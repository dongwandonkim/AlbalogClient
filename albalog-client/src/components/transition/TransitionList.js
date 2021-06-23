import ModalLoading from 'components/Loading/ModalLoading';
import MessageModal from 'components/Modal/MessageModal';
import { setTransition } from 'modules/transition';
import React, { useEffect, useState } from 'react';
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDelete,
  MdAdd,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import client from 'utils/api';
import './TransitionList.scss';

const TransitionList = ({ date, text }) => {
  const { year, month, day } = date;
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.shop);
  const user = useSelector((state) => state.user);
  const transition = useSelector((state) => state.transition);

  const [getTransition, setGetTransition] = useState('');
  const [transitionDescription, setTransitionDescription] = useState('');
  const [editTransitionDes, setEditTransition] = useState('');
  const [dataLoading, setDataLoading] = useState(1);
  const [messageModalState, setMessageModalState] = useState(false);

  const transitionDesOnChange = (e) => {
    setTransitionDescription(e.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await client.get(
        `/transition/${shop._id}/${year}-${month}-${day}`,
      );

      console.log(response.data.satisfyTransitions);
      const newArr = [...response.data.satisfyTransitions].reverse();
      setGetTransition(newArr);
    }

    fetchData();
  }, [shop, year, month, day, dataLoading]);

  // 인수인계 추가
  const addTransition = () => {
    let body = {
      locationId: shop._id,
      date: `${year}-${month}-${day}`,
      description: transitionDescription,
    };
    client.post('/transition/create', body).then((response) => {
      console.log(response);
      if (response.status === 201) {
        setDataLoading(!dataLoading);
        setTransitionDescription('');
      }
    });
  };

  // 인수인계 삭제
  const deleteTransition = () => {
    client
      .delete(`/transition/${shop._id}/delete/${transition._id}`)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setMessageModalState(!messageModalState);
          setDataLoading(!dataLoading);
        }
      });
  };

  const editTransitionInput = (e) => {
    console.log(e.target.innerText);
    setEditTransition(e.target.innerText);
  };

  // 인수인계 수정
  const editTransition = (e) => {
    let body = {
      locationId: shop._id,
      transitionId: e.target.id,
      description: editTransitionDes,
      userId: user._id,
    };

    console.log(body);

    client.patch('/transition/desc/update', body).then((response) => {
      console.log(response.data);
    });
  };

  // 인수인계 체크박스
  const toggleTransition = (id) => {
    console.log(id);

    let body = {
      locationId: shop._id,
      transitionId: id,
    };

    client.patch(`/transition/toggle`, body).then((response) => {
      console.log(response);
      if (response.status === 201) {
        setDataLoading(!dataLoading);
      }
    });
  };

  const messageModalToggle = (transition) => {
    setMessageModalState(!messageModalState);
    dispatch(setTransition(transition));
  };
  return (
    <div id="TransitionList">
      <div className="current-date">
        <h4>
          {year}년 {month}월 {day}일 ({text})
        </h4>
      </div>
      <div className="transition-input">
        <input
          type="text"
          value={transitionDescription}
          onChange={transitionDesOnChange}
          placeholder="전달 사항을 입력해 주세요"
        />
        <button type="button" onClick={addTransition} className="add">
          <MdAdd size="24" />
        </button>
      </div>
      <div className="transition-list">
        <ul>
          {getTransition &&
            getTransition.map((transition, index) => (
              <li key={index}>
                <div
                  className={`tran-cont ${
                    transition.completed ? 'completed' : ''
                  }`}
                >
                  <button
                    className="tran-check"
                    onClick={() => toggleTransition(transition._id)}
                  >
                    {transition.completed ? (
                      <MdCheckBox size="22" className="check-box" />
                    ) : (
                      <MdCheckBoxOutlineBlank size="22" />
                    )}
                  </button>
                  <div
                    onInput={editTransitionInput}
                    contenteditable="true"
                    className="title"
                    onBlur={editTransition}
                    id={transition._id}
                  >
                    {transition.description}
                  </div>

                  <button
                    type="button"
                    className="del-btn"
                    // onClick={() => deleteTransition(transition._id)}
                    onClick={() => messageModalToggle(transition)}
                    name="삭제"
                  >
                    <MdDelete size="30" />
                  </button>
                </div>
              </li>
            ))}
          {messageModalState && (
            <MessageModal
              messageModalToggle={messageModalToggle}
              deleteCont={deleteTransition}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default TransitionList;
