import "./SideBar.css"

const SideBar = () => {
  return (
    <div className="side-bar-container">
      <ul className="side-bar-tags">
        <li><i className="fa-solid fa-house fa-xl"></i>Home</li>
        <li><i className="fa-solid fa-calendar-days fa-xl"></i>Calendar</li>
        <li><i className="fa-solid fa-square-check fa-xl"></i>Add Event</li>
        <li><i className="fa-solid fa-address-book fa-xl"></i>Contacts</li>
        <li><i className="fa-solid fa-gear fa-xl"></i>Settings</li>
      </ul>
    </div>
  );
}

export default SideBar