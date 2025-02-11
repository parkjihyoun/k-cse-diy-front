import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AdminWeekPage.module.css";
import next from '../../img/next.png';
import prev from '../../img/prev.png';

const AdminWeekPage = () => {
  const navigate = useNavigate();

  // == 날짜 함수 ==
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const getWeekDates = (date) => {
    const startOfWeek = getStartOfWeek(new Date(date));
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    });
  };

  const getThreeDays = (date) => {
    const todayIndex = 1;
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - todayIndex);
    return Array.from({ length: 3 }, (_, i) => {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      return newDate;
    });
  };

  // ====== State ======
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [centeredWeekDates, setCenteredWeekDates] = useState(getWeekDates(new Date()));

  // ====== 시간 함수 ======
  const formatTime = (time) => {
    if (time === "23:59:00") return "24:00";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDateToLocalString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertTimeToPosition = (time) => {
    const rowHeight = 50;
    const startHour = 0;
    const [start, end] = time.split(" ~ ");
    const [startHourNum, startMinute] = start.split(":").map(Number);
    const [endHourNum, endMinute] = end.split(":").map(Number);
    const top =
      (startHourNum - startHour) * rowHeight +
      (startMinute / 60) * rowHeight + 25;
    const durationInMinutes =
      (endHourNum - startHourNum) * 60 + (endMinute - startMinute);
    const height = (durationInMinutes / 60) * rowHeight - 5;
    return { top, height, durationInMinutes };
  };

  // ====== API Calls ======
  const fetchReservations = async () => {
    let url;
    const targetDate = isMobileView ? new Date(selectedDate) : new Date(currentDate);
    if (isMobileView) {
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      url = `https://diy.knucse.site/api/v1/application/reservation/limit/${year}/${month}/${day}?minusDay=1&plusDay=1`;
    } else {
      const startOfWeek = getStartOfWeek(targetDate);
      const year = startOfWeek.getFullYear();
      const month = String(startOfWeek.getMonth() + 1).padStart(2, "0");
      const day = String(startOfWeek.getDate()).padStart(2, "0");
      url = `https://diy.knucse.site/api/v1/application/reservation/limit/${year}/${month}/${day}?minusDay=0&plusDay=6`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("예약 데이터를 가져오는 데 실패했습니다.");
      const data = await response.json();
      setReservations(data.response || []);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setReservations([]);
    }
  };

  // ====== Event Handlers ======
  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  // 예약 승인 시 예약 상태 변경 및 팝업 닫기
  const handleApproveReservation = async (reservationId, reservationStatus) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://diy.knucse.site/api/v1/admin/reservation/treatment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ reservationId, reservationStatus }),
      }
      );

      if (!response.ok) {
        throw new Error("예약 승인 실패");
      }

      setReservations((prev) =>
        prev.map((res) => (res.id === reservationId ? { ...res, status: reservationStatus } : res))
      );
    } catch (err) {
      console.log(err);
    } finally {
      handleClosePopup();
    }
  };

  // 예약 거절 시 거절 사유 입력 후 예약 상태 변경 및 팝업 닫기
  const handleRejectReservation = async (reservationId, reservationStatus) => {
    const token = localStorage.getItem("token");
    const cancelledReason = prompt("거절 사유를 입력해주세요.");
    if (!cancelledReason) {
      alert("거절 사유를 입력해야 합니다.");
      return;
    }
    console.log(reservationId);
    console.log(cancelledReason);

    try {
      const response = await fetch(
        `https://diy.knucse.site/api/v1/admin/reservation/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ reservationId, cancelledReason }),
      }
      );

      if (!response.ok) {
        throw new Error("예약 거절 실패");
      }

      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: reservationStatus, cancelledReason } : res
        )
      );

    } catch (err) {
      console.log(err);
    } finally {
      handleClosePopup();
    }
  };



  const handleOpenPopup = (reservation) => {
    setSelectedReservation(reservation);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedReservation(null);
    setIsPopupOpen(false);
  };

  // ====== useEffect ======
  useEffect(() => {
    fetchReservations();
  }, [currentDate, selectedDate, isMobileView]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 890);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileView) {
      setCenteredWeekDates(getWeekDates(currentDate));
    }
  }, [currentDate, isMobileView]);

  // ====== Rendering Functions ======
  const weekDates = getWeekDates(currentDate);
  const threeDays = getThreeDays(selectedDate || new Date());
  const todayStr = new Date().toISOString().split("T")[0];

  const renderGrid = () => {
    return Array.from({ length: 25 }, (_, i) => (
      <div key={i} className={styles.hourRow}>
        <span className={styles.hourLabel}>
          {i < 10 ? `0${i}:00` : `${i}:00`}
        </span>
      </div>
    ));
  };

  const renderWeekColumns = () => {
    const displayedDates = isMobileView ? threeDays : centeredWeekDates;
    return displayedDates.map((day, index) => {
      const dateString = day.toISOString().split("T")[0];
      const dayReservations = reservations.filter(
        (r) => r.reservationDate === dateString
      );
      const isSelected =
        selectedDate && selectedDate.toISOString().split("T")[0] === dateString;
      const isToday = todayStr === dateString;
      return (
        <div
          key={index}
          className={`${styles.dayColumn} ${isSelected ? styles.selected : ""} ${isToday ? styles.today : ""
            }`}
          onClick={() => setSelectedDate(day)}
        >
          <div className={styles.dayGrid}>
            {dayReservations.map((res) => {
              const { top, height, durationInMinutes } = convertTimeToPosition(
                `${formatTime(res.startTime)} ~ ${formatTime(res.endTime)}`
              );
              const isThirtyMinutes = durationInMinutes === 30;
              return (
                <div
                  key={res.id}
                  className={styles.reservationItem}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onClick={() => handleOpenPopup(res)}
                >
                  {isThirtyMinutes && (
                    <div className={styles.reservationDetailsthirty}>
                      <span className={styles.reservationName}>
                        {res.studentName}
                      </span>
                      <span
                        className={`${styles.statusCircle} ${res.status === "APPROVED"
                          ? styles.statusComplete
                          : res.status === "CANCELLED"
                            ? styles.statusRejected
                            : styles.statusPending
                          }`}
                      ></span>
                    </div>
                  )}
                  {!isThirtyMinutes && (
                    <>
                      <div className={styles.reservationDetails}>
                        <span className={styles.reservationName}>
                          {res.studentName}
                        </span>
                        <span
                          className={`${styles.statusCircle} ${res.status === "APPROVED"
                            ? styles.statusComplete
                            : res.status === "CANCELLED"
                              ? styles.statusRejected
                              : styles.statusPending
                            }`}
                        ></span>
                      </div>
                      <span className={styles.reservationTitle}>
                        {res.reason}
                      </span>
                      <span className={styles.reservationTime}>
                        {`${formatTime(res.startTime)} ~ ${formatTime(res.endTime)}`}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  // 팝업창 (팝업에도 거절 사유가 보이도록 함)
  const Popup = ({ reservation, onClose }) => {
    if (!reservation) return null;
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div className={styles.popupLabel}>예약 정보</div>
          <div className={styles.popupContent}>
            <p>
              이름 &nbsp;|&nbsp; <span>{reservation.studentName}</span>
            </p>
            <p>
              날짜 &nbsp;|&nbsp; <span>{reservation.reservationDate}</span>
            </p>
            <p>
              시간 &nbsp;|&nbsp;{" "}
              <span>
                {`${formatTime(reservation.startTime)} ~ ${formatTime(reservation.endTime)}`}
              </span>
            </p>
            <p>
              사유 &nbsp;|&nbsp; <span>{reservation.reason}</span>
            </p>
            <p>
              상태 &nbsp;|&nbsp;{" "}
              <span>
                {reservation.status === "PENDING"
                  ? "예약 대기중 . ."
                  : reservation.status === "APPROVED"
                    ? "예약 승인"
                    : `예약 거절${reservation.cancelledReason ? " (거절 사유 : " + reservation.cancelledReason : ""})`}
              </span>
            </p>
          </div>
          <div className={styles.actionButtons}>
            <button
              onClick={() => handleApproveReservation(reservation.id, "APPROVED")}
              className={styles.approveButton}
            >
              승인
            </button>
            <button
              onClick={() => handleRejectReservation(reservation.id, "CANCELLED")}
              className={styles.rejectButton}
            >
              거절
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    );
  };

  // ====== Main ======
  return (
    <div className={styles.page}>
      <div className={styles.rightControls}>
        <button className={styles.dropdownButton} onClick={() => navigate("/admin/month")}>
          MONTH
        </button>
      </div>

      <div className={styles.header}>
        <span className={styles.navText}>
          {currentDate.getFullYear()} . {String(currentDate.getMonth() + 1).padStart(2, "0")}
        </span>
        <div className={styles.statusLegend}>
          <div className={styles.statusItem}>
            <div className={styles.completeDot}></div>
            <span>예약 완료</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.pendingDot}></div>
            <span>예약 대기</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.rejectedDot}></div>
            <span>예약 거절</span>
          </div>
        </div>
      </div>

      {isMobileView && (
        <div className={styles.dateContainer}>
          <button onClick={() => handleDateChange(-1)} className={styles.navButton}>
            <img src={prev} alt="prev" />
          </button>
          {weekDates.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isToday = todayStr === dateString;
            const isSelected =
              selectedDate instanceof Date &&
              selectedDate.toISOString().split("T")[0] === dateString;
            return (
              <div
                key={index}
                className={`${styles.dateItem} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                  weekday: "short",
                }).toUpperCase()}
              </div>
            );
          })}
          <button onClick={() => handleDateChange(1)} className={styles.navButton}>
            <img src={next} alt="next" />
          </button>
        </div>
      )}

      {isMobileView && (
        <div className={styles.timelineContainer}>
          {threeDays.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isToday = todayStr === dateString;
            return (
              <div
                key={index}
                className={`${styles.timelineItem} ${isToday ? styles.timelineToday : ""}`}
              >
                <span className={styles.timelineDate}>
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                    weekday: "short",
                  }).toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!isMobileView && (
        <div className={styles.weekDaysContainer}>
          <button onClick={() => handleDateChange(-1)} className={styles.navButton}>
            <img src={prev} alt="prev" />
          </button>
          <div className={styles.weekDaysHeader}>
            {centeredWeekDates.map((day, index) => (
              <div key={index} className={styles.dateHeader}>
                <div>
                  {day.toLocaleDateString("en-US", { day: "numeric", weekday: "short" }).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => handleDateChange(1)} className={styles.navButton}>
            <img src={next} alt="next" />
          </button>
        </div>
      )}

      {/* 시간표 */}
      <div className={styles.weekGrid}>
        <div className={styles.timeColumn}>{renderGrid()}</div>
        {renderWeekColumns()}
      </div>

      {isPopupOpen && (
        <Popup reservation={selectedReservation} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default AdminWeekPage;