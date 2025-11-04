import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";


const HomePage = () => {
    const [search, setSearch] = useState("타입");
  const { data, isPending, isError } = useGetLpList({
    search,
  });

  return (
    <div className={'mt-20'}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {data?.data.data.map((lp) => <h1>{lp.title}</h1>)}
    </div>
  );
};

export default HomePage;