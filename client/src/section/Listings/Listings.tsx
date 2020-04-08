import React, { FC } from "react";
import { server } from "../../lib/api/server";
import { ListingData } from "./types";

const LISTINGS = `
  query Listings {
    listing {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;
export const Listings: FC = () => {
  async function fetchData() {
    const { data } = await server.fetch<ListingData>({ query: LISTINGS });
    console.log(data);
  }
  return (
    <div>
      Hello Listings
      <button onClick={fetchData}>Fecth Listings</button>
    </div>
  );
};
