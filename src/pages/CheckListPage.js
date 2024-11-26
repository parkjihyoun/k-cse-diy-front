import React from "react";
import styles from "../styles/CheckListPage.module.css";

const CheckListPage = () => {
  const reservations = [
    {
      id: 1,
      date: "2024.11.14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "산사랑 연극 연습",
      status: "승인",
    },
    {
      id: 2,
      date: "2024.11.14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "동아리 회의",
      status: "대기",
    },
    {
      id: 3,
      date: "2024.11.14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "동아리 회의",
      status: "대기",
    },
    
  ];

  return (
    <div className={styles.page}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.statusCircle} ${styles.pending}`} />
          대기
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.statusCircle} ${styles.approved}`} />
          승인
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.statusCircle} ${styles.rejected}`} />
          거절
        </span>
      </div>
      <div className={styles.container}>
        <div className={styles.grid}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={styles.card}>
              {/* Header: date, day */}
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <h3>{reservation.date}</h3>
                  <p className={styles.day}>{reservation.day}</p>
                </div>
                <span
                  className={`${styles.statusCircle} ${
                    reservation.status === "승인"
                      ? styles.approved
                      : reservation.status === "대기"
                      ? styles.pending
                      : styles.rejected
                  }`}
                />
              </div>

              {/* Time */}
              <p className={styles.time}>{reservation.time}</p>

              {/* Title and Actions */}
              <div className={styles.titleAndActions}>
                <p className={styles.title}>{reservation.title}</p>
                <div className={styles.actions}>
                  <button className={styles.editBtn}>수정</button>
                  <button className={styles.deleteBtn}>삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckListPage;