import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-wrap" role="status" aria-label="Loading">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;