import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-backdrop" />
      <section className="auth-card">
        <h1>{isLogin ? "Sign In" : "Create Account"}</h1>
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <label>
              Name
              <input name="name" type="text" value={form.name} onChange={onChange} required />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              minLength={6}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <p>
          {isLogin ? "New customer?" : "Already a customer?"}
          <button className="link-btn" onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? " Create account" : " Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
