import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function AppLayout() {
  return (
    <div>
      <Nav />
      <main className="px-2">
        <Outlet /> 
      </main>
    </div>
  );
}

export default AppLayout;
