import React from 'react'
import Day from "./Day"

import { useContext } from 'react'

import PropTypes from 'prop-types';
import GlobalContext from "./calendarContext/GlobalContext";


const Month = ({ month, day}) => {

    const { view } = useContext(GlobalContext);


    if (view === "month") {
        return (
            <div className="container-month">
                {month.map((row, i) => (
                    <React.Fragment key={i}>
                        {row.map((day, idx) => {
                            return <Day  day={day} key={idx} rowIdx={i} />
                        })}
                    </React.Fragment>
                ))}
            </div>
        )
    } else if(view === "week"){
        return (
            <div className="container-week">
                {month.map((day, i) => (
                    <Day  day={day} key={i} rowIdx={i} />
                ))}
            </div>
        )
    } else if(view === "day"){
        return (
            <div className="container-day">
                <Day  day={day} rowIdx={0} />
            </div>
        )
    }
}


Month.propTypes = {
    month: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    day: PropTypes.array,
}

export default Month;