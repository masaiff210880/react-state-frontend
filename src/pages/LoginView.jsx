import { useState } from "react";
import Logo from "../components/Logo";

function LoginView({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;
    const nextErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      nextErrors.email = "Email is required.";
    }

    if (email && !isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", password: "" });
    onLogin();
  };

  return (
    <section className="login-stage">
      <div className="login-grid">
        <aside className="login-copy">
          <Logo />
          <p className="eyebrow">Login Page</p>
          <h1>Sign in to continue dashboard access</h1>
        </aside>

        <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            autoComplete="off"
          />
          {errors.email ? <p className="form-error">{errors.email}</p> : null}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            autoComplete="new-password"
          />
          {errors.password ? (
            <p className="form-error">{errors.password}</p>
          ) : null}

          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}

export default LoginView;
