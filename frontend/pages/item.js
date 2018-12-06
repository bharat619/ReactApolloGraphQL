import SingleItemComponent from "../components/SingleItem";

const Item = props => {
  return <SingleItemComponent id={props.query.id} />;
};

export default Item;
