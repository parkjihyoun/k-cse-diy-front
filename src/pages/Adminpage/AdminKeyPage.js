import React, { useState, useEffect } from 'react';
import styles from "../../styles/AdminKeyPage.module.css"; // CSS 모듈을 import

const initialData = [
    { id: 3, name: "박지현", studentId: "202400001", date: "2025-01-23 14:24", status: "반납" },
    { id: 4, name: "최원아", studentId: "202400002", date: "2025-01-23 14:25", status: "반납" },
    { id: 5, name: "김예윤", studentId: "202400003", date: "2025-01-23 14:26", status: "대여" },
    { id: 1, name: "호예찬", studentId: "202400004", date: "2025-01-21 14:27", status: "반납" },
    { id: 2, name: "호예찬", studentId: "202400004", date: "2025-01-21 14:30", status: "반납" },
];

function AdminKeyTable() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([...initialData]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [sortFilter, setSortFilter] = useState('날짜순');

    useEffect(() => {
        handleSortFilter(sortFilter);
    }, [sortFilter, originalData]);

    const handleCheck = (id) => {
        setCheckedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const returnKeys = () => {
        const updatedOriginalData = originalData.map(item => ({
            ...item,
            status: checkedItems.includes(item.id) ? '반납' : item.status
        }));
        setOriginalData(updatedOriginalData);
        setCheckedItems([]);
    };

    const handleSortFilter = (option) => {
        let updatedData = [...originalData];
        switch (option) {
            case '이름순':
                updatedData.sort((a, b) => a.name.localeCompare(b.name));
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
        setData(updatedData);
    };

    return (
        <div className={styles.page}>
            <button className={styles.returnButton} onClick={returnKeys}>열쇠 반납처리</button>
            <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} className={styles.dropdown}>
                <option value="이름순">이름 순</option>
                <option value="날짜순">날짜 순</option>
                <option value="학번순">학번 순</option>
                <option value="반납">반납 상태</option>
                <option value="대여">대여 상태</option>
            </select>

            <div className={styles.tableHeader}>
                <div>No.</div>
                <div>이름</div>
                <div>학번</div>
                <div>날짜</div>
                <div>활동</div>
            </div>
            {data.map(item => (
            <div key={item.id} className={styles.row}>
                <div className={styles.cell}>{item.id}</div>
                <div className={styles.cell}>{item.name}</div>
                <div className={styles.cell}>{item.studentId}</div>
                <div className={styles.cell}>{item.date}</div>
                <div className={`${styles.cell} ${item.status === '대여' ? styles.statusRented : styles.statusReturned}`}>{item.status}</div>
            </div>
))}

        </div>
    );
}

export default AdminKeyTable;
