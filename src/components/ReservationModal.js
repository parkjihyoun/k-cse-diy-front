import React from "react";
import styles from "../styles/ReservationModal.module.css";
import editIcon from "../img/edit.png";

// 요일을 계산하는 함수 (영어)
export const getDayName = (dateString) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const date = new Date(dateString); // 전달받은 날짜를 Date 객체로 변환
  return days[date.getDay()]; // 영어 요일 반환
};

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push(
        <option key={time} value={time}>
          {time}
        </option>
      );
    }
  }
  options.push(
    <option key="24:00" value="24:00">
      24:00
    </option>
  );
  return options;
};

const ReservationModal = ({ selectedDate, onClose, handleSave }) => {
  const dayName = getDayName(selectedDate); // 요일 계산

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      startTime: e.target.startTime.value,
      endTime: e.target.endTime.value,
      studentId: e.target.studentId.value,
      reason: e.target.reason.value,
      password: e.target.password.value,
    };

    // 인증번호 유효성 검사
    if (formData.password.length !== 4 || isNaN(Number(formData.password))) {
      alert("인증번호는 반드시 4자리 숫자여야 합니다!");
      return;
    }

    handleSave(formData); // 부모 컴포넌트의 저장 함수 호출
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {selectedDate} {dayName} <img src={editIcon} alt="Edit Icon" className={styles.editIcon} />
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>예약자 이름</label>
              <input type="text" name="name" placeholder="이름을 입력하세요" required />
            </div>
            <div className={styles.inputGroup}>
              <label>예약 시간</label>
              <div className={styles.timeGroup}>
                <select name="startTime" required>{generateTimeOptions()}</select>
                <span className={styles.timeSeparator}> ~ </span>
                <select name="endTime" required>{generateTimeOptions()}</select>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>학번</label>
              <input type="text" name="studentId" placeholder="ex) 2024XXXXXX" required />
            </div>
            <div className={`${styles.inputGroup} ${styles.textareaGroup}`}>
              <label>예약 사유</label>
              <textarea
                name="reason"
                placeholder="예약 사유를 구체적으로 적어주세요&#10;ex)창의융합설계 팀 프로젝트"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>인증번호</label>
              <input type="password" name="password" placeholder="네 자리를 입력해주세요" required />
              <span className={styles.passwordHint}>비밀번호를 꼭 기억해 주세요!</span>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" className={styles.submitButton}>
              예약하기
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;