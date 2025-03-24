import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './routes'
import { TooltipProvider } from './components/ui/tooltip'
import './App.css'

function App() {
  return (
    <TooltipProvider>
      <>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </>
    </TooltipProvider>
  )
}

export default App
