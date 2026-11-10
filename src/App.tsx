import { RouterProvider } from "react-router"
import { router } from "./routes"
import Toaster from "./components/ui/Toaster"

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
