import { useState } from "react";
import { useUser } from "../../store/user-context";
import { Modal } from "../UI/Modal";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";

interface AuthModeState {
  mode: "signin" | "register" | null;
}

export const Header = () => {
  const { isLoggedIn, user, signOut, signIn, register } = useUser();
  const [authState, setAuthState] = useState<AuthModeState>({ mode: null });
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = (mode: "signin" | "register") => {
    setError(null);
    setForm({ name: "", email: "", password: "" });
    setAuthState({ mode });
  };
  const close = () => setAuthState({ mode: null });

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      if (authState.mode === "register") {
        if (!form.name.trim()) {
          setError("Name is required");
          return;
        }
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      } else if (authState.mode === "signin") {
        await signIn({ email: form.email.trim(), password: form.password });
      }
      close();
    } catch (e: any) {
      setError(e?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="main-header">
      <div className="logo-area" role="banner">
        <h1>☕ Joe Ride</h1>
      </div>
      <nav className="main-nav">
        {/* Future nav links */}
      </nav>
      <div className="auth-area">
        {!isLoggedIn && (
          <>
            <Button onClick={() => open("signin")} variant="secondary">Sign In</Button>
            <Button onClick={() => open("register")}>Register</Button>
          </>
        )}
        {isLoggedIn && (
          <div className="user-chip">
            <span className="user-name">{user?.name}</span>
            <Button onClick={signOut} variant="secondary">Sign Out</Button>
          </div>
        )}
      </div>

      <Modal
        open={authState.mode !== null}
        onClose={close}
        title={authState.mode === "register" ? "Create Account" : "Sign In"}
      >
        {authState.mode === "register" && (
          <Input
            label="Name"
            placeholder="Jane Rider"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="modal-actions">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : authState.mode === "register" ? "Register" : "Sign In"}
          </Button>
          <Button onClick={close} variant="secondary" disabled={loading}>Cancel</Button>
        </div>
        {authState.mode === "signin" && (
          <p className="switch-auth">Need an account? <button className="link-btn" onClick={() => open("register")}>Register</button></p>
        )}
        {authState.mode === "register" && (
          <p className="switch-auth">Have an account? <button className="link-btn" onClick={() => open("signin")}>Sign In</button></p>
        )}
      </Modal>
    </header>
  );
};
