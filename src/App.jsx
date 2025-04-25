import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import { UserProvider } from "../context/userContext";
import { RoomProvider } from "../context/roomContext";
import { Toast } from "./components/Toast";

function App() {
  return (
    <Router>
      <UserProvider>
        <Toast />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/" element={<AppLayout />}>
            <Route path="settings" element={<Settings />} />
            <Route path="rooms" element={<Rooms />} />
            <Route
              path="/room/:id"
              element={
                <RoomProvider>
                  <Room />
                </RoomProvider>
              }
            />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
