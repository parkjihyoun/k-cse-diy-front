import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Modal.module.css";

const Modal = ({ type, reservation, onSave, onClose }) => {
  const [authCodeInput, setAuthCodeInput] = useState("");
  const [step, setStep] = useState(type);
  const [editedReservation, setEditedReservation] = useState({
    startTime: reservation?.startTime || "09:00",
    endTime: reservation?.endTime || "10:00",
    title: reservation?.title || "",
  });

  useEffect(() => {
    if (reservation) {
      setEditedReservation({
        startTime: reservation.startTime || "09:00",
        endTime: reservation.endTime || "10:00",
        title: reservation.title || "",
      });
    }
  }, [reservation]);

  const handleStartTimeChange = (e) => {
    setEditedReservation({ ...editedReservation, startTime: e.target.value });
  };

  const handleEndTimeChange = (e) => {
    setEditedReservation({ ...editedReservation, endTime: e.target.value });
  };

  const handleSaveClick = () => {
    if (editedReservation.startTime >= editedReservation.endTime) {
      alert("시작 시간이 종료 시간보다 늦을 수 없습니다.");
      return;
    }
    setStep("auth");
  };

  const handleAuthSubmit = () => {
    const updatedReservation = {
      ...reservation,
      startTime: editedReservation.startTime,
      endTime: editedReservation.endTime,
      title: editedReservation.title,
    };
    onSave(updatedReservation);
    onClose();
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      times.push(`${String(i).padStart(2, "0")}:00`);
      times.push(`${String(i).padStart(2, "0")}:30`);
    }
    return times;
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {step === "edit" ? (
          <>
            <h2 className={styles.modalTitle}>예약 수정</h2>
            {/* 날짜 표시 */}
            <div className={styles.dateDisplay}>
              <p className={styles.dateText}>
                {reservation.date} ({reservation.day})
              </p>
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
              <button className={styles.cancelBtn} onClick={onClose}>
                취소
              </button>
              <button className={styles.saveBtn} onClick={handleSaveClick}>
                저장
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
              <button className={styles.cancelBtn} onClick={onClose}>
                취소
              </button>
              <button className={styles.confirmBtn} onClick={handleAuthSubmit}>
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;