import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout";
import Root from "./components/Root";
import Dashboard from "./components/Dashboard";
import TodayAppointments from "./components/TodayAppointments";
import NextAppointments from "./components/NextAppointments";
import PendingServices from "./components/PendingServices";
import NewAppointment from "./components/NewAppointment";
import AppointmentsCalendar from "./components/AppointmentsCalendar";
import AppointmentDetail from "./components/AppointmentDetail";
import EditAppointment from "./components/EditAppointment";
import Payments from "./components/Payments";
import PaymentsPending from "./components/PaymentsPending";
import PaymentsFuture from "./components/PaymentsFuture";
import PaymentsReceived from "./components/PaymentsReceived";
import PaymentsChart from "./components/PaymentsChart";
import Pricing from "./components/Pricing";
import Notifications from "./components/Notifications";
import NotificationDetail from "./components/NotificationDetail";
import Clients from "./components/Clients";
import ClientDetail from "./components/ClientDetail";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PhoneVerification from "./components/PhoneVerification";
import OnboardingServices from "./components/OnboardingServices";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/signup",
        Component: SignUp,
      },
      {
        path: "/phone-verification",
        element: (
          <ProtectedRoute requireOnboarding={false}>
            <PhoneVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingServices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Dashboard },
          { path: "today", Component: TodayAppointments },
          { path: "next-appointments", Component: NextAppointments },
          { path: "pending-services", Component: PendingServices },
          { path: "new-appointment", Component: NewAppointment },
          { path: "appointments", Component: AppointmentsCalendar },
          { path: "appointments/:appointmentId", Component: AppointmentDetail },
          { path: "appointments/:appointmentId/edit", Component: EditAppointment },
          { path: "payments", Component: Payments },
          { path: "payments/pending", Component: PaymentsPending },
          { path: "payments/future", Component: PaymentsFuture },
          { path: "payments/received", Component: PaymentsReceived },
          { path: "payments/chart", Component: PaymentsChart },
          { path: "pricing", Component: Pricing },
          { path: "notifications", Component: Notifications },
          { path: "notifications/:notificationId", Component: NotificationDetail },
          { path: "clients", Component: Clients },
          { path: "clients/:clientId", Component: ClientDetail },
        ],
      },
    ],
  },
]);