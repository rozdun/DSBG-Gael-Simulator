import type { CardMeta } from "../data/cards"

export class Card {
    meta: CardMeta

    constructor(meta: CardMeta) {
        this.meta = meta
    }

    get id() {
        return this.meta.id
    }

    get phase() {
        return this.meta.phase
    }

    get deck() {
        return this.meta.deck
    }
}
