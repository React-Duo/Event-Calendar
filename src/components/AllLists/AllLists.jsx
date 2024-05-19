import "./AllLists.css"
import { getLists } from "../../service/database-service"
import { useEffect, useState, useContext } from "react"
import AuthContext from "../../context/AuthContext";
import PropTypes from 'prop-types';

const AllLists = ({triggerRefetch}) => {
  const [lists, setLists] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        let lists = await getLists();
        lists = Object.values(lists);
        const myLists = lists.filter((list) => list.owner === isLoggedIn.user);
        setLists(myLists);
      } catch (error) {
        console.error(error);
      }
    };
    console.log(lists);
    fetchLists();
  }, [isLoggedIn.user, triggerRefetch]);

  return (
    <div className="all-lists">
      {lists.map((list, index) => (
        <div key={index} className="single-list">
          <div>
            <p>{list.name}</p>
          </div>
          <div className="notifier">
            <i className="fa-solid fa-user-group"></i>
            <div className="badge">3</div>
          </div>
        </div>
      ))}
    </div>
  )
}

AllLists.propTypes = {
  triggerRefetch: PropTypes.bool.isRequired
}

export default AllLists