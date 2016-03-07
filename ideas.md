# Hexagon project

- hexagon based
- turn based
- time constraint for game

Brainstorming
- "cooperative" or against AI
- How to use edges, corners and fields?
- - catan-like?
- Types of resources?
- - Only one? Where is the complexity then?
- - Wood, wool, iron ore, corn
- What is a turn?
- - Multiple moves in one turn (classic)
- - Only one thing in a turn
- Goals
- - Survive/Play a number of rounds
- - Get X of one resource
- - Move somewhere, find something
- - Explore everything
- - Destroy the enemy
- - Conquer an island
- - Connect different cities/villages to an empire

You have to explore/find a number of things. For example you have to
build villages on all 6 kinds of tiles. The status on how far you are is
represented in a display. Like in trivial pursuit.

Instead of building villages you conquer them. But conquering is a simple process.
Like there is only one kind of knight unit that is enough to conquer one village.
To make a conquered city yours you have to connect it with a street though.

How about walls? Maybe edges are used for walls. You don't build those walls
yourself, but they are calculated from the villages (in the corners or on the tiles)
So the player always has a sense of the size of their territory.

Villages are build on tiles. But they allow for creating towers/mines on the
corners.  Between the tiles could be water (rivers) and you build bridges between
tiles if you want to build a village there.

tiles: Armies can walk on tiles
corners: cities can be build
edges: walls/roads can be build -> marking territory, no new cities of other party can be build adjacent
-> armies leech a certain amount of resources
-> armies can fight other armies by moving on to the same tile

kingdom style -> nur beeinflussen
(armee steht da-> outposts werden gebaut)
staedte generieren automatisch doerfer, man gibt nur grobe anweisungen


## First Kingdom

- Turn based: One move of the king is one Turn
- 2 Resources: Gold and Manpower
- There are many neutral villages that can join you kingdom for gold
- You can upgrade villages to maybe castles

- Maybe villages on tiles
- e.g. tower on corners, walls on edges

- Unity of Command inspiration
- territory is acquired by moving a unit on a tile
- all tiles are owned by no one in the beginning
