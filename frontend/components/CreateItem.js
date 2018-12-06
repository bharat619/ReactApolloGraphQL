import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import gql from "graphql-tag";
import Router from "next/router";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $price: Int!
    $description: String!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      price: $price
      description: $description
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    image: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type == "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    console.log("uploading");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "y2sguol7");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/bharat619/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const uploadedFile = await res.json();
    console.log(uploadedFile);
    this.setState({
      image: uploadedFile.secure_url,
      largeImage: uploadedFile.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {// (mutationFunction, payload)
        (createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // stop the form from submitting
              e.preventDefault();
              // call the mutation function
              const result = await createItem();
              // route to the single added item page
              console.log(result);
              Router.push({
                pathname: "/item",
                query: { id: result.data.createItem.id }
              });
            }}
          >
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
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadFile}
                  required
                />
                {this.state.image && (
                  <img src={this.state.image} alt="Upload preview" />
                )}
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
