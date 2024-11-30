import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/CheckListPage.module.css";
import Modal from "../components/Modal";

const CheckListPage = () => {
  const location = useLocation();
  const { name, studentId } = location.state || {}; // 전달받은 이름과 학번

  const [reservations, setReservations] = useState([
    {
      reservationNum: 1,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "산사랑 연극 연습",
      status: "승인",
      authCode: "1234",
      name: "박지현",
      studentId: "2023000001",
    },
    {
      reservationNum: 2,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "동아리 회의",
      status: "대기",
      authCode: "5678",
      name: "최예윤",
      studentId: "2023000002",
    },
    {
      reservationNum: 3,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "스터디 모임",
      status: "대기",
      authCode: "9101",
      name: "최원아",
      studentId: "2023000003",
    },
    {
      reservationNum: 4,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "스터디 모임",
      status: "대기",
      authCode: "0000",
      name: "호예찬",
      studentId: "2023000004",
    },
    {
      reservationNum: 5,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "산사랑 연극 연습",
      status: "승인",
      authCode: "1233",
      name: "박지현",
      studentId: "2023000001",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("auth");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.name === name && reservation.studentId === studentId
  );

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setModalType("auth");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (reservationId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      setReservations((prevReservations) =>
        prevReservations.filter((res) => res.reservationNum !== reservationId)
      );
    }
  };

  const handleAuthentication = (inputCode) => {
    if (inputCode === selectedReservation.authCode) {
      setModalType("edit");
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleSave = (updatedReservation) => {
    const dayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const updatedDay = dayMap[new Date(updatedReservation.date).getDay()];

    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.reservationNum === updatedReservation.reservationNum
          ? {
              ...res,
              date: updatedReservation.date,
              day: updatedDay,
              time: `${updatedReservation.startTime} ~ ${updatedReservation.endTime}`,
              title: updatedReservation.title,
              status: "대기",
            }
          : res
      )
    );
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("auth");
    setSelectedReservation(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.userInfo}>
          {name} | {studentId} 님의 예약 정보
        </p>
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
      </div>
      {filteredReservations.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.grid}>
            {filteredReservations.map((reservation) => (
              <div key={reservation.reservationNum} className={styles.card}>
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
                <p className={styles.time}>{reservation.time}</p>
                <div className={styles.titleAndActions}>
                  <p className={styles.title}>{reservation.title}</p>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditClick(reservation)}
                    >
                      수정
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteClick(reservation.reservationNum)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.noResults}>
          해당 이름과 학번으로 등록된 예약이 없습니다.
        </p>
      )}

      {isModalOpen && (
        <Modal
          type={modalType}
          reservation={selectedReservation}
          onAuthenticate={handleAuthentication}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CheckListPage;