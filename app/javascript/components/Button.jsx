import PropTypes from "prop-types";

export default function Button({ title, type }) {
  return (
    <button
      type={type}
      className="rounded w-auto font-bold text-white text-xl bg-black flex items-center justify-center gap-2"
    >
      {title}
    </button>
  );
}
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  title: PropTypes.string.isRequired,
};
