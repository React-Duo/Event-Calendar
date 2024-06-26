import "./AllLists.css";
import { getLists } from "../../service/database-service";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AllLists = ({ triggerRefetch }) => {
  const [lists, setLists] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        let lists = await getLists();
        lists = Object.entries(lists);
        const myLists = lists.filter((list) => {
          if (list[1].contacts) {
            return (
              list[1].owner === isLoggedIn.user ||
              list[1].contacts.includes(isLoggedIn.user)
            );
          } else {
            return list[1].owner === isLoggedIn.user;
          }
        });
        myLists.sort((a, b) => {
          if (a[1].owner === isLoggedIn.user) return -1;
          if (b[1].owner === isLoggedIn.user) return 1;
          return 0;
        });
        setLists(myLists);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLists();
  }, [isLoggedIn.user, triggerRefetch]);

  return (
    <div className="all-lists">
      {lists.map((list, index) => (
        <div
          onClick={() => navigate(`/contacts/${list[0]}`)}
          key={index}
          className="single-list"
          style={{ backgroundColor: `${list[1].color}` }}
        >
          <div className="list-details">
            <h2>{list[1].name}</h2>
            <h4>Author:</h4>
            <p>{list[1].owner}</p>
          </div>
          <div className="notifier">
            <i className="fa-solid fa-user-group"></i>
            <div className="badge">
              {list[1].contacts ? list[1].contacts.length : 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

AllLists.propTypes = {
  triggerRefetch: PropTypes.bool.isRequired,
};

export default AllLists;
