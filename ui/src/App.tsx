import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { useTheme } from './hooks/useTheme';
import type { DataRouter } from 'react-router';

interface AppProps {
  router: DataRouter;
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