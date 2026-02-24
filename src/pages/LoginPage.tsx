import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { APP_ROUTES } from '../constant';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/error';
import { loginSchema } from '../utils/validators';
import './LoginPage.css';

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      navigate(APP_ROUTES.dashboard);
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign in</h1>

        <label>
          Email
          <input type="email" {...register('email')} />
        </label>
        {errors.email && <small className="error">{errors.email.message}</small>}

        <label>
          Password
          <input type="password" {...register('password')} />
        </label>
        {errors.password && <small className="error">{errors.password.message}</small>}

        {errors.root && <small className="error">{errors.root.message}</small>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>

        <small>
          New user? <Link to={APP_ROUTES.register}>Create account</Link>
        </small>
      </form>
    </div>
  );
};

export default LoginPage;