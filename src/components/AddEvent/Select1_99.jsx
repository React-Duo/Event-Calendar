const Select1_99 = (props) => {
    const options = [];
    for (let i = 1; i < 100; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
    }
    
    return (
        <select name={props.freq} id={props.freq} className="common">
        {options}
        </select>
    );
}

export default Select1_99;