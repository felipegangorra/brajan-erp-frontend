import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;