import React, { FC } from "react";
import { gql } from "apollo-boost";
import List from "antd/es/list";
import {
  DeleteListing,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Listings as ListingsData } from "./__generated__/Listings";
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
  let { data, refetch } = useQuery<ListingsData>(LISTINGS);
  let [deleteListing] = useMutation<DeleteListing, DeleteListingVariables>(
    DELETE_LISTING
  );

  async function handleDelete(id: string) {
    const { data } = await deleteListing({ variables: { id } });
    refetch();
  }
  return (
    <>
      {data && (
        <List
          itemLayout="horizontal"
          dataSource={data.listing}
          renderItem={(l) => (
            <List.Item>
              <List.Item.Meta title={l.title} />
            </List.Item>
          )}
        ></List>
      )}
    </>
  );
};
