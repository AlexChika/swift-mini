import { useEffect } from "react";

type Props = {
  child: JSX.Element;
};

function StartScreen({ child }: Props) {
  // initialize / fetch all queries for catching

  // listen to network changes here
  //  call toast and alert user
  useEffect(() => {}, []);

  function isloading() {
    return true;
  }

  return <div>{child}</div>;
}

export default StartScreen;
