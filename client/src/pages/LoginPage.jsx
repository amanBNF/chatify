import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form:", form);

    // TODO: send login request to backend
  };

  return (
    <div className="w-full max-w-sm bg-white/5 backdrop-blur-md px-6 py-8 rounded-xl shadow-md border border-white/10">

      <h2 className="text-2xl font-semibold text-center text-white mb-5">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 
                       text-white placeholder-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 
                       text-white placeholder-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full cursor-pointer py-2.5 bg-cyan-500/90 hover:bg-cyan-400 
                     text-slate-900 rounded-lg text-sm font-semibold
                     transition shadow-md shadow-cyan-500/20"
        >
          Login
        </button>
      </form>

      <p className="text-gray-300 text-xs text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-cyan-400 cursor-pointer hover:text-cyan-300 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
