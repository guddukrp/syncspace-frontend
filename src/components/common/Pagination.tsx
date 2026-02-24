import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination = ({ page, totalPages, onPrevious, onNext }: PaginationProps) => {
  return (
    <div className="pagination">
      <button onClick={onPrevious} disabled={page <= 0}>
        Previous
      </button>
      <span>
        Page {page + 1} of {Math.max(totalPages, 1)}
      </span>
      <button onClick={onNext} disabled={totalPages === 0 || page + 1 >= totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;