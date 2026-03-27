import Logo from "../Logo";
import { Navigation } from "./Navigation";
import { UserMenu } from "./UserMenu";

export default async function Header() {
    
    return (
        <header className="bg-white px-[100px] py-[8px] flex items-center justify-between shadow-[0px_4px_12px_1px_rgba(0,0,0,0.02)] sticky top-0 z-50">
            <Logo height={18} />
            <Navigation />
            <UserMenu />
        </header>
    );
}