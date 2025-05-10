import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Drawer,
  Group,
  Indicator,
  Menu,
  Stack,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";

const useStyles = createStyles((theme) => ({
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: `linear-gradient(to right, ${theme.fn.rgba(
      theme.colors.dark[6],
      0.9
    )}, ${theme.fn.rgba(theme.colors.dark[4], 0.9)})`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${theme.fn.rgba(theme.colors.gray[9], 0.2)}`,
    boxShadow: theme.shadows.md,
    color: theme.white,
  },
}));

export const NavBar = observer(function NavBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState("Home");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { classes } = useStyles();
  const { authStore } = useStore();
  const navigate = useNavigate();

  const isLoggedIn = authStore.IsAuthenticated;
  const userRole = authStore.Role;

  const founderLinks = [
    { label: "Dashboard", href: "/founder/dashboard" },
    { label: "Funding Simulation", href: "/founder/funding-simulation" },
    { label: "Leaderboard", href: "/leaderboard" },
  ];

  const investorLinks = [
    { label: "Explore Startups", href: "/investor/browse" },
    { label: "Pitch Rooms", href: "/investor/pitch-room/:roomId" },
    { label: "Leaderboard", href: "/leaderboard" },
  ];

  const publicLinks = [{ label: "Login", href: "/login" }];

  const getLinks = () => {
    if (!isLoggedIn) return isMobile ? publicLinks : [];
    return userRole === "founder" ? founderLinks : investorLinks;
  };

  const items = getLinks().map((link) => (
    <Button
      key={link.label}
      variant="subtle"
      color={active === link.label ? "blue" : "gray"}
      onClick={() => {
        setActive(link.label);
        close();
        navigate(link.href);
      }}
      component="a"
    >
      {link.label}
    </Button>
  ));

  return (
    <Container fluid px="md" py="sm" className={classes.navbar}>
      <img
        src={getImage("logo")}
        alt="Logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", width: "50px", height: "50px" }}
      />

      {!isMobile && (
        <Group spacing="md">
          {items}
          {<AvatarPopover isLoggedIn={isLoggedIn} />}
        </Group>
      )}

      {isMobile && (
        <>
          {!opened && <Burger opened={false} onClick={toggle} />}
          <Drawer
            opened={opened}
            onClose={close}
            title={
              <img width={30} height={30} src={getImage("logo")} alt="Logo" />
            }
            padding="md"
            size="xs"
          >
            <Stack spacing="md" align="center">
              {isLoggedIn && (
                <Avatar color="blue" radius="xl">
                  {authStore.User != null ? (
                    <img
                      src={authStore.User?.profilePictureUrl}
                      alt="Profile"
                    />
                  ) : (
                    "A"
                  )}
                </Avatar>
              )}
              {items}
            </Stack>
          </Drawer>
        </>
      )}
    </Container>
  );
});

const AvatarPopover = observer(function AvatarPopover({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const navigate = useNavigate();
  const { authStore } = useStore();

  const handleLogOut = async () => {
    await authStore.logout();
    await socket.disconnect();
    navigate("/login");
  };

  return (
    <Menu width={150} withArrow>
      <Menu.Target>
        <Group spacing="md">
          <NavAvatar />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack>
          {isLoggedIn && (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
          )}
          {isLoggedIn ? (
            <Button fullWidth variant="subtle" onClick={handleLogOut}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="subtle"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="subtle"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
});

const NavAvatar = observer(function NavAvatar() {
  const notificationsCount = 0;
  return (
    <Indicator
      size={8}
      offset={3}
      disabled={notificationsCount === 0}
      color="red"
      label={notificationsCount > 0 ? notificationsCount.toString() : ""}
    >
      <Avatar radius="xl" />
    </Indicator>
  );
});
