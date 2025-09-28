import { useEffect, useState } from "react"
import { Card } from "../models/Card"

type Props = {
  card: Card
  width?: number
  height?: number
}

export function CardView({ card, width = 320, height }: Props) {
  // pull values from the card
  const { id, deck, phase } = card.meta

  // build image URL
  const url = deck
    ? `/cards/${deck}/${id}.jpg`
    : `/cards/phase${phase}_${id}.jpg`

  // mount animation
  const [enter, setEnter] = useState(false);
    useEffect(() => {
    const t = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(t);
    }, []);

    return (
    <img
        src={url}
        alt={id}
        width={width}
        height={height}
        className={enter ? "card-enter-active" : "card-enter"}
        style={{
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        objectFit: "cover",
        }}
    />
    );

}
