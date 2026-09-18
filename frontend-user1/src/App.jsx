import AppRoutes from "./routes/AppRoutes";
import { LibraryLanguageProvider } from "./library";

function App() {
  return (
    <LibraryLanguageProvider>
      <AppRoutes />
    </LibraryLanguageProvider>
  );
}

export default App;

