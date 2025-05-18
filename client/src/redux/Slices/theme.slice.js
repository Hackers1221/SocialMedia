import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark"
}

const themeSlice = createSlice ({
    name: "theme",
    initialState,
    reducers: {
      toggleTheme: (state) => {
        state.theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem ("theme", state.theme);
        document.documentElement.setAttribute("data-theme", state.theme);
      },
      setTheme: (state, action) => {
        state.theme = action.payload;
        localStorage.setItem("theme", state.theme);
        document.documentElement.setAttribute("data-theme", state.theme);
      },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;