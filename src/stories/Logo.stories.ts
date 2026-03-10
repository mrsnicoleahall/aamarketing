import type { Meta, StoryObj } from "@storybook/html";

const meta: Meta = {
  title: "Brand/Logo",
};

export default meta;

type Story = StoryObj;

const logos = [
  { file: "Attorney%20Assistant_H_FC.svg", label: "Horizontal Full Color", bg: "white", text: "#0b0000" },
  { file: "Attorney%20Assistant_H_Black.svg", label: "Horizontal Black", bg: "white", text: "#0b0000" },
  { file: "Attorney%20Assistant_H_White.svg", label: "Horizontal White", bg: "#1a3a5c", text: "white" },
  { file: "Attorney%20Assistant_V_FC.svg", label: "Vertical Full Color", bg: "white", text: "#0b0000" },
  { file: "Attorney%20Assistant_V_Black.svg", label: "Vertical Black", bg: "white", text: "#0b0000" },
  { file: "Attorney%20Assistant_V_White.svg", label: "Vertical White", bg: "#1a3a5c", text: "white" },
  { file: "color_icon.svg", label: "Color Icon (Favicon)", bg: "white", text: "#0b0000" },
  { file: "color_icon.png", label: "Color Icon PNG", bg: "white", text: "#0b0000" },
];

export const LogoVariations: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.maxWidth = "900px";
    container.innerHTML = `
      <h2 style="font-family: Poppins, sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 32px;">Logo Variants</h2>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
        ${logos.map((logo) => `
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: ${logo.bg}; padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 120px;">
              <img src="/brand/logos/${logo.file}" alt="${logo.label}" style="max-height: 80px; max-width: 100%;" />
            </div>
            <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e5e7eb;">
              <span style="font-family: Roboto, sans-serif; font-size: 13px; color: #6b7280;">${logo.label}</span>
              <a href="/brand/logos/${logo.file}" download style="font-family: Roboto, sans-serif; font-size: 12px; color: #50a7dd; text-decoration: none; padding: 4px 10px; border: 1px solid #50a7dd; border-radius: 6px;">Download</a>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return container;
  },
};
