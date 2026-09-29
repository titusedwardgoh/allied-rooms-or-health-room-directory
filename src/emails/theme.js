export const colors = {
  paper: "#fafaf9",
  white: "#ffffff",
  ink: "#1c1917",
  mute: "#78716c",
  line: "#e7e5e4",
  sage: "#115e59",
  stone: "#f5f5f4",
};

export const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

export const main = {
  backgroundColor: colors.paper,
  fontFamily,
  padding: "32px 12px",
};

export const container = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.line}`,
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px 28px",
};

export const logo = {
  color: colors.sage,
  fontSize: "15px",
  fontWeight: "800",
  letterSpacing: "-0.02em",
  margin: "0 0 24px",
};

export const heading = {
  color: colors.ink,
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  lineHeight: "28px",
  margin: "0 0 8px",
};

export const bodyText = {
  color: colors.mute,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 20px",
};

export const card = {
  backgroundColor: colors.stone,
  border: `1px solid ${colors.line}`,
  borderRadius: "12px",
  margin: "0 0 16px",
  padding: "16px",
};

export const cardOnWhite = {
  ...card,
  backgroundColor: colors.white,
};

export const cardLabel = {
  color: "#a8a29e",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0 0 10px",
  textTransform: "uppercase",
};

export const infoLine = {
  color: colors.ink,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 4px",
};

export const link = {
  color: colors.sage,
  fontWeight: "600",
  textDecoration: "none",
};

export const note = {
  color: colors.mute,
  fontSize: "13px",
  lineHeight: "20px",
  margin: "8px 0 0",
};

export const hr = {
  borderColor: colors.line,
  borderTop: `1px solid ${colors.line}`,
  margin: "24px 0 16px",
};

export const footer = {
  color: "#a8a29e",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};

export const buttonWrap = {
  margin: "8px 0 4px",
};

export const button = {
  backgroundColor: colors.sage,
  borderRadius: "999px",
  color: colors.white,
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "600",
  padding: "12px 22px",
  textDecoration: "none",
};
