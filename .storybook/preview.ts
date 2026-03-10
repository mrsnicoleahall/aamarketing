import type { Preview } from "@storybook/html";
import "../src/styles/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#ffffff" },
        { name: "light gray", value: "#f9fafb" },
        { name: "brand black", value: "#0b0000" },
      ],
    },
  },
};

export default preview;
