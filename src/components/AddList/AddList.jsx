import "./AddList.css"
import PropTypes from 'prop-types';
import "./AddList.css"

const AddList = ({showNewList, handleShowNewList}) => {
  return (
    <div><div className="container-list-form">
    {showNewList ? (
      <div className="add-list">
        <div className="add-list__header">
          <span className="add-list__title">New list</span>
          <button onClick={handleShowNewList} className="button--icon">x</button>
        </div>
        <div className="add-list__body">
          <div className="input-list">
            <label className="input-list__label">List name</label>
            <input className="input-list__field" type="text" placeholder="Enter list name" />
          </div>
          <div className="input-list">
            <label className="input-list__label">Members</label>
            <input className="input-list__field" type="search" placeholder="Add members by email" />
          </div>
        </div>
        <div className="container-find-contact">
          <div className="single-contact">
            <div>
              <img src="https://picsum.photos/40/40"></img>
            </div>
            <div>
              <p>petko1234@gmail.com</p>
            </div>
            <button>Add</button>
          </div>
        </div>
        <div className="add-list__footer">
          <button className="button--primary">Create list</button>
        </div>
      </div>
    ) : (
      ""
    )}
  </div></div>
  )
}

AddList.propTypes = {
    showNewList: PropTypes.bool.isRequired,
    handleShowNewList: PropTypes.func.isRequired
};

export default AddList