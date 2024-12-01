import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Modal.module.css";
import editIcon from "../img/edit.png";

const Modal = ({ type, reservation, onAuthenticate, onSave, onClose }) => {
  const [authCodeInput, setAuthCodeInput] = useState("");
  const [step, setStep] = useState(type);
  const [editedReservation, setEditedReservation] = useState({
    date: reservation?.date ? new Date(reservation.date) : new Date(),
    startTime: reservation?.startTime || reservation?.time?.split(" ~ ")[0] || "09:00",
    endTime: reservation?.endTime || reservation?.time?.split(" ~ ")[1] || "10:00",
    title: reservation?.title || "",
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

  const handleSaveClick = () => {
    setStep("auth"); // 인증 화면으로 전환
  };

  const handleAuthSubmit = () => {
    const isAuthenticated = onAuthenticate(authCodeInput); // 인증번호 확인
    if (isAuthenticated) {
      const updatedReservation = {
        ...reservation,
        date: editedReservation.date.toISOString().slice(0, 10),
        startTime: editedReservation.startTime,
        endTime: editedReservation.endTime,
        title: editedReservation.title,
      };
      onSave(updatedReservation);
      onClose();
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i <= 24; i++) {
      times.push(`${String(i).padStart(2, "0")}:00`);
      if (i < 24) times.push(`${String(i).padStart(2, "0")}:30`);
    }
    return times;
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {step === "edit" ? (
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
                value={editedReservation.startTime}
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
                value={editedReservation.endTime}
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
                placeholder="사유를 작성해주세요"
                className={styles.inputedit}
              />
            </div>
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSaveClick}>
                저장
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.modalTitle}>인증번호를 입력해주세요</h2>
            <input
              type="text"
              value={authCodeInput}
              onChange={(e) => setAuthCodeInput(e.target.value)}
              placeholder="인증번호 입력"
              className={styles.input}
            />
            <div className={styles.actions}>
              <button
                className={styles.confirmBtn}
                onClick={handleAuthSubmit}
              >
                확인
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