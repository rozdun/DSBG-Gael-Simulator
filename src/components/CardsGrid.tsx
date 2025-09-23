import { Card } from "../models/Card";
import { CardView } from "./CardView";

type Props = {
  cards: Card[];
  cardWidth?: number;
};

export default function CardsGrid({ cards, cardWidth = 220 }: Props) {
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${cardWidth}px, 1fr))`, gap:12}}>
      {cards.map(c => (
        <CardView key={c.id} card={c} width={cardWidth} />
      ))}
    </div>
  );
}
