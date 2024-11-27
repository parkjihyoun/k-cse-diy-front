import React, { useState } from 'react';
import styles from '../styles/KeyPage.module.css';

const KeyPage = () => {
  const [status, setStatus] = useState("대여가능"); // 초기 상태 설정

  const handleBorrowKey = () => {
    setStatus("대여중");
  };

  const handleReturnKey = () => {
    setStatus("대여가능");
  };

  return (
    <div className={styles.page}>
      {/* 상태 표시 */}
      <div className={styles.checkkey}>
        <div className={styles.item} onClick={() => setStatus("대여가능")}>
          <span className={styles.canlent}>대여가능</span>
          <span className={`${styles.statusCircle} ${styles.canlentCircle}`} />
        </div>
        <div className={styles.item} onClick={() => setStatus("대여중")}>
          <span className={styles.using}>대여중</span>
          <span className={`${styles.statusCircle} ${styles.usingCircle}`} />
        </div>
        <div className={styles.item} onClick={() => setStatus("미반납")}>
          <span className={styles.didntreturn}>미반납</span>
          <span className={`${styles.statusCircle} ${styles.didntreturnCircle}`} />
        </div>
      </div>

      {/* 중앙 박스 */}
      <div className={styles.centerBox}>
        <h2 className={styles.roomTitle}>
          D.I.Y실
          <span 
            className={`${styles.statusCircle2} ${
              status === "대여가능"
                ? styles.canlentCircle
                : status === "대여중"
                ? styles.usingCircle
                : styles.didntreturnCircle
            }`} 
          />
        </h2>
        <p className={styles.roomSubtitle}>D.I.Y Room’s key</p>
        <hr className={styles.separator} />
        <p className={styles.lastUserTitle}>Last User</p>
        <p className={styles.lastUser}>호예찬</p>
        <p className={styles.eventTitle}>산사랑 연극 연습</p>
        <div className={styles.locationContainer}>
          <p className={styles.locationBox}>IT4호관 과사무실 반납완료</p>
          <p className={styles.date}>2024-11-14 18:55:57</p>
</div>

      </div>

      {/* 버튼 추가 */}
      <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={handleBorrowKey}>
            열쇠 대여하기
          </button>
          <button className={styles.actionButton} onClick={handleReturnKey}>
            열쇠 반납하기
          </button>
        </div>
    </div>
  );
};

export default KeyPage;
