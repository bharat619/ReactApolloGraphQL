import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignIn extends Component {
  state = {
    email: "",
    password: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      // Once mutation query is successful, it'll go to apollo store and execute the queries in refetchQueries array.
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signIn, { loading, error }) => (
          <Form
            method="POST"
            onSubmit={e => {
              e.preventDefault();
              signIn().then(data => {
                this.setState({
                  name: "",
                  password: "",
                  email: ""
                });
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in here..!!!</h2>
              <Error error={error} />

              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
            </fieldset>
            <button type="submit">Sign In!</button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
