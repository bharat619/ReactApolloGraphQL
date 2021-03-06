import Signup from "../components/Signup";
import SignIn from "../components/SignIn";
import styled from "styled-components";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignUp = props => (
  <Columns>
    <Signup />
    <SignIn />
  </Columns>
);
export default SignUp;
