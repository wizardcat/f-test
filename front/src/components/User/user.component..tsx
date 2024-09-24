import { useUser } from './use-user.hook';

export const User = () => {
  const { user, handleLogout, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>You are not logged in</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 w-full px-4 py-1 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
      >
        Logout
      </button>
    </div>
  );
};
