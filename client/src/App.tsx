import AuthProvider from "./provider/AuthProvider";
import Routes from "./routes";

export default function App() {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

