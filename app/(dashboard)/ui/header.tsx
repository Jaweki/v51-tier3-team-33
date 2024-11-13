import SearchInput from './searchInput';
//import DropDownMenu from './dropDownMenu';

import { DialogPopup } from './dialogPopup';
import MobileSideBar from './mobileSideBar';


export default function Header(){
    return (
      <header className='flex h-14 sticky top-0 z-50 items-center gap-4 border-b  px-4 lg:h-[60px] lg:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <MobileSideBar />
        <SearchInput />
        {/* <DropDownMenu /> */}
        <DialogPopup />
      </header>
    );
};


