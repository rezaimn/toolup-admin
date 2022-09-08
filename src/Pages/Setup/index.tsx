import React from "react";
import { loadable } from "Helpers/loadable";

export default loadable(() => import("./Setup"), {
fallback: null,
});