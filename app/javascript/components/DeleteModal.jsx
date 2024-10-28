import React from "react";
import PropTypes from 'prop-types';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold text-white mb-4">Deseja excluir esse post?</h2>
        <div className="flex justify-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={onConfirm}
          >
            Confirmar
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
