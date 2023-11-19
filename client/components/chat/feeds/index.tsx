import { Session } from "next-auth";

type Props = {
  session: Session;
};

function Feeds({ session }: Props) {
  return <div>Feeds</div>;
}

export default Feeds;
