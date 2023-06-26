import React from 'react';
import Logo from '../Images/Colorful.png';

function Header() {
  return (
    <div className='app-header'>
      <img src={Logo} alt='logo' />
      <h1>КВИЗ ЗА ДЕЦУ</h1>
    </div>
  );
}

export default Header;
