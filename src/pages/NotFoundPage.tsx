import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to={APP_ROUTES.dashboard}>Back to dashboard</Link>
    </div>
  );
};

export default NotFoundPage;
