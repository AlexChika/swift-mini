import useFetchChats from "./useFetchChats";

function InitSwiftMini() {
  // step1 connect to socket

  // step2 subscribe to socket

  // step3 fetch all chats
  const { data, error } = useFetchChats();

  // step4 set allChats

  // step5 set app initialized to true
}

export default InitSwiftMini;
