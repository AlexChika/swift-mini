import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  LocalStateError,
  ServerError,
  ServerParseError,
  UnconventionalError
} from "@apollo/client/errors";

function handleError(error: unknown, handler?: (error: unknown) => void) {
  if (CombinedGraphQLErrors.is(error)) {
    console.log(error.cause);
    console.log("error.graphQLErrors");
    // Handle GraphQL errors
  } else if (CombinedProtocolErrors.is(error)) {
    console.log(error.cause);
    console.log("error.protocolErrors");
    // Handle multipart subscription protocol errors
  } else if (LocalStateError.is(error)) {
    console.log(error.cause);
    console.log("error.localStateErrors");
    // Handle errors thrown by the `LocalState` class
  } else if (ServerError.is(error)) {
    console.log(error.cause);
    console.log("error.serverErrors");
    // Handle server HTTP errors
  } else if (ServerParseError.is(error)) {
    console.log(error.cause);
    console.log("error.serverParseErrors");
    // Handle JSON parse errors
  } else if (UnconventionalError.is(error)) {
    console.log(error.cause);
    console.log("error.unconventionalErrors");
    // Handle errors thrown by irregular types
  } else {
    console.log(error);
    console.log("error.otherErrors");
    // Handle other errors
  }
}

export default handleError;
