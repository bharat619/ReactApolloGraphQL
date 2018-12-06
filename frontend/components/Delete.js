import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class Delete extends Component {
  // Apollo gives the cache and payload that has details of items after delete
  update = (cache, payload) => {
    // manually update cache on client to match with the server side
    // 1. Read the items from cache that we want. Cannot be done directly, need to use GraphQL
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(payload);
    // Filter deleted items from the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <div>
        <Mutation
          mutation={DELETE_ITEM_MUTATION}
          variables={{ id: this.props.id }}
          update={this.update}
        >
          {(deleteMutation, { error }) => (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delte?"))
                  deleteMutation();
                // Once the delete is done, we need to update the page to reflect all the changes.
                // Either page can be refreshed or, cache can be updated
                // Mutation provides method for `update`
              }}
            >
              {this.props.children}
            </button>
          )}
        </Mutation>
      </div>
    );
  }
}

export default Delete;
