import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './routes/App.jsx'
import Home from './routes/Home.jsx'
import Predict from './routes/Predict.jsx'
import Feelings from './routes/Feelings.jsx'
import Goat from './routes/Goat.jsx'
const router=createBrowserRouter([{path:'/',element:<App/>,children:[{index:true,element:<Home/>},{path:'/predict',element:<Predict/>},{path:'/feelings',element:<Feelings/>},{path:'/goat',element:<Goat/>}]}]);
createRoot(document.getElementById('root')).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
