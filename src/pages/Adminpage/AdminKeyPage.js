import React, { useState, useEffect } from 'react';
import styles from "../../styles/AdminKeyPage.module.css";
import refreshIcon from '../../img/refresh.png';

const initialData = [
    { id: 3, name: "박지현", studentId: "202400001", date: "2025-01-23 14:24", status: "반납" },
    { id: 4, name: "최원아", studentId: "202400002", date: "2025-01-23 14:25", status: "반납" },
    { id: 5, name: "김예윤", studentId: "202400003", date: "2025-01-23 14:26", status: "대여" },
    { id: 1, name: "호예찬", studentId: "202400004", date: "2025-01-21 14:27", status: "반납" },
    { id: 2, name: "호예찬", studentId: "202400004", date: "2025-01-21 14:30", status: "반납" },
    { id: 6, name: "이수연", studentId: "202400005", date: "2025-01-25 10:15", status: "대여" },
    { id: 7, name: "이현진", studentId: "202400006", date: "2025-02-01 09:30", status: "반납" },
    { id: 8, name: "오경수", studentId: "202400007", date: "2025-02-05 13:20", status: "대여" },
    { id: 9, name: "김동현", studentId: "202400008", date: "2025-02-10 16:00", status: "반납" },
    { id: 10, name: "이서연", studentId: "202400009", date: "2025-02-15 11:25", status: "대여" },
];

function AdminKeyTable() {
    const [data, setData] = useState(initialData); // 데이터 상태 초기화
    const [originalData, setOriginalData] = useState(initialData); // 원본 데이터
    const [checkedItems, setCheckedItems] = useState([]);
    const [sortFilter, setSortFilter] = useState('날짜순');
    const [searchCategory, setSearchCategory] = useState('name');
    const [search, setSearch] = useState('');
    const [searchDateFrom, setSearchDateFrom] = useState('');
    const [searchDateTo, setSearchDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // 페이지네이션 처리 (현재 페이지에 해당하는 데이터만 표시)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 번호 생성
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // 페이지 클릭 처리
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < pageNumbers.length) setCurrentPage(currentPage + 1);
    };

    // 데이터 필터링 및 정렬
    const handleSortFilter = (option) => {
        let updatedData = [...originalData];

        // 필터링 (이름순, 날짜순, 학번순, 상태)
        switch (option) {
            case '이름순':
                updatedData.sort((b, a) => a.name.localeCompare(b.name));
                break;
            case '날짜순':
                updatedData.sort((b, a) => new Date(a.date) - new Date(b.date));
                break;
            case '학번순':
                updatedData.sort((a, b) => a.studentId.localeCompare(b.studentId));
                break;
            case '반납':
            case '대여':
                updatedData = updatedData.filter(item => item.status === option);
                break;
            default:
                break;
        }

        // 검색 및 날짜 필터링
        updatedData = updatedData.filter(item => {
            if (searchCategory === 'status') {
                return item.status.toLowerCase().includes(search.toLowerCase());
            } else if (searchCategory === 'name') {
                return item.name.toLowerCase().includes(search.toLowerCase());
            } else if (searchCategory === 'studentId') {
                return item.studentId.includes(search);
            }
            return false;
        });

        if (searchDateFrom) {
            updatedData = updatedData.filter(item => new Date(item.date) >= new Date(searchDateFrom));
        }
        if (searchDateTo) {
            updatedData = updatedData.filter(item => new Date(item.date) <= new Date(searchDateTo));
        }

        setData(updatedData);
    };

    // 날짜 필터 초기화 함수
    const resetDateFilter = () => {
        setSearchDateFrom('');
        setSearchDateTo('');
    };

    // 열쇠 반납처리 함수
    const handleReturnKey = () => {
        const latestRecord = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        if (latestRecord.status === '대여') {
            const updatedData = data.map(item =>
                item.id === latestRecord.id ? { ...item, status: '반납' } : item
            );
            setData(updatedData);
            alert('반납 처리 완료!');
        } else {
            alert('최근 기록이 이미 반납된 상태입니다.');
        }
    };

    // 새로고침 버튼 클릭 시 초기화
    const resetAll = () => {
        setSearch('');
        setSearchCategory('name');
        setSortFilter('날짜순');
        setSearchDateFrom('');
        setSearchDateTo('');
        setData(originalData); // 원본 데이터로 되돌리기
        setCurrentPage(1); // 첫 번째 페이지로 초기화
    };

    useEffect(() => {
        handleSortFilter(sortFilter); // 필터링 및 정렬 처리
    }, [search, searchCategory, sortFilter, searchDateFrom, searchDateTo]);

    return (
        <div className={styles.page}>
            <button className={styles.returnButton} onClick={handleReturnKey}>열쇠 반납처리</button>

            <div className={styles.searchContainer}>
                <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className={styles.searchSelect}>
                    <option value="name">이름</option>
                    <option value="studentId">학번</option>
                    <option value="status">상태</option>
                </select>

                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />

                <div className={styles.dateRange}>
                    <input
                        type="date"
                        value={searchDateFrom}
                        onChange={(e) => setSearchDateFrom(e.target.value)}
                        className={styles.searchInput}
                    />
                    <span>~</span>
                    <input
                        type="date"
                        value={searchDateTo}
                        onChange={(e) => setSearchDateTo(e.target.value)}
                        className={styles.searchInput}
                    />
                   <button onClick={resetAll} className={styles.refreshButton}>
                    <img src={refreshIcon} alt="새로고침" className={styles.refreshIcon} />
                </button>
                </div>

                <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} className={styles.dropdown}>
                    <option value="이름순">이름 순</option>
                    <option value="날짜순">날짜 순</option>
                    <option value="학번순">학번 순</option>
                    <option value="반납">반납 상태</option>
                    <option value="대여">대여 상태</option>
                </select>
            </div>

            <div className={styles.tableHeader}>
                <div>No.</div>
                <div>이름</div>
                <div>학번</div>
                <div>날짜</div>
                <div>활동</div>
            </div>

            {currentData.map(item => (
                <div key={item.id} className={styles.row}>
                    <div className={styles.cell}>{item.id}</div>
                    <div className={styles.cell}>{item.name}</div>
                    <div className={styles.cell}>{item.studentId}</div>
                    <div className={styles.cell}>{item.date}</div>
                    <div className={`${styles.cell} ${item.status === '대여' ? styles.statusRented : styles.statusReturned}`}>{item.status}</div>
                </div>
            ))}

            {/* 페이지네이션 */}
            <div className={styles.pagination}>
                <button onClick={prevPage} className={styles.pageButton} disabled={currentPage <= 1}>
                    &lt;
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`${styles.pageButton} ${currentPage === number ? styles.activePage : ''}`}
                    >
                        {number}
                    </button>
                ))}
                <button onClick={nextPage} className={styles.pageButton} disabled={currentPage >= totalPages}>
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default AdminKeyTable;
