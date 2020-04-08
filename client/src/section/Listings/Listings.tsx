import React, { FC } from "react";
import { server } from "../../lib/api/server";
import { ListingData, DeleteListing, DeleteListingVariable } from "./types";

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
const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id){
      id
      title
    }
  }
`;
export const Listings: FC = () => {
  async function fetchData() {
    const { data } = await server.fetch<ListingData>({ query: LISTINGS });
    console.log(data);
  }
  async function deleteListing() {
    const { data } = await server.fetch<DeleteListing, DeleteListingVariable>({
      query: DELETE_LISTING,
      variables: {
        id: "5e8c5854f264b6475b25bc24",
      },
    });
    console.log(data);
  }
  return (
    <div>
      Hello Listings
      <button onClick={fetchData}>Fecth Listings</button>
      <button onClick={deleteListing}>Delete Listing</button>
    </div>
  );
};
