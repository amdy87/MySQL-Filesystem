import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginPage, FileViewPage, SignUpPage, FileContentView } from '@pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/file" element={<FileViewPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/content/:userId/:fileId" element={<FileContentView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
