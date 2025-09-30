import { useParams } from "react-router-dom";
import { type ReactElement } from "react";

const MovieDetailPage = () : ReactElement => {
    const params = useParams();
    console.log(params);
    return <div>MovieDetailPage</div>;
}

export default MovieDetailPage;