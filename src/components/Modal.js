import React, { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; // date-fns를 사용해 요일을 대문자로 변환
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Modal.module.css";

// Custom Input 컴포넌트 정의
const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
  // 날짜를 대문자로 변환
  const formattedValue = value
    ? value.replace(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/g, (match) =>
      match.toUpperCase()
    )
    : "날짜 선택";

  return (
    <button className={styles.customDateInput} onClick={onClick} ref={ref}>
      {formattedValue}
    </button>
  );
});
// authCode는 백에서 인증하도록 수정했습니다 (authCode 인증하는 로직 지움)
const Modal = ({ type, reservation, onAuthenticate, onSave, onClose }) => {
  const [authCodeInput, setAuthCodeInput] = useState("");
  const [step, setStep] = useState(type);
  const [editedReservation, setEditedReservation] = useState({
    date: reservation?.date ? new Date(reservation.date) : new Date(),
    startTime: reservation?.startTime || reservation?.time?.split(" ~ ")[0] || "",
    endTime: reservation?.endTime || reservation?.time?.split(" ~ ")[1] || "",
    title: reservation?.title || "",
  });

  useEffect(() => {
    if (reservation) {
      setEditedReservation({
        date: reservation.date ? new Date(reservation.date) : new Date(),
        startTime: reservation.startTime || reservation.time?.split(" ~ ")[0] || "09:00",
        endTime: reservation.endTime || reservation.time?.split(" ~ ")[1] || "10:00",
        title: reservation.title || "",
      });
    }
  }, [reservation]);

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
    if (editedReservation.startTime >= editedReservation.endTime) {
      alert("시작 시간이 종료 시간보다 늦을 수 없습니다.");
      return;
    }
    setStep("auth");
  };


  const handleAuthSubmit = () => {
    const updatedReservation = {
      ...reservation,
      date: editedReservation.date.toISOString().slice(0, 10),
      startTime: editedReservation.startTime,
      endTime: editedReservation.endTime,
      title: editedReservation.title,
      authCode: authCodeInput
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
            <div className={styles.inputGroup}>
              <DatePicker
                selected={editedReservation.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd EEE" // 요일 약어를 표시
                customInput={<CustomDateInput />}
                className={styles.inputedit}
                placeholderText="날짜 선택"
              />
            </div> 날짜는 수정 불가능하게 바꿔주세여
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