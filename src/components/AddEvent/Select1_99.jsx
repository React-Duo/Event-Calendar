const Select1_99 = (props) => {
    const options = [];
    for (let i = 1; i < 100; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
    }

    const handleFreqChange = (e) => {
        console.log(e.target.value);
    }
    
    return (
        <select name={props.freq} id={props.freq} onChange={handleFreqChange} className="common">
        {options}
        </select>
    );
}

export default Select1_99;