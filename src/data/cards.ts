export type Role = "single" | "starter" | "chain" | "finisher"
export type DeckId = 1|2|3|4|5|6|7|8|9|10|11|12|13
export type NextDeckId = 0|1|2|3|4|5|6|7|8|9|10|11|12
export type CardPhase = 1|2|3|0

export type CardMeta = {
    phase: CardPhase   // Which phase the card is used in - 1, 2, 3, or 2 and 3 (0)
    deck?: DeckId
    nextDeck?: NextDeckId
    id: string
    windup?: boolean
    specialEffect?: 'deadlyImpulse' | 'sinisterPrelude' | 'soulboundPursuit' | 'lightningStorm'
}

export const DATA_CARDS: CardMeta[] = [
    { phase: 1,  id: 'phase1_DataCard' },
    { phase: 2,  id: 'phase2_DataCard' },
    { phase: 3,  id: 'phase3_DataCard' },
]

export const CARDS: CardMeta[] = [
    { phase: 1,  deck: 1,                  id: '1_DelayedSweep',           windup: true,  },
    { phase: 1,  deck: 1,                  id: '2_PredatorsCleave',        windup: true,  },
    { phase: 1,  deck: 1,                  id: '3_SweepingBlades',         windup: true,  },
    { phase: 1,  deck: 1,                  id: '4_CrescentLeap',             },
    { phase: 1,  deck: 1,                  id: '5_DashingImpalement',      windup: true,  },
    { phase: 1,  deck: 1,                  id: '6_PlungingFury',           windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 1,   id: '7_FleetingRest',           windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 1,   id: '8_FleetingRest',           windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 1,   id: '9_FleetingRest',           windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 1,   id: '10_SwiftCut',              windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 1,   id: '11_TwistingReprisal',      windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 2,   id: '12_FlankingManeuver',        },
    { phase: 1,  deck: 1,   nextDeck: 2,   id: '13_LeapingStrike',         windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 2,   id: '14_DownwardStrike',        windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 3,   id: '15_FlankingAssault',       windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 3,   id: '16_ImpalingFrenzy',        windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 4,   id: '17_OminourRoar',           windup: true,  },
    { phase: 1,  deck: 1,   nextDeck: 4,   id: '18_DeadlyImpulse',         specialEffect: 'deadlyImpulse'    },
             
    { phase: 1,  deck: 2,   nextDeck: 3,   id: '1_ConsecutiveStrike',      windup: true,  },
    { phase: 1,  deck: 2,   nextDeck: 3,   id: '2_QuickStab',              windup: true,  },
    { phase: 1,  deck: 2,                  id: '3_DashingImpalement',      windup: true,  },
    { phase: 1,  deck: 2,                  id: '4_MomentaryRespite',       windup: true,  },
             
    { phase: 1,  deck: 3,                  id: '1_PlungingFury',             },
    { phase: 1,  deck: 3,                  id: '2_FeigningAssault',          },
    { phase: 1,  deck: 3,                  id: '3_MomentaryRespite',       windup: true,  },
    { phase: 1,  deck: 3,                  id: '4_MomentaryRespite',       windup: true,  },
             
    { phase: 1,  deck: 4,   nextDeck: 3,   id: '1_SinisterPrelude',        windup: true,  specialEffect: 'sinisterPrelude'  },
    { phase: 1,  deck: 4,   nextDeck: 4,   id: '2_BlazingFury',            windup: true,  },
    { phase: 1,  deck: 4,   nextDeck: 4,   id: '3_BlazingFury',              },
    { phase: 1,  deck: 4,   nextDeck: 4,   id: '4_BlazingFury',              },
    { phase: 1,  deck: 4,   nextDeck: 4,   id: '5_BlazingFury',              },
             
             
    { phase: 2,  deck: 5,                  id: '1_CrossbowVolley',         windup: true,  },
    { phase: 2,  deck: 5,                  id: '2_CrossbowVolley',         windup: true,  },
    { phase: 0,  deck: 5,                  id: '3_RightwardSweep',           },
    { phase: 0,  deck: 5,                  id: '4_LeftwardSweep',          windup: true,  },
    { phase: 2,  deck: 5,   nextDeck: 5,   id: '5_FleetingRest',           windup: true,  },
    { phase: 2,  deck: 5,   nextDeck: 5,   id: '6_FleetingRest',           windup: true,  },
    { phase: 2,  deck: 5,   nextDeck: 5,   id: '7_TwistingReprisal',         },
    { phase: 2,  deck: 5,   nextDeck: 7,   id: '8_WayOfWhiteCorona',       windup: true,  },
    { phase: 2,  deck: 5,   nextDeck: 7,   id: '9_WayOfWhiteCorona',       windup: true,  },
    { phase: 2,  deck: 5,   nextDeck: 8,   id: '10_SteadyAdvance',         windup: true,  },
    { phase: 0,  deck: 5,   nextDeck: 5,   id: '11_ChargingAdvance',       windup: true,  },
    { phase: 0,  deck: 5,   nextDeck: 8,   id: '12_ChargingAdvance',       windup: true,  },
    { phase: 0,  deck: 5,   nextDeck: 8,   id: '13_SummonSign',            windup: true,  },
    { phase: 0,  deck: 5,   nextDeck: 6,   id: '14_PreciseStab',             },
    { phase: 0,  deck: 5,   nextDeck: 6,   id: '15_GroundStrike',            },
    { phase: 0,  deck: 5,   nextDeck: 6,   id: '16_RunningGroundStrike',     },
    { phase: 3,  deck: 5,   nextDeck: 9,   id: '17_DwindlingComposure',    windup: true,  },
    { phase: 3,  deck: 5,   nextDeck: 9,   id: '18_DwindlingComposure',    windup: true,  },
    { phase: 3,  deck: 5,   nextDeck: 9,   id: '19_SoulboundPursuit',      windup: true,  specialEffect: 'soulboundPursuit'  },
             
    { phase: 2,  deck: 6,                  id: '1_MomentaryRespite',       windup: true,  },
    { phase: 0,  deck: 6,                  id: '2_UpwardSlashes',          windup: true,  },
    { phase: 0,  deck: 6,                  id: '3_UpwardSlash',            windup: true,  },
    { phase: 0,  deck: 6,   nextDeck: 5,   id: '4_SavageVortex',           windup: true,  },
    { phase: 3,  deck: 6,   nextDeck: 10,  id: '5_LingeringApprehension',    },
    { phase: 3,  deck: 6,   nextDeck: 11,  id: '6_LingeringApprehension',    },
    { phase: 3,  deck: 6,   nextDeck: 11,  id: '7_LingeringApprehension',    },
    { phase: 3,  deck: 6,   nextDeck: 12,  id: '8_LingeringApprehension',    },
             
    { phase: 2,  deck: 7,                  id: '1_CrossbowVolley',         windup: true,  },
    { phase: 2,  deck: 7,                  id: '2_CrossbowVolley',         windup: true,  },
    { phase: 2,  deck: 7,   nextDeck: 8,   id: '3_LingeringApprehension',    },
             
    { phase: 0,  deck: 8,   nextDeck: 10,  id: '1_SpiralDevastation',        },
    { phase: 0,  deck: 8,   nextDeck: 10,  id: '2_PhantomStrike',            },
             
             
    { phase: 3,  deck: 9,   nextDeck: 9,   id: '1_FracturedSurge',         windup: true,  },
    { phase: 3,  deck: 9,   nextDeck: 9,   id: '2_SoulEruption',           windup: true,  specialEffect: 'lightningStorm'  },
    { phase: 3,  deck: 9,   nextDeck: 9,   id: '3_TwistedFlight',            },
    { phase: 3,  deck: 9,                  id: '4_SkywardCleave',          windup: true,  },
             
    { phase: 3,  deck: 10,  nextDeck: 10,  id: '1_SoulBarrage',            windup: true,  specialEffect: 'lightningStorm'  },
    { phase: 3,  deck: 10,  nextDeck: 10,  id: '2_SoulstormDescent',       windup: true,  },
    { phase: 3,  deck: 10,  nextDeck: 10,  id: '3_EvadingManeuver',          },
    { phase: 3,  deck: 10,                 id: '4_DashingSmite',           windup: true,  },
             
    { phase: 3,  deck: 11,  nextDeck: 11,  id: '1_AerialCrossbowVolley',   windup: true,  },
    { phase: 3,  deck: 11,  nextDeck: 12,  id: '2_DescendingBlow',         windup: true,  },
             
    { phase: 3,  deck: 12,  nextDeck: 12,  id: '1_LastAscent',             windup: true,  },
    { phase: 3,  deck: 12,                 id: '2_TerminalSpin',           windup: true,  },
             
    { phase: 3,  deck: 13,                 id: '1_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '2_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '3_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '4_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '5_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '6_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '7_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '8_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '9_LightningStorm',           },
    { phase: 3,  deck: 13,                 id: '10_LightningStorm',          },
    { phase: 3,  deck: 13,                 id: '11_LightningStorm',          },
    { phase: 3,  deck: 13,                 id: '12_LightningStorm',          },
    { phase: 3,  deck: 13,                 id: '13_LightningStorm',          },
    { phase: 3,  deck: 13,                 id: '14_LightningStorm',          },
]