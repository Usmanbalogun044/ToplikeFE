import { Link } from "react-router-dom";
import LoginForm from "../../Components/Auth/LoginForm";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(""); // clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const loginUrl = "https://toplike.up.railway.app/api/signin";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      };

      const response = await fetch(loginUrl, options);
      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases
        if (data.errors) {
          // If the API returns field-specific errors
          setError(Object.values(data.errors).join(", "));
        } else if (data.message) {
          // If the API returns a general message
          setError(data.message);
        } else {
          setError("Login failed. Please try again.");
        }
        return;
      }
//ok
      // Successful login
      localStorage.setItem("token", data.token);

      // Store remember me preference
      if (formData.remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };


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
