import React, { useContext } from 'react'
import { Container, Nav, Navbar, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Notification from './Chat/Notification'

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext)

    return (
        <Navbar>
            <Container>
                <h2>
                    <Link to={"/"} className='link-light text-decoration-none' >
                        ChattApp
                    </Link>
                </h2>
                <span>Login as a {user?.name}</span>
                <Nav>
                    {user ? <Stack direction='horizontal' gap={3}>
                        <Notification />
                        <Link onClick={() => logoutUser()} to={"/login"} className='link-light text-decoration-none'>
                            Logout
                        </Link>
                    </Stack> : (
                        <Stack direction='horizontal' gap={3}>
                            <Link to={"/login"} className='link-light text-decoration-none'>
                                Login
                            </Link>
                            <Link to={"/register"} className='link-light text-decoration-none'>
                                Register
                            </Link>
                        </Stack>
                    )}

                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar