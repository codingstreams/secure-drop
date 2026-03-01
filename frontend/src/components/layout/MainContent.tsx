import { Routes, Route, Navigate } from "react-router-dom";
import AboutScreen from "../../screens/AboutScreen";
import DownloadScreen from "../../screens/DownloadScreen";
import FilesScreen from "../../screens/FilesScreen";
import TermsScreen from "../../screens/TermsScreen";
import UploadScreen from "../../screens/UploadScreen";
import AccountScreen from "../../screens/AccountScreen";
import AuthScreen from "../../screens/auth-screen/AuthScreen";
import ProtectedRoute from "../ProtectedRoute";

interface MainContentProps { }

const MainContent: React.FC<MainContentProps> = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Routes>
        {/* PUBLIC ROUTES: Accessible to everyone */}
        <Route path="/" element={<UploadScreen />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/download" element={<DownloadScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/terms" element={<TermsScreen />} />

        {/* PROTECTED ROUTES: Requires Login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/files" element={<FilesScreen />} />
          <Route path="/account" element={<AccountScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default MainContent;