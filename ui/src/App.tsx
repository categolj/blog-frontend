import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTheme } from './hooks/useTheme';
import type { createBrowserRouter } from "react-router-dom";

interface AppProps {
  router: ReturnType<typeof createBrowserRouter>;
}

const App = ({ router }: AppProps) => {
  // This hook will apply the theme class to the root element
  useTheme();
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

export default App;
