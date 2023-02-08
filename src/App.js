import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import Header from './components/Header';
import Home from './components/Home';
import TableUsers from './components/TableUsers';

function App() {

  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/users' element={<TableUsers />}></Route>
          </Routes>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
