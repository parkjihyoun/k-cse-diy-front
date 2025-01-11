import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/CheckListPage.module.css";
import Modal from "../components/Modal";

const CheckListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, studentId } = location.state || {};
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [rejectionReason, setRejectionReason] = useState(""); // 거절 사유 상태 추가
  const [showRejectionModal, setShowRejectionModal] = useState(false); // 거절 사유 팝업 상태

  const [authCodeInput, setAuthCodeInput] = useState(""); // 인증번호 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [pageSize, setPageSize] = useState(window.innerWidth <= 770 ? 2 : 4); // 모바일은 2개씩, 데스크탑은 6개씩

  useEffect(() => {
    const handleResize = () => {
      const newPageSize = window.innerWidth <= 770 ? 2 : 4;
      setPageSize(newPageSize);

      // 현재 페이지에서 잘리는 경우 첫 페이지로 리셋
      const maxPage = Math.ceil(reservations.length / newPageSize) - 1;
      if (currentPage > maxPage) {
        setCurrentPage(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, reservations]);

  const handleBackClick = () => {
    navigate("/check");
  };

  const calculateDay = (date) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dateObj = new Date(date);
    return dayNames[dateObj.getDay()];
  };

  const isPastDateTime = (date, endTime) => {
    const today = new Date();
    const reservationEnd = new Date(`${date}T${endTime}`);
    return reservationEnd < today;
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
          reservationId: res.id,
          date: res.reservationDate,
          day: calculateDay(res.reservationDate),
          startTime: res.startTime.slice(0, 5), // 초 제거
          endTime: res.endTime.slice(0, 5), // 초 제거
          time: `${res.startTime.slice(0, 5)} ~ ${res.endTime.slice(0, 5)}`,
          title: res.reason,
          status: res.status,
          rejectionReason: res.cancelledReason || "사유가 제공되지 않았습니다.", // 거절 사유 추가
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

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (reservationId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const authCode = prompt("인증 코드를 입력해주세요:");
        if (!authCode) return;

        const response = await fetch(
          `https://diy.knucse.site/api/v1/application/reservation`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reservationId, authCode }),
          }
        );
        console.log(authCode);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setReservations((prev) =>
          prev.filter((res) => res.reservationId !== reservationId)
        );
        alert("삭제가 완료되었습니다.");
      } catch (error) {
        alert("인증번호가 틀립니다.");
      }
    }
  };

  const handleSaveReservation = async (updatedReservation) => {
    try {
      const response = await fetch(
        `https://diy.knucse.site/api/v1/application/reservation/update`,
        {
          method: "PATCH", // PATCH 사용
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: updatedReservation.reservationId,
            startTime: updatedReservation.startTime,
            endTime: updatedReservation.endTime,
            reason: updatedReservation.title,
            authCode: updatedReservation.authCode, // 인증 코드 추가
          }),
        }
      );
      console.log('tlqkf', updatedReservation.authCode);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setReservations((prev) =>
        prev.map((res) =>
          res.reservationId === updatedReservation.reservationId
            ? { ...res, ...updatedReservation, status: "PENDING" }
            : res
        )
      );

      alert("수정이 성공적으로 완료되었습니다!");
    } catch (error) {
      console.error(error);
      alert("수정 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleRejectionClick = (reason) => {
    setRejectionReason(reason);
    console.log('reason', reason);
    console.log('rejectionReason', rejectionReason);
    setShowRejectionModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setRejectionReason("");
  };

  const totalPages = Math.ceil(reservations.length / pageSize);
  const displayedReservations = reservations.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

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
          <div className={styles.cardContainer}>
            {displayedReservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className={`${styles.card} ${isPastDateTime(reservation.date, reservation.endTime)
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
                    className={`${styles.statusCircle} ${reservation.status === "APPROVED"
                      ? styles.approved
                      : reservation.status === "PENDING"
                        ? styles.pending
                        : reservation.status === "CANCELLED"
                          ? styles.rejected
                          : ""
                      }`}
                  />
                </div>
                <p className={styles.time}>{reservation.time}</p>
                <div className={styles.titleAndActions}>
                  <p className={styles.title}>{reservation.title}</p>
                  {!isPastDateTime(reservation.date, reservation.endTime) && (
                    <div className={styles.actions}>
                      {reservation.status === "CANCELLED" ? (
                        <button
                          className={styles.reasonBtn}
                          onClick={() =>
                            handleRejectionClick(reservation.rejectionReason)
                          }
                        >
                          사유
                        </button>
                      ) : (
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditClick(reservation)}
                        >
                          수정
                        </button>
                      )}
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleDeleteClick(reservation.reservationId)
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
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={styles.pageButton}
            >
              ❮
            </button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={styles.pageButton}
            >
              ❯
            </button>
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

      {/* 사유 팝업 */}
      {showRejectionModal && (
        <div className={styles.rejectionModal}>
          <div className={styles.modalContent}>
            <span>거절 사유</span>
            <p>{rejectionReason}</p>
            <button onClick={closeRejectionModal}>닫기</button>
          </div>
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
