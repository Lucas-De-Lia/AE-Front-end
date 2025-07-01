import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AECreate from "./components/AECreate.jsx";
import AEFinalize from "./components/AEFinalize.jsx";
import AEProfile from "./components/AEProfile.jsx";
import AuthLogin from "./components/AuthLogin.jsx";
import AuthRegister from "./components/AuthRegister.jsx";
import EmailChange from "./components/EmailChange.jsx";
import EmailVerify from "./components/EmailVerify.jsx";
import FAQcard from "./components/FAQ.jsx";
import NewsTable from "./components/NewsTable.jsx";
import NewsView from "./components/NewsView.jsx";
import PasswordChange from "./components/PasswordChange.jsx";
import ForgotPassword from "./components/PasswordForgot.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import { EmailVerifyProvider } from "./contexts/EmailVerifyContext.js";
import { PasswordServiceProvider } from "./contexts/PasswordContext.js";
import { PublicResourcesProvider } from "./contexts/PublicResourcesContext.js";
import { ServiceProvider } from "./contexts/ServiceContext.js";
import ErrorPage from "./frames/ErrorPage.jsx";
import Root from "./frames/Root.jsx";
import { NewEmailVerify } from "./components/NewEmailVerify.jsx";

const MemoizedErrorPage = React.memo(ErrorPage);
const MemorizedRoot = React.memo(Root);
const MemorizedPublicResourcesProvider = React.memo(PublicResourcesProvider);

// Crea un nuevo tema con el color primario modificado
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(229,95,29)",
    },
  },
});

function App() {
  return (
    <div className="App app-container">
      <ThemeProvider theme={theme}>
        <ServiceProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <MemorizedPublicResourcesProvider>
                    <MemorizedRoot />
                  </MemorizedPublicResourcesProvider>
                }
                errorElement={<MemoizedErrorPage />}
              >
                <Route index element={<NewsTable />} />
                <Route path="faq" element={<FAQcard />} />
                <Route path="document/:id" element={<NewsView />} />
              </Route>
              <Route
                path="/auth"
                element={<MemorizedRoot />}
                errorElement={<MemoizedErrorPage />}
              >
                <Route path="login" element={<AuthLogin />} />
                <Route
                  path="register"
                  element={
                    <MemorizedPublicResourcesProvider>
                      <AuthRegister />
                    </MemorizedPublicResourcesProvider>
                  }
                />
              </Route>

              <Route
                path="/ae"
                element={<MemorizedRoot />}
                errorElement={<MemoizedErrorPage />}
              >
                <Route path="finalize" element={<AEFinalize />} />
                <Route
                  path="create"
                  element={
                    <PublicResourcesProvider>
                      <AECreate />
                    </PublicResourcesProvider>
                  }
                />
                <Route path="profile" element={<AEProfile />} />
              </Route>

              <Route
                path="/password"
                element={
                  <PasswordServiceProvider>
                    <MemorizedRoot />
                  </PasswordServiceProvider>
                }
                errorElement={<MemoizedErrorPage />}
              >
                <Route path="change" element={<PasswordChange />} />
                <Route path="forgot" element={<ForgotPassword />} />
                <Route path="reset" element={<PasswordReset />} />
              </Route>

              <Route
                path="/email"
                element={
                  <EmailVerifyProvider>
                    <MemorizedRoot />
                  </EmailVerifyProvider>
                }
                errorElement={<MemoizedErrorPage />}
              >
                <Route path="change" element={<EmailChange />} />
                <Route path="verify/:id/:hash" element={<EmailVerify />} />
                <Route
                  path="verify-new-email/:token"
                  element={<NewEmailVerify />}
                />
              </Route>
              <Route path="*" element={<MemoizedErrorPage />} />
            </Routes>
          </BrowserRouter>
        </ServiceProvider>
      </ThemeProvider>
    </div>
  );
}
export default App;
