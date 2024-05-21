import "./ListById.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getListById } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const ListById = () => {
  const params = useParams();
  const listId = params.id;
  const { isLoggedIn } = useContext(AuthContext);
  const [list, setList] = useState({});
  const [contentIn, setContentIn] = useState("members");
  const navigate = useNavigate();

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
        <div className="list-by-is-title-right">
        {list.owner === isLoggedIn.user && <i className="fa-solid fa-user-plus fa-xl"></i>}
        <button onClick={()=> navigate("/contacts")} className="button--icon">x</button>
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
        <table>
            <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {list.contacts &&
                    list.contacts.map((contact, index) => (
                        <tr key={index}>
                            <td>
                                <img src="https://picsum.photos/50/50" alt="Contact" />
                            </td>
                            <td>koko</td>
                            <td>{contact}</td>
                            <td className="table-actions">
                                <button  className="table-btn">Add to event</button>
                                <button className="table-btn" id="table-btn-remove">Remove from list</button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
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
