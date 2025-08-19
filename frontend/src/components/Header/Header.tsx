import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../store/user-context";
import { Modal } from "../UI/Modal";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";

interface AuthModeState {
  mode: "signin" | "register" | null;
}

export const Header = () => {
  const { isLoggedIn, user, canOfferRides, signOut, signIn, register } = useUser();
  const [authState, setAuthState] = useState<AuthModeState>({ mode: null });
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
      dateOfBirth: "",
      homeAddress: "",
      mobilePhoneNumber: "",
      vehicleType: "",
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
      if (authState.mode === "register") {
        if (!form.name.trim()) {
          setError("Name is required");
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
        await signIn({ email: form.email.trim(), password: form.password });
      }
      close();
    } catch (e: any) {
      setError(e?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  // Demo login function for testing
  const demoLogin = (hasLicense: boolean = false) => {
    const demoUser = hasLicense ? {
      id: "demo-driver",
      name: "Demo Driver",
      email: "driver@demo.com",
      isVerified: true,
      rating: 4.8,
      driversLicenseNumber: "DL123456789",
      hasValidLicense: true,
      vehicleType: "car",
      vehiclePlate: "ABC123",
    } : {
      id: "demo-passenger",
      name: "Demo Passenger",
      email: "passenger@demo.com",
      isVerified: true,
      rating: 4.5,
      hasValidLicense: false,
    };
    
    // Set demo user
    localStorage.setItem("joeRideUser", JSON.stringify(demoUser));
    
    window.location.reload();
  };

  return (
    <header className="main-header">
      <div className="logo-area" role="banner">
        <Link to="/" className="logo-link">
          <h1>☕ Joe Ride</h1>
        </Link>
      </div>
      <nav className="main-nav" role="navigation">
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/rideboard" 
            className={`nav-link ${location.pathname === '/rideboard' ? 'active' : ''}`}
          >
            🚗 Find Rides
          </Link> 
          {canOfferRides && (
            <Link 
              to="/offer-ride" 
              className={`nav-link ${location.pathname === '/offer-ride' ? 'active' : ''}`}
            >
              🎯 Offer Ride
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                👤 Profile
              </Link>
              <Link 
                to="/vouchers" 
                className={`nav-link ${location.pathname === '/vouchers' ? 'active' : ''}`}
              >
                ☕ Vouchers
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="auth-area">
        {!isLoggedIn && (
          <>
            <Button onClick={() => open("signin")} variant="secondary">Sign In</Button>
            <Button onClick={() => open("register")}>Register</Button>
            <div className="demo-buttons">
              <Button onClick={() => demoLogin(true)} variant="secondary" size="small">
                Demo Driver
              </Button>
              <Button onClick={() => demoLogin(false)} variant="secondary" size="small">
                Demo Passenger
              </Button>
            </div>
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
            <Input
              label="Vehicle Type"
              placeholder="Car, Motorcycle..."
              value={form.vehicleType}
              onChange={(e) => setForm(f => ({ ...f, vehicleType: e.target.value }))}
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

        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="modal-actions">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : authState.mode === "register" ? "Register" : "Sign In"}
          </Button>
          <Button onClick={close} variant="secondary" disabled={loading}>Cancel</Button>
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
