import { render, screen } from "@testing-library/react";
import Login from "../src/pages/Login.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/AuthContext.jsx";

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

test("renders email input", () => {
  renderWithProviders(<Login />);
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});
