import { useUser } from "../context/UserContext"
import { Rating } from '@smastrom/react-rating';


const Comment = ({comment, deleteComment}) => {

  console.log(comment)

    const {email} = useUser()


    const handleDelete = (e) => {
        e.preventDefault()
    deleteComment(comment._id)
      }

    return (
<div id={comment._id}>
<Rating
      style={{ maxWidth: 10 }}
      value={comment.comment.rating}
      className="ratingSystem"
      readOnly
    />
{comment.comment.user.name} {comment.comment.posted} {comment.comment.comment}
{email === comment.comment.user.email ? <button onClick={handleDelete}>borrar</button> : null}
</div>   
 )
}

export default Comment