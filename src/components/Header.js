import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import {
  IoIosAlbums,
  IoIosHeart,
  IoIosList,
  IoIosMicrophone,
} from 'react-icons/io';
import { MdAlbum, MdShowChart } from 'react-icons/md';
import LargeTitle from './ui/LargeTitle';
import SearchBox from './SearchBox';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 8px 20px;
`;

const BrandTitle = styled(LargeTitle)`
  color: ${(props) => props.theme.branding};
  text-align: center;
`;

const Version = styled.span`
  color: ${(props) => props.theme.text.tertiary};
  font-size: 0.7rem;
  flex: 1 0 auto;
`;

const HeaderLink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.text.primary};
  text-decoration: none;
  margin-right: 24px;
  border-radius: 3px;
  padding: 5px;
  transition: 200ms background-color;

  &:hover svg {
    transform: scale(1.15);
  }

  > svg {
    transition: 200ms transform;
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }

  &.active {
    background-color: ${(props) => props.theme.branding};
    color: hsl(208, 12%, 88%);

    svg {
      fill: hsl(208, 12%, 88%);
    }
  }
`;

function Header() {
  const { isAuthorized } = window.MusicKitInstance;

  return (
    <Wrapper>
      <BrandTitle>AM</BrandTitle>
      <Version>{process.env.COMMIT_REF || 'dev'}</Version>
      {isAuthorized && (
        <React.Fragment>
          <HeaderLink to="/library/recently-added">
            <IoIosAlbums />
            Recently Added
          </HeaderLink>
          <HeaderLink to="/library/playlists">
            <IoIosList />
            Playlists
          </HeaderLink>
          <HeaderLink to="/library/albums">
            <MdAlbum />
            Albums
          </HeaderLink>
          <HeaderLink to="/library/artists">
            <IoIosMicrophone />
            Artists
          </HeaderLink>
          <HeaderLink to="/for-you">
            <IoIosHeart />
            For You
          </HeaderLink>
          <HeaderLink to="/top-charts">
            <MdShowChart />
            Top Charts
          </HeaderLink>
          <SearchBox />
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default Header;
