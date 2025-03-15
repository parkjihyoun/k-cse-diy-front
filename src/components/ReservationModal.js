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

  // 시간 변환 함수: 24:00 → 23:59
  const adjustTime = (time) => {
    return time === "24:00" ? "23:59" : time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      studentName: e.target.name.value,
      studentNumber: e.target.studentId.value,
      reservationDate: selectedDate,
      startTime: adjustTime(e.target.startTime.value), // 시작 시간 변환
      endTime: adjustTime(e.target.endTime.value), // 종료 시간 변환
      reason: e.target.reason.value,
      authCode: e.target.password.value,
    };

    // 시작 시간이 끝나는 시간보다 크거나 같은 경우 검증
    if (formData.startTime >= formData.endTime) {
      alert("예약 시간이 잘못 설정되었습니다. 시작 시간은 끝나는 시간보다 이전이어야 합니다!");
      return;
    }

    // 인증번호 유효성 검사
    if (formData.authCode.length !== 4 || isNaN(Number(formData.authCode))) {
      alert("인증번호는 반드시 4자리 숫자여야 합니다!");
      return;
    }

    try {
      const response = await fetch("https://diy.knucse.site/api/v1/application/reservation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        handleSave(result.response); // 부모 컴포넌트의 저장 함수 호출
        onClose(); // 모달 닫기
      } else {
        const errorData = await response.json();
        switch (response.status) {
          case 404:
            alert("학생을 찾을 수 없습니다. 이름과 학번을 확인해주세요. ");
            break;
          case 409:
            if (errorData.code === "RESERVATION_DUPLICATED") {
              alert("시간이 중복되는 예약이 존재합니다. ");
            } else if (errorData.code === "DAILY_LIMIT_REACHED") {
              alert("하루에 하나의 예약만 가능합니다. ");
            }
            break;
          case 400:
            if (errorData.code === "AUTHENTICATION_CODE_MUST_BE_4_DIGITS") {
              alert("인증 코드는 4자리 숫자여야 합니다. ");
            } else if (errorData.code === "INVALID_RESERVATION_TIME") {
              alert("예약 시간이 잘못 설정되었습니다. 시작 시간은 끝나는 시간보다 이전이어야 합니다.");
            } else if (errorData.code == "RESERVATION_DATE_OUT_OF_RANGE") {
              alert("현재 시간으로부터 4주 이내의 날짜만 예약할 수 있습니다.");
            }
            break;
          default:
            alert(`예약 실패: ${errorData.message}`);
        }
      }
    } catch (error) {
      alert(`예약 중 오류가 발생했습니다: ${error.message}`);
    }
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
              <label>학번</label>
              <input type="text" name="studentId" placeholder="ex) 2024XXXXXX" required />
            </div>
            <div className={styles.inputGroup}>
              <label>예약 시간</label>
              <div className={styles.timeGroup}>
                <select name="startTime" required>{generateTimeOptions()}</select>
                <span className={styles.timeSeparator}> ~ </span>
                <select name="endTime" required>{generateTimeOptions()}</select>
              </div>
            </div>
            <div className={`${styles.inputGroup} ${styles.textareaGroup}`}>
              <label>예약 사유</label>
              <textarea
                className={styles.textareaPlaceholder}
                name="reason"
                placeholder={`예약 사유를 구체적으로 적어주세요\nex) 창의융합설계 팀 프로젝트`}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>인증번호</label>
              <input type="password" name="password" placeholder="네 자리를 입력해주세요" required />
              <span className={styles.passwordHint}>인증번호를 꼭 기억해 주세요!</span>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              예약하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;