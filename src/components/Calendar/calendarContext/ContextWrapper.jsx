import GlobalContext from "./GlobalContext"
import { useState } from "react"
import dayjs from "dayjs"

const ContextWrapper = (props) => {
    const [monthIndex, setMonthIndex] = useState(dayjs().month())
    return (
            <GlobalContext.Provider value={{ monthIndex, setMonthIndex }}>
                {props.children}
            </GlobalContext.Provider>
    )
}

export default ContextWrapper