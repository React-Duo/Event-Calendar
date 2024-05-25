const Frequency = (props) => {
    const options = [];
    for (let i = 1; i < 100; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
    }
    
    return (
        <select name="frequency" id="frequency" onChange={props.handle} className="common" required>
        {options}
        </select>
    );
}

export default Frequency;