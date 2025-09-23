import { memo } from "react";
import { Card } from "../models/Card";

type Props = {
  card: Card;
  width?: number;          // px
  showMeta?: boolean;      // optional label under the image
};

function CardViewBase({ card, width = 320, showMeta = true }: Props) {
  return (
    <div style={{width, display:"grid", gap:8}}>
      <img
        src={card.img}
        alt={card.name}
        style={{width:"100%", height:"auto", display:"block", borderRadius:8, boxShadow:"0 1px 6px rgba(0,0,0,0.25)"}}
        draggable={false}
      />
      {showMeta && (
        <div style={{fontFamily:"monospace", fontSize:12, opacity:0.8}}>
          {card.name} • Deck {card.deck} • {card.role}
          {card.nextDeck ? ` → ${card.nextDeck}` : ""}
        </div>
      )}
    </div>
  );
}

export const CardView = memo(CardViewBase);
