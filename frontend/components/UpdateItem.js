import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import Form from "./styles/Form";
import gql from "graphql-tag";
import Router from "next/router";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $price: Int
    $description: String
  ) {
    updateItem(
      id: $id
      title: $title
      price: $price
      description: $description
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type == "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log("updating");
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log(res);
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (!data.item) return <p>Bamm!!! No such thing found</p>;
          if (loading) return <p>Loading...</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {// (mutationFunction, payload)
              (updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        value={this.state.title}
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        value={this.state.price}
                        id="price"
                        name="price"
                        placeholder="Price"
                        onChange={this.handleChange}
                        defaultValue={data.item.price}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        value={this.state.description}
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={data.description}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <button type="submit">
                      {"Sav" + (loading ? "ing" : "e")}
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
