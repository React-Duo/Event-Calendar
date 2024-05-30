import "./Preferences.css"

const Preferences = () => {
  return (
    <div>
      <h2>Preferences</h2>
      <div className="preference">
        <label htmlFor="invite-preference">Dont invite me to an event unless I allow it:</label>
        <input type="checkbox" id="invite-preference" name="invite-preference" />
      </div>
    </div>
  )
}

export default Preferences