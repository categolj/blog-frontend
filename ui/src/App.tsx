import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { useTheme } from './hooks/useTheme';
import type { Router as RouterType } from '@remix-run/router';

interface AppProps {
  router: RouterType;
}

const App = ({ router }: AppProps) => {
  // This hook will apply the theme class to the root element
  useTheme();
  
  return (
    <HelmetProvider>
      <RouterProvider router={router}/>
    </HelmetProvider>
  );
};

export default App;