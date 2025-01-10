import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MonthPage.module.css";
import ReservationModal from "../components/ReservationModal";

const MonthPage = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [month, setMonth] = useState(today.getMonth()); // 현재 달로 초기화
  const [year, setYear] = useState(today.getFullYear()); // 현재 연도로 초기화
  const [selectedView, setSelectedView] = useState("Month");
  const [selectedDate, setSelectedDate] = useState(todayStr); // 오늘 날짜로 초기화
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [reservations, setReservations] = useState([]); // 예약 데이터 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const navigate = useNavigate();

  // 예약 데이터 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://diy.knucse.site/api/v1/application/reservation/date/${year}/${month + 1}`
        );

        if (!response.ok) {
          throw new Error("예약 정보를 가져오는데 실패했습니다.");
        }

        const result = await response.json();
        console.log(result); // API 반환 데이터 확인

        // API 데이터가 존재하고 배열 형태일 때만 상태에 저장
        if (result.response && Array.isArray(result.response)) {
          setReservations(result.response); // API 데이터를 그대로 상태에 저장
        } else {
          setReservations([]); // 데이터가 없을 경우 빈 배열로 설정
        }
      } catch (err) {
        setError(err.message); // 에러 메시지 저장
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchReservations(); // 예약 데이터를 가져오는 함수 호출
  }, [year, month]);

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    } else if (direction === "next") {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };

  const handleViewChange = (view) => {
    if (view === "Week") {
      navigate("/week");
    } else {
      setSelectedView(view);
    }
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
      { ...data, reservationDate: selectedDate, id: prev.length + 1, status: "PENDING" },
    ]);
    alert("예약이 신청되었습니다!");
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);

    // 선택된 날짜에 맞는 예약 정보를 필터링
    const filteredReservations = reservations.filter(
      (r) => r.reservationDate === dateStr
    );

    setSelectedReservations(filteredReservations); // 상태 업데이트
  };

  const renderDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendar = [];
    let currentDay = 1;

    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      let isWeekEmpty = true; // 주가 비어있는지 확인하는 변수

      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else if (currentDay > daysInMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr; // 오늘 날짜인지 확인

          weekRow.push(
            <td
              key={`day-${currentDay}`}
              className={`${styles.dayCell} ${isSelected ? styles.selected : ""} ${isToday ? styles.today : ""}`}
              onClick={() => handleDateClick(dateStr)}
            >
              <div className={styles.dateNumber}>{currentDay}</div>
              <div className={styles.dotsContainer}>
                {reservations
                  .filter((r) => r.reservationDate === dateStr)
                  .slice(0, 2)
                  .map((r) => (
                    <div
                      key={`status-${r.id}`}
                      className={r.status === "APPROVED" ? styles.completeDot : styles.pendingDot}
                    ></div>
                  ))}
                {reservations.filter((r) => r.reservationDate === dateStr).length > 2 && (
                  <span className={styles.extraDots}>
                    +{reservations.filter((r) => r.reservationDate === dateStr).length - 2}
                  </span>
                )}
              </div>
            </td>
          );
          isWeekEmpty = false; // 비어있지 않음을 표시
          currentDay++;
        }
      }

      // 주가 비어 있지 않을 경우에만 추가
      if (!isWeekEmpty) {
        calendar.push(<tr key={`week-${week}`}>{weekRow}</tr>);
      }
    }

    return calendar;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      {/* Right Controls */}
      <div className={styles.rightControls}>
        <button className={styles.reserveButton} onClick={handleOpenModal}>
          예약하기
        </button>
        <div className={styles.dropdown}>

          <button
            className={`${styles.dropdownButton} ${selectedView === "Week" ? styles.active : ""
              }`}
            onClick={() => navigate("/week")} // Week 페이지로 이동
          >
            Week
          </button>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.headerRow}>
          {/* Navigation */}
          <div className={styles.navigation}>
            <button onClick={() => handleMonthChange("prev")} className={styles.navButton}>
              ❮
            </button>
            <span className={styles.navText}>
              {year} . {String(month + 1).padStart(2, "0")}
            </span>
            <button onClick={() => handleMonthChange("next")} className={styles.navButton}>
              ❯
            </button>
          </div>

          {/* Status Legend */}
          <div className={styles.statusLegendContainer}>
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
        </div>
      </div>

      <div className={styles.calendar}>
        <table>
          <thead>
            <tr>
              <th>SUN</th>
              <th>MON</th>
              <th>TUE</th>
              <th>WED</th>
              <th>THU</th>
              <th>FRI</th>
              <th>SAT</th>
            </tr>
          </thead>
          <tbody>{renderDays()}</tbody>
        </table>
      </div>

      {isModalOpen && (
        <ReservationModal
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          handleSave={handleSaveReservation}
        />
      )}

      <div className={styles.reservationDetails}>
        <h3>{selectedDate} 예약 정보</h3>
        {selectedReservations.length > 0 ? (
          <ul className={styles.reservationList}>
            {selectedReservations.map((res) => (
              <li key={res.id} className={styles.reservationItem}>
                <p>예약자 이름 | {res.studentName}</p>
                <p>예약자 학번 | {res.studentNumber}</p>
                <p>예약 사유 | {res.reason}</p>
                <p>예약 시간 | {res.startTime} ~ {res.endTime}</p>
                <p>
                  상태 |{" "}
                  {res.status === "PENDING"
                    ? "예약 대기중 . ."
                    : res.status === "APPROVED"
                      ? "예약 승인"
                      : "알 수 없음"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>예약이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MonthPage;