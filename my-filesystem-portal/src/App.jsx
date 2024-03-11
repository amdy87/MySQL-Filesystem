import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import  {LoginPage, FileViewPage} from '@pages'

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/file" element={<FileViewPage/>} />
    </Routes>
  </BrowserRouter>
}

export default App;
