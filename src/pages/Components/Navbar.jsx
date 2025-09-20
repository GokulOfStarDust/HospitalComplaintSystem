  import React, {use, useState, useEffect} from 'react'
  import { Outlet, useLocation } from 'react-router'
  import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
  import DescriptionIcon from '@mui/icons-material/Description';
  import ListAltIcon from '@mui/icons-material/ListAlt';
  import { useNavigate } from 'react-router-dom';
  import { Avatar, Typography, Box, Stack, Menu, MenuItem, IconButton } from '@mui/material';
  import Logout from '@mui/icons-material/Logout';
  import ListItemIcon from '@mui/material/ListItemIcon';
  import useAuth from '../Hooks/useAuth';


  function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);
    const [currentPage, setCurrentPage] = useState(()=>{
      if (location.pathname.includes("masterSettings")) return "masterSettings";
      if (location.pathname.includes("report")) return "report";
      if (location.pathname === "/") return "ticketSystem";
      return "";
    });
    const {isAdmin, logout, user} = useAuth();
    console.log("isAdmin:", isAdmin)

    const userImg = {
      imageUrl: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const onLogout = () => {
      logout();
      navigate('/login');
    };

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    const handleLogout = () => {
      handleMenuClose();
      onLogout(); // This triggers your logout logic
    };

    const inPageNavigation = {
      masterSettings: ['bedConfiguration','issueCategory', 'departments'],
      report: ['departmentBasedReport', 'ticketTATReport']
    }

    useEffect(() => {
      console.log("Current Page:", currentPage);
    }, [currentPage]);

    const iconStyles = (loc) => `text-primary ${(location.pathname.includes(loc)) && "text-white bg-primary" } group-hover:text-white  hover:bg-primary p-1 rounded-lg`

    return (
      <main className='w-screen h-screen'>
          <section className='w-full h-16 flex flex-row justify-end items-center bg-primary shadow-md'>
              <Box sx={{ borderRadius: '4px', margin : 1, paddingX: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                          <Box display={{ xs: 'none', sm: 'block' }}>
                          <Typography variant="body1" fontWeight="bold" color="white">{user?.username || 'loading'}</Typography>
                          <Typography variant="body2" color="white">{user?.role || 'loading'}</Typography>
                          </Box>

                          <IconButton onClick={handleMenuOpen}>
                          <Avatar alt={user?.username} src={userImg.imageUrl} />
                          </IconButton>

                          <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          slotProps={{
                              paper: {
                                  elevation: 0,
                                  sx: {
                                  overflow: 'visible',
                                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                  mt: 1.5,
                                  '& .MuiAvatar-root': {
                                      width: 32,
                                      height: 32,
                                      ml: -0.5,
                                      mr: 1,
                                  },
                                  '&::before': {
                                      content: '""',
                                      display: 'block',
                                      position: 'absolute',
                                      top: 0,
                                      right: 14,
                                      width: 10,
                                      height: 10,
                                      bgcolor: 'background.paper',
                                      transform: 'translateY(-50%) rotate(45deg)',
                                      zIndex: 0,
                                  },
                                  },
                              },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          >
                          <MenuItem onClick={handleLogout}>
                              <ListItemIcon>
                                  <Logout fontSize="small" sx={{color: 'red'}} />
                              </ListItemIcon>
                              Logout
                          </MenuItem>
                          </Menu>
                      </Stack>
                      </Box>
          </section>
          <section className='flex flex-col items-start w-full h-[93%]'>
              <nav className='w-full flex flex-row justify-between pl-10 gap-4 bg-white text-secondary shadow-md'>
                  <ul className='flex flex-row items-center justify-start gap-4 gap-x-16 pl-8'>
                      {inPageNavigation[currentPage]?.map((item, index) => (
                          <li key={index} className={`text-base text-secondary hover:underline-offset-2 p-4 ${(location.pathname.includes(item)) && "border-b-[2px] border-primary" } hover:border-b-[2px] hover:border-primary cursor-pointer`}
                          onClick={() => {navigate(`/${currentPage}/${item}`)}}
                          >
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                          </li>
                      ))
                      }  
                      <li className='text-base text-secondary hover:underline-offset-2 p-4'>
                          
                      </li> 
                  </ul>
                  
              </nav>
              <div className='flex-1 flex flex-row justify-between items-start w-full h-96'>
                  <nav className='h-[100%] flex flex-col justify-center items-center bg-white'>
                      <ul className='flex flex-col items-start justify-center gap-y-16 p-2 h-full -mt-44'>
              
                          <li className={`group transition flex flex-col items-center gap-y-1 justify-center text-[2.7rem]`}
                          onClick={() => {navigate("/"); setCurrentPage("ticketSystem")}}

                          >
                              <ListAltIcon className={`${iconStyles("ticketSystem")} ${(location.pathname == "/") && "text-white bg-primary" }`}
                              fontSize='inherit'
                              />
                              <p className={`${(location.pathname == "/") ? "text-primary" : "hidden" } text-xs`}>Tickets</p>
                          </li>
                      
                          <li className={`group transition flex flex-col items-center gap-y-1 justify-center text-[2.7rem]`}
                          onClick={() => {navigate("/report/departmentBasedReport"); setCurrentPage("report")}}
                          >
                              <DescriptionIcon className={iconStyles("report")}
                              fontSize='inherit'
                              />
                              <p className={`${(location.pathname.includes("report")) ? "text-primary" : "hidden" } text-xs`}>Report</p>
                          </li>

                        {
                          
                          isAdmin && (
                          
                          <li className={`group transition flex flex-col items-center gap-y-1 justify-center text-[2.7rem]`}
                          onClick={() => {navigate("/masterSettings/bedConfiguration"); setCurrentPage("masterSettings")}}
                          
                          >
                              <SettingsSharpIcon className={iconStyles("masterSettings")}
                              fontSize='inherit'
                              />
                              <p className={`${(location.pathname.includes("masterSettings")) ? "text-primary" : "hidden" } text-xs`}>Settings</p>
                          </li>
                      )}
                      </ul>
                  </nav>
                  
                  <Outlet />
              </div>
              
          </section>
      </main>
    )
  }

  export default Navbar