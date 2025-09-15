"use client";

import { useTheme } from "next-themes";
import React from "react";
import WordCloud from "react-d3-cloud";

type Props = {};

const data = [
  {
    text: "Hey",
    value: 3,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <WordCloud
        height={550}
        font={"Times"}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme == "dark" ? "white" : "black"}
        data={data}
      />
    </>
  );
};

export default CustomWordCloud;
