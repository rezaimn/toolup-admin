import React from "react";
import { loadable } from "Helpers/loadable";

export default loadable(() => import("./EditTeamMembers"), {
fallback: null,
});