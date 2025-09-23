import type { CardMeta, DeckId, Role } from "../data/cards";

export class Card {
  readonly id: string;
  readonly name: string;
  readonly deck: DeckId;
  readonly role: Role;
  readonly nextDeck?: DeckId;
  readonly useLightningStorm?: DeckId;
  readonly img: string;

  constructor(meta: CardMeta) {
    this.id = meta.id;
    this.name = meta.name;
    this.deck = meta.deck as DeckId;
    this.role = meta.role as Role;
    this.nextDeck = meta.nextDeck;
    this.useLightningStorm = (meta as any).useLightningStorm; // keep optional
    this.img = meta.img;
  }

  get isStarter()   { return this.role === "starter"; }
  get isChain()     { return this.role === "chain"; }
  get isFinisher()  { return this.role === "finisher"; }
  get isSingle()    { return this.role === "single"; }

  // Extend with helpers as needed (e.g., flags parsing)
}
