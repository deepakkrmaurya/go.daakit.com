import { useParams } from "react-router-dom"


function TrackOrder() {
    const {id} = useParams();
    return (
        <>
            <div>{id}: History</div>
            <div>Later</div>
        </>
  )
}

export default TrackOrder