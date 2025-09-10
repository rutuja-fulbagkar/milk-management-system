import './css/style.css';
import './charts/ChartjsConfig';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/scroll-to-top';
import 'react-toastify/dist/ReactToastify.css';
import Routerjs from './routes';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routerjs />
    </>
  );
}
