import React from "react";
import styles from "../styles/ReservationModal.module.css";

const ReservationModal = ({ onClose }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>예약하기</h2>
        <p>여기에 예약 입력 폼이 들어갑니다.</p>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;