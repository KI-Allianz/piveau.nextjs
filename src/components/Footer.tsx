import FooterClient from "./FooterClient";

export default function Footer() {
  const deployment = process.env.DEPLOYMENT?.trim() || "development";

  return <FooterClient deployment={deployment} />;
}
