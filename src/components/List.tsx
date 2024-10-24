import React, { FC, useRef, useState, useMemo } from "react";
import { useDictionary } from "../hooks/useDictionary";
import styled from "@emotion/styled";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { SafelyRenderChildren } from "./SafelyRenderChildren";
import { Item } from "./item";

const ScrollWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 500px;
  overflow: auto;
  position: relative;
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
  position: relative;
`;

const SearchBox = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  width: 100%;
`;

export const List: FC = () => {
  const dictionary = useDictionary();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useScrollPosition(scrollRef, 100);
  const [searchTerm, setSearchTerm] = useState("");

  const itemHeight = 30;
  const viewportHeight = 500;
  const itemsPerPage = Math.floor(viewportHeight / itemHeight);
  const filteredItems = useMemo(
    () =>
      dictionary.filter((word) =>
        word.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [dictionary, searchTerm]
  );

  const totalHeight = filteredItems.length * itemHeight;
  const startIndex = Math.floor(scrollPosition / itemHeight);
  const endIndex = Math.min(
    startIndex + itemsPerPage + 10,
    filteredItems.length
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <SearchBox
        type="text"
        placeholder="Search for a word..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ScrollWrapper ref={scrollRef}>
        <div style={{ height: totalHeight + "px", position: "relative" }}>
          <ListWrapper
            style={{
              top: startIndex * itemHeight + "px",
              position: "absolute",
            }}
          >
            <SafelyRenderChildren>
              {filteredItems.slice(startIndex, endIndex).map((word, index) => (
                <Item key={startIndex + index}>{word}</Item>
              ))}
            </SafelyRenderChildren>
          </ListWrapper>
        </div>
      </ScrollWrapper>
    </div>
  );
};
