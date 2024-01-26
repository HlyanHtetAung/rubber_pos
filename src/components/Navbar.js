import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AdbIcon from "@mui/icons-material/Adb";
import { PAGES, handleRouting } from "../navigation/routes";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ပွင့်တိုင်းအောင်
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            {PAGES.map((page) => (
              <Link to={`${handleRouting(page)}`} key={page}>
                <Button
                  onClick={() => handleRouting(page)}
                  sx={{
                    my: 2,
                    mr: 1,
                    color: "white",
                    display: "block",
                    fontSize: 16,
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
