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
  const [error, setError] = useState(null); // 에러 상태

  const handleBackClick = () => {
    navigate("/check"); // /check 페이지로 이동
  };

  // 날짜에 따라 요일 계산
  const calculateDay = (date) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dateObj = new Date(date);
    return dayNames[dateObj.getDay()];
  };

  // API 호출 (fetch 사용)
  useEffect(() => {
    const fetchReservations = async () => {
      if (!name || !studentId) return; // 이름과 학번이 없으면 API 호출 안 함
      setLoading(true);
      setError(null);
      try {
        // API 호출
        const response = await fetch(
          `https://diy.knucse.site/api/v1/application/reservation/student/${name}/${studentId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // JSON 데이터 파싱
        const reservationData = data.response.map((res) => ({
          reservationNum: res.id,
          date: res.reservationDate,
          day: calculateDay(res.reservationDate), // 요일 계산
          time: `${res.startTime} ~ ${res.endTime}`, // 시간 포맷팅
          title: res.reason,
          status: res.status,
          name: res.studentName,
          studentId: res.studentNumber,
        }));
        setReservations(reservationData); // 상태 업데이트
      } catch (err) {
        console.error(err);
        setError("예약 정보를 불러오는 데 실패했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };


    fetchReservations(); // 함수 호출
  }, [name, studentId]); // name, studentId가 변경될 때 호출

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
      {loading ? (
        <p>로딩 중...</p> // 로딩 중 메시지
      ) : error ? (
        <p className={styles.error}>{error}</p> // 에러 메시지 표시
      ) : reservations.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.grid}>
            {reservations.map((reservation) => (
              <div key={reservation.reservationNum} className={styles.card}>
                <p>날짜: {reservation.date}</p>
                <p>요일: {reservation.day}</p>
                <p>시간: {reservation.time}</p>
                <p>제목: {reservation.title}</p>
                <p>상태: {reservation.status}</p>
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
