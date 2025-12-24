import * as React from "react";
import LoadingBar from "@cloudscape-design/chat-components/loading-bar";
import LiveRegion from "@cloudscape-design/components/live-region";
import Box from "@cloudscape-design/components/box";

export default () => {
  return (
    <LiveRegion>
      <Box
        margin={{ bottom: "xs", left: "l" }}
        color="text-body-secondary"
      >
        Generating a response
      </Box>
      <LoadingBar variant="gen-ai-masked" />
    </LiveRegion>
  );
}