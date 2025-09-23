import { useState } from "react";
import { CARDS, type CardMeta } from "./data/cards";
import { Card } from "./models/Card";
import { CardView } from "./components/CardView";
import CardsGrid from "./components/CardsGrid";

const CARD_OBJECTS: Card[] = CARDS.map((m: CardMeta) => new Card(m));

export default function App() {
  const [hand, setHand] = useState<Card[]>([CARD_OBJECTS[0]])

  function showTwo() {
    setHand(CARD_OBJECTS.slice(0, Math.min(2, CARD_OBJECTS.length)));
  }
  function showAll() {
    setHand(CARD_OBJECTS);
  }
  function clearAll() {
    setHand([]);
  }

  const top = hand[0] ?? null;

  return (
    <div style={{display:"grid", gridTemplateColumns:"360px 1fr", gap:16, padding:16}}>
      <section>
        <h1>Gael Simulator</h1>
        <div style={{display:"flex", gap:8, margin:"8px 0"}}>
          <button onClick={showTwo}>Show 2</button>
          <button onClick={showAll}>Show all</button>
          <button onClick={clearAll}>Clear</button>
        </div>

        <div>
          {top ? <CardView card={top} width={320} /> : <div style={{height:420,display:"grid",placeItems:"center"}}>No card</div>}
        </div>
      </section>

      <section>
        <h3>Grid</h3>
        <CardsGrid cards={hand} cardWidth={180} />
      </section>
    </div>
  );
}
