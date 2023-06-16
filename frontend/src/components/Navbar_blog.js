import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HouseIcon from "@mui/icons-material/House";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userLogoutAction } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "../styles";

const pages = ["Home", "Log In"];

const Navbar_blog = () => {
const [active,setActive]=useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.signIn);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // log out user
  const logOutUser = () => {
    dispatch(userLogoutAction());
    window.location.reload(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    // <AppBar position="static">
    //     <Container >
    //         {/* principal Menu */}
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-10 bg-white`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto bg-slate-700 px-8 py-6 rounded-xl">
        <div
          className='text-white text-[30px] font-bold cursor-pointer'
        >
          ScrapIt
        </div>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} className='flex justify-end'>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <ul className='list-none hidden sm:flex flex-row gap-10 '>
          {/* menu desktop */}
        
          <li
            onClick={handleCloseNavMenu}
            className={`${
                active===Link.title
                ?"text-white":"text-secondary"
              } text-[#958e8e] hover:text-white text-[18px] font-medium cursor-pointer`}
          >
            <Link to="/" 
            // style={{ color: "white", textDecoration: "none" }}
            >
              Home
            </Link>
          </li>

          <li
            onClick={handleCloseNavMenu}
            className={`${
                active===Link.title
                ?"text-white":"text-secondary"
              } text-[#958e8e] hover:text-white text-[18px] font-medium cursor-pointer`}
          >
            <Link
              to="/register"
            //   style={{ color: "white", textDecoration: "none" }}
            >
              Register
            </Link>
          </li>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="" />
            </IconButton>
          </Tooltip>
          <Menu
            PaperProps={{
                sx: {
                    "& 	.MuiMenu-list": {
                        bgcolor: "primary.white",
                        color: "white",
                    },
                },
            }}
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">
                <Link
                  className="text-black"
                  style={{ textDecoration: "none" }}
                  to="/admin/dashboard"
                  >
                  Admin{" "}
                </Link>
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">
                <Link
                  className="text-black"
                  style={{ textDecoration: "none" }}
                  to="/user/dashboard"
                  >
                  User{" "}
                </Link>
              </Typography>
            </MenuItem>
            {userInfo ? (
                <MenuItem onClick={logOutUser}>
                <Typography
                  className="text-black"
                  textAlign="center"
                  color="#8e67b2"
                  >
                  Log Out{" "}
                </Typography>
              </MenuItem>
            ) : (
                <MenuItem onClick={handleCloseUserMenu}>
                <Typography className="text-black" textAlign="center">
                  <Link style={{ textDecoration: "none" }} to="/login">
                    Login{" "}
                  </Link>
                </Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
        </ul>
      </div>
    </nav>
    //     </Container>
    // </AppBar>
  );
};
export default Navbar_blog;
