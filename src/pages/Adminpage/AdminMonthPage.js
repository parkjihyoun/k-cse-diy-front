import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AdminMonthPage.module.css";

const AdminMonthPage = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedView, setSelectedView] = useState("Month");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleViewChange = (view) => {
      if (view === "Week") {
        navigate("/admin/week");
      } else {
        setSelectedView(view);
      }
    };

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
        if (result.response && Array.isArray(result.response)) {
          setReservations(result.response);
        } else {
          setReservations([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [year, month, navigate]);

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

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    const filteredReservations = reservations.filter(
      (r) => r.reservationDate === dateStr
    );
    setSelectedReservations(filteredReservations);
  };

  const handleApprove = async (reservationId, reservationStatus) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://diy.knucse.site/api/v1/admin/reservation/treatment`,
        {
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
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: reservationStatus } : res
        )
      );
      setSelectedReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: reservationStatus } : res
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reservationId, status, cancelledReason) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://diy.knucse.site/api/v1/admin/reservation/cancel`,
        {
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
          res.id === reservationId ? { ...res, status, cancelledReason } : res
        )
      );

      setSelectedReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status, cancelledReason } : res
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationStatus = (id, status) => {
    if (status === "CANCELLED") {
      const reason = prompt("거절 사유를 입력하세요:");
      if (!reason) {
        alert("거절 사유를 입력해야 합니다.");
        return;
      }
      handleReject(id, status, reason);
    } else {
      handleApprove(id, status);
    }
  };

  const renderDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendar = [];
    let currentDay = 1;

    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      let isWeekEmpty = true;

      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else if (currentDay > daysInMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;

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
                      className={
                        r.status === "APPROVED"
                          ? styles.completeDot
                          : r.status === "CANCELLED"
                          ? styles.rejectedDot
                          : styles.pendingDot
                      }
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
          isWeekEmpty = false;
          currentDay++;
        }
      }

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
        <div className={styles.dropdown}>
          <button
            className={`${styles.dropdownButton} ${selectedView === "Week" ? styles.active : ""}`}
            onClick={() => navigate("/admin/week")} // Week 페이지로 이동
          >
            Week
          </button>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.headerRow}>
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
              <div className={styles.statusItem}>
                <div className={styles.rejectedDot}></div>
                <span>예약 거절</span>
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

      <div className={styles.reservationDetails}>
        {selectedDate ? (
          <>
            <h3>{selectedDate} 예약 정보</h3>
            {selectedReservations.length > 0 ? (
              <ul className={styles.reservationList}>
                {selectedReservations.map((res) => (
                  <li key={res.id} className={styles.reservationItem}>
                    <p>이름 | {res.studentName}</p>
                    <p>시간 | {res.startTime.slice(0, 5)} ~ {res.endTime.slice(0, 5)}</p>
                    <p>사유 | {res.reason}</p>
                    <p>
                      상태 | {res.status === "PENDING"
                        ? "예약 대기중 . ."
                        : res.status === "APPROVED"
                        ? "예약 승인"
                        : res.status === "CANCELLED"
                        ? `예약 거절  (거절 사유: ${res.cancelledReason || "없음"})`
                        : "알 수 없음"}
                    </p>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleReservationStatus(res.id, "APPROVED")}
                        disabled={res.status === "APPROVED"}
                      >
                        승인
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleReservationStatus(res.id, "CANCELLED")}
                        disabled={res.status === "CANCELLED"}
                      >
                        거절
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noReservations}>예약이 없습니다.</p>
            )}
          </>
        ) : (
          <p><br />날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default AdminMonthPage;