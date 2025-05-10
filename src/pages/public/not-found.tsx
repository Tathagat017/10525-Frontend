import { Box } from "@mantine/core";
import { getImage } from "../../utils/image-map";

const NotFoundPage = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      style={{
        backgroundImage: `url(${getImage("not_found")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    />
  );
};

export default NotFoundPage;
