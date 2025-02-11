import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/WeekPage.module.css";
import next from '../img/next.png';
import prev from '../img/prev.png';
import ReservationModal from "../components/ReservationModal";
import { getDayName } from "../components/ReservationModal";

const WeekPage = () => {
  const navigate = useNavigate();

  // == 날짜 함수 ==

  // 주간 시작 날짜 일요일
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  // 주간 날짜 배열 생성
  const getWeekDates = (date) => {
    const startOfWeek = getStartOfWeek(new Date(date));
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    });
  };

  // 반응형 3일 간의 날짜 생성 (어제, 오늘, 내일)
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
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜
  const [reservations, setReservations] = useState([]); // 예약 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 예약 모달 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
  const [selectedReservation, setSelectedReservation] = useState(null); // 선택된 예약 데이터
  const [isMobileView, setIsMobileView] = useState(false); // 반응형 뷰 상태
  const [centeredWeekDates, setCenteredWeekDates] = useState(getWeekDates(new Date()));


  // ====== 시간 함수 ======

  // 시간 포맷팅 (23:59:00 → 24:00)
  const formatTime = (time) => {
    if (time === "23:59:00") return "24:00";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // 날짜 형식
  const formatDateToLocalString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 시간 데이터를 그리드 위치로 변환
  const convertTimeToPosition = (time) => {
    const rowHeight = 50;
    const startHour = 0;
  
    const [start, end] = time.split(" ~ ");
    const [startHourNum, startMinute] = start.split(":").map(Number);
    const [endHourNum, endMinute] = end.split(":").map(Number);
  
    // 시작 시간 위치 계산
    const top =
      (startHourNum - startHour) * rowHeight +
      (startMinute / 60) * rowHeight + 25;
  
    // 지속 시간 계산 (분 단위)
    const durationInMinutes =
      (endHourNum - startHourNum) * 60 + (endMinute - startMinute);
    const height = (durationInMinutes / 60) * rowHeight - 5;
  
    return { top, height, durationInMinutes };
  };


  // ====== API Calls ======

  // 예약 데이터 가져오기
  const fetchReservations = async () => {
    let url;
    const targetDate = isMobileView ? new Date(selectedDate) : new Date(currentDate);

    if (isMobileView) {
      // 모바일 뷰에서 3일 기준 예약 데이터
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      url = `https://diy.knucse.site/api/v1/application/reservation/limit/${year}/${month}/${day}?minusDay=1&plusDay=1`;
    } else {
      // 데스크톱 뷰에서 주간 예약 데이터
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

  // 날짜 선택
  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
  };

  // 날짜 변경 (주간 이동)
  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  // 예약 데이터 저장
  const handleSaveReservation = async (data) => {
    setReservations((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        date: formatDateToLocalString(selectedDate),
        day: getDayName(selectedDate),
        time: `${data.startTime} ~ ${data.endTime}`,
        title: data.reason,
        status: "pending",
        authCode: data.password,
        name: data.name,
        studentId: data.studentId,
      },
    ]);
    alert("예약이 저장되었습니다!");

    await fetchReservations();
  };

  // 예약 모달 열기
  const handleOpenModal = () => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요!");
      return;
    }
    setIsModalOpen(true);
  };

  // 예약 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 팝업 열기
  const handleOpenPopup = (reservation) => {
    setSelectedReservation(reservation);
    setIsPopupOpen(true);
  };

  // 팝업 닫기
  const handleClosePopup = () => {
    setSelectedReservation(null);
    setIsPopupOpen(false);
  };


  // ====== useEffect ======

  // 예약 데이터 가져오기
  useEffect(() => {
    fetchReservations();
  }, [currentDate, selectedDate, isMobileView]);

  // 반응형 뷰 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 890);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 선택 날짜 기준 업데이트
  useEffect(() => {
    if (!isMobileView) {
      setCenteredWeekDates(getWeekDates(currentDate));
    }
  }, [currentDate, isMobileView]);


  // ====== Rendering Functions ======
  const weekDates = getWeekDates(currentDate);
  const threeDays = getThreeDays(selectedDate || new Date());
  const todayStr = new Date().toISOString().split("T")[0];

  // 시간 그리드 생성
  const renderGrid = () => {
    return Array.from({ length: 25 }, (_, i) => (
      <div key={i} className={styles.hourRow}>
        <span className={styles.hourLabel}>
          {i < 10 ? `0${i}:00` : `${i}:00`}
        </span>
      </div>
    ));
  };

  
  // 주간 컬럼 렌더링
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
          className={`${styles.dayColumn} ${isSelected ? styles.selected : ""} ${
            isToday ? styles.today : ""
          }`}
          onClick={() => setSelectedDate(day)}
        >
          <div className={styles.dayGrid}>
            {dayReservations.map((res) => {
              const { top, height, durationInMinutes } = convertTimeToPosition(
                `${formatTime(res.startTime)} ~ ${formatTime(res.endTime)}`
              );
  
              const isThirtyMinutes = durationInMinutes === 30;
  
              // reservationItem 생성
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
                        className={`${styles.statusCircle} ${
                          res.status === "APPROVED"
                            ? styles.statusComplete
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
                          className={`${styles.statusCircle} ${
                            res.status === "APPROVED"
                              ? styles.statusComplete
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

  // 팝업
  const Popup = ({ reservation, onClose }) => {
    if (!reservation) return null;
  
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div className={styles.popupLabel}>예약 정보</div>
          <div className={styles.popupContent}>
            <p>이름 &nbsp;|&nbsp; <span>{reservation.studentName}</span></p>
            <p>날짜 &nbsp;|&nbsp; <span>{reservation.reservationDate}</span></p>
            <p>시간 &nbsp;|&nbsp;{" "}
              <span>
                {`${formatTime(reservation.startTime)} ~ ${formatTime(reservation.endTime)}`}
              </span>
            </p>
            <p>사유 &nbsp;|&nbsp; <span>{reservation.reason}</span></p>
            <p>상태 &nbsp;|&nbsp; {" "}
              <span>
                {reservation.status === "PENDING"? "예약 대기중 . ."
                  : reservation.status === "APPROVED"? "예약 승인": "알 수 없음"}
              </span>
            </p>
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
      {/* 상단 버튼 */}
      <div className={styles.rightControls}>
        <button className={styles.reserveButton} onClick={handleOpenModal}>
          예약하기
        </button>
        <button className={styles.dropdownButton} onClick={() => navigate("/month")}>
          MONTH
        </button>
      </div>


      {/* 년월 + status */}
      <div className={styles.header}>
        <span className={styles.navText}>
          {currentDate.getFullYear()} . {String(currentDate.getMonth() + 1).padStart(2, "0")}
        </span>

        <div className={styles.statusLegend}>
          <div className={styles.statusItem}>
            <div className={styles.completeDot}></div>
            <span>예약 승인</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.pendingDot}></div>
            <span>예약 대기</span>
          </div>
        </div>
      </div>


      {/* 주간 달력 */}
      {isMobileView && (
        <div className={styles.dateContainer}>
          <button
            onClick={() => handleDateChange(-1)}
            className={styles.navButton}
          >
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
                className={`${styles.dateItem} ${
                  isToday ? styles.today : ""
                } ${isSelected ? styles.selected : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                  weekday: "short",
                }).toUpperCase()}
              </div>
            );
          })}
          <button
            onClick={() => handleDateChange(1)}
            className={styles.navButton}
          >
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
                className={`${styles.timelineItem} ${
                  isToday ? styles.timelineToday : ""
                }`}
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


      {/* 큰 화면 */}
      {!isMobileView && (
        <div className={styles.weekDaysContainer}>
        <button
          onClick={() => handleDateChange(-1)}
          className={styles.navButton}
        >
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

        <button
          onClick={() => handleDateChange(1)}
          className={styles.navButton}
        >
          <img src={next} alt="next" />
        </button>
      </div>
      )}

      
      {/* 시간표 */}
      <div className={styles.weekGrid}>
        <div className={styles.timeColumn}>{renderGrid()}</div>
        {renderWeekColumns()}
      </div>


      {/* 모달 및 팝업 */}
      {isModalOpen && (
        <ReservationModal
          selectedDate={formatDateToLocalString(selectedDate)}
          onClose={handleCloseModal}
          handleSave={handleSaveReservation}
        />
      )}


      {isPopupOpen && (
        <Popup
          reservation={selectedReservation}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default WeekPage;

