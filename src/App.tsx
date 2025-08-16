import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./store/user-context";
import { VehicleProvider } from "./store/vehicle-context";
import { RidesProvider } from "./store/rides-context";
import { VoucherProvider } from "./store/voucher-context";
import { NotificationsProvider } from "./store/notifications-context";

// Pages
import { Home } from "./pages/Home";
import { RideBoard } from "./pages/RideBoard";
import { OfferRide } from "./pages/OfferRide";
import { RequestRide } from "./pages/RequestRide";
import { UserProfile } from "./pages/UserProfile";
import { VoucherSummary } from "./pages/VoucherSummary";

import "./App.css";

const App: React.FC = () => {
  return (
    <UserProvider>
      <VehicleProvider>
        <RidesProvider>
          <VoucherProvider>
            <NotificationsProvider>
              <Router>
                <div className="App">
                  <header className="app-header">
                    <nav>
                      <h1>☕ Joe Ride</h1>
                      {/* Navigation will be added later */}
                    </nav>
                  </header>

                  <main className="app-main">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/rideboard" element={<RideBoard />} />
                      <Route path="/offer-ride" element={<OfferRide />} />
                      <Route path="/request-ride" element={<RequestRide />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/vouchers" element={<VoucherSummary />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </NotificationsProvider>
          </VoucherProvider>
        </RidesProvider>
      </VehicleProvider>
    </UserProvider>
  );
};

export default App;
