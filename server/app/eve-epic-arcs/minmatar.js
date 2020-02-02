export const data = {
  'info':     {
    'name':        'Wildfire',
    'iconID':      '500002',
    'empire':      'Minmatar Republic',
    'race':        'minmatar',
    'starter':     'Arsten Takalo',
    'description': [
      'The Minmatar epic arc is probable the easiest from all level 4 epic arcs',
      'It does take a while to complete because you need to travel a lot in your combat ship',
      'It is also very buggy so you will possibly have to petition some missions to get CCP to resolve issue for you. Mission in question are the ones needing Relic Analyzers',
      'To start this epic arc you need standings of 5.0 towards Arsten Takalo, Brutor Tribe or Minmatar Republic'
    ],
    'rewards':     [
      '+10% Minmatar Republic faction standing increase (unmodified)'
    ],
    'notes':       [
      'You can avoid going to lowsec all together.',
      'You need Data Analyzer in mission 11',
      'You need Relic Analyzer in missions 1, 13 and 14'
    ]
  },
  'missions': [
    {
      'name':        'A Demonstration Objectives',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Relic Analyze and retrieve item',
      'start':       'Frarn',
      'destination': 'Any system in Sveipar constellation',
      'description': [
        'Arsten Takalo will ask you to bring him Olfei Medallion (0.1 m3)',
        'It can be found for about cheap in Rens, or you scan down the plex and kill Olfei and then loot him',
        'Plex is in same constellation as agent, but I never bothered searching it, simply buy it on market before you even before you start the arc and just give it to him and be done with it'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   'unknown range',
            'enemies': [
              {
                'quantity': 5,
                'names':    [
                  'Arch Gistii Outlaw', 'Arch Gistii Thug'
                ]
              },
              {
                'quantity': 11,
                'names':    [
                  'Arch Gistum Crusher'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Container'
                ],
                'notice':   'Each holds Olfei Medallion (0.1 m3)'
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Buy the Medallion on market, they should be less then million and save yourself travel time at least'
      ],
      'objective':   'Fly to agent and give him Olfei Medallion (0.1 m3).'
    },
    {
      'name':        'The Cost of Preservation',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Combat and retrieve item',
      'start':       'Frarn',
      'destination': 'Any system in constellation',
      'description': [
        'Go into single pocket mission, kill everything and retrieve item',
        'Ailon Boufin has two triggers when shot',
        'He drops a key you need to place in a can on the grid to get the objective item. You place the key in it and next time you open the can it will hold you objective item',
        'Ailon has some reps running so you might have troubles taking him out, I usually switch to shorter spawn and by the time I\'m done with them, Ailon is at 35-40 km and then I blap him',
        'You just need to clear the remaining NPC\'s'
      ],
      'enemy':       'Mercenaries',
      'pockets':     [
        [
          {
            'range':   50,
            'enemies': [
              {
                'quantity': 1,
                'names':    [
                  'Ailon Boufin'
                ],
                'notice':   'Trigger wave I when attacked / Triggers wave II when in armor / Active armor tank'
              }
            ]
          },
          {
            'range':   90,
            'enemies': [
              {
                'quantity': 5,
                'names':    [
                  'Mercenary Wingman'
                ]
              },
              {
                'quantity': 6,
                'names':    [
                  'Mercenary Corporal',
                  'Mercenary Lieutenant'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Mercenary Overlord'
                ]
              }
            ]
          },
          {
            'range':   45,
            'enemies': [
              {
                'quantity': 6,
                'names':    [
                  'Mercenary Commander'
                ]
              },
              {
                'quantity': 6,
                'names':    [
                  'Mercenary Overlord'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to loot Hauteker Memoirs (0.1 m3) by placing a key dropped by Ailon into the Archives'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Written By The Victors',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Combat and retrieve item',
      'start':       'Frarn',
      'destination': 'Any system in constellation',
      'description': [
        'Angel Cartel spawn first, at about 40km',
        'Amarr spawn after at 30km from warp in',
        'Retrieve Wildfire Khumaak (0.3 m3) from the Central Burial Tomb'
      ],
      'enemy':       [
        'Angel Cartel',
        'Amarr Empire'
      ],
      'pockets':     [
        [
          {
            'range':   40,
            'enemies': [
              {
                'quantity': 1,
                'names':    [
                  'Arch Gistii Outlaw', 'Arch Gistii Thug'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistum Breaker', 'Arch Gistum Defeater'
                ]
              },
              {
                'quantity': 7,
                'names':    [
                  'Arch Gistum Centurion', 'Arch Gistum Phalanx'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Gistatis Legatus', 'Gistatis Tribunus'
                ],
                'notice':   'Trigger wave I'
              }
            ]
          },
          {
            'range':   30,
            'enemies': [
              {
                'quantity': 3,
                'names':    [
                  'Imperial Templar Phalanx'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Imperial Templar Martyr'
                ]
              },
              {
                'quantity': 1,
                'names':    [
                  'Imperial Templar Judgement'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to loot Wildfire Khumaak (0.3 m3)'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Glowing Embers',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Courier',
      'start':       'Frarn',
      'destination': 'Todeko system , 6 jump out',
      'description': [
        'Deliver Wildfire Khumaak (0.3 m3) from last mission to a camp 6 jumps away',
        'If you are using orca, leave it in Frarn and take only combat ships and Noctis if you are using it',
        'You will need to do one combat mission in same system you are going to. It can be accepted remotely',
        'After next mission you will then need to go back to your agent and then 3 jumps on the opposite side',
        'You will get a message from lowsec agent, don\'t worry, you don\'t need to go to lowsec, you just need to put the Khummak in a can here in Todeko'
      ],
      'tips':        [
        'Do not start next mission straight away if you are doing this arc with more then one character'
      ],
      'objective':   'Fly to destination and start conversation with agent.'
    },
    {
      'name':        'From Way Above',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Combat',
      'start':       'Frarn',
      'destination': 'Todeko system , 6 jump out (same as last mission destination)',
      'description': [
        'Same system as last one',
        'Don\'t accept right away until you are ready to start it since triggers are time based',
        'Consider using mobile tractor and salvage drones from your combat ship while you are waiting for spawns since you will prolly have to wait 30-60 seconds between spawns if you do lots of DPS',
        'There are 5 spawns',
        'Spawns are about 2 minutes apart, start doing mission as soon as you accept it since timer starts from moment of accepting from my experience',
        'Mission can be accepted remotely'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   60,
            'enemies': [
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistii Ambusher', 'Arch Gistii Raider'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistum Phalanx', 'Arch Gistum Centurion'
                ]
              },
              {
                'quantity': 2,
                'names':    [
                  'Gistatis Praefectus', 'Gistatis Tribunus'
                ]
              }
            ]
          },
          {
            'range':   60,
            'enemies': [
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistii Ruffian'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistum Marauder', 'Arch Gistum Liquidator'
                ]
              },
              {
                'quantity': 1,
                'names':    [
                  'Gist Warlord'
                ]
              }
            ]
          },
          {
            'range':   60,
            'enemies': [
              {
                'quantity': 1,
                'names':    [
                  'Arch Gistii Ruffian'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Arch Gistum Breaker', 'Arch Gistum Defeater'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Gist Throne', 'Gist Cherubim'
                ]
              }
            ]
          },
          {
            'range':   60,
            'enemies': [
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistii Impaler', 'Arch Gistii Hunter'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Gistior Seizer', 'Gistior Thrasher'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Gistatis Legatus', 'Gistatis Tribunus'
                ]
              }
            ]
          },
          {
            'range':   60,
            'enemies': [
              {
                'quantity': 5,
                'names':    [
                  'Arch Gistum Breaker', 'Arch Gistum Defeater'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Gist Seraphim'
                ]
              },
              {
                'quantity': 2,
                'names':    [
                  'Gist Domination Saint', 'Gist Domination Nephilim'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        ''
      ],
      'objective':   'Kill 2 Elite Battleships in last wave and complete remotely.'
    },
    {
      'name':        'Friends In High Places',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Fly to location in space',
      'start':       'Frarn',
      'destination': 'Alakgur system , 3 jump out (8 jumps from last mission)',
      'description': [
        'Take all your ships with you since this is along the way for next agent, but for this mission use a shuttle',
        'This isn\'t combat mission and you will need to burn 50-70',
        'You can use an frigate with AB/MWD as well, but I just prefer shuttles since they take little space and still go 600 m/s'
      ],
      'tips':        [
        'You can also use your main ships for this if they can cross 50+ kilometers in reasonable time'
      ],
      'objective':   'Aproach structures in order agent tells and then complete remotely.'
    },
    {
      'name':        'My Little Eye',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Travel',
      'start':       'Frarn',
      'destination': 'Aldrat system, 8 jumps away (11 jumps from last mission)',
      'description': [
        'Report to Nilf Abruskur in Aldrat at RSS Liaison Headquarters'
      ],
      'tips':        [
        'You can accept mission remotely'
      ],
      'objective':   'Automatically once you initiate conversation with next agent.'
    },
    {
      'name':        'Dead End Intercept',
      'agent':       'Nilf Abruskur',
      'source':      'Aldrat system - RSS Liaison Headquarters',
      'type':        'Combat and retrieve item',
      'start':       'Aldrat',
      'destination': 'Any system in constellation',
      'description': [
        'Kill one battleship and loot datapad from him'
      ],
      'enemy':       'Minmatar Republic',
      'pockets':     [
        [
          {
            'range':   50,
            'note':    'spawns in few seconds after you land',
            'enemies': [
              {
                'quantity': 1,
                'names':    [
                  'Republic Tribal Kinai'
                ],
                'notice':   'Lomar Vujik, drops mission objective'
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to loot Singed Datapad (0.1 m3)'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Surfacing',
      'agent':       'Nilf Abruskur',
      'source':      'Aldrat system - RSS Liaison Headquarters',
      'type':        'Combat and retrieve item',
      'start':       'Aldrat',
      'destination': 'Jark system, 11 jumps away',
      'description': [
        'Get the objective from structure',
        'That will trigger a spawn few kilometers behind you, about half way from entry beacon and structure',
        'This mission is 11 jumps out and you need to return to agent',
        'Consider not moving orca there if you have one'
      ],
      'enemy':       'Mercenaries',
      'pockets':     [
        [
          {
            'range':   10,
            'enemies': [
              {
                'quantity': 2,
                'names':    [
                  'Mercenary Wingman'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Mercenary Commander'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Mercenary Overlord'
                ],
                'notice':   'Trigger wave I'
              }
            ]
          },
          {
            'range':   10,
            'enemies': [
              {
                'quantity': 2,
                'names':    [
                  'Mercenary Wingman'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Mercenary Commander'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Mercenary Overlord'
                ],
                'notice':   'Trigger wave II'
              }
            ]
          },
          {
            'range':   10,
            'enemies': [
              {
                'quantity': 5,
                'names':    [
                  'Mercenary Elite Fighter'
                ]
              },
              {
                'quantity': 2,
                'names':    [
                  'Mercenary Wingman'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Spider Drone I'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Mercenary Overlord'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'If you are using alt to trigger spawns, move away from warp in beacon since they spawn on the beacon with scramblers',
        'You have to kill everything to complete mission'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Who Art in Heaven',
      'agent':       'Nilf Abruskur',
      'source':      'Aldrat system - RSS Liaison Headquarters',
      'type':        'Combat',
      'start':       'Aldrat',
      'destination': 'Erstur, 1 jump away',
      'description': [
        'Kill everything, no triggers, sort by range and start working on them',
        'To finish the mission you need to approach the outpost at about 30 km',
        'You don\'t need to clear the site if you want to blitz, just use something fast to get there and get objective complete',
        'Sometimes you might warp in close enough to trigger mission objective which will cause half the NPC\'s to warp off'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   40,
            'enemies': [
              {
                'quantity': 7,
                'names':    [
                  'Arch Gistii Hunter', 'Arch Gistii Impaler'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Arch Gistum Breaker', 'Arch Gistum Defeater'
                ]
              },
              {
                'quantity': 7,
                'names':    [
                  'Gist Cherubim', 'Gist Seraphim', 'Gist Throne'
                ]
              }
            ]
          },
          {
            'range':   90,
            'enemies': [
              {
                'quantity': 8,
                'names':    [
                  'Gistii Hunter', 'Gistii Impaler'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistii Hunter'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Gistatis Praefectus'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Sort at range and kill everything or blitz the mission'
      ],
      'objective':   'Kill everything and fly back to agent.'
    },
    {
      'name':        'Playing All Their Cards',
      'agent':       'Nilf Abruskur',
      'source':      'Aldrat system - RSS Liaison Headquarters',
      'type':        'Data Analyze and retrieve item',
      'start':       'Aldrat',
      'destination': 'Any system in constellation',
      'description': [
        'Hack the container to get Drive Cluster EDF-285 (0.1 m3)',
        'Once you are 5 kilometers of containter you will trigger spawn',
        'You can hack and get out before they engage you, otherwise grab your guns'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   '100',
            'enemies': [
              {
                'quantity': 11,
                'names':    [
                  'Arch Gistii Hijacker',
                  'Arch Gistii Hunter',
                  'Arch Gistii Impaler',
                  'Arch Gistii Rogue',
                  'Arch Gistii Thug'
                ]
              },
              {
                'quantity': 6,
                'names':    [
                  'Gistor Seizor', 'Gistor Trasher'
                ]
              },
              {
                'quantity': 4,
                'names':    [
                  'Arch Gistum Phalanx', 'Arch Gistum Defeater', 'Arch Gistum Centurion'
                ]
              },
              {
                'quantity': 10,
                'names':    [
                  'Gist Cherubim', 'Gist Seraphim', 'Gist Throne'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to grab Drive Cluster EDF-285 (0.1 m3)'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'History in the Making',
      'agent':       'Arsten Takalo',
      'source':      'Frarn system - Brutor Tribe Community Area',
      'type':        'Travel',
      'start':       'Frarn',
      'destination': 'Tanoo system, 13 jumps away',
      'description': [
        'Report to Hiva Shesha in Tanoo at Krusal Mobile Library'
      ],
      'tips':        [
        'You can accept mission remotely'
      ],
      'objective':   'Automatically once you initiate conversation with next agent.'
    },
    {
      'name':        'Church of the Obsidian',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Relic Analyze and retrieve item',
      'start':       'Tanoo',
      'destination': 'Any system in constellation',
      'description': [
        'Hack the container to get Blood Obsidian Orb (0.1 m3)',
        'Do not engage 5 neutral Amarr cruisers, they will warp off',
        'If you engage them you will suffer Amarr Empire faction standings penalty'
      ],
      'enemy':       'Amarr Empire',
      'pockets':     [
        [
          {
            'range':   25,
            'note':    'triggered when approaching gate at 15km',
            'enemies': [
              {
                'quantity': 7,
                'names':    [
                  'Ammatar Navy Delta I', 'Ammatar Navy Gamma II', 'Ammatar Navy Soldier'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Ammatar Navy Armageddon', 'Ammatar Navy Apocalypse'
                ]
              }
            ]
          }
        ],
        [
          {
            'range':   30,
            'note':    '-0.06% to Amarr Empire for destroying Amarr Empire\'s Ammatar Navy Apocalypse. This appears to be buggy or incurs once per character on random ship in this pocket',
            'enemies': [
              {
                'quantity': 3,
                'names':    [
                  'Ammatar Navy Soldier'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Ammatar Navy Maller'
                ]
              },
              {
                'quantity': 10,
                'names':    [
                  'Ammatar Navy Armageddon', 'Ammatar Navy Apocalypse'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to grab Blood Obsidian Orb (0.1 m3)'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Heresiology',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Relic Analyze and retrieve item',
      'start':       'Tanoo',
      'destination': 'Any system in constellation',
      'description': [
        'Hack the containers to get Engraved Blood Obsidian tablet (0.1 m3)',
        'Only Ammatar Navy Detectives cause standing loss to Ammatar',
        'You will have to take out the detectives or tank them while you loot/hack',
        'You can also use alt in fast ship to burn 100-150km out and then draw them all the way out so you can hack in peace with your main',
        'Each can will spawn more next to it until there is 4 of them',
        'Last one hacked will drop objective'
      ],
      'enemy':       'Ammatar Mandate',
      'pockets':     [
        [
          {
            'range':   55,
            'enemies': [
              {
                'quantity': 10,
                'names':    [
                  'Ammatar Navy Delta 1 Support Frigate',
                  'Ammatar Navy Detective',
                  'Ammatar Navy Gamma II Support Frigate'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Ammatar Navy Maller'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Ammatar Navy Armageddon', 'Ammatar Navy Apocolypse'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Don\'t forget to grab Engraved Blood Obsidian tablet (0.1 m3)',
        'There is a chance of small faction stanginds penalty agaist Ammatar if you shoot cruisers as well',
        'This one and last mission are very buggy and strange things happen each time with standings'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'Wildfire',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Deliver item and combat',
      'start':       'Tanoo',
      'destination': 'Any system in constellation',
      'description': [
        'No spawn on warp in',
        'Dropping the Datacore (0.1 m3) into the chapel container triggers the spawn about 30 km off',
        'You don\'t need to kill the NPCs to complete the mission, so kill any scramming frigates and warp off',
        'Cosidering loot/salvage from this mission, it\'s not that bad idea to blitz it',
        'Keep in mind though that you will still need to wait a bit after dropping till Rend warps off',
        'If you have MWD just keep burning away from NPC\'s after drop and warp out once you get mission complete message'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   5,
            'enemies': [
              {
                'quantity': 1,
                'names':    [
                  'Elite Angel Battleship'
                ],
                'notice':   'Karkoti Rend, warps off after one minute / Trigger wave I'
              }
            ]
          },
          {
            'range':   40,
            'enemies': [
              {
                'quantity': 5,
                'names':    [
                  'Gistii Hunter', 'Gistii Impaler'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Arch Gistii Hijacker',
                  'Arch Gistii Hunter',
                  'Arch Gistii Outlaw',
                  'Arch Gistii Rogue',
                  'Arch Gistii Thug'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Gist Throne', 'Gist Cherubim'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'If you want to blitz this mission, drop item, align out, as soon as Rend warps off you can warp off'
      ],
      'objective':   'Drop the item, wait for Rend to warp off and complete remotely.'
    },
    {
      'name':        'Stillwater',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Combat and retrieve item',
      'start':       'Tanoo',
      'destination': 'Zaid system, 3 jumps away',
      'description': [
        'Karkoti Rend will aggro up to 200 kilometers away',
        'Killing him will cause any remaining rats to disappear',
        'You should have time to kill Angel Energy Neutralizer Sentry II and frigates by time Karkoti gets close to put damage, or if you want to blitz then just use MJD to jump out and wait for Karkoti to get in range'
      ],
      'enemy':       'Angel Cartel',
      'pockets':     [
        [
          {
            'range':   30,
            'enemies': [
              {
                'quantity': 8,
                'names':    [
                  'Arch Gistii Hijacker', 'Arch Gistii Hunter', 'Arch Gistii Impaler'
                ]
              },
              {
                'quantity': 3,
                'names':    [
                  'Arch Gistum Centurian', 'Arch Gistum Phalanx'
                ]
              },
              {
                'quantity': 5,
                'names':    [
                  'Gist Cherubim', 'Gist Seraphim', 'Gist Throne'
                ]
              },
              {
                'quantity': 1,
                'names':    [
                  'Elite Angel Battleship'
                ],
                'notice':   'Karkoti Rend, mission objective'
              },
              {
                'quantity': 1,
                'names':    [
                  'Angel Energy Neutralizer Sentry II'
                ]
              }
            ]
          }
        ]
      ],
      'tips':        [
        'Kill tower, keep range on Karkoti so he doesn\'t neut you out, then either kill rest and Karkoti last or just blap him',
        'Don\'t forget to loot Book Of St. Arzad (0.1 m3)'
      ],
      'objective':   'Loot the mission objective and fly back to your agent.'
    },
    {
      'name':        'With Great Power',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Epic arc choice',
      'start':       'Tanoo',
      'destination': 'Same system',
      'description': [
        'Choose your side',
        'One side (Revelation) gives Minmatar standings and other side (Retraction) gives half the standings and 10 x RSS Core Scanner Probes'
      ],
      'tips':        [
        'Pick one you want, either 10% base standings or 5% base standings + probes'
      ],
      'objective':   'Just confirm your choice.'
    },
    {
      'name':        'Revelation',
      'agent':       'Hiva Shesha',
      'source':      'Tanoo - Krusal Mobile Library',
      'type':        'Courier',
      'start':       'Tanoo',
      'destination': 'Avesber system, 5 jumps away',
      'description': [
        'Fly couple of jumps and drop Book Of St. Arzad (0.1 m3) into container'
      ],
      'tips':        [
        'Retraction is same deal as this one except you have to return to your agent to pick up probes, so consider using shuttle/frigate',
        'Otherwise you can complete remotely'
      ],
      'objective':   'Deliver item and complete remotely.'
    }
  ]
};
