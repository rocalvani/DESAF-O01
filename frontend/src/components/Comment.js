import { useUser } from "../context/UserContext";
import { Rating } from "@smastrom/react-rating";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const Comment = ({ comment, deleteComment }) => {
  const { email } = useUser();

  const handleDelete = (e) => {
    e.preventDefault();
    deleteComment(comment._id);
  };

  return (
    <div id={comment._id} className="item__comment">
      <div className="item__comment">
        <div className="item__comment--author">
          <span>
            <a href={`../users/${comment.comment.user.id}`}>
              {comment.comment.user.name}
            </a>
            <Rating
              style={{ maxWidth: 70 }}
              value={comment.comment.rating}
              className="ratingSystem"
              readOnly
            />
          </span>
          <span>
            {comment.comment.posted}
            {email === comment.comment.user.email ? (
              <button onClick={handleDelete}><FontAwesomeIcon icon={faTrashCan} /></button>
            ) : null}
          </span>
        </div>
        <div className="item__comment--text">{comment.comment.comment}</div>
      </div>
    </div>
  );
};

export default Comment;
