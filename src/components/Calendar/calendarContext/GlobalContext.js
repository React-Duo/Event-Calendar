import React from 'react';

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: () => {},
    view: '',
    setView: () => {},
    weekOffset: 0,
    setWeekOffset: () => {},
});

export default GlobalContext;