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

  // 날짜에 따라 요일 계산
  const calculateDay = (date) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dateObj = new Date(date);
    return dayNames[dateObj.getDay()];
  };

  // 날짜와 요일 포함한 포맷
  const calculateDayWithDate = (date) => {
    const day = calculateDay(date);
    return `${date} (${day})`; // "YYYY-MM-DD (DAY)" 형식
  };

  // API 호출 (fetch 사용)
  useEffect(() => {
    const fetchReservations = async () => {
      if (!name || !studentId) return; // 이름과 학번이 없으면 API 호출 안 함
      setLoading(true);
      try {
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
          startTime: res.startTime, // 시작 시간
          endTime: res.endTime, // 종료 시간
          time: `${res.startTime} ~ ${res.endTime}`, // 시간 포맷팅
          title: res.reason,
          status: res.status,
          name: res.studentName,
          studentId: res.studentNumber,
        }));
        setReservations(reservationData); // 상태 업데이트
      } catch (err) {
        console.error(err);
        setReservations([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchReservations(); // 함수 호출
  }, [name, studentId]); // name, studentId가 변경될 때 호출

  const handleDeleteClick = (reservationNum) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      setReservations((prev) =>
        prev.filter((res) => res.reservationNum !== reservationNum)
      );
    }
  };

  const handleEditClick = (reservation) => {
    setSelectedReservation({
      ...reservation,
      dateWithDay: calculateDayWithDate(reservation.date), // 날짜와 요일 추가
    });
    setModalType("edit");
    setIsModalOpen(true);
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
        <p>로딩 중...</p> // 로딩 중 메시지
      ) : reservations.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.grid}>
            {reservations.map((reservation) => (
              <div key={reservation.reservationNum} className={styles.card}>
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
          onSave={async (updatedReservation) => {
            try {
              const response = await fetch(
                `https://diy.knucse.site/api/v1/application/reservation/update/${updatedReservation.reservationNum}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    date: updatedReservation.date,
                    startTime: updatedReservation.startTime,
                    endTime: updatedReservation.endTime,
                    reason: updatedReservation.title,
                  }),
                }
              );
          
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const updatedData = await response.json();
          
              // 로컬 상태 갱신
              setReservations((prev) =>
                prev.map((res) =>
                  res.reservationNum === updatedData.id
                    ? {
                        ...res,
                        date: updatedData.reservationDate,
                        day: calculateDay(updatedData.reservationDate),
                        startTime: updatedData.startTime,
                        endTime: updatedData.endTime,
                        title: updatedData.reason,
                        status: "PENDING", // 수정 후 기본 상태는 "대기"
                      }
                    : res
                )
              );
              setIsModalOpen(false);
            } catch (error) {
              console.error("Reservation update failed:", error);
              alert("예약 수정에 실패했습니다. 다시 시도해주세요.");
            }
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckListPage;