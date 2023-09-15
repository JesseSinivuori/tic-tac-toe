import { ImageResponse } from "next/server";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = ["image/avif", "image/webp"];

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        <span style={{ color: "rgba(255, 255, 255)" }}>.j</span>
        <span style={{ color: "#22c55e" }}>s</span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
