import { Link } from "react-router-dom";
import LoginForm from "../../Components/Auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-purple-600">
            TopLike
          </h2>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </header>

      {/* Main content */}
      <main className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
