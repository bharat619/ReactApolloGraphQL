import Link from "next/link";
import UpdateItem from "../components/UpdateItem";
const Sell = props => {
  return (
    <div>
      {/* props.query.id can be accessed because of `pageProps.query = ctx.query;` in _app.js */}
      <UpdateItem id={props.query.id} />
    </div>
  );
};

export default Sell;
