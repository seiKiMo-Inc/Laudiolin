import tailwind from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";
import autoprefixer from "autoprefixer";
import fontmagician from "postcss-font-magician";
import cssnano from "cssnano";

const mode = process.env.NODE_ENV;
const dev = mode === "development";

export default {
    plugins: [
        // Some plugins, like TailwindCSS/Nesting, need to run before Tailwind.
        tailwind(tailwindConfig),
        fontmagician(),

        // But others, like autoprefixer, need to run after.
        autoprefixer(),
        !dev && cssnano({
            preset: 'default'
        })
    ]
};