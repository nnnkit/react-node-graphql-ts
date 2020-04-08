interface Body {
  query: string;
}
export const server = {
  fetch: async <TData = any>(body: Body) => {
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
