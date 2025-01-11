import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/CheckListPage.module.css";
import Modal from "../components/Modal";

const CheckListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, studentId } = location.state || {}; // 전달받은 이름과 학번
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handleBackClick = () => {
    navigate("/check"); // /check 페이지로 이동
  };

  const calculateDay = (date) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dateObj = new Date(date);
    return dayNames[dateObj.getDay()];
  };

  const isPastDateTime = (date, endTime) => {
    const today = new Date();
    const reservationEnd = new Date(`${date}T${endTime}`);
    return reservationEnd < today; // 예약 종료 시간이 현재보다 이전이면 true
  };

  useEffect(() => {
    const fetchReservations = async () => {
      if (!name || !studentId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://diy.knucse.site/api/v1/application/reservation/student/${name}/${studentId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const reservationData = data.response.map((res) => ({
          reservationNum: res.id,
          date: res.reservationDate,
          day: calculateDay(res.reservationDate),
          startTime: res.startTime,
          endTime: res.endTime,
          time: `${res.startTime} ~ ${res.endTime}`,
          title: res.reason,
          status: res.status,
          name: res.studentName,
          studentId: res.studentNumber,
        }));

        reservationData.sort((a, b) => {
          const isAPast = isPastDateTime(a.date, a.endTime);
          const isBPast = isPastDateTime(b.date, b.endTime);
          if (isAPast !== isBPast) {
            return isAPast ? 1 : -1;
          }
          return new Date(a.date) - new Date(b.date);
        });

        setReservations(reservationData);
      } catch (err) {
        console.error(err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [name, studentId]);

  const handleDeleteClick = (reservationNum) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      setReservations((prev) =>
        prev.filter((res) => res.reservationNum !== reservationNum)
      );
    }
  };

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleSaveReservation = (updatedReservation) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.reservationNum === updatedReservation.reservationNum
          ? {
              ...res,
              date: updatedReservation.date,
              day: calculateDay(updatedReservation.date),
              startTime: updatedReservation.startTime,
              endTime: updatedReservation.endTime,
              time: `${updatedReservation.startTime} ~ ${updatedReservation.endTime}`,
              title: updatedReservation.title,
              status: "PENDING",
            }
          : res
      )
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.userInfo}>
          {name} 님의 예약 정보 {"\n"} | {studentId}
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
      {loading ? (
        <p>로딩 중...</p>
      ) : reservations.length > 0 ? (
        <div className={styles.scrollWrapper}>
          <div className={styles.scrollContainer}>
            {reservations.map((reservation) => (
              <div
                key={reservation.reservationNum}
                className={`${styles.card} ${
                  isPastDateTime(reservation.date, reservation.endTime)
                    ? styles.pastCard
                    : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <h3>{reservation.date}</h3>
                    <p className={styles.day}>{reservation.day}</p>
                  </div>
                  <span
                    className={`${styles.statusCircle} ${
                      reservation.status === "APPROVED"
                        ? styles.approved
                        : reservation.status === "PENDING"
                        ? styles.pending
                        : styles.rejected
                    }`}
                  />
                </div>
                <p className={styles.time}>{reservation.time}</p>
                <div className={styles.titleAndActions}>
                  <p className={styles.title}>{reservation.title}</p>
                  {!isPastDateTime(reservation.date, reservation.endTime) && (
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditClick(reservation)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleDeleteClick(reservation.reservationNum)
                        }
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
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
          onSave={handleSaveReservation}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckListPage;