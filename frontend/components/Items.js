import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "./Pagination";
import { perPage } from "../config";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int=0, $first: Int= ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;
const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: {props => props.theme.maxWidth};
  margin: 0 auto;
`;
class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query
          // fetchPolicy netowrk-only will make the http request instead of fetching from the cache
          fetchPolicy="network-only"
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: this.props.page * perPage - perPage,
            first: perPage
          }}
        >
          {({ data, loading, error }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>Error: ${error}</p>;
            return (
              <ItemList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
