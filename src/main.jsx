import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './routes/App.jsx'

// Lazy load routes for better performance
const Home = React.lazy(() => import('./routes/Home.jsx'))
const Predict = React.lazy(() => import('./routes/Predict.jsx'))
const Feelings = React.lazy(() => import('./routes/Feelings.jsx'))
const Goat = React.lazy(() => import('./routes/Goat.jsx'))
// Loading component with consistent styling
const LoadingFallback = () => (
  <div className="card" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
    <p>Loading...</p>
  </div>
)

const router = createBrowserRouter(
  [
    { path: '/', element: <App />, children: [
      { index: true, element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense> },
      { path: '/predict', element: <Suspense fallback={<LoadingFallback />}><Predict /></Suspense> },
      { path: '/feelings', element: <Suspense fallback={<LoadingFallback />}><Feelings /></Suspense> },
      { path: '/goat', element: <Suspense fallback={<LoadingFallback />}><Goat /></Suspense> },
    ] }
  ],
  { basename: import.meta.env.BASE_URL }     // <-- add this line
)
createRoot(document.getElementById('root')).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
