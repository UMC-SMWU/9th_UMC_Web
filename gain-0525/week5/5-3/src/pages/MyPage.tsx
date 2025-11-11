import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";


const MyPage = () => {
    const [data, setData] = useState([]);
    useEffect(()=> {
        const getData = async() => {
            const response = await getMyInfo();
            console.log(response);

            setData(response.data)
        };
        getData();
    },[]);
    console.log(data.name);
    return ( 
        <div>
            {data.name}
        </div>
    )
}
export default MyPage;