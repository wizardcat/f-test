import { Link } from 'react-router-dom';
import { useLogin } from './use-login.hook';

export const Login = () => {
  const { register, handleSubmit, errors, onSubmit } = useLogin();

  return (
    <div className="w-[300px] mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`h-8 mt-1 w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password')}
            className={`h-8 w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="h-8 w-full px-4 mt-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
