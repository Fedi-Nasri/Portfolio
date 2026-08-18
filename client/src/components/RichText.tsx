import React, { Fragment } from "react";

type RichTextProps = { value: string };

const TOKEN_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|\[\[size:(?:small|lead)\]\][\s\S]*?\[\[\/size\]\])/g;

export function RichText({ value }: RichTextProps) {
  return <>{value.split(TOKEN_PATTERN).map((part, index) => {
    if (!part) return null;
    const sizeMatch = part.match(/^\[\[size:(small|lead)\]\]([\s\S]*?)\[\[\/size\]\]$/);
    if (sizeMatch) return <span key={index} className={`rich-size-${sizeMatch[1]}`}>{sizeMatch[2]}</span>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__")) return <u key={index}>{part.slice(2, -2)}</u>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  })}</>;
}
