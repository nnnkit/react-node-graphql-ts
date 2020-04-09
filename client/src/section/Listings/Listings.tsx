import React, { FC } from "react";
import { gql } from "apollo-boost";
import { server } from "../../lib/api/server";
import { ListingData, DeleteListing, DeleteListingVariable } from "./types";
import { useQuery, useMutation } from "@apollo/react-hooks";

const LISTINGS = gql`
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
const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
      title
    }
  }
`;
export const Listings: FC = () => {
  let { data, refetch } = useQuery<ListingData>(LISTINGS);
  let [deleteListing] = useMutation<DeleteListing, DeleteListingVariable>(
    DELETE_LISTING
  );

  async function handleDelete(id: string) {
    const { data } = await deleteListing({ variables: { id } });
    refetch();
  }
  return (
    <div>
      <ul>
        {data &&
          data.listing.map((l) => (
            <li key={l.id}>
              <p>{l.title}</p>
              <button onClick={() => handleDelete(l.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};
