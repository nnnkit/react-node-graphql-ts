import { useState, useEffect, useCallback } from "react";
import { server } from "./api/server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
}
export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: false,
  });
  const fetch = useCallback(() => {
    async function fetchApi() {
      const { data } = await server.fetch<TData>({ query });
      setState({ data, loading: false });
    }
    fetchApi();
  }, [query]);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return { ...state, refetch: fetch };
};

export default useQuery;
