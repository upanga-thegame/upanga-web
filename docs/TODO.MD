# TODO

Upanga: The Soul Blade - TODO + Dev Tracker


## Priorities
- [X] Begin work on main menu framework. Continue, New Game, Settings, Credits
- [ ] Work on the main travel map. Design, create party member travel logo  
- [X] Rename BattleMap.gd to CryptBattleMap.gd & update all code references
- [ ] After all tasks for CryptBattleMap is polished, build & export first Android
      apk. Check how game looks & plays on mobile. 

## Features

- [X] Add music to cutscene dialogues.
- [X] Add music to main menu.
- [X] Add character turn sound effects for all characters
- [X] Create Skeleton Mage dmg effects animation on target
- [ ] Implement autosave functions. Display message "Saving..." whenever switching screens
      save the current game state.
- [ ] Design JungleBattleMap. New NPCs: Bokors Zombies (melee cause disease), Cursed Soul 
- [ ] Design RuinsBattleMap. New NPCs: Wraith (ability: turns invis 1 turn, teleports melee)
- [ ] Design PyramidBattleMap. New NPCs: Mummies
- [ ] Design Final Boss LaplassBattleMap. Boss: The Laplass (melee + special ability) 
- [ ] Create cinematic cutscene: Game launch
- [ ] Create cinematic cutscene: New game
- [ ] Create cinematic cutscene: After JungleBattleMap
- [ ] Create cinematic cutscene: After RuinsBattleMap
- [ ] Create cinematic cutscene: After PyramidBattleMap
- [ ] Create cinematic cutscene: After LaplassBattleMap
- [~] Create leg animation frames for movement.
- [ ] Create audio dialogue for characters action like: I can't go that way, no target available etc

## Fixes

- [X] Aziza AP missing # for Trap skill
- [X] Turn before Kishi starts before his attack is finished. The next turn begins before Kishi Wolf is finished with animation.
- [X] Text on bottom of message display is truncated
- [X] Fix Aziza healthbar after sprite rescale for animation
- [X] Fix sprite shadow effect not showing again

## Polish

- [X] Re-do graphic animations in main menu, flames look unrealistic
- [X] Add eye glow animation to Main Menu background when player clicks Begin
- [X] Speed up Aziza projectile
- [X] Change Osa Shield bash sound
- [X] Refactor select animation for Aziza
- [X] Refactor select animation for Osa
- [X] Refactor select animation for Kishi
- [ ] Refactor select animation for Kishi W form
- [ ] Refactor select animation for Nganga
- [ ] When character takes dmg also put red or white flash over their portrait
- [ ] Create graphic for End button placeholder

## Testing

- [~] Test core gameplay loop.
- [~] Test scene transitions.
- [~] Test save/load or persistence behavior, if applicable.
- [ ] Test export/build flow.

## Ideas

- [ ] Work on a web demo version of a BattleMap to showcase the gameplay.

## Notes
 

## ############################# COMPLETED #############################

## Priorities

- [X] Priorities: Create turn based system no manual selection of heroes
- [X] Priorities: Balance out attack, hp, damage, scales
- [X] Priorities: Create Victory Scenario + place holder for cutscene cinematic..

## Features

- [X] Create trap animation for Aziza and update code.
- [X] Create shield bash animation for Osa and update code.
- [X] Add skill button for Nganga.
- [X] Add skill button for Kishi.
- [X] Create animation for Nganga skill effects: disease and heal.
- [X] Implement Kishi shapeshifting skill.
- [X] Create animations for Kishi shapeshifting skill.
- [X] Implement idle animation system mixed with current breathing system.
- [X] Create attack animation for skeleton warrior.
- [X] Create attack animation for skeleton archer.
- [X] Create attack animation for skeleton mage.
- [X] Create projectile sprite and animation for skeleton archer.
- [X] Create background music for battle scene.
- [X] Add idle effect for Kishi in werehyena form, maybe breathing only
- [X] Create sound effects for damage taken
- [X] Add Defeat Scene
- [X] Update the buttons at the end of the Victory/Defeat Scenes. Victory: Replay Mission, Continue, Main Menu.
	  Continue (long term) will trigger autosave progress. Defeat: Replay Mission, Exit Map, Main Menu. Exit
	  map takes player back to party travel map (to be implemented)
- [X] Using the portrait images create cut scenes of dialog from each character about the starting encounter. box
      with portrait and text being printed across. maybe have their mouth moving like they are talking. 
- [X] Finished addding new attack/skill button features
- [X] Add new portrait image in player status for kishi in wolf form

## Fixes

- [X] Fix bug: Nganga cannot cast disease twice on same target
- [X] Fix bug: Nganga Disease and Heal skill cost 2 AP 
- [X] Fix bug: When npc dies with disease effect, the cloud is green sprite and very large
- [X] Fix bug: when npc dies w/o disease effect, cloud effect is red from targeting shader
- [X] Fix bug: Disease green spell effect does not wear off after 2 turns
- [X] Fix bug: Out of bounds right side needs to be extended.
- [X] Fix bug: Apply to breathing to characters not selected. Only Nganga works.
- [X] Death animation cloud still too big
- [X] Victory sequence doesn't trigger
- [X] Add not in range targeting messages in window. So Player has feedback why no targeting selection. Check
      Other skills for missing messages.
- [X] Skeletonwarrior 2 name shows up, should just be displayed in target box as Skeleton Warrior     
- [X] Check Skip button mechanic

## Polish

- [X] Add shadow effects under all character sprites.
- [X] Update character status field with a graphic or texture map.
- [X] Update the character profile pictures to match their new sprites.
- [X] Review all characters AP,HP, skill cost values
- [X] Adjust output box frame not even.
- [X] Rework healthbar meters replace red with green. change color based on %
- [X] Skeleton Archer scale needs to be increased