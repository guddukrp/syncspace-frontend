import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { APP_ROUTES } from '../constants/routes';
import { useRegisterMutation } from '../store/api/apiSlice';
import { getErrorMessage } from '../utils/error';
import { registerSchema } from '../utils/validators';
import './LoginPage.css';

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      }).unwrap();
      navigate(APP_ROUTES.login);
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
            <h1>Create account</h1>
            <p>Start your workspace in minutes</p>
          </div>

          <label>
            Display name
            <input type="text" placeholder="Alex Johnson" {...register('displayName')} />
          </label>
          {errors.displayName && <small className="error">{errors.displayName.message}</small>}

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

          <label>
            Confirm password
            <input type="password" placeholder="••••••••" {...register('confirmPassword')} />
          </label>
          {errors.confirmPassword && <small className="error">{errors.confirmPassword.message}</small>}

          {errors.root && <small className="error">{errors.root.message}</small>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create account'}
          </button>

          <small className="auth-switch">
            Already have an account? <Link to={APP_ROUTES.login}>Sign in</Link>
          </small>
        </form>

        <aside className="auth-visual">
          <img src="/sync-space.svg" alt="" />
          <h2>Build cleaner project workflows.</h2>
          <p>Workspaces, members, tasks, and progress in one place.</p>
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

export default RegisterPage;
