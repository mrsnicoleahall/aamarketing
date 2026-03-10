import type { Meta, StoryObj } from "@storybook/html";

const meta: Meta = {
  title: "Brand/Patterns",
};

export default meta;

type Story = StoryObj;

export const H2AccentText: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.maxWidth = "800px";
    container.innerHTML = `
      <h2 style="font-family: Poppins, sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 24px;">H2 Accent Text Treatment</h2>
      <p style="font-family: Roboto, sans-serif; font-size: 14px; color: #6b7280; margin-bottom: 32px;">
        Key H2 headings use italic colored accent words for visual interest. Use 1–2 accent words per heading.
        Gold (#ffaa2b) and Blue (#50a7dd) are the accent colors.
      </p>

      <div style="margin-bottom: 24px; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <h2 style="font-family: Poppins, sans-serif; font-size: 36px; font-weight: 700; color: #0b0000; margin: 0;">
          <em style="font-style: italic; color: #ffaa2b;">Simple.</em> Fast. <em style="font-style: italic; color: #50a7dd;">Effective.</em>
        </h2>
      </div>

      <div style="margin-bottom: 24px; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <h2 style="font-family: Poppins, sans-serif; font-size: 36px; font-weight: 700; color: #0b0000; margin: 0;">
          <em style="font-style: italic; color: #ffaa2b;">Transform</em> Your Practice
        </h2>
      </div>

      <div style="margin-bottom: 24px; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <h2 style="font-family: Poppins, sans-serif; font-size: 36px; font-weight: 700; color: #0b0000; margin: 0;">
          Unlock Your Firm's <em style="font-style: italic; color: #50a7dd;">Full Potential</em>
        </h2>
      </div>

      <div style="margin-bottom: 24px; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <h2 style="font-family: Poppins, sans-serif; font-size: 36px; font-weight: 700; color: #0b0000; margin: 0;">
          Your <em style="font-style: italic; color: #ffaa2b;">Elite</em> Back-Office Team
        </h2>
      </div>

      <div style="margin-top: 32px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
        <p style="font-family: monospace; font-size: 13px; color: #374151; margin: 0; white-space: pre-wrap;">Gold: &lt;em class="not-italic text-brand-gold italic"&gt;Word&lt;/em&gt;
Blue: &lt;em class="not-italic text-brand-blue italic"&gt;Word&lt;/em&gt;</p>
      </div>
    `;
    return container;
  },
};

export const DottedBackground: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.maxWidth = "800px";
    container.innerHTML = `
      <h2 style="font-family: Poppins, sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 24px;">Dotted Background Pattern</h2>
      <p style="font-family: Roboto, sans-serif; font-size: 14px; color: #6b7280; margin-bottom: 32px;">
        A subtle polka dot pattern used behind service grids and card sections for texture.
        Pair <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">bg-dots</code>
        with <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">bg-gray-50</code>.
      </p>

      <div style="background-color: #f9fafb; background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px); background-size: 24px 24px; border-radius: 12px; padding: 48px 32px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          ${[1, 2, 3].map((i) => `
            <div style="background: white; border: 1px solid #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="width: 40px; height: 40px; background: #1a3a5c; border-radius: 8px; margin: 0 auto 12px;"></div>
              <p style="font-family: Poppins, sans-serif; font-weight: 600; font-size: 16px; color: #0b0000; margin: 0 0 4px;">Service ${i}</p>
              <p style="font-family: Roboto, sans-serif; font-size: 13px; color: #6b7280; margin: 0;">Description text</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
        <p style="font-family: monospace; font-size: 13px; color: #374151; margin: 0; white-space: pre-wrap;">CSS:
.bg-dots {
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 24px 24px;
}</p>
      </div>
    `;
    return container;
  },
};
