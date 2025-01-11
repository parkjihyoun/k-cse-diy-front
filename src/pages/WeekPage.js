import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/WeekPage.module.css";
import ReservationModal from "../components/ReservationModal";
import { getDayName } from "../components/ReservationModal";
import next from '../img/next.png';
import prev from '../img/prev.png';


const WeekPage = () => {
  const navigate = useNavigate();

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day; // Start from Sunday
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
    // Ensure the date is a Date object
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert if not a Date object
    }
  
    const todayIndex = 1; // 오늘을 기준으로 왼쪽 하루, 오른쪽 하루 추가
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - todayIndex);
  
    return Array.from({ length: 3 }, (_, i) => {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      return newDate;
    });
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
  const [selectedReservation, setSelectedReservation] = useState(null); // 선택한 예약 정보
  const [reservations, setReservations] = useState([]);
  const [centeredWeekDates, setCenteredWeekDates] = useState(
    getWeekDates(currentDate, isMobileView)
  );


  // API 호출
  useEffect(() => {
    const fetchReservations = async () => {
      let url = "";
      let targetDate = isMobileView ? new Date(selectedDate) : new Date(currentDate);
  
      if (isMobileView) {
        // 반응형일 때
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const day = String(targetDate.getDate()).padStart(2, "0");
        url = `https://diy.knucse.site/api/v1/application/reservation/limit/${year}/${month}/${day}?minusDay=1&plusDay=1`;
      } else {
        // 큰 화면일 때
        const startOfWeek = getStartOfWeek(targetDate); // 주의 시작일 (일요일)
        const year = startOfWeek.getFullYear();
        const month = String(startOfWeek.getMonth() + 1).padStart(2, "0");
        const day = String(startOfWeek.getDate()).padStart(2, "0");
        url = `https://diy.knucse.site/api/v1/application/reservation/limit/${year}/${month}/${day}?minusDay=0&plusDay=6`;
      }
  
      console.log("API 호출 URL:", url);
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("예약 데이터를 가져오는 데 실패했습니다.");
        }
  
        const data = await response.json();
        console.log("API 응답 데이터:", data);
  
        if (data.response && Array.isArray(data.response)) {
          setReservations(data.response);
        } else {
          console.error("API 응답 형식이 올바르지 않습니다:", data);
          setReservations([]);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
        setReservations([]);
      }
    };
  
    fetchReservations();
  }, [currentDate, selectedDate, isMobileView]);


  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600;
      setIsMobileView(isMobile);
    };

    handleResize(); // 초기 로드 시 실행
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 추가
    return () => window.removeEventListener("resize", handleResize); // 리스너 정리

    setSelectedDate(new Date());
  }, []);

  // useEffect to update centeredWeekDates when currentDate changes
  useEffect(() => {
    if (!isMobileView) {
      setCenteredWeekDates(getWeekDates(currentDate));
    }
  }, [currentDate, isMobileView]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":"); // 시간과 분만 추출
    return `${hours}:${minutes}`; // HH:mm 형식으로 반환
  };


  const handleOpenModal = () => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요!");
      return;
    }
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleSaveReservation = (data) => {
    setReservations((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        date: formatDateToLocalString(selectedDate),
        day: getDayName(selectedDate), // 요일
        time: `${data.startTime} ~ ${data.endTime}`, // 시간 범위
        title: data.reason, // 예약 사유
        status: "pending",
        authCode: data.password, // 인증번호
        name: data.name, // 예약자 이름
        studentId: data.studentId, // 학번
      },
    ]);
    alert("예약이 저장되었습니다!");
  };

  const handleViewChange = (view) => {
    if (view === "Month") {
      navigate("/month");
    } else {
      setSelectedView(view);
    }
  };

  

  const startOfWeek = getStartOfWeek(new Date(currentDate));


  const formatDateToLocalString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7); // 한 주씩 이동
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    setSelectedDate(date);
  };


  const weekDates = getWeekDates(currentDate); // 주간 7일
  const threeDays = getThreeDays(selectedDate || new Date());
  const todayStr = new Date().toISOString().split("T")[0];


  const convertTimeToPosition = (time) => {
    const rowHeight = isMobileView ? 50 : 50; // 반응형 여부에 따라 높이 결정
    const startHour = 0; // 시작 시간 기준 (0:00 AM)
  
    const [start, end] = time.split(" ~ ");
    const [startHourNum, startMinute] = start.split(":").map(Number);
    const [endHourNum, endMinute] = end.split(":").map(Number);
  
    // 시작 시간 위치 계산
    const top =
      (startHourNum - startHour) * rowHeight +
      (startMinute / 60) * rowHeight + 20;
  
    // 지속 시간 계산 (분 단위)
    const durationInMinutes =
      (endHourNum - startHourNum) * 60 + (endMinute - startMinute);
    const height = (durationInMinutes / 60) * rowHeight - 5;
  
    return { top, height, durationInMinutes };
  };

  const renderGrid = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0부터 23까지
  
    return hours.map((hour) => (
      <div key={hour} className={styles.hourRow}>
        <span className={styles.hourLabel}>
          {hour < 10 ? `0${hour}:00` : `${hour}:00`}
        </span>
      </div>
    ));
  };

  const getLocalDate = (dateString) => {
    if (!dateString) {
      console.error("Invalid reservationDate:", dateString);
      return null; // Return null if dateString is invalid
    }
  
    const utcDate = new Date(dateString + "T00:00:00Z");
    if (isNaN(utcDate.getTime())) {
      console.error("Invalid Date object from:", dateString);
      return null; // Return null for invalid Date objects
    }
  
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  };


  const renderWeekColumns = () => {
    const displayedDates = isMobileView ? threeDays : centeredWeekDates;
  
    return displayedDates.map((day, index) => {
      const dateString = day.toISOString().split("T")[0];
      const dayReservations = reservations.filter((r) => {
        const localDate = getLocalDate(r.reservationDate);
        if (!localDate) {
          console.error("Skipping invalid reservation:", r);
          return false; // Skip invalid reservations
        }
        return localDate.toISOString().split("T")[0] === dateString;
      });
  
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
                `${res.startTime} ~ ${res.endTime}`
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
                        {`${formatTime(res.startTime)} ~ ${formatTime(
                          res.endTime
                        )}`}
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

  const handleOpenPopup = (reservation) => {
    setSelectedReservation(reservation);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedReservation(null);
  };

  const Popup = ({ reservation, onClose }) => {
    if (!reservation) return null;
  
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div className={styles.popupLabel}>예약 정보</div>
          <div className={styles.popupContent}>
            <p>예약자 이름 | <span>{reservation.studentName}</span></p>
            <p>예약 날짜 | <span>{reservation.reservationDate}</span></p>
            <p>예약 시간 | <span>{`${reservation.startTime} ~ ${reservation.endTime}`}</span></p>
            <p>예약 사유 | <span>{reservation.reason}</span></p>
            <p>
                상태 | <span>{" "}
                {reservation.status === "PENDING"
                  ? "예약 대기중 . ."
                  : reservation.status === "APPROVED"
                    ? "예약 승인"
                    : "알 수 없음"}</span>
              </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      {/* 상단 버튼 */}
      <div className={styles.rightControls}>
  <button className={styles.reserveButton} onClick={handleOpenModal}>
    예약하기
  </button>
  <div className={styles.dropdown}>
    <button
      className={`${styles.dropdownButton} ${
        selectedView === "Month" ? styles.active : ""
      }`}
      onClick={() => navigate("/month")} // 경로 이동 추가
    >
      Month
    </button>
  </div>
</div>


      {/*년월 + status*/}
      <div className={styles.header}>
        <span className={styles.navText}>
          {currentDate.getFullYear()} . {currentDate.getMonth() + 1}
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
        </div>
      </div>


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
                })}
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

      {/* 주요 타임라인: 오늘 중심의 3일 */}
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
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}



      {/* 큰 화면에서는 기존 weekDaysHeader */}
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
                {day.toLocaleDateString("en-US", { day: "numeric", weekday: "short" })}
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


      {/* 날짜 */}
      
      
      <div className={styles.weekGrid}>
        <div className={styles.timeColumn}>{renderGrid()}</div>
        {renderWeekColumns()}
      </div>

      {isModalOpen && (
        <ReservationModal
          selectedDate={formatDateToLocalString(selectedDate)} // 로컬 기준 날짜 포맷
          onClose={handleCloseModal}
          handleSave={handleSaveReservation}
        />
      )}

      {isPopupOpen && (
        <Popup reservation={selectedReservation} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default WeekPage;
