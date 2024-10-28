import PropTypes from "prop-types";

export default function Button({ title, type }) {
  return (
    <button
      type={type}
      className="rounded p-2 w-fit justify-items-center font-bold text-white text-xl bg-black"
    >
      {title}
    </button>
  );
}
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  title: PropTypes.string.isRequired,
};

// "rounded p-2 w-full justify-items-center"