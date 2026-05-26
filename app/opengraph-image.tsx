import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TextnGo AI text formatter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top left, #9333ea 0%, #6d28d9 35%, #1e1b4b 100%)",
          color: "white",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 40,
            background: "rgba(15, 23, 42, 0.38)",
            padding: 44,
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "70%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  fontSize: 30,
                  opacity: 0.9,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.14)",
                    fontWeight: 800,
                  }}
                >
                  T
                </div>
                TextnGo
              </div>
              <div
                style={{
                  fontSize: 72,
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: -2,
                }}
              >
                AI text formatting that feels instant.
              </div>
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "rgba(255,255,255,0.84)",
                  maxWidth: 720,
                }}
              >
                Clean text, fix grammar, rewrite professionally, optimize
                resumes, and prepare content for email, social media, and code.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                fontSize: 24,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              <div>Grammar Fixer</div>
              <div>Resume Optimizer</div>
              <div>Case Converter</div>
            </div>
          </div>
          <div
            style={{
              width: 240,
              height: "100%",
              borderRadius: 34,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 128,
              fontWeight: 900,
            }}
          >
            T
          </div>
        </div>
      </div>
    ),
    size,
  );
}
