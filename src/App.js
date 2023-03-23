import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoLayout from './components/TodoLayout'
import Home from './components/TodoLayout/Home'
import HomeMuiTable from './components/TodoLayout/HomeMuiTable'
import CreateTodo from './components/TodoLayout/CreateTodo'
import EditTodo from './components/TodoLayout/EditTodo'
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createContext, useState, useEffect } from 'react';
import React from "react";




export const Context = createContext(null);

function App() {





  const [darkMode, setDarkMode] = useState(false);
 
  const [theme, setTheme] = useState(createTheme({
    palette: {
      mode: 'light',
    },
  }));

  useEffect(()=>{
    setTheme(createTheme({
      palette: {
        mode: darkMode? "dark" :'light',
      },
    }));
  },[darkMode]);
  
  return (
   

  
    <Context.Provider value={[darkMode,setDarkMode]}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<TodoLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="mui" element={<HomeMuiTable />} />
        {/* <Route path="createTodo" element={<CreateTodo />} /> */}
        <Route path="createTodo" element={<EditTodo />} />
        <Route path="editTodo/:id" element={<EditTodo />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </Context.Provider>
   
  );
}

export default App;
