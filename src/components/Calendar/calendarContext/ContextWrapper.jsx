import GlobalContext from "./GlobalContext"
import { useState } from "react"
import dayjs from "dayjs"
import PropTypes from 'prop-types';

const ContextWrapper = (props) => {
    const [monthIndex, setMonthIndex] = useState(dayjs().month())
    return (
            <GlobalContext.Provider value={{ monthIndex, setMonthIndex }}>
                {props.children}
            </GlobalContext.Provider>
    )
}

ContextWrapper.propTypes = {
    children: PropTypes.node
};

export default ContextWrapper