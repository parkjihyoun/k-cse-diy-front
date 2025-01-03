import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from "../styles/CheckListPage.module.css";
import Modal from "../components/Modal";

const CheckListPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
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
      time: "15:00 ~ 17:00",
      title: "동아리 회의",
      status: "대기",
      authCode: "5678",
      name: "최예윤",
      studentId: "2023000002",
    },
    {
      reservationNum: 3,
      date: "2024-11-15",
      day: "FRI",
      time: "09:00 ~ 11:00",
      title: "스터디 모임",
      status: "승인",
      authCode: "9101",
      name: "최원아",
      studentId: "2023000003",
    },
    {
      reservationNum: 4,
      date: "2024-11-16",
      day: "SAT",
      time: "14:00 ~ 16:00",
      title: "프로젝트 회의",
      status: "대기",
      authCode: "0000",
      name: "호예찬",
      studentId: "2023000004",
    },
    {
      reservationNum: 5,
      date: "2024-11-17",
      day: "SUN",
      time: "10:00 ~ 12:00",
      title: "운동 모임",
      status: "승인",
      authCode: "2222",
      name: "박지현",
      studentId: "2023000001",
    },
    {
      reservationNum: 6,
      date: "2024-11-18",
      day: "MON",
      time: "13:00 ~ 15:00",
      title: "프로젝트 리뷰",
      status: "대기",
      authCode: "3333",
      name: "최예윤",
      studentId: "2023000002",
    },
    {
      reservationNum: 7,
      date: "2024-11-19",
      day: "TUE",
      time: "16:00 ~ 18:00",
      title: "스터디 발표 준비",
      status: "승인",
      authCode: "4444",
      name: "최원아",
      studentId: "2023000003",
    },
    {
      reservationNum: 8,
      date: "2024-11-20",
      day: "WED",
      time: "11:00 ~ 13:00",
      title: "팀 회의",
      status: "대기",
      authCode: "5555",
      name: "호예찬",
      studentId: "2023000004",
    },
    {
      reservationNum: 9,
      date: "2024-11-21",
      day: "THU",
      time: "08:00 ~ 10:00",
      title: "아침 조깅",
      status: "승인",
      authCode: "6666",
      name: "박지현",
      studentId: "2023000001",
    },
    {
      reservationNum: 10,
      date: "2024-11-22",
      day: "FRI",
      time: "14:00 ~ 16:00",
      title: "개발 스터디",
      status: "대기",
      authCode: "7777",
      name: "최예윤",
      studentId: "2023000002",
    },
    {
      reservationNum: 11,
      date: "2024-11-23",
      day: "SAT",
      time: "09:00 ~ 11:00",
      title: "스터디 회의",
      status: "승인",
      authCode: "8888",
      name: "최원아",
      studentId: "2023000003",
    },
    {
      reservationNum: 12,
      date: "2024-11-24",
      day: "SUN",
      time: "10:00 ~ 12:00",
      title: "독서 모임",
      status: "대기",
      authCode: "9999",
      name: "호예찬",
      studentId: "2023000004",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleBackClick = () => {
    navigate("/check"); // /check 페이지로 이동
  };
  const calculateDay = (date) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dateObj = new Date(date);
    return dayNames[dateObj.getDay()];
  };

  React.useEffect(() => {
    const updatedReservations = reservations.map((res) => ({
      ...res,
      day: calculateDay(res.date),
    }));
    setReservations(updatedReservations);
  }, []);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.name === name && reservation.studentId === studentId
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.userInfo}>
          {name}{"\n"}{studentId} 님의 예약 정보
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
                {/* 예약 정보 카드 */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noResultsContainer}>
          <p className={styles.noResults}>
            해당 이름과 학번으로 등록된 예약이 없습니다.
          </p>
          <button className={styles.backBtn} onClick={handleBackClick}>
            이전으로
          </button>
        </div>
      )}

      {isModalOpen && (
        <Modal
          type={modalType}
          reservation={selectedReservation}
          onAuthenticate={(inputCode) =>
            String(inputCode) === String(selectedReservation?.authCode)
          }
          onSave={(updatedReservation) => {
            const updatedDay = calculateDay(updatedReservation.date);
            setReservations((prev) =>
              prev.map((res) =>
                res.reservationNum === updatedReservation.reservationNum
                  ? {
                      ...res,
                      ...updatedReservation,
                      day: updatedDay,
                      status: "대기",
                    }
                  : res
              )
            );
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckListPage;