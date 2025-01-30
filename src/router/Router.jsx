import { createBrowserRouter } from "react-router-dom";

import APP from "../App"
import REGISTER from "../components/Register"
import LOGIN from "../components/Login"
import Home from "../components/Home";
import CHAT from "../components/Chat"
import ADMIN from "../admin/Admin"
import TEST from "../test/Test"

const router = createBrowserRouter([
    {
        path: "/pj-DPUCare/",
        element: <APP/>
    },
    {
        path: "/pj-DPUCare/register",
        element: <REGISTER/>
    },
    {
        path: "/pj-DPUCare/login",
        element: <LOGIN/>
    },
    {
        path: "pj-DPUCare/home",
        element: <Home/>
    },
    {
        path: "/pj-DPUCare/chat",
        element: <CHAT/>
    },
    {
        path: "/pj-DPUCare/admin",
        element: <ADMIN/>
    },
    {
        path: "/pj-DPUCare/test",
        element: <TEST/>
    }
])

export default router;