import type { Meta, StoryObj } from "@storybook/html";

const meta: Meta = {
  title: "Brand/Icons",
};

export default meta;

type Story = StoryObj;

const icons: Record<string, string> = {
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  scale: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  check: "M5 13l4 4L19 7",
  chevronDown: "M19 9l-7 7-7-7",
  menu: "M4 6h16M4 12h16M4 18h16",
  star: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
};

function createIcon(path: string, color: string = "#50a7dd", size: number = 24): string {
  return `<svg width="${size}" height="${size}" fill="none" stroke="${color}" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
}

function createFilledIcon(path: string, color: string = "#ffaa2b", size: number = 24): string {
  return `<svg width="${size}" height="${size}" fill="${color}" viewBox="0 0 20 20"><path d="${path}"/></svg>`;
}

export const IconSet: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.maxWidth = "700px";
    container.innerHTML = `
      <h2 style="font-family: Poppins, sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 32px;">Icon Set</h2>

      <h3 style="font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #50a7dd;">Feature Icons (Outline)</h3>
      <p style="font-size: 13px; color: #6b7280; margin-bottom: 16px;">Used in feature cards and service descriptions. Heroicons outline style.</p>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px;">
        ${Object.entries(icons).map(([name, path]) => `
          <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(80,167,221,0.1); border-radius: 10px; margin-bottom: 8px;">
              ${createIcon(path, "#50a7dd", 24)}
            </div>
            <p style="font-family: monospace; font-size: 12px; color: #6b7280; margin: 0;">${name}</p>
          </div>
        `).join("")}
      </div>

      <h3 style="font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #50a7dd;">Icon Colors</h3>
      <div style="display: flex; gap: 24px; margin-bottom: 40px;">
        ${[
          { color: "#50a7dd", name: "Blue (default)" },
          { color: "#ffaa2b", name: "Gold (accent)" },
          { color: "#0b0000", name: "Black" },
          { color: "#588aa5", name: "Steel" },
          { color: "#9ca3af", name: "Gray (muted)" },
        ].map(({ color, name }) => `
          <div style="text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 8px;">
              ${createIcon(icons.shield, color, 24)}
            </div>
            <p style="font-family: monospace; font-size: 11px; color: #6b7280; margin: 0;">${name}</p>
          </div>
        `).join("")}
      </div>

      <h3 style="font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #50a7dd;">Icon Sizes</h3>
      <div style="display: flex; align-items: end; gap: 24px; margin-bottom: 40px;">
        ${[16, 20, 24, 28, 32].map(size => `
          <div style="text-align: center;">
            ${createIcon(icons.shield, "#50a7dd", size)}
            <p style="font-family: monospace; font-size: 11px; color: #9ca3af; margin: 8px 0 0 0;">${size}px</p>
          </div>
        `).join("")}
      </div>

      <h3 style="font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #50a7dd;">Star Ratings</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${[5, 4, 3].map(rating => `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="display: flex; gap: 2px;">
              ${Array.from({ length: 5 }).map((_, i) =>
                createFilledIcon(icons.star, i < rating ? "#ffaa2b" : "#e5e7eb", 20)
              ).join("")}
            </div>
            <span style="font-family: monospace; font-size: 12px; color: #6b7280;">${rating}/5</span>
          </div>
        `).join("")}
      </div>
    `;
    return container;
  },
};
