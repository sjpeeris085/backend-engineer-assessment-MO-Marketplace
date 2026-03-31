import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public or shared route for customers and guests */}
          <Route path="/" element={<Home />} />
          
          {/* Protected route mapping only for ADMIN */}
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
