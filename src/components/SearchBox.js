import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  background: none;
  border: 2px solid ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.text.primary};
  border-radius: 4px;
  padding: 5px;
`;

const SuggestionsList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0 5px;
  z-index: 100;

  position: absolute;
  left: 0;
  right: 0;

  background-color: ${(props) => props.theme.background.primary};
`;

const Suggestion = styled.span`
  color: ${(props) => props.theme.text.secondary};
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  transition: 200ms transform;

  &:hover {
    cursor: pointer;
    transform: translateY(-50%) scale(1.2);
  }
`;

function SearchBox() {
  const history = useHistory();
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('');
  const [isUserInput, setIsUserInput] = useState(false);

  useEffect(
    debounce(() => {
      if (input.length === 0 || !isUserInput) {
        setSuggestions([]);
        return;
      }
      async function fetchSuggestions() {
        const hints = await window.MusicKitInstance.api.searchHints(input);
        setSuggestions(hints.terms);
      }
      fetchSuggestions();
    }, 300),
    [input],
  );

  function performSearch(term) {
    history.push({
      pathname: '/search',
      state: { term },
    });
  }

  return (
    <Wrapper>
      <Input
        type="text"
        value={input}
        placeholder="Search"
        onChange={(e) => {
          setIsUserInput(true);
          setInput(e.target.value);
        }}
      />
      <SearchButton
        onClick={() => {
          setSuggestions([]);
          performSearch(input);
        }}
      >
        <FaSearch />
      </SearchButton>
      <SuggestionsList>
        {suggestions.map((s) => (
          <Suggestion
            key={s}
            onClick={() => {
              setIsUserInput(false);
              setInput(s);
              setSuggestions([]);
              performSearch(s);
            }}
          >
            {s}
          </Suggestion>
        ))}
      </SuggestionsList>
    </Wrapper>
  );
}

export default SearchBox;
