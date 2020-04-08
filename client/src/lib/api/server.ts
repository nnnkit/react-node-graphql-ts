interface Body<TVariable> {
  query: string;
  variables?: TVariable;
}
export const server = {
  fetch: async <TData = any, TVariable = any>(body: Body<TVariable>) => {
    let res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<{ data: TData }>;
  },
};
