import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { APP_ROUTES } from '../constant';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/error';
import { registerSchema } from '../utils/validators';
import './LoginPage.css';

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();

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
      await authService.register({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
      navigate(APP_ROUTES.login);
    } catch (error) {
      setError('root', { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create account</h1>

        <label>
          Display Name
          <input type="text" {...register('displayName')} />
        </label>
        {errors.displayName && <small className="error">{errors.displayName.message}</small>}

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

        <label>
          Confirm Password
          <input type="password" {...register('confirmPassword')} />
        </label>
        {errors.confirmPassword && <small className="error">{errors.confirmPassword.message}</small>}

        {errors.root && <small className="error">{errors.root.message}</small>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>

        <small>
          Already have an account? <Link to={APP_ROUTES.login}>Sign in</Link>
        </small>
      </form>
    </div>
  );
};

export default RegisterPage;