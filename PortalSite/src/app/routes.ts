import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { BulletinBoard } from "./pages/BulletinBoard";
import { Applications } from "./pages/Applications";
import { Attendance } from "./pages/Attendance";
import { Accounting } from "./pages/Accounting";
import { DocumentManagement } from "./pages/DocumentManagement";
import { Knowledge } from "./pages/InternalDocs";
import { Notifications } from "./pages/Alerts";
import { Masters } from "./pages/Masters";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "bulletin-board", Component: BulletinBoard },
      { path: "applications", Component: Applications },
      { path: "attendance", Component: Attendance },
      { path: "accounting", Component: Accounting },
      { path: "documents", Component: DocumentManagement },
      { path: "internal-docs", Component: Knowledge },
      { path: "alerts", Component: Notifications },
      { path: "masters", Component: Masters },
    ],
  },
]);
