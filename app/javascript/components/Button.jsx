import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Button({ title, type, icon, transaction }) {
  let SelectIconComponent;
  const navigate = useNavigate();

  if (icon === "plus") SelectIconComponent = BiPlusCircle;
  if (icon === "minus") SelectIconComponent = BiMinusCircle;

  return (
    <button
      type={type}
      className="rounded w-24 font-bold text-white text-xl bg-black flex items-center justify-center gap-2"
      onClick={() => transaction && navigate(`/transaction/${transaction}`)}
    >
      {SelectIconComponent && <SelectIconComponent />} {title}
    </button>
  );
}
Button.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  icon: PropTypes.oneOf(["plus", "minus"]),
  transaction: PropTypes.string,
};
