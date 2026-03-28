import { Outlet } from "react-router-dom";

// File này đóng vai trò là cái khung (Layout)
// Outlet chính là nơi các trang con (Home, Login, Admin...) sẽ hiện ra
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet /> 
    </div>
  );
};

export default App;