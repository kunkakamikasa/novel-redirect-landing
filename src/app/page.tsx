import RedirectClient from "./RedirectClient";

export default function Home() {
  return <RedirectClient entry="home" destinationUrl={process.env.DESTINATION_URL} />;
}
