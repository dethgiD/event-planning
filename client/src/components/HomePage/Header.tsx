import Nav from "./Nav";

export default function Header(){
    return(
        <header className="sticky top-0 z-[1] mx-auto  flex w-screen flex-wrap items-center justify-between border-b border-gray-100 bg-background p-[2em] font-bold uppercase text-text-primary backdrop-blur-[100px] dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
            <p>Event Planning System</p>
            <Nav />
        </header>
    )
}