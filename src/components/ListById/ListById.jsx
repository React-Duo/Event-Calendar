import "./ListById.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getListById } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";


const ListById = () => {
  const params = useParams();
  const listId = params.id;
  const { isLoggedIn } = useContext(AuthContext);
  const [list, setList] = useState({});
  const [contentIn, setContentIn] = useState("members");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await getListById(listId);
        setList(list);
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, [listId]);

  return (
    <div className="list-by-id">
      <div className="list-by-is-title">
        <h1>{list.name}</h1>
        {list.owner === isLoggedIn.user && <button className="btn">Add member</button>}
        <div className="list-by-is-title-right">

        <button className="button--icon">x</button>
        </div>
      </div>
      <hr />
      <div>
        <ul>
          <li onClick={()=> setContentIn("members")}>Members</li>
          <li onClick={()=> setContentIn("chat")}>Chat</li>
        </ul>
      </div>
      <div>
        {contentIn === "members" && (
          <div className="container-all-members">
            {list.contacts &&
              list.contacts.map((contact, index) => (
                <div key={index} className="member">
                  <img src="https://picsum.photos/50/50"></img>
                  <p>{contact}</p>
                </div>
              ))}
          </div>
        )}
        {contentIn === "chat" && (
          <div>
            <p>Chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListById;
