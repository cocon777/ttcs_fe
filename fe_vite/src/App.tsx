import "./index.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-slate-100 text-sm text-gray-800">
      <Outlet />
    </div>
  );
}

export default App;
