import React, { useState } from "react";
import styles from "../styles/CheckListPage.module.css";
import Modal from "../components/Modal";

const CheckListPage = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "산사랑 연극 연습",
      status: "승인",
    },
    {
      id: 2,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "동아리 회의",
      status: "대기",
    },
    {
      id: 3,
      date: "2024-11-14",
      day: "THU",
      time: "12:00 ~ 14:00",
      title: "동아리 회의",
      status: "대기",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [modalType, setModalType] = useState("auth"); // 'auth' or 'edit'
  const [selectedReservation, setSelectedReservation] = useState(null);

  // 수정 버튼 클릭 시 인증 모달 열기
  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation); // 선택된 예약 정보 저장
    setModalType("auth"); // 인증 모달로 설정
    setIsModalOpen(true); // 모달 열기
  };

  // 삭제 버튼 클릭 시
  const handleDeleteClick = (reservationId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      setReservations((prevReservations) =>
        prevReservations.filter((res) => res.id !== reservationId)
      );
    }
  };

  // 인증 처리
  const handleAuthentication = (inputCode) => {
    const correctCode = "1234"; // 인증번호
    if (inputCode === correctCode) {
      setModalType("edit"); // 인증 성공 시 수정 모달로 변경
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  // 수정 내용 저장 처리
  const handleSave = (updatedReservation) => {
    const dayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const updatedDay = dayMap[new Date(updatedReservation.date).getDay()]; // 요일 계산

    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === updatedReservation.id
          ? {
              ...res,
              date: updatedReservation.date,
              day: updatedDay,
              time: `${updatedReservation.startTime} ~ ${updatedReservation.endTime}`,
              title: updatedReservation.title,
              status: "대기", // 수정 시 상태를 대기로 변경
            }
          : res
      )
    );
    closeModal(); // 모달 닫기
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("auth"); // 초기 상태로 리셋
    setSelectedReservation(null); // 선택된 예약 초기화
  };

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
                    onClick={() => handleDeleteClick(reservation.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <Modal
          type={modalType} // 모달 타입 (인증 or 수정)
          reservation={selectedReservation}
          onAuthenticate={handleAuthentication}
          onSave={handleSave} // 수정 저장 처리
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CheckListPage;