import PropTypes from 'prop-types';

export default function Input({ type, placeholder, register, name }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="rounded p-2 w-full justify-items-center"
      {...register(name)}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
