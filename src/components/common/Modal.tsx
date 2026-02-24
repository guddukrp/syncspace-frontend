import { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ title, open, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;