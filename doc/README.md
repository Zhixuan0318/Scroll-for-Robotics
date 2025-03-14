# Code Submission Breakdown

### Project Folder Structure

Our team's code submission able to split into **three major parts** in our demo:

1. 📦`dapp-demo`: All the DApp related and Scroll blockchain interaction code
2. 📦`contract`: All the contracts we wrote for this demo and deployed on Scroll
3. 📦`robot-sim`: All the robotic simulation setup and connection layer code

```bash
📦dapp-demo
┣ 📂public
┣ 📂src
.....┣ 📂app
..........┣ 📂api
...............┣ 📂order
...............┗ 📂robot
....................┣ 📂simulate
...............┗ 📂worldcoin-verify
..........┣ 📂home
...............┣ 📂inventory
...............┣ 📂store
...............┗ 📂track
...............┗ 📂delivery
...............┗ 📂twins
..........┣ 📂order-deliver
...............┣ 📂pre-attestation
...............┗ 📂attestation
..........┣ 📂order
...............┣ 📂approval
...............┗ 📂simulator
.....┣ 📂class
.....┣ 📂components
.....┣ 📂config
.....┣ 📂context
.....┣ 📂contracts ABI
.....┣ 📂data
.....┣ 📂hooks
.....┣ 📂lib
.....┣ 📂services
.....┗ 📂utils


-------------------------------------

📦contract
┣ 📂scroll-contracts

-------------------------------------
📦robot-sim
┣ 📂_pycache_
┣ 📂robot-controllers
┣ 📂connectivity-layer-server
┣ 📂robot-status-memory
┣ 📂robot-part-stl
┣ 📂templates
┣ 📂webot-world-setup

```

## DApp-Demo `src` Folder Description

📂`app/api/order`: API for processing orders

📂`app/api/robot`: API for controlling robot simulations (local or online embedded)

📂`app/api/worldcoin-verify`: API for managing World ID verification with IDKit and Cloud Verify by World ID (for the Recipient Verification Mechanism)

📂`app/home`: Client interface for store page (purchase tokenized products), track page (on-chain order tracking), inventory page (admin for monitoring stock levels), delivery page (simulation of physical distribution of order), twins page (tokenized robot digital twins)

📂`app/order-deliver`: Managing the last-mile distribution mechanism (pre-attestation verification check with World ID, attestation phase with Sign Protocol)

📂`app/order`: Run Webots simulations, multi-signature mechanism, keep track Activity Verifier of each phase, perform order lifecycle on-chain, manage order state, detail on-chain log, render order page UI components

📂`class`: ScrollContract class is used to interact with all the order fulfilment process via smart contracts and run the order fulfilment lifecycle

📂`components`: Some reusable frontend UI components are stored here (cards, toast, styling)

📂`config`: Database and wagmi configuration

📂`context`: Manage wallet connection and update order context through DApp

📂`contracts ABI`: ABI of respective contract, refer to scroll-contracts section for contracts info

📂`data`: contract addresses and ID, detail log template, product collection data, customer-info rand value (a randomizer for faster demo purpose)

📂`hooks`: For add,retrieve,updating orders + smart contract event listening, checking event logs, syncing order status, update data in each phase in cycle + load products, refresh stock info and update, fetch on-chain stock info

📂`services`: Firebase db, Pinata, Sign Protocol interaction

📂`utils`: Generating lifecycle report, owner account, customer info random generator (built for faster demo purpose), unique off-chain order reference generator: using user wallet address and time, World ID verify action

## scroll-contracts/

All contracts are deployed and **VERIFIED** on Scroll Sepolia Testnet

- `Robots.sol`(Tokenized Robot Digital Twin: RWA)
  - **picking robot:** 0x47ed499231d767135347B5a01BB690d40fA24aAC [🌐Scroll Scan](https://sepolia.scrollscan.com/token/0x47ed499231d767135347B5a01BB690d40fA24aAC)
  - **packing robot:** 0xbb1A5d36306Baa5AC756e2c0b2dC99BD3cab6CD2 [🌐Scroll Scan](https://sepolia.scrollscan.com/token/0xbb1A5d36306Baa5AC756e2c0b2dC99BD3cab6CD2)
  - **delivering robot:** 0x42cd8054593EF719E4540cB29Af06Ce28BdC2b3F [🌐Scroll Scan](https://sepolia.scrollscan.com/token/0x42cd8054593EF719E4540cB29Af06Ce28BdC2b3F)
- `Products.sol` (Tokenized Inventory: RWA): 0x420fC211DB1Bfb0b0E29a49E3f51E0C806F3C0e6 [🌐Scroll Scan](https://sepolia.scrollscan.com/address/0x420fC211DB1Bfb0b0E29a49E3f51E0C806F3C0e6)
  - **Green Cube** [🌐Scroll Scan](https://sepolia.scrollscan.com/nft/0x420fC211DB1Bfb0b0E29a49E3f51E0C806F3C0e6/0)
  - **Purple Cube** [🌐Scroll Scan](https://sepolia.scrollscan.com/nft/0x420fC211DB1Bfb0b0E29a49E3f51E0C806F3C0e6/1)
  - **Blue Cube** [🌐Scroll Scan](https://sepolia.scrollscan.com/nft/0x420fC211DB1Bfb0b0E29a49E3f51E0C806F3C0e6/2)
- `Shop.sol`: 0x99355Ba19923EC8601f5A1CD8F9E3e93d13EB4C9 [🌐Scroll Scan](https://sepolia.scrollscan.com/address/0x99355Ba19923EC8601f5A1CD8F9E3e93d13EB4C9#code)
- `Warehouse.sol`: 0x435c8C6048ae5601D05Dd5D42C16141602C86990 [🌐Scroll Scan](https://sepolia.scrollscan.com/address/0x435c8c6048ae5601d05dd5d42c16141602c86990#code)
- utils/`WarehouseManager.sol`
- lib/`Anyrand.sol`
- interfaces
- scripts (deploy,verify)

## Robot-Sim Description

#### robot-controllers/

This folder contain the controller system of each individual robot which define their operations in the warehouse. Robot 1,2,3 representing picking, packing, and delivering.

#### connectivity-layer-server/

Containing the flask server acting as the connectivity layer. Using ngrok tunneling to connect.

#### robot-status-memory/

Acting as a simple robot temp memory for demo purpose.

#### robot-part-stl/

Containing all the robotic parts use for simulation purpose in the showcase.

#### webot-world-setup/

Containing the warehouse 3D scene our team setup for simulation purpose in the showcase. In the format of wbt file.
