import React from 'react'
import Day from "./Day"

const Month = ({ month }) => {
    return (
        <div className="container-month">
            {month.map((row, i) =>   (
                <React.Fragment key={i}>
                    {row.map((day, idx) => {
                        return <Day day={day} key={idx} rowIdx={i}/>
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}


export default Month;