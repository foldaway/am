import React, { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import styled from 'styled-components';

/* eslint-disable no-await-in-loop */

const Wrapper = styled.div`
  grid-area: side-menu;
  display: grid;
  grid-auto-flow: row;
  overflow-y: scroll;
  grid-row-gap: 10px;
  grid-template-rows: auto auto 1fr;
  grid-template-areas: "library" "playlists";
  background-color: ${(props) => props.theme.background.primary};
  padding: 10px 20px 10px 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    font-size: 0.75em;
    margin-bottom: 8px;
    color: ${(props) => props.theme.text.tertiary};
    text-decoration: none;

    &.current {
      font-weight: 700;
    }

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  &.playlists {
    overflow-y: scroll;
  }
`;

const SectionTitle = styled.span`
  font-weight: 700;
  font-size: 0.7em;
  color: $lightgray;
  margin-bottom: 10px;

  &:hover {
    cursor: default;
    text-decoration: none;
  }
`;

function SideMenu() {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    async function loadPlaylists() {
      const results = [];
      let temp = [];
      do {
        temp = await window.MusicKitInstance.api.library.playlists(null, {
          limit: 100,
          offset: temp.length,
        });

        results.push(...temp);
      } while (temp.length > 0);
      setPlaylists(results);
    }
    loadPlaylists();
  }, []);
  return (
    <Wrapper>
      <Section>
        <SectionTitle>Library</SectionTitle>
        <NavLink activeClassName="current" to="/library/recently-added">
          Recently Added
        </NavLink>
        <NavLink activeClassName="current" to="/library/artists">
          Artists
        </NavLink>
        <NavLink activeClassName="current" to="/library/albums">
          Albums
        </NavLink>
        <NavLink activeClassName="current" to="/library/songs">
          Songs
        </NavLink>
      </Section>
      <Section>
        <SectionTitle>Catalog</SectionTitle>
        <NavLink activeClassName="current" to="/search">
          Search
        </NavLink>
        <NavLink activeClassName="current" to="/for-you">
          For You
        </NavLink>
      </Section>
      <Section>
        <SectionTitle>Playlists</SectionTitle>
        {playlists.map((playlist) => (
          <NavLink
            key={playlist.id}
            activeClassName="current"
            to={`/library/playlist/${Buffer.from(playlist.id).toString(
              'base64',
            )}`}
          >
            {playlist.attributes.name}
          </NavLink>
        ))}
      </Section>
    </Wrapper>
  );
}

export default SideMenu;
