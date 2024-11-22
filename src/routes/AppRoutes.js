import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import KeyPage from '../pages/KeyPage';
import MonthPage from '../pages/MonthPage';
import WeekPage from '../pages/WeekPage';
import HelpPage from '../pages/HelpPage';
import CheckPage from '../pages/CheckPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/key" element={<KeyPage />} />
            <Route path="/month" element={<MonthPage />} />
            <Route path="/week" element={<WeekPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/check" element={<CheckPage />} />
        </Routes>
    );
};

export default AppRoutes;