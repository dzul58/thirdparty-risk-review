import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function usernameOnChange(event) {
    setUsername(event.target.value);
  }

  function passwordOnChange(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const dataLogin = { username, password };
      const response = await axios.post(`http://localhost:8000/api/login-vendor`, dataLogin);
      console.log(response, "ini resphone");
      // Periksa apakah response.data ada
      if (response && response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        console.log(response.data.access_token);
        Swal.fire({
          icon: "success",
          title: "Success Login",
        });
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: error.response?.data?.error || "An error occurred during login",
      });
    }
  }

  return (
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light">Moving Address Homepass</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-sky-400 rounded-t-md"></div>
          <div className="px-8 py-6">
            <form onSubmit={handleLogin}>
              <label className="block font-semibold">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                required
                onChange={usernameOnChange}
              />
              <label className="block mt-3 font-semibold">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                required
                onChange={passwordOnChange}
              />
              <div className="flex justify-between items-baseline">
                <button
                  type="submit"
                  className="mt-4 bg-sky-500 text-white py-2 px-6 rounded-md hover:bg-sky-600"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
