import { Breadcrumbs, Anchor, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const SimpleBreadcrumb = ({
  items,
}: {
  items: { label: string; to: string }[];
}) => {
  const navigate = useNavigate();

  const crumbs = items.map((item, index) => (
    <Anchor
      key={index}
      onClick={(e) => {
        e.preventDefault();
        navigate(item.to);
      }}
      size="lg"
      style={{ textDecoration: "none" }}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <Box
      style={{
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <Breadcrumbs separator="→" style={{ fontSize: "16px" }}>
        {crumbs}
      </Breadcrumbs>
    </Box>
  );
};
