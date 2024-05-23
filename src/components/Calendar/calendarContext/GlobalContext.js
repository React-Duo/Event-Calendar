import React from 'react';

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: () => {},
});

export default GlobalContext;