import type { CardMeta, CardPhase } from "./data/cards"

export class DeckEngine {
    private decks: Map<number, CardMeta[]> = new Map()
    private initialDecks: Map<number, CardMeta[]> = new Map()
    private deckOrder: Map<number, number[]> = new Map()
    private drawIndex: Map<number, number> = new Map()

    // Phase-scoped toggle for Deadly Impulse (affects Sinister Prelude handling)
    private deadlyImpulseActive: Map<CardPhase, boolean> = new Map([[1, false], [2, false], [3, false]])

    // Track which decks were drawn this turn, per phase
    private drawnThisTurn: Map<CardPhase, Set<number>> = new Map([
        [1, new Set<number>()],
        [2, new Set<number>()],
        [3, new Set<number>()],
    ])

    constructor(cards: CardMeta[]) {
        const phaseMap = new Map<CardPhase, CardMeta[]>()

        // Expand phase 0 into 2 and 3
        for (const card of cards) {
            const phases = card.phase === 0 ? [2, 3] : [card.phase]
            for (const ph of phases) {
                const p = ph as CardPhase
                if (!phaseMap.has(p)) phaseMap.set(p, [])
                phaseMap.get(p)!.push(card)
            }
        }

        // Build decks per phase
        for (const [phase, cardsForPhase] of phaseMap.entries()) {
            const grouped: Record<number, CardMeta[]> = {}
            for (const card of cardsForPhase) {
                if (card.deck !== undefined) {
                    if (!grouped[card.deck]) grouped[card.deck] = []
                    grouped[card.deck].push(card)
                }
            }

            const deckNums = Object.keys(grouped).map(Number).sort((a, b) => a - b)
            for (const deck of deckNums) {
                const key = this.deckKey(phase, deck)
                const cardsInDeck = grouped[deck]

                // Decks 9–12 keep fixed order; others get an initial shuffle
                const deckCards = deck >= 9 && deck <= 12 ? [...cardsInDeck] : this.shuffle(cardsInDeck)

                this.decks.set(key, deckCards)
                this.initialDecks.set(key, [...deckCards])
                this.drawIndex.set(key, 0)
            }
            this.deckOrder.set(phase, deckNums)
        }
    }

    /** Reset the given deck numbers for a phase back to their initial composition and index 0. */
    resetDecks(phase: CardPhase, deckNums: number[]) {
        for (const deck of deckNums) {
            const key = this.deckKey(phase, deck)
            const initial = this.initialDecks.get(key)
            if (initial) {
                this.decks.set(key, [...initial])
                this.drawIndex.set(key, 0)
            }
        }
    }

    /** Reset + reshuffle the given decks (fresh random order becomes the new baseline). */
    resetAndShuffleDecks(phase: CardPhase, deckNums: number[]) {
        for (const deck of deckNums) {
            const key = this.deckKey(phase, deck)
            const base = this.initialDecks.get(key)
            if (base) {
                const reshuffled = this.shuffle(base)
                this.decks.set(key, [...reshuffled])
                this.initialDecks.set(key, [...reshuffled])
                this.drawIndex.set(key, 0)
            }
        }
    }

    /** True if `deck` was drawn at least once since last clear (for this phase). */
    wasDeckDrawnThisTurn(phase: CardPhase, deck: number): boolean {
        return this.drawnThisTurn.get(phase)?.has(deck) ?? false
    }

    /** Clear per-turn flags/marks for this phase (call from Clear). */
    clearTurnFlags(phase: CardPhase) {
        this.deadlyImpulseActive.set(phase, false)
        this.drawnThisTurn.set(phase, new Set<number>())
    }

    drawLightning(): CardMeta {
        const phase: CardPhase = 3
        const key = this.deckKey(phase, 13)
        const cards = this.decks.get(key) ?? []
        let index = this.drawIndex.get(key) ?? 0
        if (cards.length === 0) throw new Error("Deck 13 is empty or missing")
        const card = cards[index]
        index = (index + 1) % cards.length
        this.drawIndex.set(key, index)
        return card
    }

    hasDeck(phase: CardPhase, deck: number): boolean {
        const key = this.deckKey(phase, deck)
        return this.decks.has(key)
    }

    private deckKey(phase: number, deck: number): number {
        return phase * 100 + deck
    }

    private shuffle<T>(arr: T[]): T[] {
        const a = [...arr]
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[a[i], a[j]] = [a[j], a[i]]
        }
        return a
    }

    private advanceIndex(phase: CardPhase, deck: number, steps: number) {
        const key = this.deckKey(phase, deck)
        const cards = this.decks.get(key)
        if (!cards || cards.length === 0) return
        const len = cards.length
        const cur = this.drawIndex.get(key) ?? 0
        const next = ((cur + steps) % len + len) % len
        this.drawIndex.set(key, next)
    }

    getInitialDeck(phase: CardPhase): number {
        return this.deckOrder.get(phase)?.[0] ?? 1
    }

    draw(phase: CardPhase, deck: number): CardMeta {
        const key = this.deckKey(phase, deck)
        const cards = this.decks.get(key) ?? []
        let index = this.drawIndex.get(key) ?? 0
        if (cards.length === 0) return {} as CardMeta

        // Mark that this deck was drawn this turn
        this.drawnThisTurn.get(phase)!.add(deck)

        // Take the top card
        let card = cards[index]

        // Deadly Impulse: enable flag for this phase
        if (card.specialEffect === 'deadlyImpulse') {
            this.deadlyImpulseActive.set(phase, true)
        }

        // Sinister Prelude: normally replace + shuffle unless Deadly Impulse was drawn earlier this turn
        if (card.specialEffect === 'sinisterPrelude' && !this.deadlyImpulseActive.get(phase)) {
            const remaining = cards.length - index - 1
            if (remaining >= 3) {
                const removed = cards.splice(index, 1)[0]
                cards.push(removed)
                this.shuffleDeck(key)
                index = this.drawIndex.get(key) ?? 0
                card = cards[index]
            }
        }

        // Soulbound Pursuit: next draw from Deck 9 (phase 3) skips two cards
        if (card.specialEffect === 'soulboundPursuit') {
            this.advanceIndex(3, 9, 2)
        }

        // Finish draw of current deck
        index = (index + 1) % cards.length
        this.drawIndex.set(key, index)
        return card
    }

    private shuffleDeck(key: number) {
        const deck = this.decks.get(key)
        if (!deck) return
        const shuffled = this.shuffle(deck)
        this.decks.set(key, shuffled)
        this.drawIndex.set(key, 0)
    }

    peek(phase: CardPhase, deck: number): CardMeta | null {
        const key = this.deckKey(phase, deck)
        const cards = this.decks.get(key) ?? []
        const idx = this.drawIndex.get(key) ?? 0
        return cards[idx] ?? null
    }

    debugState(phase: CardPhase) {
        const decks = this.deckOrder.get(phase) ?? []
        return decks.map(deck => {
            const key = this.deckKey(phase, deck)
            const draw = this.drawIndex.get(key) ?? 0
            const cards = this.decks.get(key) ?? []
            const items = cards.map((c, i) => ({
                id: c.id,
                index: i,
                nextIndex: draw
            }))
            return { deck, cards: items }
        })
    }
}
