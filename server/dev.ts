import httpServer from "./api";

const PORT = 4000;

// Now that our HTTP server is fully set up, we can listen to it
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
