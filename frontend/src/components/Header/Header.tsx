import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../store/user-context";
import { Modal } from "../UI/Modal";
import { Input } from "../UI/Input";
import { Select } from "../UI/Select";
import { Button } from "../UI/Button";

interface AuthModeState {
  mode: "signin" | "register" | null;
}

export const Header = () => {
  const { isLoggedIn, user, signOut, signIn, register } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthModeState>({ mode: null });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    homeAddress: "",
    mobilePhoneNumber: "",
    vehicleType: "",
    vehiclePlate: "",
    driversLicenseNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = (mode: "signin" | "register") => {
    setError(null);
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      homeAddress: "",
      mobilePhoneNumber: "",
      vehicleType: user?.vehicleType || "",
      vehiclePlate: "",
      driversLicenseNumber: "",
    });
    setAuthState({ mode });
  };
  const close = () => setAuthState({ mode: null });

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);

      const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      // Define validation rules for registration
      const regValidationRules = [
        { field: 'name', message: 'Name is required', check: (value: string) => !value.trim() },
        { field: 'dateOfBirth', message: 'Date of Birth is required', check: (value: string) => !value },
        { field: 'homeAddress', message: 'Home Address is required', check: (value: string) => !value.trim() },
        { field: 'mobilePhoneNumber', message: 'Mobile Phone Number is required', check: (value: string) => !value.trim() },
        { field: 'email', message: 'Email is required', check: (value: string) => !value.trim() },
        { field: 'password', message: 'Password is required', check: (value: string) => !value.trim() },
      ];

      // Define validation rules for sign-in
      const signValidationRules = [
        { field: 'email', message: 'Email is required', check: (value: string) => !value.trim() },
        { field: 'password', message: 'Password is required', check: (value: string) => !value.trim() },
      ];

      // Validation function for sign-in
      const validateForm = (form: any): string | null => {
        // Check field validation rules
        for (const rule of signValidationRules) {
          if (rule.check(form[rule.field])) {
            return rule.message;
          }
        }

        // Check email format
        if (!isValidEmail(form.email)) {
          return "Please enter a valid email address";
        }
        
        // Check password length
        if (form.password.length < 8) {
          return "Password must be at least 8 characters";
        }
        return null;
      };

      const regValidateForm = (form: any): string | null => {
        // Check field validation rules
        for (const rule of regValidationRules) {
          if (rule.check(form[rule.field])) {
            return rule.message;
          }
        }

        // Check email format
        if (!isValidEmail(form.email)) {
          return "Please enter a valid email address";
        }

        // Check password match
        if (form.password !== form.confirmPassword) {
          return "Passwords do not match";
        }

        // Check password length
        if (form.password.length < 8) {
          return "Password must be at least 8 characters";
        }

        return null;
      };

      // In your component, replace the switch statement with:
      if (authState.mode === "register") {
        const validationError = regValidateForm(form);
        if (validationError) {
          setError(validationError);
          return;
        }
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          dateOfBirth: form.dateOfBirth,
          homeAddress: form.homeAddress,
          mobilePhoneNumber: form.mobilePhoneNumber,
          vehicleType: form.vehicleType,
          vehiclePlate: form.vehiclePlate,
          driversLicenseNumber: form.driversLicenseNumber,
        });
      } else if (authState.mode === "signin") {
        const validationError = validateForm(form);
        if (validationError) {
          setError(validationError);
          return;
        }
        await signIn({ 
          email: form.email.trim(), 
          password: form.password 
        });
      }
      close();
    } catch (e: any) {
      setError(e?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }
  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/rideboard", label: "Ride Board", icon: "📋" },
    { path: "/offer-ride", label: "Offer Ride", icon: "🚗", authRequired: true },
    { path: "/request-ride", label: "Request Ride", icon: "🙋", authRequired: true },
    { path: "/vouchers", label: "Vouchers", icon: "☕" },
    // { path: "/profile", label: "Profile", icon: "👤", authRequired: true },
  ];

  return (
    <header className="main-header">
      <div className="logo-area" role="banner">
        <button 
          className="logo-btn" 
          onClick={() => navigate("/")}
          aria-label="Go to home page"
        >
          <h1>☕ Joe Ride</h1>
        </button>
      </div>
      
      <nav className="main-nav">
        {navItems.map(item => {
          if (item.authRequired && !isLoggedIn) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
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
            <span className="user-name">Hello, {user?.name}</span>
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
          <>
            <Input
              required={true}
              label="Name"
              placeholder="Jane Rider"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
            />
            <Input
              label="Home Address"
              placeholder="123 Main St"
              value={form.homeAddress}
              onChange={(e) => setForm(f => ({ ...f, homeAddress: e.target.value }))}
            />
            <Input
              label="Mobile Phone Number"
              placeholder="09123456789"
              value={form.mobilePhoneNumber}
              onChange={(e) => setForm(f => ({ ...f, mobilePhoneNumber: e.target.value }))}
            />
            <Select
              label="Vehicle Type"
              value={form.vehicleType}
              onChange={(e) => setForm(f => ({ ...f, vehicleType: e.target.value }))}
              options={[
                { value: "Car", label: "Car" },
                { value: "Motorcycle", label: "Motorcycle" },
                { value: "SUV", label: "SUV" },
                { value: "Truck", label: "Truck" },
                { value: "Bicycle", label: "Bicycle" },
                { value: "Scooter", label: "Scooter" },
              ]}
              placeholder="Select vehicle type..."
              required={true}
            />
            <Input
              label="Vehicle Plate"
              placeholder="ABC123"
              value={form.vehiclePlate}
              onChange={(e) => setForm(f => ({ ...f, vehiclePlate: e.target.value }))}
            />
            <Input
              label="Driver’s License Number"
              placeholder="DL123456"
              value={form.driversLicenseNumber}
              onChange={(e) => setForm(f => ({ ...f, driversLicenseNumber: e.target.value }))}
            />
          </>
        )}

        {/* Email + Password always shown (for both sign in and register) */}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
        />
        
        {authState.mode === "register" && (
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          />
        )}

        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="modal-actions">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : authState.mode === "register" ? "Register" : "Sign In"}
          </Button>
          {/* <Button onClick={close} variant="secondary" disabled={loading}>Cancel</Button> */}
        </div>

        {authState.mode === "signin" && (
          <p className="switch-auth">
            Need an account?{" "}
            <button className="link-btn" onClick={() => open("register")}>Register</button>
          </p>
        )}
        {authState.mode === "register" && (
          <p className="switch-auth">
            Have an account?{" "}
            <button className="link-btn" onClick={() => open("signin")}>Sign In</button>
          </p>
        )}
      </Modal>

    </header>
  );
};
