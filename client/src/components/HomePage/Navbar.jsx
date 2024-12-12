import './navbar.css'
export default function Navbar(){
    return(
        <nav className='nav'>
            <p className="site-title">Event Planning System</p>
            <ul>
                <li>
                    <a href="/">Your Events</a>
                </li>
                <li>
                    <a href="/logout">Logout</a>
                </li>
            </ul>
        </nav>
    )
}