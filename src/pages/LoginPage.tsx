import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { APP_ROUTES } from '../constants/routes';
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
      <section className="auth-shell">
        <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-brand">
            <img src="/sync-space.svg" alt="" />
            <strong>SyncSpace</strong>
          </div>

          <div className="auth-copy">
            <h1>Welcome back</h1>
            <p>Sign in to your workspace</p>
          </div>

          <label>
            Email
            <input type="email" placeholder="you@example.com" {...register('email')} />
          </label>
          {errors.email && <small className="error">{errors.email.message}</small>}

          <label>
            Password
            <input type="password" placeholder="••••••••" {...register('password')} />
          </label>
          {errors.password && <small className="error">{errors.password.message}</small>}

          <div className="auth-row">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>
            <a>Forgot password?</a>
          </div>

          {errors.root && <small className="error">{errors.root.message}</small>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="auth-divider">or</div>
          <button className="google-button" type="button">
            Sign in with Google
          </button>

          <small className="auth-switch">
            Do not have an account? <Link to={APP_ROUTES.register}>Sign up</Link>
          </small>
        </form>

        <aside className="auth-visual">
          <img src="/sync-space.svg" alt="" />
          <h2>All your work, synced in one space.</h2>
          <p>Secure. Fast. Collaborative.</p>
          <div className="auth-dots">
            <span />
            <span />
            <span />
          </div>
        </aside>
      </section>
    </div>
  );
};

export default LoginPage;
