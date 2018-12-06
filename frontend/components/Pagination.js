import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";

import { perPage } from "../config";
import PaginationStyles from "./styles/PaginationStyles";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

class Pagination extends Component {
  render() {
    return (
      <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading</p>;
          const count = data.itemsConnection.aggregate.count;
          const pages = Math.ceil(count / perPage);
          return (
            <PaginationStyles>
              <Head>
                <title>Sick Fits!! Page {this.props.page} of pages</title>
              </Head>
              <Link
                prefetch // prefetch will preload next and previous page. which will give a performance boost
                href={{
                  pathname: "items",
                  query: { page: this.props.page - 1 }
                }}
              >
                <a className="prev" aria-disabled={this.props.page <= 1}>
                  🔙Previous
                </a>
              </Link>
              <p>
                You are on {this.props.page} of {pages}!
              </p>
              <p>{count} items in total</p>
              <Link
                prefetch // prefetch will preload next and previous page. which will give a performance boost
                href={{
                  pathname: "items",
                  query: { page: this.props.page + 1 }
                }}
              >
                <a className="prev" aria-disabled={this.props.page >= pages}>
                  →Next
                </a>
              </Link>
            </PaginationStyles>
          );
        }}
      </Query>
    );
  }
}

export default Pagination;
