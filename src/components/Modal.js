import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Modal.module.css";
import editIcon from "../img/edit.png";

const Modal = ({ type, reservation, onAuthenticate, onSave, onClose }) => {
  const [editedReservation, setEditedReservation] = useState({
    date: reservation?.date ? new Date(reservation.date) : new Date(), // 전달된 date가 있으면 변환
    startTime: reservation?.startTime || reservation?.time?.split(" ~ ")[0] || "09:00", // 전달된 startTime, 없으면 time에서 추출
    endTime: reservation?.endTime || reservation?.time?.split(" ~ ")[1] || "10:00", // 전달된 endTime, 없으면 time에서 추출
    title: reservation?.title || "", // 전달된 title 유지
  });

  const handleDateChange = (date) => {
    setEditedReservation({ ...editedReservation, date });
  };

  const handleStartTimeChange = (e) => {
    setEditedReservation({ ...editedReservation, startTime: e.target.value });
  };

  const handleEndTimeChange = (e) => {
    setEditedReservation({ ...editedReservation, endTime: e.target.value });
  };

  const handleSave = () => {
    // 수정된 데이터를 상위 컴포넌트로 전달
    const updatedReservation = {
      ...reservation,
      date: editedReservation.date.toISOString().slice(0, 10), // ISO 형식으로 변환
      startTime: editedReservation.startTime, // 수정된 시작 시간
      endTime: editedReservation.endTime, // 수정된 끝나는 시간
      title: editedReservation.title, // 수정된 제목
    };

    onSave(updatedReservation); // 수정된 예약 정보를 상위 컴포넌트로 전달
    onClose(); // 모달 닫기
  };

  // 30분 간격으로 시간을 생성
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i <= 24; i++) {
      times.push(`${String(i).padStart(2, "0")}:00`);
      if (i < 18) times.push(`${String(i).padStart(2, "0")}:30`);
    }
    return times;
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {type === "auth" ? (
          <>
            <h2 className={styles.modalTitle}>인증번호를 입력해주세요</h2>
            <input
              type="text"
              value={editedReservation.title}
              onChange={(e) =>
                setEditedReservation({ ...editedReservation, title: e.target.value })
              }
              placeholder="인증번호 입력"
              className={styles.input}
            />
            <div className={styles.actions}>
              <button
                className={styles.confirmBtn}
                onClick={() => onAuthenticate(editedReservation.title)}
              >
                확인
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.modalTitle}>
              예약 수정
              <img src={editIcon} alt="Edit Icon" className={styles.editIcon} />
            </h2>
            <div className={styles.inputGroup}>
              <DatePicker
                selected={editedReservation.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className={styles.inputedit}
                placeholderText="날짜 선택"
              />
            </div>
            <div className={styles.timeGroup}>
              <select
                value={editedReservation.startTime} // 시작 시간을 설정
                onChange={handleStartTimeChange}
                className={styles.timeSelect}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className={styles.timeSeparator}> ~ </span>
              <select
                value={editedReservation.endTime} // 끝나는 시간을 설정
                onChange={handleEndTimeChange}
                className={styles.timeSelect}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={editedReservation.title}
                onChange={(e) =>
                  setEditedReservation({ ...editedReservation, title: e.target.value })
                }
                placeholder="title"
                className={styles.inputedit}
              />
            </div>
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSave}>
                저장
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;