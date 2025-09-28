import './index.css'
import { useRef, useState, useEffect } from "react"
import { CARDS, type CardPhase } from "./data/cards"
import { Card } from "./models/Card"
import { CardView } from "./components/CardView"
import { DeckEngine } from "./DeckEngine"

let engine = new DeckEngine(CARDS)

export default function App() {
    const [health] = useState<{ [key: number]: number }>({ 1: 70, 2: 60, 3: 50 })
    const [phase, setPhase] = useState(1)
    const [drawDeck, setDrawDeck] = useState<number | null>(null)
    const [comboActive, setComboActive] = useState(false)
    const [open, setOpen] = useState(false)

    // NORMAL CARDS ONLY
    const [hand, setHand] = useState<Card[]>([])

    // LIGHTNING STORM — OUTSIDE THE HAND
    const [stormCard, setStormCard] = useState<Card | null>(null)
    const [stormQueued, setStormQueued] = useState(false)
    const [stormVisible, setStormVisible] = useState(false)
    const [stormX, setStormX] = useState(0)
    const [stormNeedsBump, setStormNeedsBump] = useState(false)

    // post-bump delay
    const [postBumpDelay, setPostBumpDelay] = useState(false)

    // show/hide horizontal scroll bar depending on actual need
    const [needsScroll, setNeedsScroll] = useState(false)

    const cardsRowRef = useRef<HTMLDivElement>(null)

    const cardWidth = 300
    const cardHeight = cardWidth * (1040 / 745)

    // base layout spacers
    const GAP_BASE = 5
    const LEFT_PAD_BASE = 20
    const TOP_PAD = 20
    
    // slot width is card + current gap (set per render)
    const SLOT = (gap: number) => cardWidth + gap

    function refreshEngine() {
        engine = new DeckEngine(CARDS)
        setDrawDeck(engine.getInitialDeck(phase as CardPhase))
        setHand([])
        setComboActive(false)
        resetStorm()
    }

    function resetStorm() {
        setStormCard(null)
        setStormQueued(false)
        setStormVisible(false)
        setStormX(0)
        setStormNeedsBump(false)
        setPostBumpDelay(false)
    }

    useEffect(() => {
        if (cardsRowRef.current) {
            cardsRowRef.current.scrollLeft = cardsRowRef.current.scrollWidth
        }
    }, [hand, stormVisible, stormX])

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
    }, [open])

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.code === "Space") {
                e.preventDefault()
                handleDraw()
            }
            if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
                e.preventDefault()
                clearAll()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [drawDeck, stormQueued, stormVisible, stormNeedsBump, comboActive, postBumpDelay])

    useEffect(() => {
        setDrawDeck(engine.getInitialDeck(phase as CardPhase))
        setHand([])
        setComboActive(false)
        resetStorm()
    }, [phase])

    
    // compute right padding
    const contentWidth =
        hand.length === 0 ? 0 : (hand.length - 1) * (cardWidth + GAP_BASE) + cardWidth

    const stormExtension = stormVisible
        ? Math.max(0, Math.ceil(stormX + cardWidth - contentWidth))
        : 0

    const rightPad = LEFT_PAD_BASE + stormExtension
    
    // recompute whether the row actually needs horizontal scroll
    useEffect(() => {
        const el = cardsRowRef.current
        if (!el) return
        const need = (el.scrollWidth - el.clientWidth) > 1  // small tolerance
        setNeedsScroll(need)
    }, [hand.length, stormVisible, stormX, drawDeck, comboActive, rightPad])


    useEffect(() => {
        const el = cardsRowRef.current
        if (!el) return

        const ro = new ResizeObserver(() => {
            const need = (el.scrollWidth - el.clientWidth) > 1
            setNeedsScroll(need)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    
    function handleDraw() {
        if (postBumpDelay) return

        if (stormQueued && !stormVisible) {
            drawStormIntoOverlay()
            return
        }

        if (stormVisible && stormNeedsBump) {
            bumpStormOnly()
            return
        }

        if (drawDeck !== null) {
            drawNormalCard()
        }
    }

    function drawStormIntoOverlay() {
        const meta = engine.drawLightning()
        const card = new Card(meta)
        const newestIdx = hand.length - 1
        const initialIndex = Math.max(0, newestIdx + 1)
        setStormX(initialIndex * SLOT(GAP_BASE))

        setStormCard(card)
        setStormVisible(true)
        setStormQueued(false)
        setStormNeedsBump(true)
    }

    function bumpStormOnly() {
        const newestIdx = Math.max(0, hand.length - 1)
        const comboContinues = drawDeck !== null
        const targetIndex = comboContinues ? newestIdx + 3 : newestIdx + 1
        setStormX(targetIndex * SLOT(GAP_BASE))
        setStormNeedsBump(false)

        setPostBumpDelay(true)
        window.setTimeout(() => {
            setPostBumpDelay(false)
            if (drawDeck !== null) drawNormalCard()
        }, 500)
    }

    function drawNormalCard() {
        if (!drawDeck) return

        const meta = engine.draw(phase as CardPhase, drawDeck)
        const card = new Card(meta)

        let nextDeck = meta.nextDeck ?? null
        if (nextDeck !== null && !engine.hasDeck(phase as CardPhase, nextDeck)) {
            nextDeck = null
        }

        setHand(prev => {
            const next = [...prev, card]

            if (stormVisible && stormCard) {
                const newestIdx = next.length - 1
                const targetIndex = nextDeck ? newestIdx + 2 : newestIdx + 1
                setStormX(targetIndex * SLOT(GAP_BASE))
            }

            return next
        })

        setDrawDeck(nextDeck)
        setComboActive(!!nextDeck)

        if (meta.specialEffect === 'lightningStorm' && !stormVisible) {
            setStormQueued(true)
        }
    }

    function clearAll() {
        // 1) Figure out if Deck 4 was drawn this turn
        const reshuffleDeck4 = engine.wasDeckDrawnThisTurn(phase as CardPhase, 4)

        // 2) Reset decks 9–12 every time (fixed order + index 0)
        engine.resetDecks(phase as CardPhase, [9, 10, 11, 12])

        // 3) Deck 4: only reshuffle if it was drawn this turn; otherwise just reset
        if (reshuffleDeck4) {
            engine.resetAndShuffleDecks(phase as CardPhase, [4])
        } else {
            engine.resetDecks(phase as CardPhase, [4])
        }

        // 4) Clear per-turn flags/marks
        engine.clearTurnFlags(phase as CardPhase)

        // 5) UI reset
        setHand([])
        setDrawDeck(engine.getInitialDeck(phase as CardPhase))
        setComboActive(false)

        // if you manage storm state in App, also reset it here
        // resetStorm() or your equivalent
    }


    const drawLabel =
        postBumpDelay
            ? "Continuing…"
            : (stormQueued && !stormVisible)
            ? "Draw Lightning Storm"
            : drawDeck !== null
            ? `Draw from Deck ${drawDeck}`
            : `Draw from Deck ${engine.getInitialDeck(phase as CardPhase)}`

    
    
    
    return (
        <div className="layout">
            <div className="main">
                <div className="controls">
                    {[1, 2, 3].map(p => (
                        <button
                            key={p}
                            onClick={() => setPhase(p)}
                            disabled={phase === p}
                            style={p === 3 ? { marginRight: 20 } : undefined}
                        >
                            Phase {p} ({health[p]} HP)
                        </button>
                    ))}
                    <button onClick={handleDraw} disabled={postBumpDelay}>{drawLabel}</button>
                    <button onClick={clearAll}>Clear</button>
                    <button onClick={refreshEngine}>Refresh Decks</button>
                </div>

                <div
                    className="card cards-row"
                    style={{
                        minHeight: cardHeight,
                        paddingLeft: LEFT_PAD_BASE,
                        paddingTop: TOP_PAD,
                        paddingRight: rightPad,
                        gap: `${GAP_BASE}px`,
                        overflowX: needsScroll ? 'auto' : 'hidden'
                    }}
                    ref={cardsRowRef}
                >
                    {hand.map((c, i) => (
                        <div
                            key={`${c.id}-${i}`}
                            className="card-item"
                            style={{ zIndex: 1000 - i }}
                        >
                            <CardView card={c} width={cardWidth} height={cardHeight} />
                        </div>
                    ))}

                    {stormVisible && stormCard && (
                        <div
                            className="storm-overlay"
                            style={{
                                width: cardWidth,
                                height: cardHeight,
                                transform: `translateX(${stormX}px)`,
                                zIndex: 1,
                                left: LEFT_PAD_BASE,
                                top: TOP_PAD
                            }}
                        >
                            <CardView card={stormCard} width={cardWidth} height={cardHeight} />
                        </div>
                    )}
                </div>

                {!comboActive && hand.length > 0 && (
                    <div className="activation-ended">Activation ended</div>
                )}
            </div>

            <div className="debug-panel">
                <details open={open} onToggle={e => setOpen(e.currentTarget.open)}>
                    <summary className="debug-summary">Debug Panel</summary>
                    <section className="debug-section">
                        {[1, 2, 3].map(p => {
                            const decks = engine.debugState(p as CardPhase)
                            return (
                                <div key={p} className="debug-col">
                                    <div className="deck-title">Phase {p}</div>
                                    {decks.map(deckObj => {
                                        const nextIndex = deckObj.cards[0]?.nextIndex ?? 0
                                        return (
                                            <div key={deckObj.deck} className="deck-block">
                                                <div className="deck-heading">Deck {deckObj.deck}</div>
                                                <div className="deck-list">
                                                    {deckObj.cards.map((c, idx) => {
                                                        const color = c.index < nextIndex ? "#888" : "#000"
                                                        const isNext = c.index === nextIndex
                                                        const fontStyle = isNext ? "italic" : "normal"
                                                        const fontWeight = isNext ? "bold" : "normal"
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="deck-entry"
                                                                style={{ fontStyle, fontWeight, color }}
                                                            >
                                                                {c.id}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </section>
                </details>
            </div>
        </div>
    )
}