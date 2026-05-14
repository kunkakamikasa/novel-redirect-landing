import RedirectClient from "../RedirectClient";

export default function RedirectEntry() {
  return <RedirectClient entry="r" destinationUrl={process.env.DESTINATION_URL} />;
}
